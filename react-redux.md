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

