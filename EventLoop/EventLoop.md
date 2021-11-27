# `EventLoop`

## 1 背景

`javascript` 是单线程语言，至于其为什么是单线程呢，而不采用多线程。原因就在于，`javascipt` 是面向用户端的一门语言，其主要作用是与用户交互，渲染数据，操作`dom`，如果是多线程，就会出现一个问题，比如说，一个线程删除了一个`dom`节点，另外一个线程添加了一个`dom`节点，以那个线程为主呢，就会出现混乱的情况。当然，我们可以在操作一个`dom`之后，加上锁，只允许一个线程操作，但这样，无形之中，程序又平添了复杂程度，未必是一个好的办法。另外，`HTML5` 中提供了` web worker` 等 `api`，用来处理例如因大量计算而占用主线程的情况，但按照规定，其也受制于主线程，而且不能操`作dom`。所以，`javascript`是一门单线程语言，也只可能是单线程语言。

## 2 任务队列

为什么会有任务队列呢，还是因为 `javascript` 单线程的原因，单线程，就意味着一个任务一个任务的执行，执行完当前任务，执行下一个任务，这样也会遇到一个问题，就比如说，要向服务端通信，加载大量数据，如果是同步执行，`js` 主线程就得等着这个通信完成，然后才能渲染数据，为了高效率的利用`cpu`, 就有了 同步任务和 异步任务 之分。

+ 同步任务: 进入主线程，按顺序执行。
+ 异步任务: 进入`event table`，注册回调函数`callBack`，任务完成后，将`callBack`移入`event queue`,等待主线程调用。

## 3 异步任务

异步任务分为`micor Task`微任务和`macro Task`宏任务两种：

+ `micor Task` 包括 `promise`、`process.nextTick`、`MutationObserver`。
+ `macro Task` 包括 `script`、`setTimeout`、`setInterval`、`requestAnimationFrame`。

```javascript
<script>
    console.log(1)
    setTimeout(() => console.log(2), 0)
    new Promise((resolve, reject) => {
        console.log(3)
        resolve()
    }).then(() => {
        console.log(4)
    })
</script>
```

1. 整个 `script` 就是一个 宏任务，主线程开始执行任务。
2. 同步执行 `console.log(1)`， 然后到 `setTimeout` , 主线程发现 `setTimeout` 是一个 异步的宏任务， 执行 `setTimeout` , 并将注册的回调函数分发到` macro Task`(宏任务) 的 `event queue` 中，等待执行。
3. 然后是 `promise` , `new Pormise` 马上执行，同理， 主线程发现有一个 异步的微任务 `promise.then`, 注册回调函数，并将回调函数 分发到 `micro Task`(微任务) 中的 `event queue`中，等待调用。
4. 好了， 第一轮事件循环结束，主线程开始检查 异步任务， 它会优先检查`micro Task`(微任务) 的 `event queue` , 结果发现了 `promise.then`, 执行 `promise.then`。
5. 微任务执行结束了，开始检查 `macro Task` 的 `event queue`, 检查到 `setTimeout` ，执行。
6. 这也就是为什么 后注册的 `promise.then` 会优先 先注册 的 `setTimeout` 执行的原因。

![](https://github.com/zuimeidamowang/dayUp/blob/a705687bae2872b415b5aa8754fb6ed6c5650a6f/EventLoop/eventLoop.png)
