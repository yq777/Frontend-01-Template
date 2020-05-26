const css = require('css');
let rules = [];

module.exports.addCSSRules = function addCSSRules(text) {
  const ast = css.parse(text);
  // 将css rules push进来
  rules.push(...ast.stylesheet.rules);
};
module.exports.computeCSS = function computeCSS(element, stack) {
  // 获取到的html AST树，复制是操作不影响原数组
  const elements = stack.slice().reverse(); // reverse的原因是因为要找到最后一个匹配的是当前元素，需要从当前元素往前找，所以我们获得和计算父元素匹配的顺序是从内向外的
  // 元素是否有computedStyle属性
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  // 所有的css规则
  for (let rule of rules) {
    // 获取选择器，并将选择器转成数组， e.g: #id.class被分割成["#id", ".class"]
    const selectorParts = rule.selectors[0].split(' ').reverse();
    // 将当前属性和规则进行匹配
    if (!match(element, selectorParts[0])) continue;
    let matched = false;
    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      const sp = specificity(rule.selectors[0]);
      // 需要将match到的元素加入computedStyle
      const computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) <= 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
};
function specificity(selector) {
  const sp = [0, 0, 0, 0];
  const selectorParts = selector.split(' ');
  for (let part of selectorParts) {
    if (part.charAt(0) === '#') {
      sp[1] += 1;
    } else if (part.charAt(0) === '.') {
      sp[2] += 1;
    } else {
      sp[3] += 1;
    }
  }
  return sp;
}
function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  if (sp1[3] - sp2[3]) {
    return sp1[3] - sp2[3];
  }
}
function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }
  //
  if (selector.charAt(0) === '#') {
    const attr = element.attributes.filter((attr) => attr.name === 'id')[0];
    if (attr && attr.value === selector.replace('#', '')) {
      return true;
    }
  } else if (selector.charAt(0) === '.') {
    const attr = element.attributes.filter((attr) => attr.name === 'class')[0];
    const classArr = (attr && attr.value.split(' ')) || [];
    for (let cls of classArr) {
      if (cls === selector.replace('.', '')) {
        return true;
      }
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}
