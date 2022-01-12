# 理解 JavaScript 的 async/await

## 1. async 和 await 在干什么

任意一个名称都是有意义的，先从字面意思来理解。async 是“异步”的简写，而 await 可以认为是 async wait 的简写。所以应该很好理解 async 用于申明一个 function 是异步的，而 await 用于等待一个异步方法执行完成。

另外还有一个很有意思的语法规定，await 只能出现在 async 函数中。然后细心的朋友会产生一个疑问，如果 await 只能出现在 async 函数中，那这个 async 函数应该怎么调用？

如果需要通过 await 来调用一个 async 函数，那这个调用的外面必须得再包一个 async 函数，然后……进入死循环，永无出头之日……

### 1.1. async 起什么作用

这个问题的关键在于，async 函数是怎么处理它的返回值的！

我们当然希望它能直接通过 `return` 语句返回我们想要的值，但是如果真是这样，似乎就没 await 什么事了。所以，写段代码来试试，看它到底会返回什么：

```javascript
async function testAsync() {
    return "hello async";
}

const result = testAsync();
console.log(result);
```

看到输出就恍然大悟了——输出的是一个 Promise 对象。

```bash
c:\var\test> node --harmony_async_await .
Promise { 'hello async' }
```

所以，async 函数返回的是一个 Promise 对象。从[文档](https://link.segmentfault.com/?enc=gfvufyXKsroq4SqXbSQTwg%3D%3D.NhCpoikRuj7rFw7Kt8OOzCbb4s5j%2FivmqT5qZSwA6zdhwwvNjJ%2Bw6%2BpQJhIZQSLFUHbKl77kDcb1tOr9bcFNrUvSGqsQfFDrFAHWOAoNGmvVnsLHa%2FHml%2FnvjJIX7x0d)中也可以得到这个信息。async 函数（包含函数语句、函数表达式、Lambda表达式）会返回一个 Promise 对象。如果在函数中 `return` 一个直接量，async 会把这个直接量通过 `Promise.resolve()` 封装成 Promise 对象。

> `Promise.resolve(x)` 可以看作是 `new Promise(resolve => resolve(x))` 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例。

async 函数返回的是一个 Promise 对象，所以在最外层不能用 await 获取其返回值的情况下，我们当然应该用原来的方式：`then()` 链来处理这个 Promise 对象，就像这样

```javascript
testAsync().then(v => {
    console.log(v);    // 输出 hello async
});
```

现在回过头来想下，如果 async 函数没有返回值，又该如何？很容易想到，它会返回 `Promise.resolve(undefined)`。

联想一下 Promise 的特点——无等待，所以在没有 `await` 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。这和普通返回 Promise 对象的函数并无二致。

那么下一个关键点就在于 await 关键字了。

### 1.2. await 到底在等啥

一般来说，都认为 await 是在等待一个 async 函数完成。不过按[语法说明](https://link.segmentfault.com/?enc=Ety12gaSt8%2B7tA18drs89g%3D%3D.THqoidMDJjSDNspHzG7%2F4ffe1ylVwCqVSMbCkXlJxybWgYROcufOw1OrRs4o3KvIy9qyfZp%2FqLwEXn4llWlUCRjgoFD4s3lCPKaWx10A81A%3D)，await 等待的是一个表达式，这个表达式的计算结果是 Promise 对象或者其它值（换句话说，就是没有特殊限定）。

因为 async 函数返回一个 Promise 对象，所以 await 可以用于等待一个 async 函数的返回值——这也可以说是 await 在等 async 函数，但要清楚，它等的实际是一个返回值。注意到 await 不仅仅用于等 Promise 对象，它可以等任意表达式的结果，所以，await 后面实际是可以接普通函数调用或者直接量的。所以下面这个示例完全可以正确运行

```javascript
function getSomething() {
    return "something";
}

async function testAsync() {
    return Promise.resolve("hello async");
}

async function test() {
    const v1 = await getSomething();
    const v2 = await testAsync();
    console.log(v1, v2);
}

test();
```

### 1.3. await 等到了要等的，然后呢

await 等到了它要等的东西，一个 Promise 对象，或者其它值，然后呢？我不得不先说，`await` 是个运算符，用于组成表达式，await 表达式的运算结果取决于它等的东西。

如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。

如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。

> 看到上面的阻塞一词，心慌了吧……放心，这就是 await 必须用在 async 函数中的原因。async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。

> 根据 [await - JavaScript | MDN](https://link.segmentfault.com/?enc=zbO%2BZiWJcrun9pJddfin6g%3D%3D.dB7VFs6B3Dwe%2F3vrSbxIRlHfzAbrtTnZfCJgUGgKow1woZxiXnQGDuhWUznlbSmaPsm%2BRJ7mQ5s0Mr32N5FLmyyex2tLdtEy%2Fl9oBlIhVODekb0y%2BUm6BMOjVjoPqGuqYzpfjuKjxMTpB1E7k3D51w%3D%3D)，`await` 等待的不是一个 Promise Like 对象的时候，相当于 `await Promise.resolve(...)`。