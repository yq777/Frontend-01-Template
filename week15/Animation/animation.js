export class Timeline {
  constructor() {
    this.animations = [];
    this.requestId = null;
    this.state = 'inited';
    this.tick = () => {
      let t = Date.now() - this.startTime;
      let animations = this.animations.filter(
        (animation) => !animation.finished
      );
      for (let animation of animations) {
        let {
          property,
          object,
          start,
          end,
          timingFunction,
          delay,
          template,
          duration,
          addTime,
        } = animation;
        // timingFunction(start, end) 返回的是一个progression
        let progression = timingFunction((t - delay - addTime) / duration); // 0-1之间的数
        if (t > duration + delay + addTime) {
          progression = 1;
          animation.finshed = true;
        }
        let value = start + progression * (end - start);
        object[property] = template(value);
      }
      if (animations.length) {
        this.requestId = requestAnimationFrame(() => this.tick());
      }
    };
  }
  // 每帧执行的函数

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.pauseTime = Date.now();
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
  }
  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }
  start() {
    if (this.state !== 'inited') return;
    this.state = 'playing';
    this.startTime = Date.now();
    this.tick();
  }
  restart() {
    if (this.state === 'playing') {
      this.pause();
    }
    // 重置数据
    this.animations = [];
    this.requestId = null;
    this.state = 'playing';
    this.startTime = Date.now();
    this.pauseTime = null;

    this.tick();
  }
  // startTime delay后默认执行
  add(animation, addTime) {
    // 运行中加动画会有问题
    this.animations.push(animation);
    animation.finshed = false;
    if (this.state === 'playing') {
      animation.addTime =
      addTime !== void 0 ? addTime : Date.now() - this.startTime;
    } else {
      animation.addTime = addTime !== void 0 ? addTime : 0;
    }
  }
}

export class Animation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object;
    this.template = template;
    this.property = property;
    this.start = start;
    this.end = end;
    this.delay = delay || 0;
    this.timingFunction = timingFunction;
    this.duration = duration;
  }
}

/**
 * let animation = new Animation(object, property, start, end, duration, delay, timingFunction)
 * let animation2 = new Animation(object, property, start, end, duration, delay, timingFunction)
 *
 *
 * let timeline = new Timeline
 *
 * timeline.add(animation)
 * timeline.add(animation2)
 *
 * timeline.start()
 * timeline.pause()
 * timeline.stop()
 * timeline.resume()
 *
 * setTimeout()
 *
 * setInterval
 *
 * requestAnimationFrame
 *
 * 一帧里面执行多个动画会产生性能问题，所以需要加timeline,通过timeline控制动画的重回，执行，timeline控制多个动画
 */
