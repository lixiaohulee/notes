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





