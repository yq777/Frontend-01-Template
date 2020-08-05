export function enableGesture(element) {
  let contexts = Object.create(null);
  let MOUSE_SYMBOL = Symbol('mouse');

  if (document.ontouchstart !== null) {
    element.addEventListener('mousedown', (event) => {
      contexts[MOUSE_SYMBOL] = Object.create(null);
      start(event, contexts[MOUSE_SYMBOL]);
      let mousemove = (event) => {
        move(event, contexts[MOUSE_SYMBOL]);
      };
      let mouseend = (event) => {
        end(event, contexts[MOUSE_SYMBOL]);
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseend);
      };
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseend);
    });
  }

  element.addEventListener('touchstart', (event) => {
    for (let touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null);

      start(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener('touchmove', (event) => {
    for (let touch of event.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener('touchend', (event) => {
    for (let touch of event.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  element.addEventListener('touchcancel', (event) => {
    for (let touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  // tap
  // pan - panstart panmove panend
  // flick
  // press - pressstart pressend

  /**
   * start->tap（马上end）
   * start 超过0.5秒就是pressstart移动10px是到panstart,立马end是pressend
   * start ->move了大概10px可以认为是panstart，->移动产生panmove,最后是panend
   * flick可能是panend的变形，和panend同时触发，panend的时候速度>?就是flick
   */
  /**
   * 监听，识别，分发
   *pan优先级比press高
   */
  let start = (point, context) => {
    element.dispatchEvent(
      new CustomEvent('start', {
        detail: {
          startX: point.startX,
          startY: point.startY,
          clientX: point.clientX,
          clientY: point.clientY,
        },
      })
    );
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.moves = [];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.timeoutHandler = setTimeout(() => {
      if (context.isPan) return;
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      console.log('pressstart');
      element.dispatchEvent(new CustomEvent('pressstart'), {});
    }, 500);
  };
  let move = (point, context) => {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        console.log('presscancel');
        element.dispatchEvent(new CustomEvent('presscancel', {}));
      }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;

      element.dispatchEvent(
        new CustomEvent('panstart', {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
          },
        })
      );
    }

    if (context.isPan) {
      context.moves.push({ dx, dy, t: Date.now() });
      context.moves = context.moves.filter(
        (record) => Date.now() - record.t < 300
      );
      element.dispatchEvent(
        new CustomEvent('pan', {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
          },
        })
      );
    }
  };
  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX,
        dy = point.clientY - context.startY;
      let record = context.moves[0];
      let speed = Math.sqrt(
        ((record.dx - dx) ** 2 + (record.dy - dy) ** 2) /
          (Date.now() - record.t)
      );
      let isFlick = speed > 2.5;
      if (isFlick) {
        console.log('flick');
        element.dispatchEvent(
          new CustomEvent('flick', {
            detail: {
              startX: context.startX,
              startY: context.startY,
              clientX: point.clientX,
              clientY: point.clientY,
              speed,
            },
          })
        );
      }
      console.log(context.moves);
      console.log('panend');
      element.dispatchEvent(
        new CustomEvent('panend', {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            speed,
            isFlick,
          },
        })
      );
    }
    if (context.isTap) {
      console.log('tap');
      element.dispatchEvent(new CustomEvent('tap', {}));
    }
    if (context.isPress) {
      console.log('pressend');
      element.dispatchEvent(new CustomEvent('pressend', {}));
    }
    clearTimeout(context.timeoutHandler);
  };
  let cancel = (point, context) => {
    element.dispatchEvent(new CustomEvent('cancel', {}));
    console.log('cancel');
  };
}
