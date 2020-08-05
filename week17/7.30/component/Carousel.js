import { createElement, Text, Wrapper } from './createElement';
import { Timeline, Animation } from './animation';
import { ease } from './cubicBezier';

import css from './carousel.css';


export class Carousel {
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

  autoPlay() {
    let timeline = new Timeline();
    timeline.start();

    let position = 0;

    let nextPicStopHandler = null;

    let children = this.data.map((url, currentPosition) => {
      let lastPostion =
        (currentPosition - 1 + this.data.length) % this.data.length;
      let nextPostion = (currentPosition + 1) % this.data.length;

      let offset = 0;
      let onStart = () => {
        timeline.pause();
        clearTimeout(nextPicStopHandler);

        let currentElement = children[currentPosition];

        let currentTransformValue = Number(
          currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]
        );
        offset = currentTransformValue + 500 * currentPosition;
      };
      let onPan = (event) => {
        let lastElement = children[lastPostion];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPostion];

        let dx = event.detail.clientX - event.detail.startX;

        let currentTransformValue = -500 * currentPosition + offset + dx;
        let lastTransformValue = -500 - 500 * lastPostion + offset + dx;
        let nextTransformValue = 500 - 500 * nextPostion + offset + dx;
        lastElement.style.transform = `translateX(${lastTransformValue}px)`;
        currentElement.style.transform = `translateX(${currentTransformValue}px)`;
        nextElement.style.transform = `translateX(${nextTransformValue}px)`;
      };

      let onPanend = (event) => {
        let direction = 0;
        let dx = event.detail.clientX - event.detail.startX;
        // 控制左右拖动
        if (dx + offset > 250 || (dx > 0 && event.detail.isFlick)) {
          direction = 1;
        } else if (dx + offset < -250 || (dx < 0 && event.detail.isFlick)) {
          direction = -1;
        }
        timeline.reset();
        timeline.start();
        let lastElement = children[lastPostion];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPostion];
        if (direction) {
          let lastAnimation = new Animation(
            lastElement.style,
            'transform',
            -500 - 500 * lastPostion + offset + dx,
            -500 - 500 * lastPostion + direction * 500,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          );
          let currentAnimation = new Animation(
            currentElement.style,
            'transform',
            -500 * currentPosition + offset + dx,
            -500 * currentPosition + direction * 500,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          );
          let nextAnimation = new Animation(
            nextElement.style,
            'transform',
            500 - 500 * nextPostion + offset + dx,
            500 - 500 * nextPostion + direction * 500,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          );
          timeline.add(lastAnimation);
          timeline.add(currentAnimation);
          timeline.add(nextAnimation);

          position =
            (position - direction + this.data.length) % this.data.length;

          nextPicStopHandler = setTimeout(nextPic, 3000);
        } else {
          let currentTransformValue = -500 * currentPosition + offset;
          let lastTransformValue = -500 - 500 * lastPostion + offset;
          let nextTransformValue = 500 - 500 * nextPostion + offset;

          lastElement.style.transform = `translateX(${lastTransformValue}px)`;
          currentElement.style.transform = `translateX(${currentTransformValue}px)`;
          nextElement.style.transform = `translateX(${nextTransformValue}px)`;
        }
      };

      let element = (
        <img
          src={url}
          onStart={onStart}
          onPan={onPan}
          onPanend={onPanend}
          enableGesture={true}
        />
      );
      element.style.transform = 'translateX(0px)';
      element.addEventListener('dragstart', (event) => event.preventDefault());
      return element;
    });

    let nextPic = () => {
      let nextPostion = (position + 1) % this.data.length;

      let current = children[position]; // 不能有dom操作，这是个视觉操作，改了dom会语义变了，元素之间顺序变了，所以只能改变css
      let next = children[nextPostion];
      let currentAnimation = new Animation(
        current.style,
        'transform',
        -100 * position,
        -100 - 100 * position,
        500,
        0,
        ease,
        (v) => `translateX(${5 * v}px)`
      );
      let nextAnimation = new Animation(
        next.style,
        'transform',
        100 - 100 * nextPostion,
        -100 * nextPostion,
        500,
        0,
        ease,
        (v) => `translateX(${5 * v}px)`
      );

      timeline.add(currentAnimation);
      timeline.add(nextAnimation);
      position = nextPostion;
      nextPicStopHandler = setTimeout(nextPic, 3000);
    };
    nextPicStopHandler = setTimeout(nextPic, 3000);
    return children;
  }

  render() {
    return <div class='carousel'>{this.autoPlay()}</div>;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
