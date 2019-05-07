### Promise

promise是个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）语法上说它是一个对象，可以获取异步操作的消息

promise的特点

1. 状态不受外界影响，padding，fulfilled，rejected 只有异步操作的结果可以改变状态

2. 状态一旦改变就不会再变，从padding 到 fulfilled， 从padding到rejected

promise的缺点

1. 一旦创建，立即执行

2. 不设置回调函数，内部抛出的错误无法反应到外面，会吃掉错误

3. padding状态时，无法确定具体进展到哪一步，快要完成还是刚刚开始