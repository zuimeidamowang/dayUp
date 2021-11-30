# `this`

**`this`的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定`this`到底指向谁**，**实际上`this`的最终指向的是那个调用它的对象。**

## 1 普通函数调用

### 1.1

```javascript
function a() {
    var user = "123456";
    console.log(this.user); //undefined
    console.log(this); //Window
}
// 这里a() = window.a(),所以是window调用
a();
```

### 1.2

```javascript
var o = {
    user:"123456",
    fn:function(){
        console.log(this.user);  //123456
    }
}
// 这里是o调用了fn()，所以this指向o
o.fn();
```

### 1.3

```javascript
var o = {
    user:"123456",
    fn:function(){
        console.log(this.user); //123456
    }
}
// 对于这个this,还是o在调用他，所以指向o,不用管谁调用的o
window.o.fn();
```

### 1.4

```javascript
var o = {
    a:123,
    b:{
        a:123456,
        fn:function(){
            console.log(this.a); //123456
        }
    }
}
// 对于这个this,还是o在调用他，所以指向o,不用管谁调用的o
o.b.fn();
```

1. 如果一个函数中有`this`，但是它没有被上一级的对象所调用，那么`this`指向的就是`window`，这里需要说明的是在`js`的严格版中`this`指向的不是`window`，而是`undefined`。

2. 如果一个函数中有`this`，这个函数有被上一级的对象所调用，那么`this`指向的就是上一级的对象。

3. 如果一个函数中有`this`，**这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，`this`指向的也只是它上一级的对象**

## 2 构造函数的`this`

```javascript
function Fn(){
    this.user = "123456";
}
var a = new Fn();
console.log(a.user); //123456
```

这里涉及到了`new`操作符号。

这里之所以对象a可以点出函数`Fn`里面的`user`是因为`new`关键字可以改变`this`的指向，将这个`this`指向对象a，为什么我说a是对象，因为用了`new`关键字就是创建一个对象实例。

### 当`this`遇到返回值

```js
function Fn()  
{  
    this.user = '123456';  
    return {};  
}
var a = new Fn;  
console.log(a.user); //undefined
```

再看一个

```js
function Fn()  
{  
    this.user = '123456';  
    return function(){};
}
var a = new Fn;  
console.log(a.user); //undefined
```

再来

```js
function Fn()  
{  
    this.user = '123456';  
    return 1;
}
var a = new Fn;  
console.log(a.user); //123456
function Fn()  
{  
    this.user = '123456';  
    return undefined;
}
var a = new Fn;  
console.log(a.user); //123456
```

什么意思呢？

如果返回值是一个对象，那么`this`指向的就是那个返回的对象，如果返回值不是一个对象那么`this`还是指向函数的实例。

```js
function Fn()  
{  
    this.user = '123456';  
    return undefined;
}
var a = new Fn;  
console.log(a); //fn {user: "123456"}
```

还有一点就是虽然`null`也是对象，但是在这里this还是指向那个函数的实例，因为`null`比较特殊。

```js
function Fn()  
{  
    this.user = '123456';  
    return null;
}
var a = new Fn;  
console.log(a.user); //123456
```

这里可以看一下[`new`手写源码](https://github.com/zuimeidamowang/dayUp/blob/main/new/new.js)里面的注释。

## 3 改变`this`指向

### 3.1 使用局部变量来代替`this`指针

```javascript
var name = "123";
var obj = {
  name : "456",
  say : function(){
    var that = this;//使用一个变量指向 this
    setTimeout(function(){
      console.log(that.name);
    },0);
  }
}
// 456
obj.say();
```

### 3.2 [使用call 、 apply 或者 bind 方法](https://github.com/zuimeidamowang/dayUp/tree/main/call%2Capply%2Cbind)

### 3.3 `new `操作符

## 4 箭头函数

`es6`里面`this`指向固定化，始终指向外部对象，因为箭头函数没有`this`,因此它自身不能进行`new`实例化,同时也不能使用`call, apply, bind`等方法来改变`this`的指向。

## 匿名函数

```javascript
var name="123";
    var person={
        name:"456",
        showName:function(){
            console.log(this.name);
        }
        sayName:function(){
            (function(callback){
                callback();
            })(this.showName)
        }
    }
    person.sayName();  //输出 456
```



匿名函数的执行同样在默认情况下`this`是指向`window`的，除非手动改变`this`的绑定对象。

