const css = require('css');
let rules = [];

module.exports.addCSSRules = function addCSSRules(text) {
  const ast = css.parse(text);
  // 将css rules push进来
  rules.push(...ast.stylesheet.rules);
  // console.log(rules);
};
module.exports.computeCSS = function computeCSS(element, stack) {
  // console.log(rules);
  const elements = stack.slice().reverse(); // reverse的原因是因为要找到最后一个匹配的是当前元素，需要从当前元素往前找，所以我们获得和计算父元素匹配的顺序是从内向外的
  console.log(elements);
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (let rule of rules) {
    const selectorParts = rule.selectors[0].split(' ').reverse();
    if (!match(element, selectorParts[0])) continue;
    let matched = false;
    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j > selectorParts.length) {
      matched = true;
    }
    if (matched) {
      // 需要将match到的元素加入
      console.log('Element', element, 'matched rule', rule);
    }
  }
};
function match(element, selectorPart) {}
