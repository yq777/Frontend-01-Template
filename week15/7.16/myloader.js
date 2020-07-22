var parser = require('./parser');

module.exports = function (source, map) {
  let tree = parser.parseHTML(source);
  let template = null;
  let script = null;

  for (let node of tree.children) {
    if (node.tagName === 'template') {
      template = node.children.filter((item) => item.type !== 'text')[0];
    }
    if (node.tagName === 'script') {
      script = node.children[0].content;
    }
  }
  let visit = (node, depth) => {
    if (node.type === 'text') {
      return JSON.stringify(node.content);
    }
    let attrs = {};
    for (let attribute of node.attributes) {
      attrs[attribute.name] = attribute.value;
    }
    let children = node.children.map((item) => visit(item));
    return `createElement("${node.tagName}", ${JSON.stringify(
      attrs
    )}, ${children})`;
  };
  return `
import { createElement, Text, Wrapper } from './createElement';
export class Carousel {
    setAttribute(name, value) {
        this[name] = value;
      }
    render() {
        return ${visit(template)};
    }
    mountTo(parent) {
        this.render().mountTo(parent);
      }
  }
  `;
};
