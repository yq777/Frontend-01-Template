import { createElement, Text, Wrapper } from './createElement';

class Carousel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    let properties = new Map();
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  appendChild(child) {
    this.children.push(child);
  }
  set title(value) {
    this.attributes.set('title', value);
  }

  autoPlay(children) {
    let position = 0;
    let nextPic = () => {
      let nextPostion = (position + 1) % this.data.length;

      let current = children[position]; // 不能有dom操作，这是个视觉操作，改了dom会语义变了，元素之间顺序变了，所以只能改变css
      let next = children[nextPostion];
      current.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';
      current.style.transform = `translateX(${-100 * position}%)`;
      next.style.transform = `translateX(${100 - 100 * nextPostion}%)`;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            // 用css控制
            current.style.transition = "";
            next.style.transition = "";
            current.style.transform = `translateX(${-100 - 100 * position}%)`;
            next.style.transform = `translateX(${-100 * nextPostion}%)`;
            position = nextPostion;
        })
    }, 16)

      setTimeout(nextPic, 3000);
    };
    setTimeout(nextPic, 3000);
    return '';
  }

  drag(root, children) {
    let position = 0;
    root.addEventListener('mousedown', (event) => {
      let startX = event.clientX;

      let lastPostion = (position - 1 + this.data.length) % this.data.length;
      let nextPostion = (position + 1) % this.data.length;

      let current = children[position];
      let last = children[lastPostion];
      let next = children[nextPostion];

      // 关闭动画
      current.style.transition = 'ease 0s';
      last.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      // 设置图片为值
      current.style.transform = `translateX(${-500 * position}px)`; // 0
      last.style.transform = `translateX(${-500 - 500 * lastPostion}px)`; // 前一个
      next.style.transform = `translateX(${500 - 500 * nextPostion}px)`; // 后一个

      // 设置图片拖动距离
      let move = (event) => {
        current.style.transform = `translateX(${
          event.clientX - startX - 500 * position
        }px)`;
        last.style.transform = `translateX(${
          event.clientX - startX - 500 - 500 * lastPostion
        }px)`;
        next.style.transform = `translateX(${
          event.clientX - startX + 500 - 500 * nextPostion
        }px)`;
      };
      let up = (event) => {
        let offset = 0;
        // 控制左右拖动
        if (event.clientX - startX > 250) {
          offset = 1;
        } else if (event.clientX - startX < -250) {
          offset = -1;
        }
        // 把style自带的css动画打开
        current.style.transition = '';
        last.style.transition = '';
        next.style.transition = '';

        // 播动画，动画的目标位置
        current.style.transform = `translateX(${
          offset * 500 - 500 * position
        }px)`; // 0
        last.style.transform = `translateX(${
          offset * 500 - 500 - 500 * lastPostion
        }px)`; // 前一个
        next.style.transform = `translateX(${
          offset * 500 + 500 - 500 * nextPostion
        }px)`; // 后一个

        // 修改当前图片位置，也就是确认当前图片的index
        position = (position - offset + this.data.length) % this.data.length;

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
    return '';
  }

  render() {
    let children = this.data.map((url) => {
      let element = <img src={url} />;
      element.addEventListener('dragstart', (event) => event.preventDefault());
      return element;
    });

    let dragableChildren = this.data.map((url) => {
      let element = <img src={url} />;
      element.addEventListener('dragstart', (event) => event.preventDefault());
      return element;
    });

    let dragRoot = <div class='carousel'>{dragableChildren}</div>;

    return (
      <div>
        <div style="text-align: center">自动轮播：</div>
        <br />
        {this.autoPlay(children)}
        {<div class='carousel'>{children}</div>}
        <br />
        <div style="text-align: center">拖拽轮播：</div>
        <br />
        {this.drag(dragRoot, dragableChildren)}
        {dragRoot}
        <br />
      </div>
    );
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}

let component = (
  <Carousel
    data={[
      'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
      'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
      'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
      'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    ]}
  />
);

component.mountTo(document.body);
