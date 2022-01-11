# try catch

### 一、try catch基本语法

```
try {
    //可能会导致错误的代码
} catch (error) {
    //在错误发生时怎么处理
}finally {
     //即使报错始终执行
 }
```

### 二、try catch特点

##### 1.try catch耗性能

`try catch`会消耗性能，但是`try catch`对`Chrome`的影响比`IE11`小很多,据说是V8引擎新的编译器`TurboFan`起到的作用，有兴趣的小伙伴们可以看下[v8_8h_source的3354行起](https://link.juejin.cn?target=https%3A%2F%2Fv8docs.nodesource.com%2Fnode-0.8%2Fd4%2Fda0%2Fv8_8h_source.html)，但是`IE11`是slower不少的。这就根据小伙伴们的业务对象了，如果只面向现代浏览器，`try catch`消耗性能影响会很小；如果需要兼容`IE`或内嵌在低端的`webView`时，可适当考虑下`try catch`消耗性能。

##### 2.try catch捕获不到异步错误

尝试对异步方法进行`try catch`操作只能捕获当次事件循环内的异常，对callback执行时抛出的异常将无能为力。

```
try {
    setTimeout(()=>{
        const A = 1
        A = 2
    },0)
} catch (err) {
    // 这里并不能捕获回调里面抛出的异常
    console.log("-----catch error------")
    console.log(err)
}
复制代码
```

异步情况想捕获异常，建议在异步函数里包一层`try catch`。

```
setTimeout(() => {
  try {
    const A = 1
    A = 2
  } catch (err) {
    console.log(err)
  }
}, 0)

复制代码
```

##### 3.try catch抛出错误

与 `try-catch` 语句相配的还有一个 `throw` 操作符，随时抛出自定义错误，可以根据不同错误类型，创建自定义错误消息。

```
throw new Error("Something bad happened.");
throw new SyntaxError("I don’t like your syntax.");
throw new TypeError("What type of variable do you take me for?"); throw new RangeError("Sorry, you just don’t have the range.");
throw new EvalError("That doesn’t evaluate.");
throw new URIError("Uri, is that you?");
throw new ReferenceError("You didn’t cite your references properly.");
```

### 三、慎用try catch

`try catch`最适合处理那些我们无法控制的错误，如`I/O`操作等，后端`nodeJs`或`java`读取`I/O`操作比较多比如读数据库，所以用`try catch`比较多。前端可以用在上传图片、使用别人的`js`库报错、`async await`同步调接口等地方适用。

```
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}
复制代码
```

但是大部分前端客户端代码处理都不怎么依赖环境也没有`I/O`操作，都是自己写的代码，在明明白白地知道自己的代码会发生错误时，再使用`try catch`语句就不太合适了，对应数据类型的错误，建议小伙伴们用解构赋值指定默认值、`&&`和`||`来规避，所以慎用try catch。

```
foo = (obj = {}) => {
  let obj1 = result || {};
  if (obj && obj.code) {
    console.log('obj.code',obj.code)
  }
}
复制代码
```