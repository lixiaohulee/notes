# 面试题准备

### 浏览器的解析过程

#### css和js的加载解析过程到底会不会阻塞后面的工作

> 这里要特别注意**解析和渲染两个词的真正的意思 他们不等同 解析是读取字符生成dom数或者cssom数的过程 但是渲染是直接根据render树回流和重绘显示在屏幕上**

1. css的下载和解析过程不会阻塞dom树的解析 根据关键渲染路径就可以知道他们俩的过程的是并行的 
2. css的下载和解析过程会阻塞render树的渲染 render树需要cssom树
3. css加载会阻塞后面的js语句的**执行** 

#### DOMContentLoaded事件当页面的内容解析完成之后就会触发该事件

#### load事件就是等页面中所有资源都加载完成之后才会触发 包括css js 图片 视频等等

### Promise的原理及手写Promise

* new Promise的时候需要传递一个exector执行器 执行器立即执行

* exector执行器接受两个参数 分别是resovle 和 reject 

* promise的状态只能从pending到fulfilled 或者从pending状态到rejected

* promise的状态一旦确定就不会改变 

* promise都有一个then方法 then方法接受两个参数 分别是promise成功的时候的回调和失败的时候的回调 

* 如果调用then方法时  promise的状态是成功的。那么就会调用onFulfilled函数并将promise的成功的值传递进去 如果promise的状态是失败的 那么就会调用onRejected函数并将promise失败的原因传递进去 如果promise的状态是pending的话。那么就会将onFulfilled和onRejected函数保存起来 然后等待promsie的状态变化之后 再依次将函数执行掉

* promise的then可以调用多次 then方法还是返回一个promise

* 如果then中返回的是一个结果。那么就会将这个结果传递给下一个then的onFulfulled函数 如果then返回的抛出一个异常 那么就会将这个异常作为参数传递给onRejected的参数

* 如果then中返回的是一个promise  那么就需要等待这个promise的状态了 如果这个promise成功了。就会走下一个then的成功。如果失败了就会走下一个then的失败 

```
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(exector) {
    if (typeof exector !== 'function') {
        throw new TypeError(`promise resolver is not function`)
    }

    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onRejectedCallbacks = []
    this.onFulFilledCallbacks = []

    const that = this

    function resolve(value) {
        if (that.status === PENDING) {
            that.status = FULFILLED
            that.value = value
            that.onFulFilledCallbacks.forEach(func => func())
        }
    }

    function reject(reason) {
        if (that.status === PENDING) {
            that.status = REJECTED
            that.reason = reason
            that.onRejectedCallbacks.forEach(func => func())
        }
    }

    try {
        exector(resolve, reject)
    }catch(e) {
        reject(e)
    }
}


Promise.prototype.then = function(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    const promise = new Promise((resolve, reject) => {
        if (this.status === FULFILLED) {
            const timer = setTimeout(() => {
                try {
                    let x = onFulfilled(this.value)
                    clearTimeout(timer)
                    resolvePromise(promise,x,resolve,reject)
                }catch(e) {
                    reject(e)
                }
            })
        }else if (this.status === REJECTED) {
            const timer = setTimeout(() => {
                try {
                    let x = onRejected(this.reason)
                    clearTimeout(timer)
                    resolvePromise(promise,x,resolve, reject)
                }catch(e) {
                    reject(e)
                }
            })
        }else if (this.status === PENDING) {
            this.onFulFilledCallbacks.push(() => {
                const timer = setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        clearTimeout(timer)
                        resolvePromise(promise,x,resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                })
            })
            this.onRejectedCallbacks.push(() => {
                const timer = setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        clearTimeout(timer)
                        resolvePromise(promise,x,resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                })
            })
        }
    })


    return promise
}


function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        reject(new TypeError('Chaining cycle'))
    }

    if (x instanceof Promise) {
        x.then(res => {
            resolvePromise(promise, res, resolve, reject)
        }, err => {
            reject(err)
        })
    }


    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let called = false
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, res => {
                    if (called) return
                    called = true
                    resolvePromise(promise, res, resolve, reject)
                }, err => {
                    if (called) return
                    called = true
                    reject(err)
                })
            }else {
                if (called) return
                called = true
                resolve(x)
            }
            
        }catch(e) {
            if (called) return
            called = true
            reject(e)
        }
    }else {
        resolve(x)
    }
}
```

---
**以上实现全是符合PromiseA+规范实现**

> 原生的promise在PromiseA+的基础上又实现了几个方法就是es6中实现

### Promise.resolve() 

这个方法就为了将需呀转为Promise的参数转为Promise

#### 规则 

1. 如果参数promise 直接返回

2. 如果参数是个thenable对象 那么就会以thenable对象的为准

3. 其他值都会以promise的成功状态

```
Promise.resolve = function(param) {
    if (param instanceof Promise) {
        return param
    }

    return new Promise((resolve, reject) => {
        if (param && param.then && typeof param.then === 'function') {
            setTimeout(() => {
                param.then(resolve, reject)
            })
        }else {
            resolve(param)
        }
    })
}
```


### Promise.reject()

promise.reject的参数会原封不动的变为reject的参数


```
Promise.reject = function(param) {
    return new Promise((resolve, reject) => {
        reject(param)
    })
}
```


### Promise.prototype.catch()

Promise.catch() 相当于Promise.prototype.then(null, onRejected)
或者相当于Promise.prototype.then(undefined, onRejected)用于指定发生错误时的回调 

### Promise.prototype.finally()

无论是成功还是失败。这个方法都会执行。


### vue-router源码分析 



### 浏览器缓存机制解读 


### vue源码解析

### 缓存原理 

#### 缓存步骤

1. 浏览器在请求某个资源的时候 会先根据资源的http header判断是否命中强缓存  如果强缓存命中 那么就会直接从自己的缓存中读取资源 根本不会发送请求到服务器 

**强缓存命中  直接从本地缓存中加载。 连请求都不会发送到服务器**

2. 当强缓存没有命中的时候 浏览器一定会发送一个请求到服务器 服务器会依据资源的另外一些http header字段验证是否命中协商缓存 如果协商缓存命中 浏览器会将这个请求返回 但是不会返回这个资源的内容 而是只是告诉客户端可以直接从缓存中加载这个资源 

3. 强缓存和协商缓存的共同点是： 如果命中。都是从客户端中加载资源而不是从服务端加载资源 区别是： 强缓存不发送任何请求到服务器 协商缓存会发送请求到服务器 

4. 当协商缓存没有命中的时候 浏览器直接从服务器加载资源数据


* 第一次请求： 通常服务器会传送4个缓存相关的字段过来 也可能一个都没有 

* 第二次请求： 前端首先检查Cache-Control和Expires两个字段  这俩个都是强缓存的字段 但是当都有的时候  Cache-Control优先级更高  如果检查完发现缓存超时了 那么就会向后端发送请求  请求中会带上跟协商缓存相关的字段if-Modified-Since 和。if-None-Match两个让服务端来判断资源

后台接受到请求之后 会对两个协商缓存的字段进行对比 同样的如果两个字段都有 那么就会以if-None-Match为标准。他的优先级更高。没有if-None-Match的时候 就会对比另外一个字段if-Modified-Since  比对之后如果发现文件没有过期 即Etag没有发生变化 或者Last-Modified 和if-Modified-Since字段一致的时。如果改变了就会发送新的文件 反之就会返回304 告诉浏览器文件更新 可以从缓存中读取


### 浏览器缓存分类

|request header | response header | 说明 |
|---- |----| --- |
| Expires | Expires | http1.0 就开始支持的头字段 采用相对服务器时间来定义 但是因为服务器时间和浏览器时间不一致。所以不完全可靠 | 
| Cache-Control | Cache-Control | http1.0 就开始支持的字段 优先级要比expires高 但是来说通常两者并存 采用绝对时间 Cache-Control： max-age= 60 单位是秒 |
| if-Modified-Since | Last-Modified | Last-Modified表示上一次更改时间 这里的更改并非狭义上的对内容进行修改 哪怕是打开文件再直接保存也会刷新改时间 | 
| if-None-Match | Etag | Etag则是与内容紧密相关的一个字段 是对文件内容hash散列的值 hash会消耗一部分cpu计算时间 比Last-Modified可靠 | 

#### 强缓存 

客户端在第一次问服务器要某个资源的时候 服务器在返回资源的同时 会告诉客户端将这个资源保存在本地 同时在未来某个时间点之前还需要这个资源的时候 直接从本地获取就行了 不需要向服务器发送任何请求 这就是强缓存 **强缓存通过返回头部的Expires 和 Cache-Control两个字段来控制的 都表示资源的缓存时间  强缓存命中时就会返回200 可以通过size属性判断是返回的还是从缓存中拿的**


#### Expires

这个字段是一个绝对时间的GMT格式的时间字符串 代表缓存的过期时间 在这个时间点之前都可以命中缓存 

服务器返回资源并在返回头中加上Expires这个字段  浏览器接受到该资源时连同这个header 字段一起把资源缓存到本地 再次请求时 会先从本地中找到这个资源然后用当前的请求时间跟Expires时间对比  如果当前的时间比Expires的时间晚 说明缓存过期了 未命中 然后从服务器直接去拉取。如果未过期 那么直接从缓存中拿


**缺点是： 服务器返回的Expires时间是服务器上的时间  可能与客户端有时间差的  时间差太大会造成缓存混乱**


#### Cache-Control： max-age

这个字段有很多属性 代表不同的含义

private  客户端可以缓存 

public  客户端和代理服务器都可以缓存

max-age=t 缓存将在t秒后失效 

no-cache 需要使用协商缓存来验证缓存数据

no-store 所有内容都不会 缓存

这个字段Cache-Control： max-age=333 即从第一次获取字段的开在设置的时间范围内请求资源都是可以命中强缓存的 


客户端接受到资源后 连同header一起缓存下来  再次请求这个资源时会从本地找到这个资源 然后**获取第一次返回这个资源的时间 和 设置的max-age的时间 两个时间计算出一个有效期 再和本地请求的时间对比 看看是否命中了强缓存**

Cache-Control表示的额相对时间 采用本地的时间来计算资源有效期 比Expires更可靠 


### 协商缓存 

客户单第一次向服务器请求某个资源的时候 服务器在返回资源的同时 还会将改资源的一些信息 文件摘要 或者最后修改时间返回给客户端 客户端一并讲这些信息保存在本地
下次再请求的时候 客户端会带上这些信息 然后由服务器来判定请求的资源是不是须哟啊更新 如果不需要那么就会直接返回304。客户端从缓存读取就行了 如果需要更新服务器就会返回资源并带上最新的信息 浏览器再次缓存资源并更新信息 

#### Last-Modified if-Modified-Since

浏览器第一次请求资源 服务器返回资源并会在response header中加上Last-Modified这个字段 这个header表示资源再服务器上最后一次修改时间 

浏览器再次请求的时候 会在request header 中加上if-Modified-since这个字段 这个值即为上次服务器返回的资源的Last-Modified时间 

服务器接受到请求时 将请求头中的if-Modified-Since与最后一次文件修改的时间对比 如果一致 则命中缓存 如果不一致则返回304。 命中的话就是从缓存总拿去数据 否则返回资源并更新Last-Modified。

####。Etag 和 if-None-Match 

Last-Modified的时间无法精确到毫秒 但有些资源的更新频率有时会小于一秒 

为了解决的这些问题 允许用户为资源打上标签  这个是根据文件的内容生成的hash值 

Etag最后服务器返回资源的同时跟response header中一起返回  

if-None-Match 为请求头部字段 

服务器第一次接受到请求 返回资源的时候在header中加上etag  客户端连同这个etag字段一起缓存 

当浏览器再次向服务器发送的资源请求的时候 在header中带上if-None-Match 该值为第一次返回服务器返回的Etag值 

服务器收到请求后就开始对比两个字段。命中则返回304 没有命中则返回资源并更新字段 

**协商缓存一般会把上面两种方式都会使用  这是为了处理Last-Modified不可靠的原因 **


### 浏览器工作的过程 

#### 关键渲染路径

浏览器收到服务器返回的HTML、CSS、JavaScript字节数据并对其进行解析和转变成像素的渲染过程被称为关键渲染路径。通过优化关键渲染路径即可以缩短浏览器渲染页面的时间 


#### 从浏览器地址栏中输入url到页面展现都发生了什么

总的过程大概可以分为：

1. DNS解析
2. TCP链接
3. 发送HTTP请求
4. 服务器处理请求并返回HTTP报文
5. 浏览器解析渲染页面
6. 链接结束

DNS解析的过程实际上就是寻找哪台机器上有你需要的资源 就是url转变成IP地址的过程
，DNS解析过程其实就是一个递归查询的过程 当输入浏览器地址栏url后 首先在本地域名服务器中查询IP地址，如果没有找到的情况下  本地域名服务器会向根域名服务器发送一个请求 如果根域名服务器没有找到的情况下 那么本地域名服务器就会向com顶级域名服务器发送一个请求 依次类推下去 直到最后本地域名服务器找到输入域名的IP地址并把他缓存到本地 其实真正的网址一般都是www.baidu.com. 最后的那个点对应的就是根域名服务器 默认情况下所有网址的最后就是. 所以都给省略了  


> DNS优化

上文中请求得倒网址的IP地址时 经历了8个步骤 这个过程中存在着多个请求 同时存在UDP请求和TCP请求 每次查询都要经过这么多步骤 肯定会浪费很多时间 如果减少这些步骤呢 那就是DNS缓存 

DNS存在着多级缓存  从离浏览器的距离排序的话  有以下几种： 浏览器缓存  系统缓存 路由器缓存  IPS服务器缓存  根域名服务器缓存 顶级域名服务器缓存 主域名服务器缓存 


#### 浏览器的关键渲染路径 

> 构建dom树

抛出js不说 浏览器收到html页面的时候 会从上往下开始解析生成DOM树 如果中途发现了Link标签或者style标签停止DOM的解析和DOM树的生成 转而去同步下载CSS资源并解析生成CSSOM树 当DOM树和CSSOM树都构建好之后 浏览器就会开始组合 生成渲染树 最后就是开始布局计算元素的位置和渲染

> 构建CSSOM树 阻止渲染的CSS

渲染树是在CSSOM树和DOM树构建好之后开始的 **也就是说CSS和HTML是阻塞浏览器渲染的 如果没有完整读取DOM和CSSOM也就无法构建渲染树**


#### 回流和重绘

当render tree中的一部分或者全部因为元素的规模尺寸，布局，隐藏等改变时，浏览器重新排列渲染部分DOM或者全部DOM的过程就是回流 回流也称为重排

当页面元素样式改变不影响元素在文档流中的位置时，浏览器只会将新样式赋予元素并重新绘制操作就是重绘


**有大量的用户行为或者潜在的动态HTML的改变都会触发回流，例如改变浏览器窗口的大小，操作dom的增删改查等都会触发回流**

> 回流比定引起重绘  而重绘不一定会引起回流 


### Object.create 和new 的区别


### Vuex原理

vuex是类似于redux一样的状态管理机制 采用集中式的管理vue组件中的一些属性

* vuex的本质就是把我们提前定义好的state变换成一个隐藏的Vue组件的data 也就是说我们每次修改访问值都是实际上访问的这个隐藏的vue组件的data属性 因为这样做完完全全就利用上了vue自身的响应式设计 依赖监听 依赖收集等等

* vuex是如何注入到组件中的呢 其实是利用vue的混入机制 在beforeCreate钩子函数中将store挂在到组件 并定义了$store属性

#### vuex的getters

我们知道了vuex的state是响应式的 实际上是借助了vue的data的响应式 将state存入vue组件的实际的例子中。而Vuex的getters则是借助了vue的computed属性

### mutations getters state actions

可以直接简历对比关系 mutations可以理解为vue组件中的methods属性 getters可以理解为vue组件中的computed属性 state就是理解为vue组件中的data属性

通过dispatch方法可以触发actions中的方法  通过commit可以触发mutations中的方法 

getters通过方法直接访问时对应的属性值是不缓存的 实际上getters属性的值是可以缓存的  只有当依赖的值变化了的时候才会更新

actions接受一个和和store实例具有相同属性和方法的context对象 因此你可以调用context.commit提提交mutations 或者通过cotext.state和getters来获取状态  

#### 为什么不能直接修改store中的值 而是必须通过提交commit调用mutations中的方法来修改

这样做的原因就是这样作出的修改 可以让我们把每次的记录修改记录下来  方便我们追踪状态的变化过程 **但是如果我们将vuex的stict设置为true。所有不经过mutaions方法来修改vuex的值的操作都会抛出错误**


### Vue Router的原理

单页面应用的一个核心理念就是更新时图但不是真正的请求页面 

#### 三种模式 

Vue router提供了三种模式 hash模式 history模式和abstract模式 hash模式是以url的hash值来作为路由 history则是依赖于HTML5的history的pushstate和replaceState方法来实现 abstract模式则是可以应用于任何js环境包括node

**记住 url的hash值改变的时候本来就是不会请求页面的 但是他会在浏览器的历史记录中添加记录  实际上hash值改变是用来不在加载整个页面的前提下 浏览器只会加载响应锚点位置的内容**

#### history模式

history模式其实就是在historyapi的基础上实现的 history api的提供的方法可以让我们在改变url的情况下不刷新页面不向服务端请求页面 但是这中模式也要同时在福服务端做好配置。当你手动刷新浏览器的时候 这个时候是会想服务端发送请求的 

#### abstract模式 

abstract模式是完全脱离了浏览器的历史记录而自己模拟了一个历史记录栈来来实现路由的 他可以应用在任何的场景


### 浏览器的并发请求数量

### ES6 ES7 ES8 等等是否跟进

### 不可变对象 

### 事件循环队列题

```
console.log(1)
setTimeout(() => {
    console.log(2)
    Promise.resolve().then(data => {
        console.log(3)
    })
})
new Promise((resolve) => {
    resolve()
    console.log(4)
}).then(() => {
    console.log(5)
    setTimeout(() => {
        console.log(6)
    })
}).then(() => console.log(7))
console.log(8)
```

### 函数申明提升和变量申明提升

```
console.log(fish1, fish2, fish3)
var fish1 = function() {
    console.log('welcom to p1')
}
function fish2() {
    console.log('welcom to p2')
}
var fish3 = 'welcome to p3'

var fish1, fish2, fish3;
console.log(fish1, fish2, fish3)
```

### this指向问题

```
var nickname = 'lilei'
function Person(name) {
    this.nickname = name
    this.sayHi = function() {
        console.log(this.nickname)
        setTimeout(function() {
            console.log(this.nickname)
        }, 1000)
    }
}

var Male = {
    nickname: 'xiaofang'
    sayHi: () => {
        console.log(this.nickname)
    }
}
var person = new (Person.bind(Male, 'xiaohong'))
person.sayHi()
```

### 按值传递

```
let object = { a: 0}
function fun(obj) {
    obj.a = 1
    obj = {a: 2}
    obj.b = 2
}
fun(object)
console.log(object)
```

### Promise.all async await 

### node的事件循环机制和浏览器的事件循环机制有区别

### vue的v-for中的key为什么要设置呢 
当vue更新正在使用v-for渲染的元素列表时 它默认使用就地更新政策 如果数据项的顺序被改变 vue并不会移动dom元素来匹配数据项的顺序 而是就地更新每个元素 并且确保它们在每个索引位置正确渲染 这个模式默认是高效的 但是只是适用于不依赖子组件状态或临时dom状态的列表渲染 为了给Vue一个提示 以便他能跟踪每个节点的身份 从而重用和重新排序现有元素 

### Object.definedProperty的缺点
1. 无法监控数组下标的变化 导致通过数组下标添加元素 不能实时响应
2. 只能劫持对象的属性 从而需要对每个对象每个属性遍历  如果属性值是对象还需要深度遍历 
3. proxy不仅可以代理对象 还可以代理数组 还可以dialing动态增加的属性 

### Promise.reject后的代码会执行吗

### Promise的构造函数是同步执行还是异步执行

### vue的组件通信方式

### 多维数组变成一维数组 

### 将驼峰变成下划线 

### Js的变迁阻塞

### 解释性的语言和编译性的语言有什么区别

### vue-cli的webpack配置和webpack的相关配置

### v-if和v-show有什么区别 

### 做项目时遇到哪些难点

### 最近在学什么技术