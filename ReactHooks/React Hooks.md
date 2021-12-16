# `React Hooks`

## 1 为什么要有`React Hooks`

介绍`Hooks`之前，首先要给大家说一下`React`的组件创建方式，一种是**类组件**，一种是**纯函数组件**，并且`React`团队希望，组件不要变成复杂的容器，最好只是数据流的管道。开发者根据需要，组合管道即可。也就是说**组件的最佳写法应该是函数，而不是类。**
 但是我们知道，在以往开发中*类组件*和*纯函数组件*的区别是很大的，纯函数组件有着类组件不具备的多种特点，简单列举几条

- 纯函数组件**没有状态**
- 纯函数组件**没有生命周期**
- 纯函数组件没有`this`
- 只能是纯函数

这就注定，我们所推崇的函数组件，只能做UI展示的功能，涉及到状态的管理与切换，我们不得不用类组件或者redux，但我们知道类组件的也是有缺点的，比如，遇到简单的页面，你的代码会显得很重，并且每创建一个类组件，都要去继承一个`React`实例，至于`Redux`,更不用多说，很久之前`Redux`的作者就说过，“能用`React`解决的问题就不用`Redux`”,等等一系列的话。关于`React`类组件`redux`的作者又有话说

> - 大型组件很难拆分和重构，也很难测试。
> - 业务逻辑分散在组件的各个方法之中，导致重复逻辑或关联逻辑。
> - 组件类引入了复杂的编程模式，比如 render props 和高阶组件。

## 2 `React Hooks`的用法

### 2.1 `userState()`:状态钩子

```jsx
import React, {useState} from 'react'
const AddCount = () => {
  const [ count, setCount ] = useState(0)
  const addcount = () => {
    let newCount = count
    setCount(newCount+=1)
  } 
  return (
    <>
      <p>{count}</p>
      <button onClick={addcount}>count++</button>
    </>
  )
}
export default AddCount 
```

通过上面的代码，我们实现了一个功能完全一样的计数器，代码看起来更加的轻便简洁，没有了继承，没有了渲染逻辑，没有了生命周期等。这就是`hooks`存在的意义。
 在`useState()`中，它接受状态的初始值作为参数，即上例中计数的初始值，它返回一个数组，其中数组第一项为一个变量，指向状态的当前值。类似`this.state`,第二项是一个函数，用来更新状态,类似`setState`。该函数的命名，我们约定为`set`前缀加状态的变量名。

如果新的 `state` 需要通过使用先前的 `state` 计算得出，那么可以将函数传递给` setState`。该函数将接收先前的 `state`，并返回一个更新后的值。下面的计数器组件示例展示了`setState` 的两种用法：

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1)
  }
  function handleClickFn() {
    setCount((prevCount) => {
      return prevCount + 1
    })
  }
  return (
    <>
      Count: {count}
      <button onClick={handleClick}>+</button>
      <button onClick={handleClickFn}>+</button>
    </>
  );
}

```

两种方式的区别
注意上面的代码，`handleClick`和`handleClickFn`一个是通过一个新的 `state` 值更新，一个是通过函数式更新返回新的` state`。现在这两种写法没有任何区别，但是如果是异步更新的话，那你就要注意了，他们是有区别的，来看下面例子：

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setTimeout(() => {
      setCount(count + 1)
    }, 3000);
  }
  function handleClickFn() {
    setTimeout(() => {
      setCount((prevCount) => {
        return prevCount + 1
      })
    }, 3000);
  }
  return (
    <>
      Count: {count}
      <button onClick={handleClick}>+</button>
      <button onClick={handleClickFn}>+</button>
    </>
  );
}
```

当我设置为异步更新，点击按钮延迟到3s之后去调用`setCount`函数，当我快速点击按钮时，也就是说在3s多次去触发更新，但是只有一次生效，因为 `count` 的值是没有变化的。

当使用函数式更新` state` 的时候，这种问题就没有了，因为它可以获取之前的 `state` 值，也就是代码中的 `prevCount` 每次都是最新的值。

### 2.2 `useContext()`:共享状态钩子

该钩子的作用是，在组件之间共享状态。关于`Context`这里不再赘述，其作用就是可以做状态的分发，在`React16.X`以后支持，避免了`react`逐层通过`Props`传递数据。
 下面是一个例子，现在假设有A组件和B组件需要共享一个状态。



```jsx
import React,{ useContext } from 'react'
const Ceshi = () => {
  const AppContext = React.createContext({})
  const A =() => {
    const { name } = useContext(AppContext)
    return (
        <p>我是A组件的名字{name}<span>我是A的子组件{name}</span></p>
    )
}
const B =() => {
  const { name } = useContext(AppContext)
  return (
      <p>我是B组件的名字{name}</p>
  )
}
  return (
    <AppContext.Provider value={{name: 'hook测试'}}>
    <A/>
    <B/>
    </AppContext.Provider>
  )
}
export default Ceshi 
```

### 2.3 `useEffect()`:副作用钩子

```jsx
useEffect(() => {},[array])
```

`useEffect()`接受两个参数，第一个参数是你要进行的异步操作，第二个参数是一个数组，用来给出Effect的依赖项。只要这个数组发生变化，`useEffect()`就会执行。当第二项省略不填时，`useEffect()`会在每次组件渲染时执行。这一点类似于类组件的`componentDidMount`。

副效应是随着组件加载而发生的，那么组件卸载时，可能需要清理这些副效应。
useEffect()允许返回一个函数，在组件卸载时，执行该函数，清理副效应。如果不需要清理副效应，useEffect()就不用返回任何值。

```javascript
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    subscription.unsubscribe();
  };
}, [props.source]);
```


上面例子中，useEffect()在组件加载时订阅了一个事件，并且返回一个清理函数，在组件卸载时取消订阅。

实际使用中，由于副效应函数默认是每次渲染都会执行，所以清理函数不仅会在组件卸载时执行一次，每次副效应函数重新执行之前，也会执行一次，用来清理上一次渲染的副效应。

使用useEffect()时，有一点需要注意。如果有多个副效应，应该调用多个useEffect()，而不应该合并写在一起。