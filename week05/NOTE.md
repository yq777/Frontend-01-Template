# 每周总结可以写在这里
- Realm
  - JS Context - Realm(比宏任务大的一个容器，上下文执行环境，容器或载体，Realm之间可以互相通讯，互相通讯指：借助公共宿主环境进行交流,上下文包含global, jsContext对应globalObject)
  - 宏任务
  - 微任务（浏览器里只有Promise, mutationObserver）
  - 函数调用（Execution Context）进入一个函数时会进行一个stack push返回的时候会执行一次stack pop,执行一个函数会切换一下函数执行环境
    - ECMAScript Code Execution Context
  - 语句/声明
  - 表达式
  - 直接量/变量/this....
- Realm
  - 在JS中，函数表达式和对象直接量均会创建对象
- TCP获取response是流式数据