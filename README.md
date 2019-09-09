### script

---

* 解析器在对script标签内部的代码解析完毕之前 页面中其他内容都不会被加载和显示

* script标签外链js文件时，如果在标签内部嵌入代码，这些代码会被忽略

* script的src属性引入链接，是可以跨域的

* noscript 标签可以包含任何body中的html元素

### 搞懂script标签的defer和async属性

#### 先看普通的脚本

* 浏览器遇到普通的script标签停止解析document

* 请求js文件

* 执行js文件脚本

* 继续解析document

#### defer 延迟脚本

`<script src="d.js" defer></script>
<script src="e.js" defer></script>`

* 浏览器遇到延迟脚本，不会停止解析document，而是继续解析document并且同时下载d.js e.js

* 下载完了连个js文件，浏览器还是继续接着解析document

* 浏览器解析完doument完毕后。就是加载并显示到</html>后，按照延迟脚本在页面中出现的顺序，在其他同步脚本执行后，DOMcontentloaded事件前依次执行延迟脚本

#### async 异步脚本

`<script src="b.js" async></script>
<script src="c.js" async></script>`

* 浏览器遇到异步脚本，不会停止解析document，而是继续解析document并且同时下载两个js文件

* 下载完毕后立即执行，两个执行顺序无法确定，谁先谁后，在DOMcontentloaded事件前后都不确定

#### 理解图

![](https://camo.githubusercontent.com/3cfc9c7f3ff4185cd5c2d9d40c03e942b98c6dfd/68747470733a2f2f692e737461636b2e696d6775722e636f6d2f77664c38322e706e67)

#### 结论

* 最理想的情况是将脚本放在head中并设置成延迟脚本，这样能节省一些时间，不然当我们把脚本放在</body>前，需要在解析显示完内容后才请求js文件并解析执行，但问题是defer有一定的兼容性问题，一些老的浏览器不支持和这个属性，所以：如果项目可以保证忽略老的浏览器，优先使用延迟脚本优化，不能忽略的话，放在</body>前依然是最稳妥的方式


### 基本概念

* js单行注释和多行注释(块级注释)，多行注释的出了开头和结尾/的* 其他的* 不是必须的 有只是为了提高可读性

* js语句代码结尾应该有分号，但不是必须的。 如果没有分号则由js解析器自己推测在哪里应该插入分号，加上分号是很好的习惯，可以提高性能(解析器不用考虑在哪里加入分号)，防止代码压缩错误等

* 使用var操作符定义的变量将成为该变量所在作用域的局部变量，而在js中只有两类作用域，函数作用域和全局作用域

#### var 声明变量提升

* var变量声明总是在任意代码执行之前处理，在代码任何位置声明的变量都等同于在代码的开头声明，所有变量的声明都是会移动到函数开头或者全局开头. 提升只提升的是声明 而不是赋值


* 在全局作用域中，不使用var声明的变量其实是一个全局的属性，因为可以用delete 删除掉，但是var声明的全局变量不行

---
*2019年2月15日*

---

### 数据类型

* 五种简单数据类型 undefined null string number boolean 一种复杂类型object

* typeof 操作符的返回值有undefined object string boolean function number

* typeof 操作符对于未经声明的变量和声明未赋值的变量都是undefined 但是使用未声明的值会报错

* 显示的赋值声明的变量为undefined是一种明智的选择。想想上面的话

* 如果声明的变量在未来要保存一个对象的话 就优先赋值一个null


### Boolean 

* Boolean()转型函数 可以把js中**任何一个类型**的值转化为对应的boolean值

* if else 流程控制语句底层调用的就是强转函数Boolean()

| 数据类型 | 转为true的值 | 转为false的值 |
| ------- | ---------- | -------------|
| Boolean |  true | false |
| String | 任何非空字符串 | 空字符串 |
| Number | 任何非零数字值（包括无穷大）| 0和NAN|
| Object | 任何对象 | null | 
| Undefined | ---- | undefined |

### Number

* 八进制以0开头 在严格模式下是无效的 超出忽略前导0 按照十进制算

* 浮点树值需要的存储空间是整数的两倍。因此js中会不失时机地将浮点数转为整数值 例如小数点后面没有数字的，是0的都会转为整数

#### NaN not a number

* 任何设计NaN的计算结果都是NaN

* NaN 与任何值都不相等 包括自己

* isNaN函数尝试会尝试将参数转化为数值

*2019年2月25日*

#### Number() 转型函数

| 类型   |  值   | 结果 |
|-------| ----- | ---- |
| Number | 数字 | 数字|
| Boolean | true/ false | true => 1 false => 0 |
| Null | null | 0 |
| Undefined | undefined | NaN |
| String | string | 只包含数字(不限于拥有正负号) => 忽略前导0转为数字 空字符串 => 0 合法十六进制转为10进制 浮点数转为浮点数(忽略前导0) 其他的全为NaN|
| Object | object | 调用valueOf() 按照前面的规则转 当结果是NaN的时候再调用对象的toString()方法|

* js中一加操作符 转化原理同Number()一样

### parseInt() 

> ***只转化字符串和数字*** parseInt()会忽略参数的前面的空格直到遇到第一个非空格字符，如果第一个字符不是数字字符或者负号直接返回NaN 如果是则继续接着解析后面的字符直到遇到非数字字符


* 这个函数具有自动识别进制的能力。也就是说参数是'0xf'这样的话他就知道这是16进制并转为10进制值

* 函数接受第二个参数表示**传入的第一个参数是几进制的**

### parseFloat()

* 只能解析10进制的数 没有第二个参数

* 始终会忽略前导0 所以16进制的数始终解析为0 

* 参数是整数或者小数点后面全是0都会返回整数

### String

* js中的字符串是不可变的 一旦创建值就不能改变。要改变就得销毁原来的 重新创建一个字符串并填充该变量 这也是某些老版本浏览器拼接字符串慢的原因 但在新浏览器中已经优化

#### 转为字符串
1. 调用**几乎每个值(null和undefined)没有**都有的toString()方法
2. toSting()方法可以传入一个参数表示输出是数值字符串的时候的基础(进制) 默认值10
3. String() 如果要转化的值有toString()方法调用这个方法 没有null => "null" undefined => "undefined"
4. 使用一加操作符把要转化的值和一个空字符串相加

#### 一元操作符

* 前置递增递减是在包含语句求值之前计算的 后置递增递减是在包含语句求值之后计算的

* ***记住*** 一元 ++ -- 不仅使用于数字。其实适用于js中的任何数据类型 当不是数字类型的时候先通过调用转型函数Number()转成数字。再操作

* 一元 + 放在数字前面没有影响。放在非数字类型前相当于调用Number() 一元 - 同一元 + 一样放在非数字前面


#### 位运算符

* 有符号的整数，从右到左，前31位表示数值，最后一位表述符号，0代表正数，1代表负数，没有用到的位用0填充

* 负数以补码形式表示

* 默认所有的整数都是有符号整数，但也有无符号整数，无符号整数更大。因为多出一位表述数值

* 应用位操作时 NaN和Infinity被当作0 其余非0值会先被调用Number()转型函数

* ～按位非 返回反码

* &按位与 两个对应位都是1时返回1

* | 按位或 两个对应位都是0时返回0

* ^ 按位异或 对应位只有一个1时返回1

* << 向左移动指定的位数 移动后右侧空出来的位以0填补 不会影响符号位

* '>>' 有符号的右移 保留符号位，向右移动指定位数 移动后左侧空的位置以**符号位的值**填充

* '>>>' 无符号右移 移动32位 移动后以0填充空位 对于正数 无符号右移结果与有符号右移动结果一样，但是对于负数，因为负数是以二进制补码形式表述，并且移动时，会将负数的二进制码当成正数的二进制码，负数在无符号右移后变得非常大


### 布尔操作值

#### 逻辑非 ！

> 逻辑非的工作原理是： 调用Boolean()转型函数 再取反 也就是说同时使用两个逻辑非的作用就是相当于Boolean()


#### 逻辑与 &&

> 逻辑与只有在两个操作数都是true的时候才会返回true 逻辑与可以操作任何类型的值。不仅仅是Boolean值  ***在有一个操作值不是Boolean值的情况下返回的就不一定是Boolean值了***

* ***总结起来：逻辑与遇到非Boolean值先调用Boolean转型函数转成Boolean值，然后如果第一个值是true则永远返回第二个值，否则就返回第一个值***


#### 逻辑或 ||

> 只有两个值都是false才会返回false 

* ***总结起来：逻辑与遇到非Boolean值先调用Boolean转型函数转成Boolean值，然后如果第一个值是false则永远返回第二个值，否则就返回第一个值***

逻辑与和逻辑或都属于短路操作

#### 乘性操作符

* Infinity * 0 = Infinity

* Infinity / Infinity = NaN     0 / 0 = NaN

* ‘+’ 如果有一个值是字符串则结果是字符串  +0 + -0 = +0


#### 关系操作符

`> < >= <=`

* 如果都是数值则执行数值比较

* 如果都是字符串 比较两个字符串对应位置的每个字符的编码值(大写编码值全小于小写编码值) ***是按照第一个字母比较的***

* 如果有一个是数值。则将另一个转化为数值

* 如果是boolean值转为数值

* 如果是对象 调用valueOf. toString

* 任何操作数与NaN比较结果都是false `'a' < 3 => false  NaN < 3 NaN >= 3 都是false`


#### 相等操作符

##### == != 相等和不相等

* 先转化类型 再比较类型

* 如果有个值是Boolean值。则将其转为0 || 1

* 一个数值。一个字符串。将字符串转为数值

* 如果一个对象 一个不是对象 则调用对象的valueOf方法

* null 和 undefined 相等

* 如果有一个NaN 则返回false

* 如果两个值都是对象。则他们指向同一个对象。相等。 

##### === !== 全等和不全等

* 类型不同直接返回false


#### 条件操作符

* var variable = isTrue ? true-result : false-result

#### 逗号操作符

* 可以在一条语句中执行多个操作

* 逗号操作符可以用于**赋值** 此时总是返回操作符的最后一项 var name = (1,3,4,5,6)   name => 6


### 语句

#### if else

* if(condition) condition可以是任何值任何表达式 如果表达式的值不是Boolean值的话 js会自动调用Boolean()转型函数将其转为一个boolean值

* do while 语句至少执行一次循环体 

* for循环和while循环的能力一样，但是区别是for循环***具有执行循环前定义初始化变量和定义之行循环后要之行的代码的能力*** **记住定义初始化变量只有开始的一次  亲自试的**

* for in 循环遍历对象可枚举的属性

* switch 语句 case可以连续判断两种几种情况 比如这样： `switch(condition) case 1: case 2: case 3: expression` ***case的情况不一定是常量 可以是变量甚至表达式 ***

### 函数

* 函数的参数不在乎个数，类型

* 函数的参数实际上在内部是一个arguments这个类数组来定义的

* 函数没有重载的概念 因为其参数是由包含0个或多个值的数组来表示的而不是函数签名（接受的参数的类型，和数量）

## 第四章

### 变量

* 只能给引用类型的值动态的添加属性

* 复制基本类型值的时候 会在当前的变量对象上创建一个新位置，然后把放到这个新的位置上 此后这两个值的任何操作互不影响

* 当从一个变量向另一个变量赋值引用类型的值时，同样也会将存储在变量对象中的值复制一份放到为新变量分配的空间中，**不同的是这个值的副本实际上是一个指针，而这个指针指向存储在堆中的一个对象** 复制结束后，两个变量保存的指针指向同一个对象

* js中的参数传递是按值传递的，意思就是说：把函数外部的值传递给函数内部（函数的一个布局变量，arguments类数组的一个元素）就相当于把一个值复制到另一个变量中，基本类型的传递相当于基本类型的复制，引用类型就相当于引用类型的复制一样，在传递基本类型时就是在传递值，传递引用类型时传递的是指针(就是这个值在内存中保存的地址)

* 参数实际上是函数的布局变量


### 类型检测

* typeof 操作符是检测string，number，boolean，undefined的最佳工具

* typeof操作符检测对象和null时都返回‘object’

* typeof 函数返回值是‘function’ 实际上typeof操作符会对所有内部实现了[[Call]] 方法的对象都返回‘function’

* instanceof操作符 如果变量是给定引用类型的实例 那么就会返回true intanceof操作符的原理是根据原型链实现的


### 执行环境及作用域

* 执行环境定义了变量和函数有权访问的其他数据，决定了他们各自的行为

* 每一个执行环境都有一个与之关联的变量对象，环境中定义的变量和函数都保存在这个对象中

* 根据我的理解 ***执行环境其实就是一个对象 他就是用一个对象来表示的， 例如在web中最外围的全局执行环境就是用window对象表示的***

* 每一个执行环境其实就是就是一个对象，而且这个执行环境与之关联的变量对象也是一个对象

* 每一个执行环境中的代码执行完了之后，该环境就会被销毁，定义在环境中的变量和函数也会同时销毁

* 每一个函数都会有一个执行环境，当执行流进入一个函数中，这个函数的执行环境就会被推入一个环境栈中，函数执行完后执行环境就会被弹出

* ***当代码在一个函数中执行时，会创建变量对象的一个作用链，作用域链的作用就是保证对执行环境有权访问的变量和函数的有序访问 作用域链的前端是当前执行环境的变量对象，最外层是全局执行环境的变量对象***


* 每一个函数都会有一个执行环境，当执行流进入一个函数中，这个函数的执行环境就会被推入一个环境栈中，函数执行完后执行环境就会被弹出

* ***当代码在一个函数中执行时，会创建当前变量对象的一个作用域链，他的用途就是保证执行环境所有有权访问的变量和函数的有序访问***

* 访问一个变量的时候，最先在自己的变量对象中查找，如果没有找到，就开始沿着作用域链向上查找，一直查到全局执行环境的变量对象上(浏览器中就是window), 如果最终没有找到就是undefined

* 函数的参数也是一个变量，就是函数的当前的局部变量，

### 延长作用域链

* with 语句可以将指定的对象添加到作用域链的前端

* try catch 语句中catch块则是创建一个新的变量对象 其中包含的是错误对象的声明添加到作用域链中

### 声明变量

* 使用var关键字声明的变量会被自动添加到最近的执行环境中的变量对象中，如果没有使用var关键字，则一律添加到全局执行环境的变量对象中(全局执行环境在浏览器中就是window)

* **建议使用变量之前一定要先声明，这是良好的习惯同时在严格模式下这种行为会报错**

### 查询标示符

* 如果在某个环境中读取或者写入一个变量的时候，就会通过搜索的方式来确定这个标识符到底代表着什么， 过程从作用域链的前端开始，向上逐级查询，如果在某一级找到则停止搜索，如果知道全局执行环境的变量对象上还没有找到的话就会是undefined

* 变量查询的过程并不是没有代价，所以尽量应该把变量声明在最近的执行环境中，这样查询更快，不过这个过程已经被引擎优化了，其中的性能损耗可以忽略不计，

### 垃圾回收

* JavaScript中执行环境会负责管理代码执行过程中使用到的内存，包括内存的分配和收回

* 局部变量的生命周期： 局部变量只在函数执行的过程中存在，在这个过程中开始为变量分配内存空间，然后在函数中使用，函数执行结束时 就要收回内存空间了，在收回的过程中，会判断这个变量还有存在的必要吗， 如果没有则会打上标记，等待下一周垃圾回收周期到来的时候收回，

* 而对于打标记，根据浏览器的实现不同，打标记的方式也有不同，主流的有两种

1. 标记清除
2. 引用计数

#### 标记清除

* 垃圾收集器会在运行的时候给存储在内存中的所有变量都加上标记，然后它会去掉环境中的变量以及被环境中引用的变量，而在此之后在此被加上标记的变量将被认为是准备删除的变量， 

* 大多数浏览器都用的是标记清除方式的垃圾收集策略，只不过收集的时间间隔不一样

#### 引用计数

* 引用计数的含义就是跟踪记录每个值被引用的次数，如果引用的次数变成0则说明不能在访问，已经可以准备收回了

* 引用计数会导致一个循环引用的问题，这将会导致变量值占用的内存永远不能释放

```
function problem() {
   var objA = new Object()
   var objB = new Object()
   
   objA.someObj = objA
   objB.anotherObj = objB
}
```

#### 性能问题

* 垃圾收集器是周期运行的 

* 确定垃圾收集器运行的时间间隔是非常重要的，IE浏览器是根据内存分配量运行的，具体就是256个变量，4096个对象或者数组，或者64kb的字符串，达到上述任何一个阀值就是触发垃圾收集器运行，这样有性能问题，如果一个脚本一直含有超过阀值的内存使用情况，则会频繁的触发垃圾收集器运行，造成巨大的性能损耗

* 从IE7开始，javaScript引擎改变了工作方式，阀值变成了动态修改的，改善了性能损耗

* 部分浏览器可以触发垃圾收集，IE： window.CollectGarbage() Opera: window.opera.collect()

### 管理内存

* 分配给web浏览器的可用内存要比分配给桌面程序的少，这样防止web程序耗尽系统内存导致系统奔溃

* 确保更少的内存使用将会带来更好的性能体验

* 手动解除引用，尤其是全局变量

## 引用类型

* 构造函数就是一个普通的函数，只不过它是为了创造新对象而定义的，构造函数就是给将要创造的新对象定义了默认的属性和方法

* 创造Object实例的方法有两种 new 原生构造函数 对象字面量

* 对象的属性可以是字符串，如果是数字可以自动转化为字符串

* 必需参数可以是命名参数，可选参数可以选择对象字面量封装

* 点表示法和方括号语法都可以访问对象的属性，方括号的优势在于属性值可以是变量，或者某些会导致语法错误的属性 eg： “first name”

* 优先选择点表示法


### Array

* 创建方式： 使用Array构造函数， 对象字面量语法

* Javascript中的数组特点是： 可以保存任何数据类型，而且数组的长度是随着数据的添加自动增加的

* 使用构造函数创建数组的时候可以给函数传入数值代表数组的长度 像这样： 

```
var arr = new Array(20)
```
也可以直接传入数组中保存的值 像这样： 

```
var arr = new Array('asdfas', 'asdfasdf', 'afsdfa')
```

同时在创建的时候还可以省略new关键字 直接使用构造函数（Object() 也是如此）

```
var arr = Array()
```

***不建议使用这种构造函数的方式定义数组， 因为当你传入一个数值的时候会被认为是数组的长度，如果是多个就是数值或者别的类型就是数组元素***

* 数组的length属性非常灵活，它不仅是可读的，还可以写，通过设置length属性可以增加数组的长度，也可以删除数组元素 增加长度设置的数组访问的值都是undefined

#### 数组检测

* instanceof 

```
value instanceof Array
```
instanceof 虽然能检测出数组但是他有缺点： **instanceof 假设当前存在单一的全局环境 如果网页中还有多个框架，则每个框架下的数组的构造函数其实是不一样的，也就是说如果在框架1中检测框架2中的数组用instanceof  那么就会检测失败**

* Array.isArray() 这个方法就是为了解决上面的问题，判断到底是不是数组，

* 数组的toString()方法返回数组每一个元素的toString()方法，toLocaleString()则是返回每一个数组的元素的toLocaleString()方法，然后中间用逗号隔开，valueOf()方法则是返回原数组

* join()方法不传递参数或者传入undefined则是默认以逗号为分隔符

* 如果数组中有元素是undefined或者null，则在调用上面提到的几个方法后全部变为空字符串

* 数组的栈方法，push()可以接受任意数量的参数，并逐个将它们添加到数组的末尾，**同时返回数组的长度** pop()方法则是在数组的末尾删除一个元素，并返回删除的元素

* 队列方法，shift() 方法在数组的前端删除一个元素，并返回这个删除的元素，数组长度减少一，unshift() 则是在数组的前端添加若干个元素并返回数组的长度，

* sort()***比较的是数组元素的字符串格式*** 可以接受一个自定义函数

* concat() 方法合并数组，不会改变原来的数组，会创建并返回一个新数组，如果传入的是空，则简单复制原数组，如果是数组或者元素则是添加并返回新数组，不会改变原数组

* slice() 接受开始下标值和结束下标值(不包括) 创建并返回一个新数组，不会改变原数组，如果传入的负数则会用负数加上数组的长度来确定位置， 如果结束位置小于开始位置，则会返回空数组

* splice(index, length, element element) 可以删除元素，添加元素，替换元素  返回一个包含删除元素的新数组，

* 位置： indexOf lastIndexOf 这两个方法都会返回两个参数，第一个是查找的元素，第二个是起始查找的位置，如果没有查找到就会返回 -1 

* 迭代方法： every，some map filter forEach 每个方法都会接受两个参数，第一个是运行在每一个元素的函数，第二个是该函数的作用域对象，影响this的值， 函数接受三个参数，分别是元素本身，元素位置，数组本身，这些方法都不会改变数组本身

* 缩小范围： reduce 和 reduceRight arr.reduce((pre, next, index, curArr) => {})

### Date

* Date.parse()接受一个指定格式的字符串然后返回一个时间戳

* Date.now()获取当前时间时间戳

* new Date().valueOf() 方法返回时间戳

### RegExp 正则

`/pattern/` `flag` 正则表达式就是pattern和flag的组合体

* g 表示全局匹配并不是在发现匹配到第一个后就立即停止，i是忽略大小写，m是多行匹配

* 正则表达式中的原字符是： ( [ { \ ^ $ | ) ? * + . ] } 在使用这些元字符的时候需要转义

* 正则表达式字面量定义模式和RegExp()构造函数定义的模式有区别，ES3字面量的模式始终会共享一个实例，而构造函数每回都创建的是一个新的实例

***ES5开始明确规定，使用字面量定义的模式和构造函数定义的模式必须一摸一样，每次都会创建新的实例***

| 字符 | 含义 |
| --- | ---  |
| \   | 反斜杠表示转义，如果放在一个非特殊字符前则表示下一个字符是特殊的，如果放在一个特殊字符前则表示下一个字符不是特殊的了 例如： /a*/ 表示匹配0或多个a /a\*/ 表示匹配 a\*   |
| ^   | 匹配以什么开头  |
| $   | 匹配以什么结尾  | 
| *   | 匹配前一个一个表达式0次或者多次 等价于 {0, }| 
| +   | 匹配前一个表达式1次或者多次 等价于 {1, } |
| ?   | 匹配前一个表达式0次或者1次 |
| .   | 匹配任何除换行符之外的任何单个字符 |
| (x) | 匹配x并记住匹配项 这时候如果调用exec方法会返回捕获组|
| (?:x)| 匹配x但不记住捕获组，这种叫做非捕获括号|
| x(?=y) | 匹配x当且仅当后面跟着y |
| (?<=y)x| 匹配x当且仅当前面跟着y |
|x(?!y)| 匹配x当且仅当后面不跟着y |
| x\|y | 匹配x或者y |
| {n, m} | 匹配前面的字符出现至少n次 最多m次 如果n m 都等于0 则忽略这个值|
| [xyz] | 一个字符集合，匹配方括号中的任意字符 可以使用破折号指定字符范围 |
| [^xyz] | 匹配除括号中的字符 |
| \d | 匹配一个数字 等价于 [0-9] |
| \D | 匹配一个非数字字符 |
| \s | 匹配一个空白字符 |
| \S | 匹配一个非空白字符 | 
| \w | 匹配一个单字字符 |

* exec test

### Function

***函数是对象，是Function构造函数的实例，因此它具有跟其他引用类型一样的属性和方法，而函数名实际上是一个指向函数对象的指针***

* 理解可以通过函数表达式定义函数实际上就能提现出js中的函数是一个对象

* ***由于函数名仅仅是指向函数的指针，因为函数名与包含对象指针的其他变量没有什么不同，也就是说我们可以让函数跟对象一样拥有多个函数名***

函数声明的三种方式：

1. 函数声明语法方式

```
function func() {
  console.log(1)
}
```

2. 函数表达式方式

```
var func = function() {
   console.log(2)  
}
```

3. Function构造函数方式（这种方式可以传递若干个参数，但是最后一个参数永远被视为函数体）

```
var func = new Function(1,2,3,4,...., 'console.log(3)')
```

* 函数没有重载(重载是指函数名相同，函数参数个数，类型不同，函数体可以不同，同名实现功能类似的函数) ***理解：js中函数名是一个保存着函数对象的地址的指针变量，当命名多个同名函数时实际上就是指针变量的重新赋值，相当于函数体的覆盖替换，所有是没有函数重栽的***

```
function func(num) {
  return num += 1
} 

function func(num) {
  return num += 2
}

----------相当于这样

var func = function(num) {
  return num += 1
}

func = function(num) {
  return num += 2
} 
```

### 函数声明和函数表达式的区别

* 对于函数声明，在执行任何代码之前，解析器会通过一个叫做**函数声明提升**的过程率先将声明的函数放到代码树的顶部，保证可以访问，

* 而对于函数表达式，则必须等到解释器执行到代码所在行才能被真正的解释执行，

* 这也就是为什么可以在函数声明的前面可以访问执行函数，但是在函数表达式前面访问执行会报错的原因

### 作为值的函数

* ***理解了js中的函数时间就是一个对象，函数名就是保存着函数对象地址的一个指针变量，就能明白我们其实也可以将函数作为普通的变量一样使用，传递，返回等***


### 函数内部属性

* arguments类数组对象 这个对象保存着实际传入函数所有的参数，这个对象还是有个属性callee这个属性是一个指针变量，保存着拥有这个函数arguments对象的函数

```

1. 这是一种函数名称高度耦合函数体的阶乘函数
function factorial(num) {
   return num <= 1
              ? 1
              : num * factorial(num - 1)
}

2. 利用arguments.callee => factorial的特性

function factorial(num) {
    return num <= 1
               ? 1
               : num * arguments.callee(num - 1)
}
```


* ***this属性，另一个函数内部特殊对象就是大名鼎鼎的this对象***

1. 对于this的理解和this的指向性问题要记住，this其实是一个指针变量，这个指针变量保存的是当前函数**执行时(千万要记住，这里的执行时非常重要)**需要用到的执行环境对象或者根据我的理解就是**当前函数执行环境所对应的那个变量对象**

2. 在调用函数之前，this的值时不确定的，只有在函数真正执行的时候this的值才会确定下来

* caller属性保存着调用当前函数的函数，如果实在全局作用域中调用函数这个值就是null

* ES5还为arguments对象也定义了一个caller属性，***记住： 这个属性和函数的caller属性不是一个***

* 严格模式访问arguments.callee 和 arguments.caller都会报错，而且如果为函数的caller属性赋值也会报错

* length属性，函数的length属性的意思就是当前函数***希望接受到的参数的个数，记住： 是希望接受到的函数参数个数***


### 函数的属性和方法

* length属性，length属性的意思就是函数的命名参数的个数

* prototype属性 函数的原型对象


### apply 和 call 和 bind

* 这两个方法都是在特定的作用域中调用函数，他们都有可以扩充函数的作用域链的作用

* apply()方法接受两个参数，一个是在函数运行时的作用域，另一个是参数数组或者参数类数组

* call()方法和apply()方法的作用相同，区别在域call是第一个参数还是this，但是其余的参数都是直接传递给函数的，```func.call(this, arg1, arg2, ...)```

* bind(this, arg1,arg2,arg3...) 这个方法会创建一个函数的实例，改实例的this值会绑定在传给bind函数的值，

```
 function func(){
 console.log('name')
 }
 
var newFunc = func.bind(this)
newFunc === func
false
 
```
***注意:*** bind()第一个参数是this的值，而剩余的可以传递参数，在真正的调用时这些参数会加上调用绑定函数实际传入的参数按照顺序作为原函数的参数

### 基本包装类型

* 为了方便操作基本类型，es提供了三个特殊的引用类型，Boolean，Number，String

* 每当读取一个基本类型的时候，后台就会为我们创建一个对应的基本包装类型的对象

* ***记住：***引用类型和基本包装类型的主要区别就在于对象的生存期，引用类型的实例在执行流离开当前作用域之前一直保存在内存中，而自动创建的基本包装类型的对象则只存在于一行代码的执行瞬间，然后立即销毁

```
var s1 = 'some text'
s1.color = 'red'
alert(s1.color)    //undefined
```


我们平时设置基本的类型的过程其实在底层是这样的：

```
var s1 = 'some text'
var s2 = s1.substring(2)

----------

var s1 = new String('some text')
var s2 = s1.substring(2)
s1 = null
```

### Boolean类型

**Boolean基本包装类型的实例重写了valueOf()和toString()方法**

***记住：***使用Boolean转型函数和new Boolean生成一个实例是有区别的，
new Boolean() 生成实例是一个对象不是Boolean值

```
var falseObj = new Boolean(false)
var falseValue = false
var res = falseObj && true
res => true


typeof fasleObj => 'object'
typeof falseValue => 'boolean'
```

### Number类型

Number类型也是重写了valueof方法，而对于toString()可以额外传入一个参数表示返回几进制的字符串形式

### Number类型

Number类型也是重写了valueof方法，而对于toString()可以额外传入一个参数表示返回几进制的字符串形式

* toFixed() 方法会按照指定的小数位返回数值的字符串表示

```
var num = 10
num.toFixed(2)  => '10.00'
```
* toFixed() 会自动四舍五入，同时可以表示0-20个小数位数，当然根据浏览器的不同，实现也不同

![sf](lixiaohuloveyangtong.com/static/-.png)

### String类型

* charAt() || charCodeAt() 传入字符串中字符的位置，然后返回这个字符或者字符的字符编码值

* concat() 方法用于将一个或者多个字符串拼接起来，也就是说他可以接受一个或者多个参数， 

* slice() 返回子字符串，第一个参数是起始位置，第二个参数结束位置(不包括)

* substr() 返回子字符串，第一个参数是起始位置，第二个参数是截取长度(改方法废弃)

* substring() 返回子字符串，第一个参数是起始位置，第二个参数是结束位置(不包括)

* 当参数是负数的时候情况就是不一样了对于这三个方法，slice会将负数和长度相加，substr会将负的第一个参数加上长度，而将第二个参数视为0，substring则会将所有的参数都视为0 

* ***注意： 上面的几个字符串方法都不会改变原来的字符串***

* indexOf() || lastIndexOf(）这两个方法都是返回子字符串的位置，如果没有找到，则返回-1， 他们的区别在于一个是从字符串的开头开始搜索，一个是从末尾开始搜索，他们都接受第二个参数，表示从字符串的什么位置开始搜索，**这么看来，这两个方法可以反过来**

* trim() 创建字符串的一个副本 也就是说不会改变原来的字符串，同时去掉字符串的开头和末尾的空格

* toLowerCase() toUpperCase() toLocalLowerCase() toLocalUpperCae() 字符串的大小写转化，加上local是因为根据地区不同，少数语言会对为Unicode大小写转化应用特殊的规则

* match() 模式匹配，接受的参数是一个正则表达式，或者Regexp对象，本质上与调用正则表达式的exec()方法一样，返回分组

### 单体内置对象

由ECMAScript定义并实现提供的，不依赖于宿主对象的，在程序执行之前就已经存在了的对象，例如： Object, Array, String, Global, Math

* isNaN isFinite parseInt parseFloat 等都是在Global全局对象上的

* encodeURI decodeURI 只会对整个URI编码，它不会对本身属于URI自身的特殊字符编码，如冒号，问好等，

* encodeURIComponent decodeURIComponent 则会对所有的非标准字符编码

* eval() 接受一个js代码字符串，并执行，eval中执行的代码具有与当前行共同的作用域，

* Math对象

* Math.ceil() 向上舍入

* Math.floor() 向下舍入

* Math.round() 四舍五入

* Math.random() 返回一个0到1的随机数，不包括0和1



## 面向对象的程序设计


* 每一个对象都是基于一个引用类型创建的，这个引用类型可以是原生的引用类型，也可以是开发人员自己定义的类型

* 早期创建一个对象的首选方式就是使用 ```new Object()``` 之后流行的方式就是使用对象字面量，这种方式更加的直观 ```var person = { neme: 'lee'}```


### 属性类型

ECMA-262第五版在定义只有内部(供js引擎使用的)使用的特性时，也描述了对象属性的各种特征 对于这些特征，js是不能直接访问他们的，为了表示特征就是内部属性，改规范将内部属性放在了两对方括号中```[[Enumerable]]```


#### 数据属性

数据属性就是保存一个数据值的位置，在这个位置可以读取和写入值，有四个特性

1. [[Configurable]] 
	
	表示能否通过delete操作符删除属性从而重新定义属性
	
	能否修改属性的特性
	
	能否将属性转为访问器属性
	
	默认值就是true
	
2. [[Enumerable]] 表示能否通过for in 循环返回属性 默认值就是true

3. [[Writable]] 表示能否修改属性的值，默认值就是true

4. [[Value]] 包含着整个属性的属性值，读取和写入属性值的时候都是在这个位置操作的 默认值时undefined

```
var person = {
    name: 'lixiaohu'
}

person.name[[Value]] => lixiaohu
```

### Object.defineProperty()

***要修改属性的特性 就必须使用Object.defineproperty()这个方法***

* 这个方法的使用规则是： 接受三个参数，第一个参数是属性所在的对象，第二个参数是属性名称，第三个参数是一个描述符对象，这个对象的属性必须是configurable,enumable,writable,value这四个属性中一个或者多个


* 调用这个方法如果把configurable设置为false，那么如果再次调用该方法设置除了writable之外的特性值时都会报错，

* 注意如果调用了该方法时， 没有指定configurable, enumerable, writable,
则他们默认都是false

***注意：***

> 在把writable特性设置成false后表示这个属性是只读的，如果这时尝试为这个属性赋值，非严格模式下赋值操作忽略，严格模式下会报错

> 同样的如果把configurable特性设置成false后，这是如果再尝试改变这个属性的除了writable之外的任何特性值都会在严格模式下报错，非严格模式下忽略（测试后发现，**设置成false之后，value特性是可以改变的**）


#### 访问器属性

访问器属性不包含数据值，而是拥有一个[[Get]], [[Set]]， 这两个特性都应该对应的是两个函数，在为这个属性写入值的时候会调用Set函数处理，读取属性值的时候会调用Get函数返回值，这两个特性的默认值是undefined

***如果想为一个对象设置一个访问器属性，就必须通过调用Object.defineProperty()这个方法来设置，这里这么说的原因在于，我们平时普通为为一个对象设置的属性默认都是数据属性***

* 同样的访问器属性也有四个特性，

1. [[Configurable]] 同数据属性的configurable特性相似，表示能否通过delete操作符删除属性，能否将属性变为数据属性，能否修改属性的特性，默认值是true

2. [[Enumerable]] 表示能否通过for in 循环返回属性 默认值true

3. [[Set]] 写入属性值的时候调用的函数  默认值undefined

4. [[Get]] 读取属性值的时候调用的函数 默认值undefined

```
var book = {
    _year: 2005,
    edition: 1
}

//定义访问器属性
Object.defineProperty(book, 'year', {
    get: function() {
        return this._year
    },
    
    set: function(newValue) {
        if (newValue > 2004) {
            this._year = newValue
            this.edition += newValue - 2004
        }
    }

})
```
**不一定非要同时指定getter和setter 只指定getter意味着不能写，尝试写入非严格模式下忽略，严格模式下报错，同样，只指定setter意味着不能读，尝试读取非严格模式下返回undefined，严格模式下报错**

***这里发现了一个书中的错误，关于上面的这段描述，其实说的是一种情况全是只只指定getter的情况***



### Object.defineProperties() 为对象定义多个属性

这个方法接受两个对象参数，第一个参数表示要添加属性和修改属性的目标对象，第二个参数对象中的属性和第一个参数对象中要添加的属性一一对应

```
var book = {}

Object.defineProperties(book, {
    year: {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 2003
    },
    _year: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.year
        },
        set: function(value) {
            this.year += value
        }
    }
})
```
**上面这段代码为book对象一次性添加了两个属性，一个数据属性，一个防卫器属性**


### Object.getOwnPropertyDescriptor()

这个方法可以获取一个属性的所有特性，接受两个参数，第一个参数是目标对象，第二个参数要查看特性的属性，返回值是一个对象，如果是一个数据属性，则是返回的对象中有Configurable, enumerable, writable, value四个属性，如果是一个访问器属性则是返回一个对象中的属性都有，Configurable, enumerable, get, set四个特性


## 创建对象

---

> 虽然用Object构造函数或者对象字面量的方式可以创建单个对象，但是这种方式的一个明显区别是创建多个对象的时候会产生大量重复的代码，因此产生了一种叫做工厂模式的方式

### 工厂模式

工厂模式抽象了创建对对象的具体过程，有效减少了创建多个对象的时候产生大量重复的代码，但是它有个明显的缺点就是无法解决创建的对象的识别的问题***(即怎样知道一个对象的类型)***

```
function createPerson(name, age, job) {
    var o = new Object()
    
    o.name = name
    o.age = age
    o.job = job
    o.sayName = function() {
        alert(this.name)
    }
    
    return o
}
```

### 构造函数模式

ECMAscript中的函数可以用来创建特定的对象，像Object, Array这样的原生构造函数在运行时会自动出现在执行环境中，当然我们也可以创建自定义的函数来创建对象

```
function Person(name, age) {
    this.name = name
    this.age = age
    this.sayName = function() {
        alert(this.name)
    }

}

var p1 = new Person('lixiaohu', 23)
var p2 = new Person('xxx', 0)

```

> 注意： 构造函数创建对象不会再创建一个新对象，直接把属性赋值给函数的this对象，没有return语句

使用构造函数的方式创建对象必须使用```new```操作符

new操作符创建一个对象的实际过程分为四个步骤：

1. 创建一个新对象，
2. 将构造函数的作用域赋值给新对象，就是this指向了这个对象
3. 执行构造函数中代码，为这个新对象添加属性，
4. 返回新对象

* 创建自定义的构造函数意味着将来可以将它的实例标识成一种特定的类型，这就是构造函数模式胜过工程模式的地方

* 在全局作用域中调用函数，this对象总是指向全局的

> 构造函数的问题：就是每个方法都要在每个实例上重新创建一遍，比如前面我们创建的p1和p2两个对象都有sayName函数，但是他们并不是同一个Function的实例，ECMAscript中的函数就是对象，因此每实例化一个对象就是创建一个对象 ```p1.sayName === p2.sayName ==> false```

可以这样实现

```
function Person(name, age) {
    this.name = name
    this.age = age
    this.sayName = sayName

}

function sayName() {
    alert(this.name)
} 

var p1 = new Person('lee', 12)
var p2 = new Person('yang', 22)

p1.sayName === p2.sayName
```

### 原型模式

```
我们创建的每一个函数都会有一个prototype属性，这个属性是一个指针，指向一个对
象，而这个对象包含着可以由特定类型的所有实例共享的属性和方法，这个对象其实
就是这个函数的原型对象，默认情况下prototype原型对象都会获得一个构造函数
constructor属性，这个属性包含着一个指向prototype属性所在函数的指针
Person.prototype.constructor === Person

```
原型对象默认只会取得construtor属性，其余的属性都是从Object继承下来的

```
当调用了构造函数创建了一个新的实例后，这个实例内部会包含一个指针属性，指向构造
函数的原型对象，ECMA-262第五版管这个叫[[Prototype]]是一个内部属性，无法直
接访问，但是现在的浏览器有的实现并支持了这个属性[[__proto__]]
```

关于对象实例和原型对象之间的关系

```Object.isPrototypeOf```虽然我们无法直接访问到实例的原型对象, 但是通过这个方法可以判断两个对象之间是否存在着这样的关系

```Object.getPrototypeOf```ECMAscript5实现了这个方法，这个方法主要是用于获取一个对象的原型对象

> 对象属性的访问机制：读取每一个对象的属性的时候都会执行一次搜索，首先是从对象实例的本身开始，如果在对象实例本身找到了这个属性则返回，如果没有找到就继续接着在对象实例的原型对象中找，如果在原型对象中找到了这个属性就返回，如果没有找到那就是undefined


***注意：虽然我们可以访问保存在原型对象的属性，但是我们没有办法重写原型对象中的属性，当我们为对象实例添加一个属性时，这个属性会屏蔽原型对象中的保存的同名属性，进而会阻止我们访问到原型对象中的这个属性，我们再次访问这个属性时只会返回给我们对象实例中的这个属性，要想恢复访问原型对象中的这个属性的时候，除非使用```delete```操作符删除这个属性，才可以恢复访问，否则都不行,将这个属性设置位null也不行***

```
var obj = {}

Object.prototype.name = 'lee'

console.log(obj.name) => lee

obj.name = 'yang'  这里开始屏蔽了原型对象中的name属性

console.log(obj.name)    => yang

obj.name = null    这里试图恢复访问原型对象中的name属性，但是无效

delete obj.name    只有通过删除对象实例中的这个属性才会恢复对原型对象中的name属性的访问

console.log(obj.name)   => lee   恢复成功

```

#### hasOwnProperty() 是从Object继承过来的

这个方法用于来判断一个属性到底是属于对象实例中的呢还是属于原型对象中的呢，如果是来自对象实例则返回true，否则返回false，**通过这个方法属性什么时候访问的是原型属性什么时候访问的是实例属性一目了然**

#### in操作符 

会在通过对象能访问到给定属性时返回true，无论该属性是在实例中还是在原型对象中

> 同时结合hasOwnProperty 和 in 操作符就能判断出这个属性到底是属于原型对象还是实例对象中

**注意： ```Object.getOwnPropertyDescriptor(targetObj, propertyName)```** 默认只会返回实例属性的描述符对象，如果想访问原型对象上的属性的描述符对象必须在对象的原型对象上调用这个方法


#### for in 循环

返回的是所有能通过对象访问的，可枚举的属性，这些属性既包括实例中的也包括原型对象中的。**注意： Object原型对象上的hasOwnProperty，propertyIsEnumerable, toLocaleString, toString, valueOf都是不可枚举的，ECMA5开始也将constructor，prototype设置成不可枚举的了**因此这些属性都不会出现在for in循环的结果中

#### Object.keys() ECMA5开始

要取得对象上所有的***可枚举的实例属性***可以用Object.keys()这个方法，

### Object.getOwnPropetyNames() 

获得所有的实例属性，无论是否可以枚举

> Object.keys() 和 Object.getOwnPropertyNames()这两个方法都可以用来替代for in 循环

#### 重写原型对象

```
function Person() {}

Person.prototype = {
    name: 'lee'
}
```
这种以字面量的形式重写原型对象的形式非常的方便，但是他的缺点是这样会丢失construcor属性的指向正确性，像上面这样现在constructor属性其实是指向Object.prototype的，其实字面量对象中是没有这个construtor属性，但是别忘了，访问属性可以沿着原型链查找，他的原型对象有啊，**如果认为这个constructor属性的执行很重要，可以去手动改正设置**

```
function Person() {}

Person.prototype = {
    constructor: Person，
    name: 'lee'
}ß

```
**注意：constructor属性的[[Enumerable]]属性默认是false,上面刚说过，但是通过这样的方式重写的话，就会变为true，所以最安全的设置方法就是可以通过Object.defineProperty()去设置这个属性**

#### 原型的动态性

对原型对象中的任何修改都会立即反应在实例中，原因就是因为实例和原型之间的松散链接关系，实例与原型之间的连接是一个指针而不是一个副本，但是如果重写原型对象情况就会不同，因为这样会切断构造函数与最初的原型对象之间联系

```
function Person() {}

var person = new Person()

Person.prototype = {
    constructor: Person,
    sayName: function() {
        alert(222)
    }
}
person.sayName()     //error
```

#### 原生对象的原型

原生对象上一些方法都是定义在他的原型对象上的，不过我们再建议在原生对象的原型上添加自定义方法或者属性，

#### 原型模式的问题

所有实例默认情况下都会取得相同的属性值，而且它的所有属性都是被很多实例所共享的，这种共享对于函数来说非常适合，对于那些包含基本值的属性也说的过去，但是对于包含引用类型的属性来说这就是灾难了，

```
function Person() {}

Person.prototype = {
    constructor: Person,
    friends: ['lee', 'yang']
}

var p1 = new Person()
var p2 = new Person()

p1.friends.push('xiaodong')

p1.friends => [lee, yang, xiaodong]
p2.friends => [lee, yang, xiaodong]
```

***这样的冲突点在于实例一般是要有完全属于自己的属性的，原型模式是做不到这样的***

### 组合使用构造函数模式和原型模式

创建自定义类型的最常见模式就是组合使用构造函数模式和原型模式，构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的的属性

```
function Person(name, age) {
    this.name = name
    this.age = age
    this.friends = []
}

Person.prototype = {
    constructor: Person,
    sayName: function() {
        alert(this.name)
    }
}
```

### 动态原型模式

> 上面的那种组合使用构造函数和原型模式方法对于有其他oo语言的开发人员来说是非常奇怪的，而动态原型模式可以完美解决的他们的疑惑

```
function Person(name, age) {
    this.name = name
    this.age = age
    
    if (typeof this.sayName !== 'function') {
        Person.prototype.sayName = function() {
            alert(this.name)
        }
    }
} 

const p = new Person('lee', 23)
```

构造函数中的if语句块只会执行一次，之后不会再执行，因为原型对象中已经存在了sayName方法，而如果一旦在原型对象中添加了方法，会立即反应到各个实例中，包括之前创建的对象实例，**切记这里给原型对象添加方法的时候千万不要重写原型对象，之前提到过，一旦重写原型对象，之前创建的实例，他们都会丢失与原型对象的链接**

### 寄生构造函数模式

构造函数封装着创建对象的代码

```
function Person(name, age) {
    const o = new Object()
    o.name = name
    o.age = age
    
    o.sayName = function() {
        alert(this.name)
    }
    
    return o
}

const p = new Person('lee', 232)
```
如果不使用new关键字实例化对象，其实寄生构造函数模式和工厂模式没有什么区别
之所以还能这么用的原因在于**构造在不返回任何值的时候默认返回新创建的对象实例，而我们可以通过添加return语句来重写返回的值，这才是关键所在**


### 稳妥构造函数模式

> 新创建的对象实例的不引用this对象，不使用new操作符调用构造函数

```
function Person(name, age) {
    const o = new Object()
    o.sayName = function() {
        alert(name)
    }
    
    return o
}
```

### 继承

继承的实现主要是依赖于原型链的机制，假如我们让原型对象等于另一个类型的实例就可以实现继承，***实现继承的本质就是重写原型对象*** 

```
function Father(name) {
    this.name = name
}
Father.prototype.sayName = function() {
    alert(this.name)
}

function Son(name, age) {
    this.age = age
    this.name = name
}

Son.prototype = new Father('a')

const s = new Son('b', 343)
```

#### 理解继承

> 首先我们重写了Son类型的原型对象，Son类型的原型对象现在就是Father类型的一个实例化对象，那么我们如果实现继承的呢，别忘了访问对象的属性或者方法的机制过程，如果访问一个对象的属性或者访问首先在这个对象的本身去查找，如果没有找到就会沿着原型链去原型对象中查找，访问sayName访问首先在Son类型的实例中是没有的，所以到Son类型的原型对象中查找，Son类型的原型是Father类型的一个实例，这个实例中也是没有sayName方法的，所以接着根据这个实例的内部指针[[\__proto__]] 找到Father的原型对象，而Father的原型对象中是有这个sayName方法的 至此找到了这个方法，成功实现了继承


#### 别忘记了默认的原型

**我们前面所展示的原型链还少一环，要知道所有引用类型默认都继承了Object，而这个继承也是通过原型链实现的，要记住：所有函数的默认原型对象都是Object的实例，因此默认原型对象中包含一个内部指针属性就是那个[[__proto__]]它指向的就是Object.prototype这个对象，这也正是自定义类型的都会继承toString等方法的根本原因**


> Object.prototype.[[\__proto__]] === null Object.prototype是原型链的顶端，Function，Object等其他构造函数都是继承Fucntion.prototype而产生

#### 确定原型和实例之间的关系

	instanceof & isPrototypeOf()
	
#### 原型链的问题

1. 对于具有引用类型属性的父类型，如果继承过来的话就会出现问题，继承后再实例化，所有的实例对象又会共享一个引用类型，显然这是糟糕的

```
function Super(){
    this.hobbys = [1,2,4,5]
}

function Suber(){
}

Suber.prototype = new Super()

const s1 = new Suber()
const s2 = new Suber()

s1.hobbys.push(3)

s1.hobbys === s2.hobbys => [1,2,3,4,5]

这就是问题所在，虽然hobbys在构造函数中，但是继承之后又成为了原型对象中属性，而原型对象中的属性都是共享的
```

2. 无法在实例化子类型的时候，给父类型的构造函数传递参数

```
function Super(name, age){
    this.name = name
    this.age = age
}

function Suber(){}

Suber.prototype = new Super()

const s = new Suber()

s.name => undefined
```

#### 借用构造函数继承(伪造对象或者经典继承)

> 说白了 经典继承就是在子类型的构造函数中调用了一下超类型的构造函数

```
function Super(){
    this.colors = [1,2,3,4,5,6]
}
function Suber() {
    Super.call(this)
}

const s = new Suber()
const s1 = new Suber()


s1.colors.push(7)
s1.colors => [1,2,3,4,5,6,7]
s.colors => [1,2,3,4,5,6]
```

**当然这种方式也可以直接在调用超类型的构造函数的时候为其添加参数， 这里使用call apply bind都是可以的**

##### 发现经典继承的问题了吗

实际上，经典继承就是将超类型中的属性方法复制了一份到子类型的构造函数中，他的问题相当的突出，那就是所有的属性和方法都会成为实例属性，并不存在原型对象中共享的方法，同时这种方式会造成在超类型中的原型中的属性方法对子类型实例是不可见的

> 我认为这就不算是继承

### 组合继承

```
function SuperType(name) {
    this.name = name
    this.colors = [1,3,43,54]
}
SuperType.prototype.sayName = function() {
    alert(this.name)
}

function SubType(name, age) {
    SuperType.call(this, name)
    this.age = age
}

SubType.prototype = new SuperType()

SubType.prototype.sayAge = function() {
    alert(this.age)
}

const s1 = new SubType('lee', 22)
s1.colors.push(1111)
s1.colors. => [1,3,43, 54, 1111]
s1.sayName() => lee
s1.sayAge() => 22

const s2 = new SubType('yang', 11)
s2.colors => [1,3,43,54]
s2.sayName() => yang
s2.sayAge() => 11 

```
> 组合继承其实就是结合了原型继承和借用构造函数继承的有点，既能保证私有属性又能同时共享原型方法和属性

### 原型继承

> 原型继承是由道格拉斯提出的一种借助原型基于已有的对象创建新对象的继承方式

```
function object(o) {
    function Func() {}
    Func.prototype = o
    return new Func()   
}
```
**上面的代码就是原型继承的代码, 原型继承的使用是需要基于一个对象作为另一个对象的基础，然后如果再有自己的需求就可以在新的对象中作出修改和添加, 但是要注意基础对象因为要作为原型对象成为新对象的原型，所以基础对象中的引用类型将会不仅仅属于基础对象，同时还会被新对象所共享，其实这里要注意原型继承其实根本没有用到构造函数的概念**

```
const person = {
    name: 'lee',
    colors: [1,2,3]
}

function object(o){
    function Func(){}
    Func.prototype = o
    return new Func()
}

const o1 = object(person)
o1.name = 'lixiaohu'
o1.colors.push(4)

const o2 = object(person)
o2.name = 'yangtong'
o2.colors.push(5)

person.colors => [1,2,3,4,5]
```

> ECMAscript5通过新增Object.create()规范了原型继承，这个方法的实现大概就是上面的代码的object函数，它接受两个参数，一个是base对象，就是那个要被当作原型对象的对象，一个是想要新增加的对象的属性，它的格式和Object.defineProperties()的参数一样

```
const person = {
    name: 'lee'
}

const newPerson = Object.create(person, {
    age: {
        configurable: true,
        writable: true,
        enumerable: true
        value: 212
    }
})
```

### 寄生式继承

> 寄生式继承与寄生构造函数和工厂模式相似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真的似的返回对象

```
function createAnother(original) {
    const clone = object(original)   //通过调用函数创建一个新对象
    clone.sayHi = function() {
        alert('hi')
    }
    return clone 
}
```
**这里的object方法我觉得跟Object.create()的实现差不多吧 在这里其实任何能够返回一个对象的方法都可以是object方法**

使用寄生式继承来为新对象添加的函数，由于它是直接添加到对象实例的，所以这样的函数不能像添加到原型对象中那样做到函数复用从而降低效率

### 寄生组合式继承

```
function SuperType(name) {
    this.name = name
    this.colors = [1,2,3]
}

SuperType.prototype.sayName = function() {
    alert(this.name)
}

function SubType(name, age) {
    Supertype.call(this, name)
    this.age = age
}

SubType.prototype = new SuperType()
SubType.prototype.constructor = SubType
SubType.prototype.sayAge = function() {
    alert(this.age)
}
```


# 函数表达式

Firefox Safari Chrome 等浏览器为函数定义了一个非标准的name属性，通过这属性就可以访问到函数的名字 **这个属性的值永远跟跟在function关键字后的标示符一样**

> 最重要的就是函数声明提升 意思是在执行代码之前就会先读取函数声明，这就意味着可以把函数声明放在调用他的语句之后

```
function sayHi() {
    alert('hi')
}

sayHi.name => sayHi
```

#### 函数表达式

```
var func = function() {}
```
函数表达式看起来像常规的变量赋值语句，这样创建的函数就是匿名函数，匿名函数也叫拉姆达函数，匿名函数的name属性是空字符

> 函数声明提升的关键就是理解函数声明和函数表达式之间的区别

```
！不要这样做

if(condition) {
    function sayHi() { alert('HI')}
}else {
    function sayHi() { alert('Yo!')}
}
```
**注意了： 这道题表面看condition为true时，使用第一个定义，否则使用第二个定义，但是：实际上这在ECMAscript中属于无效语法 JavaScript回尝试修正语法，将其转换为一个合理的状态，但问题是浏览器尝试修正错误的语法并不一致，大多数浏览器会返回第一个声明，忽略condition，firefox则会在condition为true时返回第一个声明，所以这样的方式很危险，不要出现在你的代码中**

> 当然 上面的问题可以利用函数表达式轻松化解

函数可以被当作变量的值或者可以当作是其他函数返回的结果值

**把函数当作值的情况下都可以使用匿名函数来代替**

### 递归

```
function factorial(num) {
    if (num <= 1) {
        return 1
    } else {
        return num * factorial(num - 1)
    }
}
```

这样的递归阶乘函数是有问题的，比如如果这样的话

```
var anotherFactorial = factorial
factorial = null
alert(anotherFactorial(2)) 出错
```

对于递归的变通实现是利用argument.callee代替函数引用，但是缺点是这个函数指针会在严格模式下，访问这个属性会导致报错，完美的实现方案是： **利用函数表达式**

```
var factorial = (function f(num) {
    if (num <= 1) {
        return 1
    }else {
        return num * f(num - 1)
    }
})
```
### 闭包

闭包是指有权访问另一个函数作用域中的变量的函数，闭包说起来简单实际上我感觉闭包包含到的知识点有很多，比如执行环境，执行环境所对应的变量对象，由变量对象所组成的作用域链，还有垃圾回收机制，闭包都不可跟这些知识分开而论。

> 当某个函数第一次被调用时，会创建一个执行环境和相应的作用域链，并将这个作用域链赋值给一个内部属性叫做[[Scope]] 然后要明白this，arguments和其他命名参数的值都是会用来初始化函数的变量的对象

写一个正经的闭包

```
function func(firstName) {
    return function() {
        const lastName = 'li'
        console.log(lastName + firstName)
    }
}

const sayName = func('xiaohu')
sayName() => lixiaohu    sayName就是一个闭包
```

每一个执行环境都一个表示变量的对象叫做变量对象，全局执行环境的变量对象其实就是window/global始终存在

**一般来讲，当函数执行完毕后，局部活动对象就回被销毁，内存中仅保存着全局执行环境的变量对象， 但是闭包的情况有所不同**

就像上面的举例一样，当func函数内部的匿名函数被返回后，他的作用域链就会被初始化为包含func函数的变量对象和全局执行环境的变量对象，这样的话匿名函数就可以访问到func中的定义的所有变量，**更重要的是注意了：在func函数执行完毕后它对应的变量对象不会被销毁(正常的逻辑是： 局部函数的所对应的变量对象在函数执行完毕后其所保存在内存中的变量对象就会被销毁，但是匿名函数不会)**

> 上面的例子中的func函数的变量对象不会在执行完毕后销毁的原因就是： 内部返回的这个匿名函数的作用域链上仍然包含着func函数的变量对象，换句话说：func函数在执行完毕后他自己的执行环境的作用域链会被销毁，但是他的执行环境对应的变量对象不会被销毁还是会保存在内存中，**因为返回的匿名函数的有可能会访问这其中的变量， 知道匿名函数被销毁后，func函数的变量对象才会被销毁**


***由于闭包会携带包含他的函数的作用域，因此会比其他函数占有更多的内存，所以过度使用闭包可能会导致内存占用过多，我们建议只有在绝对必要时再考虑使用闭包***

### this

**this对象是在运行时基于函数的执行环境绑定的**

匿名函数的执行环境具有全局性，也就是说匿名函数的执行环境就是全局执行环境，也就说它所对应的变量对象就是window对象

> 每个函数在被调用时，其活动对象就会自动取得两个特殊变量，this和arguments对象，内部函数在搜索这两个变量时只会搜索到其自己的活动对象为止，永远不可能访问外部函数的这两个变量

变通的方法是这样：

```
var name = 'the window'
var obj = {
    name: 'my object'
    getNameFunc: function() {
        var that = this
        return function() {
            return that.name
        }
    }
}
```

javaScript中对变量的重复声明会忽视掉 **会忽视掉，不过要注意忽视的是声明，但是如果是后面的赋值的话就不会忽视**


#### 块级作用域

javaScript中是没有块级作用域的，但是可以用匿名立即执行函数或者闭包可以来模拟一个块级作用域

```
function func() {
    for(var i = 0; i <= 10; i++){
        console.log(i)
    }
    
    console.log(i)  // 11
}

这里没有形成块级别作用域 console在for循环之后还能够访问到i说明没
有块级别作用域
```

```
真正的块级别作用域

function func() {
    (function() {
        for( var i = 0; i <= 10; i++) {
            console.log(i)
        }
    })()
    
    console.log(i) // Error i is not defined
}

匿名立即执行函数(也是一个闭包)在执行完毕后，会销毁他自己的执行环境和变量对
象，和作用域链。 所以变量i相当于在执行完毕之后就被销毁了，销毁了之后也就在后
面访问时就会报错，因为没有定义。这样就能达到一个模拟块级作用域的概念
```


上面这样的技术可以在全局作用域中大量使用，这样的好处就是可以防止向全局作用域中无故的添加没有用处的方法和变量，防止全局环境污染，这才大型开发现场和多人开发中是一种有效的方式


#### 私有变量

严格的讲，在js中没有私有成员的概念，但是有一个私有变量的概念，任何在函数中定义的变量都可以认为是私有变量，因为不能在函数外部访问这些变量。

**私有变量包含函数的参数，局部变量和函数内部定义的其他函数**

> 通过在函数内部创建闭包的方式，利用闭包的作用域链可以访问到这些变量，而利用这一点可以访问私有变量的公有方法。


```
function MyObject() {
    var privateVariable = 10
    
    function privateFunction() {
        return false
    }
    
    this.publicMethod = function() {
        privateVariable++
        return privateFunction()
    }
}

const o = new MyObject()

console.log(o.publicMethod())

```
这样可以创建私有变量，同时也可以暴露出一个公有方法去做为唯一的渠道访问私有变量，但是要明白这种使用构造函数的方式是有一定缺陷的，就是第六章讲到的一样，这样的话每一个实例中都是重复定义共有方法的，没有办法做到公用

##### 可以使用私有作用域或者说上面刚说的js中的块级作用域来定义私有变量或者函数

```
(function () {
  
  // 还记得吗 这里就是块级别作用域，在立即执行函数执行完毕之后
  // 这里的变量和函数都会被销毁。但是也有意外
  
 
})()


(function() {

    var privateVariable = 10
    function privateFunction() {
        return false
    }
    
    MyObject = function() {}   //这里有关键点需要注意
   
    MyObject.prototype.publicMethod = function() {
        privateVariable++
        pribateFunction()
    }
})()


这个方式要仔细思考，挺牛逼的，他通过在私有块级别作用域中创建私有变量和函数，然
后注意它通过函数表达式的方式创建了构造函数，而且构造函数在通过函数表达式定义时
没有使用var关键字，这样的方式会讲MyObject定义在全局，初始化未经声明的变量
都会在定义在全局中 同时利用原型模式在原型对象上定义了公有方法，防止在实例化
时重复定义公有方法， 但是还要注意这里有一个问题，就是在没有使用变量声明关键字
去定义一个全局变量的时候，在严格模式下这样的方式会报错
```

### 单例模式

所谓单例模式是指只有一个实例的对象

```
var singleton = function() {
    var privateVariable = 10
    function privateFunction() {
        return false
    }
    
    return {
        publicProperty: true,
        publicFunction() {
            privateVariable++
            return privateFunction()
        }
    }
}
```

> 按照惯例，通常在js中是按照对象字面量的方式创建单例对象的


# BOM

浏览器对象模型

BOM的核心是window对象，表示浏览器的一个实例，同时它还扮演着JavaScript中的global对象的角色，因此所有在全局作用域中声明的变量和函数都会变成window对象的属性和方法

> 但是要记住定义在全局作用域中的属性和方法和直接在window对象上定义的属性和方法**还是有一定区别的**，区别就是：全局变量不能delete操作符删除而window对象上定义的属性和方法是可以删除的

**全局变量和方法不能删除的本质区别其实第六章讲到的对象属性的特性在搞的鬼，还记得吗，属性有个特性叫做[[Configurable]] 全局属性的的这个特性被默认设置成了false所以delete操作符没有用**

可以通过Object.getOwnPropertyDescriptor(target, propertyName)获取对象属性的特性描述符

```

var age = 13

window.color = 222

delete window.age //error

delete window.color   // true


```

### 框架集

在含有框架集中的页面中，每个框架集都有自己的window对象，也就是说拥有多个global对象，每个框架都有一套自己的完整的构造函数，**同时各个框架集之间的构造函数都不相等，比如说frames[0].Object 不等于 frames[1].Object 这样的话会影响到跨框架之间的传递的对象使用instanceof操作符的判断能力，这在之前的提到过，instanceof这个操作符有一定的问题的，就在这里**

### 窗口位置

**由于浏览器厂商实现的获取浏览器窗口位置的api的不同，所以在跨浏览器取得窗口位置精确的值是一个比较的困难的事情**

> 由于各大浏览器厂商实现的api不同(包括api名称，API的表现都不同) 比如说获取浏览器窗口相对于屏幕上面的位置，在IE，safari，Opera，Chrome中都提供了screenTop，但在Firefox中提供了 screenY等  并且他们对相对于屏幕上面的位置的理解也不同IE,Chrome,Opera都认为是屏幕上面到页面可见区域的位置，而Firefox safari则认为是整个窗口到屏幕的位置

```
function windowPosition() {
    const leftPos = typeof window.screenLeft === 'number'
                        ?  window.screenLeft
                        :  window.screenX

    const topPos = typeof window.screenTop === 'number'
                        ? window.screenTop
                        : window.screenY
                    
    return {
        leftPos,
        topPos
    }
} 

console.log(windowPosition())
```

获取浏览器窗口位置可能是一件不能精确的事情，但是我们可以通过moveTo & moveBy两个方法将窗口移动到精确的位置

* moveTo(newPosX, newPosY)

* moveBy(x轴移动距离，y轴移动距离)

**需要注意的是这俩个方法都可能被浏览器所禁用，同时他们都不适用于框架**

> 试了一下 这俩方法再chrom中没有什么卵用 都不生效， 查了下说会在ie中生效


### 窗口大小

**窗口大小和视口大小不是一回事**

同样的问题在获取浏览器窗口大小的问题上，一样是不容易的，由于各大浏览器厂商对api实现的表现的理解不同，实际获得效果也是有所不同的

获取浏览器窗口大小的api是： outerWidth outerHeight innerHeight innerWidth 

在IE9+，safari，firefox中outerWidth & outHeight 返回的是浏览器窗口本身的大小，**就是包括浏览器窗口的边框** 在Opera这俩个属性表示视图容器的大小，而innerWidth & innerHeight返回页面视图区域的大小(视口大小)，chrome中这个四个属性对应返回相同的值都是视口的大小

### 视口大小

在标准模式和混杂模式下获取视口大小的api有所不同

```
let pageWidth = window.innerWidth
let pageHeight = window.innerHeight

if (typeof pageWidth !== 'number') {
    if (document.compatMode === 'CSS1Compat') {
        pageWidth = document.documentElement.clientWidth
        pageHeight = document.documentElement.clientHeight
    }else {
        pageWidth = document.body.clientWidth
        pageHeight = document.body.clientHeight
    }
}

### 调整浏览器窗口的大小

* resizeTo(新宽度，新高度)

* resizeBy(宽度之差， 高度之差) 

> 可惜的是，这俩个api依旧在chrome中不能生效，被禁止掉了

**有说就算没有禁止掉，也只有在通过```window.open```打开的页面，同时只有一个tab标签页面的时候才能生效**

### 注意了：曾过实际的验证，上面所说的改变浏览器窗口大小和移动浏览器位置的api确实在浏览器中默认有些是禁用的，但是但是如果通过```window.open()```这个方法打开同时在设置了这个方法的第三个字符串参数的中的resizable特性为true，同时在window.open()方法调用之后返回的新的浏览器窗口的引用，在这个应用下就可以调用位置和大小方法了，亲测有效

```
const newWindow = window.open('http://www.baidu.com', 
'_blank', 'width=400,height=400,left=100,top=100,resizable=yes')

newWindow.moveBy(100, 100)  //有效
newWindow.moveTo(100, 100)  //有效

newWindow.resizeBy(100, 100) //有效
newWindow.resizeTo(100, 100) //有效

```
**震撼吗**

### window.open

这个方法接受四个参数，要加载Url，窗口目标，一个特性字符串，一个表示新页面是否取代浏览器历史记录中当前加载页面的的布尔值

第二个参数可以是已有窗口或者框架的名称或者是_self,_parent,_top,_blank特殊窗口名称

第三个参数是一些特性字符串，用逗号隔开，表示新窗口中都表示哪些特性，例如：fullscreen, height, left, location, resizable,toolbar, top, width, menubar,

> 这个方法返回一个新窗口的引用，可以在这个引用的基础上调用上面哪些被浏览器所禁用的方法，

**鉴于浏览器的安全限制，window.open方法弹出的窗口可能会被屏蔽**

```
let blocked = false

try {
    let newWindow = window.open('http://www.baidu.com', '_blank')
    if (newWindow == null) {
        blocked = true
    }
}catch(error) {
    blocked = true
}

if (blocked) {
    alert('the popup was blocked')
}
```
上面这段程序可以检测弹出窗口是否被屏蔽了

### 超时调用和间歇调用 setTimeout & setInterval

**超时调用都是在全局环境中调用的，因次函数中的this都是指向window的**

超时调用和间歇调用的第一个参数都是在一个包含js代码的字符串或者一个函数，第二个参数表示多了多长时间将任务添加到任务队列中，如果任务队列为空就会立即执行，如果没有为空就会等待前面的代码执行完了之后执行

这俩个方法都会返回一个定时器的引用，唯一的Id值，可以调用clearTimeout去清除掉超时调用只要指定的时间之前调用就可以达到效果


setInterval方法可以间隔指定的时间去调用方法，**不推荐使用间歇调用，原因在于后一个间歇调用可能会在前一个间歇调用结束之前启动，并切间歇调用需要跟踪id，所以推荐使用超时调用去模拟间歇调用是一种比较好的实践方式**

### 用户对话框 alert confirm prompt 

弹出系统对话框是同步的，会阻塞代码执行


### location对象 最有用的BoM对象之一

|属性名称|例子|说明|
|---|---|---|
| hash | "#contents" | 返回url中#号后面的零或者多个字符，如果url不包含散列则会返回空字符串|
| host | www.baidu.com:80 | 返回服务器名称和端口号 如果有 |
| hostname | www.baidu.com | 返回不带端口号的服务器名称 |
| href | http://www.baidu.com | 返回加载页面的完整url location对象的tostring() 方法也返回这个值|
| pathname | /myhome/ |  返回目录或者文件名称 | 
| port | 8080 | 返回url中指定的端口号 | 
| protocol | https | 返回页面使用的协议 |
| search | ‘?question=answer’ | 返回url中的查询字符串 | 

```
//获取并处理查询参数

function getQueryStingArgs() {
    const qs = window.location.search.length > 0 
                  ? window.location.search.substring(1)
                  : ''
    const paramArr = qs.length > 0 ? qs.split('&') : []
    const paramObj = Object.create(null)
    
    for(let i = 0; i <= paramArr.length - 1; i++) {
        const currentParam = paramArr[i].split('=')
        const key = currentParam[0]
        const value = currentParam[1]
        
        paramObj[key] = value
    }
    
    return paramObj
}
```

### 位置操作

通过location对象就可以改变浏览器的位置，最常用的方法就是```location.assgin()``` 他的作用和window.location=   location.href= 的作用是一样的

> 通过修改location的属性: search hostname pathname port除了hash外页面都会重新加载 通过这几种方式都会在浏览器历史记录中新生成一条记录，因此通过单击后退按钮就会导航到前一个页面

**要想禁止掉上面这样的新生成页面的问题可以使用replace方法，这个方法接受一个参数，就是导航到的URL，他可以使浏览器位置变化，但是不会在历史记录总生成新的记录**

```window.location.reload``` 这个方法如果掉用的时候没有传递参数，会以最有效的方式也就是会在浏览器缓存中加载的方式去重新加载页面，但是如果传递了true就会从服务器中重新加载页面

### navigator 对象

navigator对象包含了客户端的信息，其中有userAgent浏览器的用户代理字符串等

### 检测插件

通过navigator对象的plugins属性，这是一个数组，里面包含所有插件的信息

```
functiton hasPlugin(name) {
    name = name.toLowerCase()
    
    for(var i = 0; i <= navigator.plugins.length - 1; i++) {
        const plugin = navigator.plugins[i].name
        if (name === plugin) {
            return true
        }
    }
    
    return false
}
```

> 检测IE中的插件有所不同，IE中就得使用专门的ActiveObject类型

```
function hasPlugin(name) {
    try {
        new ActiveObject(name)
        return true
    }catch(error) {
        return false
    }
}
```

**注意：这里使用try catch语句的原因在于实例化未知的对象会报错，所以就是说如果在实例化时发现实例化成功了那么这个插件相当于是存在的，如果没有实例化成功说明这个插件是不存在的就这么简单**


### 注册处理程序

### screen对象

**JavaScript中有几个对象在编程中用处不大，screen对象就是其中之一，screen对象基本上只是用来表示客户端的能力， 包括浏览器窗口的外部的信息，像素宽度和高度，每个浏览器的screen对象都包含着不同的属性**

### history对象

history对象中包含中的浏览器浏览器历史记录，

history.go() 可以随意在历史记录中穿梭，可以接受一个正负数字值也可以接受一个字符串，会跳转到最近的相关字符串页面

history.back() 后退一页面

histor.forward() 前进一页面

# 客户端检测

---

### 能力检测

能力检测又称为特性检测，能力检测的目的不是识别特定的浏览器，而是识别特别的能力

能力检测要注意：

1. 优先简则达成目的的最常用的特性，这样可以保证代码最优化，

2. 必须检测实际要用到的特性，一个特性存在不一定代表另一个特性也存在

```

function getElement(id) {
    if (document.getElementById) {
        return document.getElementById(id)
    }else {
        return document.all(id)
    }
} 
```

### 怪癖检测

bug检测


# DOM 文档对象模型

JavaScript中的所有节点类型都是继承自Node类型的，因此所有节点都共享着相同的基本属性和方法，每个节点都有个nodeType属性，用来表明节点的类型

> 节点类型共有12个常量来表示，任何节点类型必居其一

由于IE浏览器没用公开Node类型的构造函数，所以直接比较```someNode.nodeType === Node.ELEMENT_NODE```会导致错误，保险的方式就是直接用nodeType和数字比较，每一个节点类型都对应一个数字，元素节点的类型就是1比如

nodeName & nodeValue nodeName保存的是节点的名称，nodeValue始终为null


### 节点关系

节点之间的关系可以理解家谱之间的关系，比如说可以把body元素看成是html的子元素，head元素可以看成是body元素的同胞元素等。

> 每个节点都有一个childNodes属性，其中保存着一个NodeList类数组对象，可以像访问数组一样访问这个类数组对象，这个对象也有length属性，**注意了，这个NodeList对象有个很大的不同是它是基于DOM结构动态查询的结果，也就是说dom解构的变化会实时的反应到这个NodeList对象上，它是一个有生命的对象，并不是我们第一次访问它们时的一个快照**

#### parentNode

该属性指向文档中的父节点，在包含childNodes中的所有的节点中，每一个节点都指向同一个父节点

#### previousSibling & nextSibling

previousSibling属性和nextSibling属性分别指向节点的前一个同胞节点和后一个同胞节点，如果没有前一个或者后一个则为null

#### firstChild & lastChild

父节点的最后一个子节点和第一个子节点可以通过上面的两个属性可以访问，当然如果只有一个子节点的时候，两个属性相等，如果没有子节点那么这俩个属性都是null

#### hasChildNodes() 

这个方法可以用来判断在节点包含一个或者多个子节点的情况下返回true，应该说它是比查询ChildNodes的length属性更加有用的属性

#### ownerDocument

这个属性指向整个文档的文档节点也就是html元素，每一个元素都只能在一个文档中，所以通过这个属性可以直接访问到文档元素而不是一层一层向上查询

### 操作节点

#### appendChild() 向childNodes末尾添加节点

appendChild用于向***childNodes列表的末尾***添加一个节点，并同时返回添加的节点，**如果添加的节点已经是文档的一部分了，那么就会从原来的位置移动到新位置**

```
const newNode = someNode.appendChild(newNode)
someNode.lastChild = newNode
```

appendChild在向ChildNodes列表末尾添加元素后，dom中相关的所有api都会更新，他们都是动态的，比如说添加后，lastChild，firstChild，childNodes等等

```
const returnNode = someNode.appendChild(newNode)
returnNode === someNode.firstChild   //false
returnNode === someNode.lastChild   // true
```


#### insertBefore(要插入的节点，参考节点) 用与向某个特定的位置添加节点

* 方法返回插入的节点

* 如果参考节点是null 那么这个方法的效果等同于appendChild

```
const returnNode = someNode.insertBefore(newNode, null)
returnNode === someNode.lastChild   // true
returnNode === newNode. // true
``` 

```
const returnNode = someNode.insertBefore(newNode, someNode.firstNode)

returnNode === newNode // true
returnNode === someNode.firstChild. // true
```

#### replaceChild(要插入的节点，要替换的节点) 返回替换的节点

```
const returnNode = someNode.replaceChild(newNode, someNode.firstNode)

returnNode === someNode.firstNode  //false
```

#### removeChild(要移除的节点) 返回移除的节点

```
someNode.removeChild(someNode.lastChild)
```

**注意了，上面介绍的几个方法都有使用限制，那就是要想使用他们就必须先取得父节点，只有在父节点上调用这些方法才可以使用他们**

### 两个不需要父亲节点就可以使用的方法

#### cloneNode(boolean) true表示深复制就是会复制节点及其子节点, false表是浅复制仅仅复制节点本身

```
<ul>
    <li></li>
    <li></li>
    <li></li>
</ul>

const ulNode = document.getElementsByTagName('ul')[0]
const cloned1 = ulNode.cloneNode(true)

cloned.childNodes.length === 3

const cloned2 = ulNode.cloneNode(false)

cloned2.childNodes.length === 0

```

> 注意了： cloneNode这个方法不会复制添加到dom中的JavaScript特性，比如说事件处理程序

### normalize() 处理文本节点

* 如果连续出现两个文本节点就会合并成一个
* 如果出现一个空的文本节点那么就会删除这个文本节点


### Document类型

document类型表示文档，它是window对象的一个属性 表示整个页面

#### 文档的子节点

1. document.documentElement 表示html元素

2. document.body 表示body元素

3. document.doctype 表示<!DOCTYPE>引用

4. document.firstChild

5. document.childNodes

**注意了：浏览器对document.doctype支持不一样**

### 文档信息

1. document.title 获取文档标题

2. document.URL 获取页面的完整的URL

3. document.domain 获取页面的域名 也可设置这个属性

> document.domain的设置可以达到跨域的作用 当页面中包含其他子域的框架的时候，由于安全限制，不同的子域的页面无法通过JavaScript通信，而通过设置document.domain为相同的值，就可以通信了

**另外要注意： 如果域名一开始是松散的，不能再设置为紧绷的，**

```
document.domain = 'wrox.com'   //松散

document.domain = 'p2p.wrox.com'  //紧绷
```

### 查找元素

#### document.getElementById()

获取第一个出现的id属性配置的元素，如果没有找到则返回null，避免使用表单元素的name属性和id属性一样，不然会在IE浏览器中返回表单元素如果表单元素在前的话

#### document.getElementsByTagName() 

传入标签名称，返回一个HtmlCollection对象，这个对象与NodeList非常类似，但他还有nameItem方法可以传入标签的name属性值，传入*可以获取所有的标签

> HtmlCollection 对象和 NodeList对象还是有区别的 虽然都是类数组对象，要注意有些获取元素的方法返回的是HtmlCollection 有些返回的是NodeList

#### 特殊集合

document.anchors 返回带name属性的a标签元素

document.applets 返回所有的applets元素

document.forms 返回所有的form表单元素

document.images 返回所有的img元素

document.links 返回所有的带href属性的a标签元素

> 注意： 以上这些属性返回的都是HtmlCollection对象

### 文档写入

document.write && document.writeIn

这俩个方法都可以在页面加载的时候动态的加入内容，其中可以动态加入外部资源，比如JavaScript文件等，

> 如果在文档加载完毕后再去执行document.write方法写入内容，这样会重写整个页面

```
<html>
    <head>
        <title>hello world</title>
    </head>
    <body>
        <script>
            window.onload = function() {
                document.write('hello world')
            }
        </script>
    </body>
</html>
```

### Element 类型

Element类型的特点是：

1. nodeType的值为1
2. nodeName的值为元素的标签名称
3. nodeValue的值为null
4. parentNode的值可能是Document或者是Element
5. 其子节点可能是Element,Text,Comment,等

> 要访问元素的标签名称的话可以使用tagName或者nodeName属性，他们俩返回相同的值，但是要注意的是**在Htmlz中返回的都是大写标签名称，但是在XML中返回的标签名称和在代码中的一样，因此判断标签名称使用为了统一应该考虑全部转为大写或者小写**

```
if (element.tagName === 'div') {}  //这样容易出错

if (element.tagName.toLowerCase === 'div') // 这样比较安全 适用于任何类型的文档
```

### html元素

我们为每个html元素添加了特定的属性，ID，title，lang，dir，className
除了id和lang对其他特性的修改都会立即表现到元素中，

### 操作特性

#### Element.getAttribute(特性名称)

传递给我改方法的特性名称要于实际的特性名称一致，如果不存在则返回null，当然也可以用来取得自定义的特性名称，**但是要注意自定义特性名称是不区分大小写的**

> 注意了： 有两类属性通过getAttribute和属性访问的方式，返回的值不一样，一个是style，前者返回css文本后者返回对象，一个是onclick前者返回相应代码的字符串，后者返回函数

```
 console.log(document.getElementsByTagName('div')[0].className)
 
 console.log(document.getElementsByTagName('div')[0].style)
        
 console.log(document.getElementsByTagName('div'[0].getAttribute('style'))
 
console.log(document.getElementsByTagName('div')[0].getAttribute('onclick'))
        
console.log(document.getElementsByTagName('div')[0].onclick)



test
 {0: "width", 1: "height", backgroundColor: }
width: 100px; height: 100px; background-color: yellow;
console.log(33)
ƒ onclick(event) {
console.log(33)
}
        
```