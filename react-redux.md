# React Redux



## useSelector

**selector函数什么时候才会执行呢**

1. 每当函数组件render(包括initial render 和 re-render)的时候。**除非前后两次render之间selector的函数引用没有变化**。
2. 每当任何一个action被dispatch的时候并导致state变化的时候。useSelector订阅了Redux store的变化。



**selector执行完毕后怎么触发更新的**

1. Dispatch action 和 组件render 都会触发selector的执行，当他们同时触发的时候，selector的执行不会被挤压而是叠加多次执行。
2. 当selector函数执行完毕，返回一个result结果值之后，就会默认执行一次严格全等引用检查，对比本地返回的值是否和前一次selector函数执行的值相等，如果相等那么就是`forced to re-render` 如果不相等，那么就不会触发函数re-render。
3. 严格全等引用比较，useSelector默认使用的严格全等比较`===`  这样的话 如果我们的selector函数返回的直接是一个对象字面量，那么每次对比都是false 进而会每次都会触发函数re-render。
4. useSelector可以在一个组件中多次调用，每次调用都会单独对Redux store订阅，如果一次dispatch触发了多个selector函数都会返回了新的值，那么这些的新的值仅会触发一次re-render而不是多次，这是因为redux中react的批量更新处理。



> mapStateToProps 这个函数默认每次返回一个对象，抽取的redux中的值都是这个对象的一个字段，他默认使用的浅比较，如果比较结果不同就会触发更新
>
> useSelector不一样，他可以返回任何值，而非仅仅的对象。这个使用它默认使用的全等比较。如果每次都返回一个新对象，那么每次都会强制处罚组件更新。这里有潜在的性能风险。



**如果使用useSelector抽取多个值，且不想每次都触发re-render 那么可以这样：**

1. 调用useSelector多次，每个都返回单个的值。
2. 使用Reselect这样类似的第三方库，可以返回多个字段在一个对象中，但仅仅只会在某个字段的值不一样的时候才会返回一个新对象。
3. 使用`shallowEqual`第二个参数



## useDispatch

**useDispatch 调用返回的disatch函数引用不变**

1. dispatch函数的引用不会变，除非store的实例变了，store实例和dispatch函数是一一对应的。
2. 因为dispatch函数引用不会变，所以他不应该成为useEffect或者useCallback的deeps依赖项，但是eslin规则可能不知道这个情况。



## mapDispatchToProps

1. mapDispatchToProps这个函数接受两个参数，dispatch和ownProps  其中ownProps是可选参数 如果传递了ownProps 那么这个函数会在每次组件props变化的时候重新调用执行，返回新的dispatch相关的函数。

2. 这个函数需要返回一个普通对象，对象中的每一个字段对应的都是一个会使用dispatch的函数，这些字段都会独立的成为组件的props传递给组件内部使用

3. 当在connect函数中传递了mapDispatchToProps这个参数时，那么组件就会不再收到`props.dispatch`这个props了，如果确实还需要这个dispatch，那么可以通过手动的方式传递给组件。

   ```javascript
   function mapDispatchToprops(dispatch, ownProps) {
     return {
       dispatch,
       ...actionCreator,
     }
   }
   ```



> mapDispatchToProps 也可以是个普通对象，用对象的方式是官方所提倡的，对象的每个字段对应的值都是一个actionCreator 这样redux就会默认使用bindActionCreator帮我们需要包装。

```javascript
// 这他妈的就是一个actionCreator 
function doAddToDoItem(text) {
  return { type: 'TODO_ADDED', payload: text }
}

import { increment, decrement, reset } from './counterActions'

const actionCreators = {
  increment,
  decrement,
  reset,
}

// React Redux does this for you automatically:
;(dispatch) => bindActionCreators(mapDispatchToProps, dispatch)
```



## mapStateToProps

> mapStateToProps是connect函数的第一个参数，用来从store选择组件需要的数据，这个函数需要返回一个对象，包含着组件需要的字段。简称mapState 

##### 这个函数什么时候会执行呢？

1. 每一次store state 变化的时候。
2. 接受完整的store state 然后返回一个对象。

##### mapStateToProps的定义

1. 接受一个必选参数： 完整的store state 一个可选的参数ownProps 
2. 返回一个普通对象，对象中的参数将作为props传递给组件，同时ownProps中的参数也将被自动合并成为props。
3. mapState的返回对象的将决定组件的re-render

##### 关于他的使用

1. mapState函数不应该仅仅作为一个从store抽取组件所需数据的功能函数，他右责任需要重新组织转化组件真正需要的值。
2. mapState的执行应该是很快的。只要store state 一变化那么跟他绑定的组件就会重新执行，因为这个他就需要执行很快，不然可能影响组件性能。
3. mapState应该是纯函数且是同步的，他不能有副作用，所以不能在他里面直接更改state或者ownProps，也不能做一些异步操作，如ajax

##### 和性能相关

1. 默认使用`shallow equality` (使用全等`===`比较mapState返回的对象的每一个字段是否相等) **注意这里跟useSelector完全不一样，useSelector是对比的selector函数的返回值，所以如果你在selector函数中返回一个新对象字面量，那么每次比较都会不一样，因为引用地址每次都是新的。但是mapState不一样，即使他每次返回的对象也是新的对象字面量，但是当比较的时候，他默认直接使用的一个对象浅比较，所以他会对返回的对象的每个字段都一一进行全等比较，而不是对这个返回的对象做比较。**

> mapState函数接受state和一个可选的ownProps参数，并且返回的对象决定着组件的re-render 

| --                           | (state) => stateProps                  | (state, ownProps) => mergedStateProps                        |
| ---------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| `mapStateToProps` runs when: | store `state` changes                  | store `state` changes or any field of `ownProps` is different |
| component re-renders when:   | any field of `stateProps` is different | any field of `stateProps` is different or any field of `ownProps` is different |

2. 一些昂贵的操作应该被移动到render函数，reducer函数，或者直接使用useSelector。
3. mapState函数会在store state变化 或者ownProps变化的时候重新执行，所以只有在你真正需要ownProps的时候再把它传递进来，否则可能造成不必要的重新执行和性能问题

```javascript
// 定义mapState函数的不一样，那么是否会接受到state和ownProps的情况不一样

function mapStateToProps(state) {
  console.log(state) // state
  console.log(arguments[1]) // undefined
}
const mapStateToProps = (state, ownProps = {}) => {
  console.log(state) // state
  console.log(ownProps) // {}
}

// It will receive ownProps when the formal definition of the function contains zero or two mandatory parameters:

function mapStateToProps(state, ownProps) {
  console.log(state) // state
  console.log(ownProps) // ownProps
}

function mapStateToProps() {
  console.log(arguments[0]) // state
  console.log(arguments[1]) // ownProps
}

function mapStateToProps(...args) {
  console.log(args[0]) // state
  console.log(args[1]) // ownProps
}
```



> useSelector具有缓存功能的，mapState没有



**useSelector和mapStateToProps 都应该尽可能的从store中获取少的值， 这样可以确保组件尽在自己需要的时候重新渲染**



## connectAdvanced

connect函数的基础，没有那么多的配置和限制

## batch 

> batch((fn: Function))

这个`unstable_batchedUpdates`API的别名



# redux

> redux store 应该只是用来存储那些属于全局的变量，任何不属于全局的变量应考虑放到局部当中。



### 值的不可变性

值的不可变性并不是不改变值，而是在程序状态改变时，不直接修改当前的数据，而是创建并追踪一个新的数据。

考虑到性能 immutable.js正是做这件事的好手。

js中的原始基本类型本身就是不可变的，例如字符串，数字，boolean，undefined，null。但是像数组和对象这类的他们的值是可以变的。



### 什么是纯函数

1. 一个函数的返回结果只依赖于他的参数。
2. 在执行过程中没有副作用：没有副作用的意思就是比如：他不会修改参数，不会改变函数外面的值。**不会产生外部可观察的变化**

```javascript
// foo不是纯函数，因为他的返回结果依赖了参数以外的值，那么他的返回结果就不可预料
const a = 1;
const foo = (b) => a + b;
foo(2);

// foo现在是纯函数，因为只要参数确定 那么返回的结果永远是固定的。
const a = 1;
const foo = (x,b) => x + b;
foo(1,2);

// 执行过程中不能有副作用，就是不能产生函数外部的可观察的变化。

// 这里foo是纯函数，因为它没有产生外部可观察的变化。函数执行完毕后，counter对象没有变化。
const a = 1;
const counter = { x: 1 };
const foo = (obj, b) => {
  return obj.x + b;
}
foor(counter, 2);

// 这里foo函数就不是纯函数了，因为counter对象在函数执行完毕后被改变了。
const a = 1;
const counter = { x: 1 };
const foo = (obj, b) => {
  obj.x = 2;
  return obj.x + b;
}


```



### 为什么我们要关注纯函数呢 

因为纯函数意味着靠谱，稳定。他不会产生什么意料之外的行为，也不会对外部产生影响。这样的话对于我们的程序来说测试起来，调试起来都是非常方便的。



### 动手实现一个redux

```javascript

const createStore = (stateChanger) => {
  let state = null;

  const listeners = [];
  const getState = () => state;
  const dispatch = (action) => {
    state = stateChanger(state, action);
    listeners.forEach(listener => listener());
  }

  const subscribe = (listener) => listeners.push(listener);

  dispatch({});
  
  return {
    getState,
    dispatch,
    subscribe,
  }
}


export default createStore;




import createStore from './store';



function reducer(state, action) {
  if (!state) {
    return {
      title: {
        text: 'React.js 小书',
        color: 'red',
      },
      content: {
        text: 'React.js 小书内容',
        color: 'blue',
      }
    }
  }

  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      return {
        ...state,
        title: {
          ...state.title,
          text: action.text,
        }
      } 
    case 'UPDATE_TITLE_COLOR': 
      return {
        ...state,
        title: {
          ...state.title,
          color: action.color,
        }
      }
    default: 
      return state;
  }
}

const store = createStore(reducer);


const renderTitle = (newTitle, oldTitle = {}) => {
  console.log(newTitle === oldTitle);
  if (newTitle === oldTitle) return;


  console.log('render title');
  const titleDom = document.getElementById('title');

  titleDom.innerHTML = newTitle.text;
  titleDom.style.color = newTitle.color;
}

const renderContent = (newContent, oldContent = {}) => {
  if (newContent === oldContent) return;

  console.log('render content');
  const contentDom = document.getElementById('content');

  contentDom.innerHTML = newContent.text;
  contentDom.style.color = newContent.color;
}

const renderApp = (newState, oldState = {}) => {
  console.log(newState === oldState);
  if (newState === oldState) return;

  console.log('render app');
  renderTitle(newState.title, oldState.title);
  renderContent(newState.content, oldState.content);
}


let oldState = store.getState();

store.subscribe(() => {
  const newState = store.getState();

  renderApp(newState, oldState);

  oldState = newState;
});

window.onload = function() {
  renderApp(store.getState());


  const p1 = new Promise((resolve, reject) => {
    window.setTimeout(() => {
      store.dispatch({
        type: 'UPDATE_TITLE_COLOR',
        color: 'green'
      })

      resolve('color changed');
    }, 3000);
  });

  const p2 = new Promise((resolve, reject) => {
    window.setTimeout(() => {
      store.dispatch({
        type: 'UPDATE_TITLE_TEXT',
        text: '更新后的名称'
      })

      resolve('text changed');
    }, 5000);
  });

}
```



> 很显然 reducer就是一个彻头彻尾的纯函数。


### 浅比较diff深比较

浅比较比较的是两个对象的引用地址就完了  但是深比较是对比两个对象的每个属性的值是否相同，且是递归对比两个对象的每一层的属性的值的。



出于性能方面的考虑 redux使用的浅层比较。



> 因为redux中的reducer函数是对store state需要做immutable修改的，所以对于每一层都会做copy，这样就会显得难以理解和容易出错，并且还有性能上的问题。因此**state应该是尽可能的扁平化**



# 谈谈redux



### redux是什么

redux是一个可预测的状态管理库。它只是负责和专注于状态管理，所以它并不只是能应用在react中，任何UI渲染库或者说任何需要状态的地方，都可以是它的使用场景。

redux本身是没有触发react或者任何UI库更新的能力的。它只能存储我们的状态，并在状态改变的时候通知状态改变了而已。



### redux是如何管理状态的

1. 以对象的形式在全局存储维护一份状态数据

2. 约定了一套修改状态的模版路径，提高修改数据的门槛，以禁止维护的状态可以被任意修改，任何对数据的修改必须走redux提供的模版路径，从而达到状态修改可预测。

3. 实现了一个发布订阅模式，在状态改变的时候方便通知消费者状态已经更改。

   

> 他妈的，redux没啥。就这么点东西。



### redux 和 react-redux什么关系

redux仅仅是状态管理。它没有驱动react在状态变化的以后触发更新的能力，从而让状态和UI保持一致。

> 我认为任何触发UI库更新的操作一定是来自于UI库本身。那么在一个react应用中，redux状态变更要同步到react一定也得调用react的更新api

**显然，react-redux就他妈的是干这件事的。**

react-redux夹在redux和react中间，像桥一样，链接起redux和react。在状态变更的时候，触发react更新，同步状态。



### react-redux 是怎么做的呢

记住这三个东西

1. Context  通过context提供了嵌套组件可以方便访问store的能力。无论组件层次多深，无需通过props层层传递，就可以访问store。
2. 高阶组件  高阶组件是一个函数，这个函数接受一个组件，返回一个新的组件。实际上在react-redux中它所做的就是通过context拿到store，然后再订阅store的state的变化，在状态变化时候获取最新的状态以props的形式传递包装的组件。
3. 能触发react更新的api  目前触发更新的方式有多种，比如setState等等。



react-redux说白了就是一边订阅了redux的状态变化，一边借助react提供的api去在状态变更的时候触发re-render



### 不得不说下Context

为什么说是不得不说下context呢？

原因就是react-redux深度使用了context的能力。如果没有context那么react-redux可能比较难做，为什么会这么说呢？

1. 没有context  任何一个组件访问store的方式将很不方便，可能只能通过props层层传递，这简直就是噩梦。
2. 凡是消费了context的组件，都将在context的value变化的时候强制更新，react-redux使用了这一特点。

至于context这个东西怎么实现的，大概看了下跟fiberNode有关系，通过`Object.is` 这个方法对比value是否变化，变化的话forceUpdate 组件。



### 提一下immutability

immutability 就是值不可变性。这一概念可以联系到函数式编程的纯函数。它讲究的是一个值一旦生成，在内存中申请空间并存储之后，如果在程序运行过程中针对这个值有更改，那么不直接修改内存中的这个值，而是重新申请一份内存空间，在旧值的基础上再做更改，从而生成一份新的数据并开始追踪。

显然在js中，对基本类型的值的修改默认就是不可变的。比如`let a = 2;` 这时你要修改这个变量的话`a = 3;` 那么过程就是：重新申请一个内存，填充一个3，释放a = 2的内存空间并被垃圾回收，这个过程就体现了不可变性。

但是如果你对一个对象进行修改可能就会出现问题，比如下面这样

```javascript
const obj = {
  name: 'lixiaohu',
}

// 我要修改name了
const newObj = obj;
newObj.name = 'lee';   //这样你改了对象的内容，但是对象的指针还是没有变，newObj === obj; 直接对比对象看不出变化。

// 如果这样就可以
const newObj = { ...obj };
newObj.name = 'lee';   //newObj !== obj  
```



讲redux为什么提这个东西呢？

因为redux或者react整个体系中，都是靠对象的浅层比较来对比值是否变化了的，从而决定下一步的动作是啥。如果不这样做，那就没法判断出状态的变改了，这就会出问题。

redux当前使用immer这个库来转门做这件事，它的不同点在于它实现了结构化数据的结构共享，就是说，当对象化变化的时候，它只让节点的值和其祖先节点都变化，其他的都保持不变，实现结构共享。这对于内存节省和变更效率有很大帮助。



### 最后放段redux的简单实现吧

```javascript
// createStore.js
export default function createStore(reducer) {
  if (typeof reducer !== 'function') {
    throw new TypeError(`reducer must a function`);
  }

  let currentState = null;
  
  const listeners = [];

  const subscribe = (listener) => {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    listeners.push(listener);
  }
  

  const dispatch = (action) => {
    if (Object.prototype.toString(action) !== '[object Object]') {
      throw new TypeError('action must be a object');
    }

    const nextState = reducer(currentState, action);
    
    if (nextState !== currentState) {
      listeners.forEach(listener => listener());
    }

    currentState = nextState;
  }

  const getState = () => {
    return currentState;
  }

  // initial
  dispatch({});


  return {
    getState,
    dispatch,
    subscribe,
  }
}

// connect.js
import React from 'react';
import { ReactReduxContext } from "./Provider"

export default function connect(mapStateToProps, mapDispatchToProps) {
  

  return function connectHOC(WrappedComp) {
    

    return function AdvancedComp(props) {

      const store = React.useContext(ReactReduxContext);


      const [state, setState] = React.useState(() => store.getState());
      
      React.useEffect(() => {
        store.subscribe(() => {
          const curState = store.getState();
          
          setState(curState);
        })
      }, [])
      
      const storeState = store.getState();
      console.log(storeState);
      const dispatch = store.dispatch;

      const mapState = mapStateToProps(storeState);

      const mapDispatch = mapDispatchToProps &&  mapDispatchToProps(dispatch);

      const finalProps = { ...mapState, ...mapDispatch || {}, ...props};

      return (
        <WrappedComp {...finalProps}/>
      )
    } 
  } 
}

//Provider.js
import React from 'react';

export const ReactReduxContext = React.createContext({});

export default function Provider(props) {

  const store = props.store;  

  return (
    <ReactReduxContext.Provider value={store}>
      {props.children}
    </ReactReduxContext.Provider>
  )
}
```

