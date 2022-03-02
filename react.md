### React 组件最佳实践

1. useMemo useCallback 要真的考虑清楚是否有用的必要性  如何他们以来的deps本身就是变化频繁的 可能就没有必要了  他们会带来额外的空间消耗
2. useMemo或者useCallback依赖的deps数组为空时 就说明我们希望存储一个值 这个值在组件re-render时不会变化的  这种情况可以直接替换成useRef 或者踢到组件外面

### useEffect

1. 无论useEffect的依赖是什么 在函数组件initial的时候，第一次渲染的时候，都必须执行： 这就是代表了之前的didmount，其次每次re-render的时候依赖项有变化都会执行，
2. 每当函数组件执行的时候 这包括首次初始化渲染执行和之后的状态改变导致的更新执行  记住函数都是整体重新执行了的。所以每次useEffect对应的callback函数都是重新生成的了  那么在本次函数执行时 callback的作用域链上对应的函数的状态都是最新的
3. 一般建议把不依赖state和props的函数移动到函数组件外面。
4. **Effect拿到的总是定义它的那次渲染中的props和state**
5. ***组件内的每一个函数（包括事件处理函数，effects，定时器或者API调用等等）会捕获定义它们的那次渲染中的props和state。***
6. useEffect中的清除逻辑都会被延迟到下一次渲染完成后执行，状态更新，函数重新执行，useEffect执行重新，useEffect对应回调函数重新定义(这包括里面返回的清除函数也是重新定义，他们都拿到了本次渲
   染的最新的状态)， render执行， dom更新渲染完成，**这时执行上一次effect中的清除函数的逻辑，这个清除函数中保留的事上次的旧状态的**  执行完后 再执行本地新状态的对应的useEffect对应的回调函数>的逻辑。
7. 你可以从依赖中去除`dispatch`, `setState`, 和`useRef`包裹的值因为React会确保它们是静态的。不过你设置了它们作为依赖也没什么问题。他们在整个react生命周期内是保持不变的
8. 当状态比较复杂的时候 或者想从useEffect中剔除依赖的时候 可以考虑使用useReducer
9. 实际上，在组件内定义的函数每一次渲染都在变。
10. 在你用`memo`或者`useMemo`做优化时，如果你可以从不变的部分里分割出变化的部分，那么这看起来可能是有意义的。
11. 将昂贵的组件“提升”到父组件中，在父组件中它将不那么频繁地呈现。
12. 然后将昂贵的组件作为道具传递下去。
13. if we create the JSX element once and re-use that same one, then we'll get the same JSX every time!
14. 并且把那些仅被effect使用的函数放到effect里面

### 每一次渲染都有自己的事件处理函数

1. **在任意一次渲染中，props和state是始终保持不变的。**如果props和state在不同的渲染中是相互独立的，那么使用到它们的任何值也是独立的（包括事件处理函数）。它们都“属于”一次特定的渲染。即便是事件处理中的异步函数调用“看到”的也是这次渲染中的`count`值。
2. 对于每一次渲染中 props和state是这次函数调用中的一个内部的局部常量值 

### effect 是如何读取到最新的count的状态值的呢 

也许，是某种“data binding”或“watching”机制使得`count`能够在effect函数内更新？也或许`count`是一个可变的值，React会在我们组件内部修改它以使我们的effect函数总能拿到最新的值？

都不是。

我们已经知道`count`是某个特定渲染中的常量。事件处理函数“看到”的是属于它那次特定渲染中的`count`状态值。对于effects也同样如此：

**并不是`count`的值在“不变”的effect中发生了改变，而是\*effect 函数本身\*在每一次渲染中都不相同。**

每一个effect版本“看到”的`count`值都来自于它属于的那次渲染：

### effect 是如何工作的

***React会记住我们每次提供给他的useEffect的回调函数*** 并会在每次更改作用于dom并让浏览器绘制屏幕后去调用它。所以虽然我们说的是一个同一个函数(**这里的同一个可以理解为函数的作用或者函数体内容是一样的**)，但实际上每次渲染都是一个不同的函数(**因为每次渲染时都是重新定义了这个回调函数 这也很关键 在重新定义时 函数体中关联到的组件的状态自然是本次渲染中的那个状态常量 这是可以理解的**)，函数看到的props和stata也是来自于它属于的那次特定渲染。

### 实际上 函数组件每次渲染都会有属于它自己的stata，props.....所有。

1. 每一个组件内的函数（包括事件处理函数，effects，定时器或者api调用等等） 会捕获某次渲染中定义的props和state。
2. 在组件内什么时候去访问props和state是无关紧要的。因为他们不会改变，在单词渲染的范围内，props和state始终是不变的。
3. 如果你想在某次渲染中的effect的回调中访问非本次渲染的props和state，而是最新的状态的话，ref是一个选择。

### effect的清除工作

1. react只会在浏览器绘制后运行effect。effect的清除逻辑同样被延迟了，上一次的effect会在重新渲染完后被清除。而不是状态更新，清除effect，渲染UI，执行新的effect。应该是这样的： UI对应的状态从10变化到20，流程是： 渲染20对应的UI， 浏览器绘制我们看到了20的UI，React清除状态为10的effect，React执行状态为20的effect。

> 那么既然清除上一次effect既然被延迟到了状态变为20之后，那为什么清除回调函数中还能访问到旧的状态呢？还是那句话： React组件函数中的每一个函数，包括事件处理函数，effects，定时器或者Api调用等等。会捕获定义他们那次渲染的props和state。

这里感觉应该是React保留了上次渲染中的清除effect回调函数的引用。这个函数属于上一次渲染，他保存着旧的状态。

### useEffect的依赖控制

1. react 不清楚不知道每次re-render的时候  effect对应的函数要做的事件(函数体内容)变化了没有，她没有对比这个函数体相同不相同，所以我们可以告诉他们函数体中依赖的变量是否变化了，这样就能跳过不必要的一些函数执行。

#### 不要对react撒谎

```javascript
// First render, state is 0
function Counter() {
  // ...
  useEffect(
    // Effect from first render
    () => {
      const id = setInterval(() => {
        setCount(0 + 1); // Always setCount(1)
      }, 1000);
      return () => clearInterval(id);
    },
    [] // Never re-runs
  );
  // ...
}

// Every next render, state is 1
function Counter() {
  // ...
  useEffect(
    // This effect is always ignored because
    // we lied to React about empty deps.
    () => {
      const id = setInterval(() => {
        setCount(1 + 1);
      }, 1000);
      return () => clearInterval(id);
    },
    []
  );
  // ...
}
```



> 找到最小状态 给effect中传递尽量少的值 会很有帮助

### useReducer

1. 当你想更新一个状态，并且这个状态更新依赖另一个状态的时候，你可能需要用useReducer去替换它们。比如当你写setSomething(something => ....) 这种代码的时候 也许就是使用useReducer的时机到了。
2. reducer可以让你把组件内发生了什么(只需要提交action就行)跟状态如何响应更新分开表述。
3. react会保证dispath在组件的声明周期内保持不变。

> 你可以从依赖中去除dispatch，setState，useRef包裹的值，因为react会确保他们是静态的。

#### 关于children属性

```javascript
const parent = (props) => {
  
  return (
    <div>{props.children}</div>
  )
}
```

当一个组件重新渲染时 这里指他自己内部的状态引起的渲染时 来自于props的children属性没有变 那么在重新渲染时react就不会访问这个children属性。所以chilren对应的组件不会再重新渲染。这是一种优化手段。称为内容提升。

#### 在使用useMemo之前

1. 如果组件树中国的一个状态放在了比实际位置更高的位置上 不是一个好主意 这是需要状态下移。
2. 还有内容提升。

#### 代数效应

代数效应就是让我们可以把做什么和怎么做分开，在js中，代数效应可以让我们自上而下编写代码，当时程序执行可以在不同的函数之间跳跃执行的效果。而这种跳跃执行的目的就是为了将函数式和副作用进行分离，保持函数式编程的同时又能支持副作用操作。

比如： 执行流进入一个函数，顺序从上到下执行，遇到一个副作用操作，则离开当时函数环境， 跳跃到另一个函数执行流，执行副作用，再将副作用的操作结果反馈到当前执行流。再接着用这个结果进行剩下的计算。

实际上： 像await async generator这样的语法类似于函数效应 只不过他们缺陷。比如他们是有传染性的。

```javascript
async function doSome() {
  const v1 = do1()
  const v2 = await do2(v1)  // perform effect and resume with result
  const v3 = do3(v2)
  const v4 = await do4(v3) // ...
  return v4
}




function* doSome() {
  const v1 = do1()
  const v2 = yield do2(v1) // ...
  const v3 = do3(v2)
  const v4 = yield do4(v3) // ...
  return v4
}
```



js中现在没有这样的语法以支持代数效应的实现， 已经有不止一人提出了这样的语法提案。 



```javascript
try {
  const v1 = do1()
  const v2 = perform '1' // 执行副作用
  const v3 = do3(v2)
  const v4 = perform '3' // 执行副作用
  return v4
} 
handle (e) {
  if (e === '1') {
    resume 'v2' // 返回到那个执行流  这里甚至可以执行异步逻辑 可以远程获取数据 但对于上面的执行完全是同步的 且没有传染性。
  }
  else if (e === '3') {
    resume 'v4'
  }
}


// 这个语法跟try catch的不同在于 try catch 一旦throw 抛出错误后面的代码就不会在执行了。 进入catch块中的代码执行完毕后也不会在恢复那个执行流中了。 throw抛出错误的那个环境的变量将全部释放内存收回。
```



**React Hooks 实际上是在践行代数效应**

> 当然，除了hooks，Suspense还有Reconciler，都是对代数效应的践行，它们本质上就如我前文所说，在正常的程序流程中，允许我们停下来，去做另外一件事，做完之后，我们可以再从被打断的地方继续往下执行，而另外的那件事，可以是同步的，也可以是异步的，理论上，它的执行过程与我们当前的流程无关，我们仅关心（或根本不关心）它的结果。



#### PureComponent vs Memo

PureComponent 会浅对比Props和state两个对象决定是否render 但是Memo只会浅对比props 另外Memo也可以用在类组件上。




# React

### JSX

1. jsx是meta公司发明推出的一种javascript扩展语法，它不属于ECMA语法规范。它需要由对应的转换器转为真正的js语言内容。
2. React推荐将逻辑和标记放在一种称为组件的耦合单元中，实现**关注点分离**
3. jsx本身就是一个表达式，所以他可以作为函数的参数或返回值，甚至使用在if或者for循环等中。在jsx的花括号中可以加入任何合法的js表达式。
4. jsx可以防止XSS跨站脚本攻击。
5. babel会将jsx转为js的函数调用`React.createElement()` 这个函数调用执行完毕后，会返回一个js对象。一个对象可以认为是一个节点，react通过这个些节点构造虚拟dom树。

```javascript
// JSX
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);

//Babel转移后的结果
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);

// React.createElement函数执行后的结果。 这个对象就是React元素
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

**React.createElement 执行后返回的对象就是React元素**

### 元素渲染

1. React通过diff对比，只会进行必要的更新，来保持状态和DOM的统一。

### 组件和props

1. 组件允许你讲UI拆分成独立且可复用的代码片段，这个片段需要独立设计和构思。
2. 概念上，组件就是接受props同时返回React元素的JavaScript函数。
3. 建议从组件自身命名，而不是根据调用组件的上下文环境命名。
4. 组件足够复杂或被多处使用的时候，就要考虑拆分复用。
5. 所有的组件都必须像纯函数一样对待自己的props。

### State和生命周期

1. setState方法会对state进行合并，并且是浅合并。
2. React数据流是自上向下的的单向数据流。

### 事件处理

1. [`SyntheticEvent`](https://zh-hans.reactjs.org/docs/events.html) 代表一个合成事件，React做了这个处理，你可以不用关心浏览器兼容性。
2. 在class组件中，要注意事件处理函数的this问题，需要手动绑定或者箭头函数处理。

### 条件渲染

1. 可以用变量配合if语句的方式条件渲染。
2. 可以使用三元运算符来判断
3. 可以使用逻辑与和逻辑或 注意0的坑。

### 列表 & Key

1. React使用数组的map方法来通过数组变成React元素的过程。
2. key如果不传默认使用的数组的索引Index
3. 在一个数组上下文中，数组的key应该是确定唯一的，不推荐使用数组的索引Index来做key，这样在数组顺序变化的时候可能会有隐患。

### 表单

1. input textarea select 组件都可以通过value属性同React的状态链接到一起，这样他们就都能变成受控组件了
2. 特殊的是： input type 等于file 它的value只读，所以它只能是个非受控组件。
3. 如果给受控组件的value属性指定一个undefined或者null 那么还是能够输入的 

### 状态提升

1. 当多个组件需要反应数据的相同变化的时候，那么就需要将状态提升。状态提升就像寻找两个子树的最近公共祖先。

### 组合和继承

1. React推荐使用组合来实现组件间的代码重用
2. 组合的方式：包含或者特例

```javascript
// 包含关系
// 包含关系可以通过props.children来实现
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}

// 包含关系还可以是自行约定的props属性来实现。这就像vue的slot插槽一样。
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}

```

```javascript
// 特例这种关系平时开发中特别常见，比如还有原子组件Button 特例组件AddButton
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

3. React并没有发现需要通过继承来实现组件层次的

### React哲学

1. 根据UI划分组件层级，组件的设计划分根据单一职责原则。一个组件只负责一个功能。
2. 自上向下或者自下向上开发组件的静态版本，静态版本不需要考虑交互逻辑。
3. 确定UI state的最小且完整表示，其实这一步就是建模，数据模型。一条原则，dont repeat youself 。
4. 确定state的位置，这个问题就是一个树的最近公共祖先的问题。
5. 构建反向数据流，其实就是子组件产生数据，存储到父亲组件，再共享到所以兄弟组件。 这可以理解成一种数据双向绑定。