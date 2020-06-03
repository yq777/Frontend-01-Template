// 获取元素的style属性
function getStyle(element) {
  if (!element.style) element.style = {};
  for (let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value;
    if (element.style[prop].toString().match(/px$/g)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/g)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout(element) {
  // 不是flex元素不处理
  if (!element.computedStyle) return;
  const style = getStyle(element);
  if (style.display !== 'flex') return;
  // 过滤掉text元素
  const childrens = element.children.filter((item) => item.type === 'element');
  // 按照order进行排序
  childrens.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });
  // 获取元素的style值
  // 看元素是否有width和height元素，没有置为null
  ['width', 'height'].forEach((item) => {
    if (style[item] === 'auto' || style[item] === '') {
      style[item] = null;
    }
  });
  // 设置flex布局的默认值
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch';
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch';
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  // main是主轴，cross是交叉轴
  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;
    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;
    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;
    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;
    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexWrap === 'wrap-reverse') {
    const temp = crossStart;
    crossStart = crossEnd;
    crossEnd = temp;
    crossSign = -1;
  } else {
    crossSign = 1;
    crossBase = 0;
  }
  //主轴未设置宽度值
  let isAutoMainSize = false;
  if (!style[mainSize]) {
    style[mainSize] = 0;
    childrens.forEach((item) => {
      const itemStyle = getStyle(item);
      if (!!itemStyle[mainSize]) {
        style[mainSize] += itemStyle[mainSize];
      }
      isAutoMainSize = true;
    });
  }
  // 主轴排放个数
  let flexLine = [];
  // 排多少个主轴
  let flexLines = [flexLine];
  // 主轴空间
  let mainSpace = style[mainSize];
  // 交叉轴空间
  let crossSpace = 0;

  childrens.map((item) => {
    const itemStyle = getStyle(item);
    // 判断子元素是否是flex元素，并且不换行直接放在一行内
    if (itemStyle.flex && style.flexWrap === 'nowrap') {
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      // 计算主轴去除当前子元素的宽度还剩的控件
      mainSpace -= itemStyle[mainSize];
      // 取一行内资源高度最高的作为交叉轴的高度
      if (!itemStyle[crossSize]) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      // 放到主轴排放的数组中
      flexLine.push(item);
    } else {
      // 子元素不是flex布局并且当前元素允许允许换行
      // 判断子元素的宽度是否大于当前元素的宽度，大于的话去当前元素的宽度给子元素
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = mainSpace; // 若item的mainSize大于父元素mainSize取父元素的mainSize
      }
      // 主轴排列元素的空间比子元素的宽度小，则换行
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace; // 一行只排列一个元素
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine); // 换行
        mainSpace = style[mainSize]; // 重置主轴空间
        crossSpace = 0; // 重置交叉轴空间
      } else {
        flexLine.push(item); // 子元素的宽度小于主轴的宽度，则直接放进去
      }
      // 计算子元素交叉轴的最大高度
      if (itemStyle[crossSize]) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  });
  flexLine.mainSpace = mainSpace;
  // 计算交叉轴高度
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = !!style[crossSize] ? style[crossSize] : crossSpace;
  } else {
    // 多行或者一行
    flexLine.crossSpace = crossSpace;
  }
  // 主轴空间小于0，则子元素等比缩小
  if (mainSpace < 0) {
    const scale = style[mainSize] / (style[mainSize] - mainSpace);
    let currentMain = mainBase; // 起始值
    childrens.map((item) => {
      const itemStyle = getStyle(item);
      // 子元素是flex元素则宽度全部设为0
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] =
        itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    });
  } else {
    flexLines.forEach((item) => {
      const mainSpace = item.mainSpace;
      // 一行的flex个数
      let flexTotal = 0;
      item.map((children) => {
        const itemStyle = getStyle(children);
        if (!!itemStyle.flex) {
          flexTotal += itemStyle.flex;
        }
      });
      // 一行flex个数大于0
      if (flexTotal > 0) {
        let currentMain = mainBase;
        item.map((children) => {
          const itemStyle = getStyle(children);
          // 获取style的flex值，
          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd]; // 定好一行内下一个元素的起始位置
        });
      } else {
        let currentMain, step;
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase; // 起始位置
          step = 0; // 间距
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = mainBase + mainSpace * mainSign; // mainSign表示元素排列方向
          step = 0;
        }
        if (style.justifyContent === 'center') {
          currentMain = mainBase + (mainSpace / 2) * mainSign; // 中间位置开始排列
          step = 0;
        }
        if (style.justifyContent === 'space-between') {
          currentMain = mainBase;
          step = (mainSpace / (item.length - 1)) * mainSign;
        }
        if (style.justifyContent === 'space-around') {
          step = (mainSpace / item.length) * mainSign;
          currentMain = step / 2 + mainBase;
        }
        item.map((children) => {
          const itemStyle = getStyle(children);
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        });
      }
    });
  }
  // 获取元素的交叉轴高度，没有取排列总行数的高度相加
  if (!style[crossSize]) {
    crossSpace = 0;
    style[crossSize] = 0;
    flexLines.forEach((item) => {
      style[crossSize] += item.crossSpace;
    });
  } else {
    crossSpace = style[crossSize];
    flexLines.forEach((item) => {
      crossSpace -= item.crossSpace;
    });
  }
  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }
  // const lineSize = style[crossSize] / flexLines.length;
  let step;
  if (style.alignContent === 'flex-start') {
    crossBase += 0;
    step = 0;
  }
  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace;
    step = 0;
  }
  if (style.alignContent === 'center') {
    crossBase += (crossSign * crossSpace) / 2;
    step = 0;
  }
  if (style.alignContent === 'space-between') {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }
  if (style.alignContent === 'space-around') {
    step = crossSpace / flexLine.length;
    crossBase += (crossSign * step) / 2;
  }
  if (style.alignContent === 'stretch') {
    crossBase += 0;
    step = 0;
  }
  flexLines.forEach((item) => {
    const lineCrossSize =
      style.alignContent === 'stretch'
        ? item.crossSpace + crossSpace / flexLines.length
        : item.crossSpace;
    item.map((children) => {
      const itemStyle = getStyle(children);
      const align = itemStyle.alignSelf || style.alignItems;
      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
      }
      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] =
          itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }
      if (align === 'center') {
        itemStyle[crossStart] =
          crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          crossBase +
          crossSign *
            ((!!itemStyle[crossSize] && itemStyle[crossSize]) || lineCrossSize);
        itemStyle[crossSize] =
          crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    });
    crossBase += crossSign * (lineCrossSize + step);
  });
}
module.exports = layout;
