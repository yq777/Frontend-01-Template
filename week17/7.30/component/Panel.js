import { createElement, Text, Wrapper } from './createElement';

export class TabPanel {
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
  select(i) {
    for (let view of this.chilViews) {
      view.style.display = 'none';
    }
    this.chilViews[i].style.display = '';
    this.titleViews.innerText = this.children[i].title;
    for (let view of this.titleViews) {
      view.classList.remove('selected');
    }
    this.titleViews[i].classList.add('selected');
  }

  render() {
    this.chilViews = this.children.map((item) => (
      <div style='width:300px'>{item}</div>
    ));
    this.titleViews = this.children.map((child, index) => (
      <span
        onClick={() => this.select(index)}
        style='background-color: lightgreen;padding: 10px; margin-right:10px'>
        {child.getAttribute('title')}
      </span>
    ));
    setTimeout(() => this.select(0), 16);
    return (
      <div class='panel'>
        <h1 style=' width: 300px'>{this.titleViews}</h1>
        <div style='min-height:300px; border: 1px solid blue'>
          {this.chilViews}
        </div>
      </div>
    );
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
