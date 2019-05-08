### Promise

promise是个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）语法上说它是一个对象，可以获取异步操作的消息

promise的特点

1. 状态不受外界影响，padding，fulfilled，rejected 只有异步操作的结果可以改变状态

2. 状态一旦改变就不会再变，从padding 到 fulfilled， 从padding到rejected

promise的缺点

1. 一旦创建，立即执行

2. 不设置回调函数，内部抛出的错误无法反应到外面，会吃掉错误

3. padding状态时，无法确定具体进展到哪一步，快要完成还是刚刚开始

### 基本用法

* 如果有两个promise实例，第一个promise 的resolve讲第二个promise返回，这是第一个promise的状态就会无效，它的状态将由第二个promise的状态决定，如果第二个promise状态是resolve，则调用第一个promsie的resolve状态的回调函数，如果是reject则调用reject的回调函数，如果是padding状态，则第一个promise需要等待

* 调用resolve或者reject 并不会终结promise参数函数的继续执行

```
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```
* 不建议再resolve或者reject之后再有执行语句，可以使用return 语句返回resolve或者reject 这样即使有语句也不会再执行

### Promise.prototype.then()

* then方法是定义在Promise构造函数的原型对象上的，它的目的是为了所有promise实例添加状态改变时的回调函数

* then()方法的第一个回调函数是resolve状态的回调，第二个reject状态的回调函数，他们的参数都是resolve或者reject的参数

* then方法返回的是一个全新的promise，保证可以链式调用

### Promise.prototype.catch()

* .catch 等同于.then(null, rejection) 或者.then(undefined, rejection)


* then方法中抛出的错误也会被catch捕获

* Promise的参数函数中如果直接抛出异常，也会被catch所捕获，***但是如果在resolve后再抛出异常就无效了***

* promsie的对象的错误具有冒泡性质，就是说无论前面有几个promise实例都会被catch捕获

* **优先使用catch捕获错误，而不是使用then方法的第二参数函数**