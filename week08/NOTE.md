# 每周总结可以写在这里
- 简单选择器
  - `*`
  - div
  - .cls
  - #id
  - [attr=val]
  - 伪类
  - 伪元素
- 复合选择器
  - <简单选择><简单选择器><简单选择器>
- 复杂选择器
  - <复合选择器>space<复合选择器>
  - <复合选择器>“>”<复合选择器>父子选择器
  - <复合选择器>"~"<复合选择器>兄弟选择器
  - <复合选择器>"+"<复合选择器>兄弟选择器
  - <复合选择器>"||"<复合选择器>
- css match函数，基于toy-browser
  - 将selector按照复杂选择器规则(未实现||)进行分割，然后reverse，从当前元素开始往上寻找
  ```js
  function matchRules(selector) {
  let list = selector
    .trim()
    .replace(/(?<=[~+>])\s+/g, '')
    .replace(/\s+(?=[ ~+>])/g, '')
    .split(/(?<=[ ~+>])/g);
  return list.reverse();
    }
  ```
  - 循环遍历分析出来的选择器，首先看当前元素是否和当前元素匹配，匹配则继续匹配父元素或者否兄弟元素
  ```js
  selectors.forEach((item, index) => {
    if (index === 0) {
      matched = matcheElement(selectors, [element], index); // 第一个元素是元素本身
    }
    // 父元素或者兄弟节点
    if (matched && index > 0) {
      if (!selectors[index].endsWith('+') && !selectors[index].endsWith('~')) {
        nodeIndex++;
      }
      matched = matcheElement(selectors, elements, index, nodeIndex);
    }
  });    
  ```
  - 匹配父元素或者兄弟元素分为四种情况，根据这四种情况查找元素然后进行元素和选择器进行匹配
    - 空格父元素
  ```js
    if (selector.endsWith(' ')) {
      selector = selector.replace(' ', '');
      let convertElement = elements[parentIndex - 1];
      while (
        convertElement &&
        !matchSimpleOrCompound(selector, convertElement)
      ) {
        convertElement = convertElement.parent;
      }
      return !!convertElement;
    }
  ```
    - `>`直接父元素
  ```js
    if (selector.endsWith('>')) {
      selector = selector.replace('>', '');
      let convertElement = elements[parentIndex - 1];
      if (!convertElement) {
        return false;
      }
      return matchSimpleOrCompound(selector, convertElement);
    }
  ```
    - +邻近兄弟元素
  ```js
    if (selector.endsWith('+')) {
      selector = selector.replace('+', '');
      let convertElement = elements[parentIndex]; // 获取父元素
      if (!convertElement) {
        return false;
      }
      let children = convertElement.children; // 获取所有子元素
      children = children.filter((item) => item.type !== 'text');
      let prev = selectors[i - 1];
      prev = prev && prev.replace(/[ ~+>]$/g, '');
      let flag = false;
      const matchIndex = children.findIndex((item) =>
        matchSimpleOrCompound(selector, item)
      );
      flag = matchSimpleOrCompound(prev, children[matchIndex + 1]);
      return flag;
    }
  ```
    - ~兄弟元素
  ```js
    if (selector.endsWith('~')) {
      selector = selector.replace('~', '');
      let convertElement = elements[parentIndex];
      let children = convertElement.children; // 获取所有子元素
      children = children.filter((item) => item.type !== 'text');
      if (!convertElement) {
        return false;
      }
      let flag = false;
      let prevIndex;
      let prev = selectors[i - 1]; // 前一个选择器
      prev = prev && prev.replace(/[ ~+>]$/g, '');
      prevIndex = children.findIndex((item) =>
        matchSimpleOrCompound(prev, item)
      );
      flag =
        children.findIndex((item) => matchSimpleOrCompound(selector, item)) !==
        prevIndex;
      return flag;
    }
  ```
  - 以上步骤完成后，需要将选择器与元素进行匹配，此时选择器可能是复合选择和简单选择器，统一当做复合选择器来处理对选择器进行拆分，然后匹配元素