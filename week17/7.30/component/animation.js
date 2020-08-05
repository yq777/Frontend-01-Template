export class Timeline {
  constructor() {
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requestId = null;
    this.state = 'inited';
    this.tick = () => {
      let t = Date.now() - this.startTime;
      for (let animation of this.animations) {
        let {
          property,
          object,
          start,
          end,
          timingFunction,
          delay,
          template,
          duration,
        } = animation;
        let addTime = this.addTimes.get(animation);
        if (t < delay + addTime) {
          continue;
        }
        // timingFunction(start, end) 返回的是一个progression
        let progression = timingFunction((t - delay - addTime) / duration); // 0-1之间的数

        if (t > duration + delay + addTime) {
          progression = 1;
          this.animations.delete(animation);
          this.finishedAnimations.add(animation);
        }

        let value = animation.valueFromProgression(progression);
        object[property] = template(value);
      }
      if (this.animations.size) {
        this.requestId = requestAnimationFrame(() => this.tick());
      } else {
        this.requestId = null;
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
      this.requestId = null;
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
  reset() {
    if (this.state === 'playing') {
      this.pause();
    }
    // 重置数据
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requestId = null;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.state = "inited";
  }
  restart() {
    if (this.state === 'playing') {
      this.pause();
    }
    // 重置数据
    for (let animation of this.finishedAnimations) {
      this.animations.add(animation);
    }
    this.finishedAnimations= new Set();
    this.requestId = null;
    this.state = 'playing';
    this.startTime = Date.now();
    this.pauseTime = null;

    this.tick();
  }
  // startTime delay后默认执行
  add(animation, addTime) {
    // 运行中加动画会有问题
    this.animations.add(animation);
    if (this.state === 'playing' && this.requestId === null) {
      this.tick();
    }
    if (this.state === 'playing') {
      this.addTimes.set(
        animation,
        addTime !== void 0 ? addTime : Date.now() - this.startTime
      );
    } else {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : 0);
    }
  }
}

export class Animation {
  constructor(
    object,
    property,
    start,
    end,
    duration,
    delay,
    timingFunction,
    template
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

  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}

export class ColorAnimation {
  constructor(
    object,
    property,
    start, // rgb值
    end, // rgb值
    duration,
    delay,
    timingFunction,
    template
  ) {
    this.object = object;
    this.template = template || ((v) => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
    this.property = property;
    this.start = start;
    this.end = end;
    this.delay = delay || 0;
    this.timingFunction = timingFunction;
    this.duration = duration;
  }

  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    };
  }
}
