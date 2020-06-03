const images = require('images');
function render(viewport, element) {
  if (element.style) {
    const img = images(element.style.width, element.style.height);
    if (element.style['background-color']) {
      let color = element.style['background-color'] || 'rgb(0,0,0)';
      const colorArr = color.match(/rgb\((\d+),\s(\d+),\s(\d+)\)/);
      if (colorArr) {
        img.fill(Number(colorArr[1]), Number(colorArr[2]), Number(colorArr[3]));
        viewport.draw(img, element.style.left || 0, element.style.top || 0);
      }
    }
  }
  if (element.children) {
    element.children.map((item) => {
      render(viewport, item);
    });
  }
}
module.exports = render;
