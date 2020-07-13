# 每周总结可以写在这里

- requestAnimationFrame
  - 注意点：使用h5的js动画，需要调用requestAnimationFrame方法两次
  - requestAnimationFrame只运行一次传入的函数，需要再次更新就需要再次调用requestAnimationFrame，类似递归调用同一方法来不断更新画面以达到动起来的效果
  