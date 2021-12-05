### 设计模式

按照数据类型类型来说 分为静态类型语言和动态类型语言 静态类型就是在编译时才能确定类型的语言 动态类型是运行时才能确定类型的语言 

#### 多态 

多态就是同一个操作作用在不同的对象上 可以产生不同的解释和不同的执行结果 

多态背后的思想就是将做什么和谁去做怎么做分开 将可变的事和不可变的事分开 

#### 原型编程范型的规

1. 所有的数据都是对象
2. 要得到一个对象 不是实例化类。而是找到一个对象作为原型并克隆他
3. 对象会记住它的原型
4. 如果对象无法响应某个请求 就会把这个请求委托给他的原型

### this call和apply

#### this的指向

this总是指向一个对象 至于是哪个对象是运行时基于执行环境动态绑定的 而非声明时的环境

1. 作为对象的属性执行 指向该对象
2. 作为普通函数调用  指向全局对象 严格模式指向undefined
3. 作为构造器调用 指向返回的对象 如果构造器显示的返回一个对象 则指向这个对象 
4. call apply 调用执行绑定的对象 

dom的事件处理函数中的this指向这个dom元素 

#### call apply的用途

1. 改变this的指向

2. 借用其他对象的方法

   ```js
   var a = function(name) {
     this.name = name;
   }
   
   var B = function() {
     a.apply(this, arguments);
   }
   
   B.prototype.getName = function() {
     return this.name;
   }
   
   var b = new B('lixiaohu');
   b.getName();  //lixiaohu
   
   ```

#### 高阶函数

1.  函数可以作为参数参数被传递  回调函数
2.  函数可以作为返回值 

#### 把不变的和可变的分开 



#### 单例模式

单例模式的核心就是： 确保只有一个实例。并提供全局访问的入口

##### 惰性单例

指的是只有在需要的时候才会创建一个对象实例

##### 单一职责原则 

```javascript
const createDiv = function(html) {
  const div = document.createElement('div');
  div.innnerHTML(html);
  div.style.dispaly = 'none';
  document.body.appendChild(div);
  
  return div;
}

const getSingle(func) {
  let res = null;
  return function() {
    return res || (res = func.apply(this, arguments));
  } 
}

const createModal = getSingle(creatDiv);

document.querySelector('button').addEventListener('click', e => {
  const modal = createModal('lixiaohu');
  modal.style.display = 'block';
}, false);


```



#### 策略模式

策略模式指的是定义一系列的算法 并将他们封装起来。 

目的就是将算法的使用和算法的实现分离开来 

策略模式的程序至少包含两部分： 一部分是一组策略类 封装了具体的算法。另一部分是环境类 接受用户的请求 并把请求委托给某一个策略类 要做到这点 说明环境类中要有对某个策略对象的引用

策略模式中的一系列策略类对应的算法  并使他们可以互相替换 

##### 面向对象中策略模式实现 

```javascript
//OOP

//一组策略类 

const PerformanceS = function() {};
PerformanceS.prototype.calculate = function(salary) {
  return salary * 4;
}

const PerformanceA = function() {};
PerformanceA.prototype.calculate = function(salary) {
  return salary * 3;
}

const PerformanceB = function() {};
PerformanceB.prototype.calculate = function(salary) {
  return salary * 2;
}


//Context 接受请求并委托请求
const Bonus = function() {
  this.salary = null;
  this.strategy = null;
}

Bonus.prototype.setSalary = function(salary) {
  this.salary = salary;
}

Bonus.prototype.setStrategy = function(strategy) {
  this.strategy = strategy;
}

Bonus.prototype.getBonus = function() {
  if (!this.strategy) {
    throw new Error('strategy is null');
  }
  return this.strategy.calculate(this.salary);
}

//start calculate 

const bonus = new Bonus();
bonus.setSalary(1000);
bonus.setStrategy(new PerformanceA());

console.log(bonus.getBonus());




//JavaScript

const strategies = {
  S: function(salary) {
    return salary * 4;
  },
  A: function(salary) {
    return salary * 3;
  },
  B: function(salary) {
    return salary * 2;
  }
}

const getBonus = function(level, salary) {
  return strategies && strategies[level] && strategies[level](salary);
} 



console.log(getBonus('B', 26000));


// 实际上在JavaScript中策略模式还能变成更简洁的这样 
// 一等函数对象的策略模式

function S(salary) {
  return salary * 4;
}

function A(salary) {
  return salary * 3;
}

function B(salary) {
  return salary * 2;
}


function calculateBonus(levelFunc, salary) {
  if (typeof levelFunc === 'function') {
    return levelFunc(salary);
  }
}


console.log(calculateBonus(B,26000));
```

##### 策略模式的优缺点

优点

1. 利用组合 委托 多态等思想有效的避免了多重条件选择语句
2. 策略模式提供了对开发封闭原则的完美支持 将算法封装在独立的strategy中 使得它易于切换 理解和扩展 
3. 策略模式的算法也可以复用在程序的其他地方 
4. 策略模式用组合和委托的方式来让环境类拥有执行算法的能力 这也是继承的一种更轻便的替代方案

缺点

1. 会在程序中增加许多策略类或者策略对象 但这比把它们负责的逻辑堆砌在环境类中更好
2. 使用策略模式 必须了解所有的策略类 这样才能选择合适的策略 进而达到自己的目的 

#### The Open-Closed principle 开闭原则

Software should be opened for extension.  but closed for modification

这是非常重要的软件设计原则 任何程序对于扩展应该是开放的 但是对于修改应该是关闭的

这样的原则有利于保持代码的稳定性  当有新的需求来时 应该是去扩展新的类或者函数 而不是修改原来的代码 

在开闭原则中 如果要对原来的逻辑进行修改 那应该只能是bugfix 

