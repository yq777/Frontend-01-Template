// parser接受HTML文本作为参数，返回一颗DOM树
// https://html.spec.whatwg.org/multipage/parsing.html#tokenization这个的伪代码翻译成真代码 先写一下6个状态，开始标签，结束标签，和自封闭标签这个6个状态主要处理
// 创建元素
const  parserCSS  = require('./parserCss.js');
const layout = require('./layout');
const EOF = Symbol('EOF'); // end of file, 文件最后有一个EOF标识了文件结尾
let currentToken = null;
let currentAttribute = null;
let stack = [{ type: 'document', children: [] }];
let currentTextNode = null;

function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;
    for (let p in token) {
      if (p !== 'type' || p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }
    parserCSS.computeCSS(element, stack)
    top.children.push(element);
    element.parent = top;
    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't match");
    } else {
      if (top.tagName === 'style') {
        parserCSS.addCSSRules(top.children[0].content);
      }
      layout(top);
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}
function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: 'EOF' });
    return;
  } else {
    emit({ type: 'text', content: c });
    return data;
  }
}
function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
    };
    return tagName(c);
  } else {
    emit({
      type: 'text',
      content: c,
    });
    return;
  }
}
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    };
    return tagName(c);
  } else if (c === '>') {
  } else if (c === EOF) {
  } else {
  }
}
function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c.toLowerCase();
    return tagName;
  } else {
    currentToken.tagName += c.toLowerCase();
    return tagName;
  }
}
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '>' || c === 'EOF' || c === '/') {
    return afterArrtibuteName(c);
  } else if (c === '=') {
    currentAttribute = {
      name: c,
      value: '',
    };
    return attributeName;
  } else {
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
    // return beforeAttributeName;
  }
}
function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f \/>]$/) || c === EOF) {
    return afterArrtibuteName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentAttribute.name += c.toLowerCase();
    return attributeName;
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<') {
  } else {
    currentAttribute.name += c.toLowerCase();
    return attributeName;
  }
}
function afterArrtibuteName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterArrtibuteName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f \/>]$/) || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === '>') {
  } else {
    return UnquotedAttributeValue(c);
  }
}
function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}
function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
module.exports.parserHTML = function parserHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF); // 实现标识文件结尾的作用，不写的话程序会等待补全，导致问题
  return stack[0];
};
