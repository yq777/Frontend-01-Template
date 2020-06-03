// match
function match(element, selectors, elements) {
  let matched = false;
  let nodeIndex = 0; // 节点的index便于获取父元素
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
  return matched;
}

// 匹配复合选择器
function matcheElement(selectors, elements, i, parentIndex) {
  let selector = selectors[i];
  if (i) {
    // 父元素
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
    // 直接父元素
    if (selector.endsWith('>')) {
      selector = selector.replace('>', '');
      let convertElement = elements[parentIndex - 1];
      if (!convertElement) {
        return false;
      }
      return matchSimpleOrCompound(selector, convertElement);
    }
    // 临近兄弟元素
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
    // 兄弟元素
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
  }

  return matchSimpleOrCompound(selector, elements[i]);
}
const attrCompareObj = {
  '=': (attrValue, value) => attrValue === value, //相等
  '~=': (attrValue, value) => attrValue.split(/\s+/g).includes(value), // 包含value
  '|=': (attrValue, value) =>
    attrValue === value || attrValue.startsWith(`${value}-`), // 属性值为“value”或是以“value-”为前缀开头
  '^=': (attrValue, value) => attrValue.startsWith(value), // 属性值是以 value 开头的元素
  '$=': (attrValue, value) => attrValue.endsWith(value), // 属性值是以 value 结尾的元素
  '*=': (attrValue, value) => attrValue.includes(value), // 属性值包含有 value 的元素
};

// 匹配复合选择器或简单选择器
function matchSimpleOrCompound(selector, element) {
  if (!selector || !element.attributes) {
    return false;
  }
  // 复合选择器或者简单选择器进行分割
  const selectors = selector.split(/(?<=[\w\]\)])(?=[#.:\[])/);
  return selectors.every((simpleSelector) => {
    // id选择器
    if (simpleSelector.startsWith('#')) {
      const id = element.attributes.filter((a) => a.name === 'id')[0];
      return !!id && id.value === simpleSelector.slice(1);
      // class选择器
    } else if (simpleSelector.startsWith('.')) {
      // 获取class属性值
      const attr = element.attributes.filter(
        (attr) => attr.name === 'class'
      )[0];
      // class可能有多个值需要进行划分
      const classArr = (attr && attr.value.split(' ')) || [];
      // 判断class数组中是否包含class简单选择器
      for (let cls of classArr) {
        if (cls === simpleSelector.replace('.', '')) {
          return true;
        }
      }
      // 属性选择器
    } else if (simpleSelector.match(/^\[(.+?)\]$/)) {
      const match = /([\w-]+)\s*(?:([~|^$*]?=)\s*(\S+))?/.exec(RegExp.$1);
      if (!match) {
        return false;
      }
      const name = match[1];
      const comparator = match[2]; // 比较符： = ~= |= ^= $= *=
      const value = match[3] && match[3].replace(/["']/g, ''); // 去除Value的引号
      const attr = element.attributes.find((a) => a.name === name); // 属性名比较
      if (!attr) {
        return false;
      }
      if (!comparator) {
        // 没有比较符号就没有属性值的比较
        return true;
      }
      return attrCompareObj[comparator](attr.value, value); // 属性值比较
      // :not伪类选择器
    } else if (simpleSelector.match(/^:not\((.+)\)$/)) {
      return !matchSimpleOrCompound(element, RegExp.$1);
    } else {
      // 标签选择器
      return element.tagName === simpleSelector;
    }
  });
}

function matchRules(selector) {
  let list = selector
    .trim()
    .replace(/(?<=[~+>])\s+/g, '')
    .replace(/\s+(?=[ ~+>])/g, '')
    .split(/(?<=[ ~+>])/g);
  return list.reverse();
}
module.exports = {
  match,
  matchRules,
};
