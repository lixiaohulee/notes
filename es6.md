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

* **优先使用catch捕获错误，而不是使用then方法的第二参数函数**

* catch 之后还可以接着使用catch和then

### promise.prototype.finally

* finally 不会管promise的状态到底是什么 总会执行

* finally 不会接受前面的promise的状态改变的回调传值

### promise.all

* promise.all 接受的参数必须含有Interator接口的类型参数，而且其中内容必须包含的promise 如果不是promise则会调用pormise.resolve转化为promise

* 只有参数中的promise的状态都是fulfilled promise.all的状态才回事fulfilled，此时每个promise的返回值组成一个数组作为返回值，
如果其中有一个是rejected 则会直接rejected 并将第一个rejected的返回值作为返回值

### promise.race

* 相对于promise.all 接受数组或者具有interator接口的的参数，如果某个promise率先改变状态，promise.race的状态就会根据它的状态改变

### promise.resolve

* 将一个对象转化为promise对象

```
Promise.resolve('foo') === new Promise(resolve => 

resolve('foo'))
```

* 参数有四种类型： 

1. promise 原封不动的返回

2. thenable对象(一个具有then方法的对象) 转为promise 立即执行then方法

3. 基本数据类型，返回新的promise对象，并直接返回resolved

4. 不带任何参数，直接resolved

### promise.reject

* 返回一个新的promise对象，状态直接是rejected


### promise.try