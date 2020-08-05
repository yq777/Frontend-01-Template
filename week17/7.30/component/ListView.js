import { createElement, Text, Wrapper } from './createElement';

export class ListView {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    let properties = new Map();
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  getAttribute(name) {
    return this[name];
  }
  appendChild(child) {
    this.children.push(child);
  }

  render() {
    let data = this.getAttribute('data');
    return (
      <div class='list-view' width='300px'>
        {data.map(this.children[0])}
      </div>
    );
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
