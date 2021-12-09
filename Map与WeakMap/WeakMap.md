# `WeakMap`

### 含义

`WeakMap`结构与`Map`结构类似，也是用于生成键值对的集合。

```javascript
// WeakMap 可以使用 set 方法添加成员
const wm1 = new WeakMap();
const key = {foo: 1};
wm1.set(key, 2);
wm1.get(key) // 2

// WeakMap 也可以接受一个数组，
// 作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // "bar"
```

`WeakMap`与`Map`的区别有两点。

首先，`WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。

```javascript
const map = new WeakMap();
map.set(1, 2)
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key
```

上面代码中，如果将数值`1`和`Symbol`值作为 `WeakMap` 的键名，都会报错。

其次，`WeakMap`的键名所指向的对象，不计入垃圾回收机制。

`WeakMap`的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。请看下面的例子。

```javascript
const e1 = document.getElementById('foo');
const e2 = document.getElementById('bar');
const arr = [
  [e1, 'foo 元素'],
  [e2, 'bar 元素'],
];
```

上面代码中，`e1`和`e2`是两个对象，我们通过`arr`数组对这两个对象添加一些文字说明。这就形成了`arr`对`e1`和`e2`的引用。

一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放`e1`和`e2`占用的内存。

```javascript
// 不需要 e1 和 e2 的时候
// 必须手动删除引用
arr [0] = null;
arr [1] = null;
```

上面这样的写法显然很不方便。一旦忘了写，就会造成内存泄露。

`WeakMap` 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，`WeakMap` 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 `WeakMap`。一个典型应用场景是，在网页的 `DOM` 元素上添加数据，就可以使用`WeakMap`结构。当该 `DOM` 元素被清除，其所对应的`WeakMap`记录就会自动被移除。

```javascript
const wm = new WeakMap();

const element = document.getElementById('example');

wm.set(element, 'some information');
wm.get(element) // "some information"
```

上面代码中，先新建一个 `WeakMap` 实例。然后，将一个 `DOM` 节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在 `WeakMap` 里面。这时，`WeakMap` 里面对`element`的引用就是弱引用，不会被计入垃圾回收机制。

也就是说，上面的 `DOM` 节点对象除了 `WeakMap` 的弱引用外，其他位置对该对象的引用一旦消除，该对象占用的内存就会被垃圾回收机制释放。`WeakMap` 保存的这个键值对，也会自动消失。

总之，`WeakMap`的专用场合就是，它的键所对应的对象，可能会在将来消失。`WeakMap`结构有助于防止内存泄漏。

注意，`WeakMap` 弱引用的只是键名，而不是键值。键值依然是正常引用。

```javascript
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;
wm.get(key)
// Object {foo: 1}
```

上面代码中，键值`obj`是正常引用。所以，即使在 `WeakMap` 外部消除了`obj`的引用，`WeakMap` 内部的引用依然存在。

### `WeakMap` 的语法

`WeakMap` 与 `Map` 在 `API` 上的区别主要是两个，一是没有遍历操作（即没有`keys()`、`values()`和`entries()`方法），也没有`size`属性。因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。这一刻可以取到键名，下一刻垃圾回收机制突然运行了，这个键名就没了，为了防止出现不确定性，就统一规定不能取到键名。二是无法清空，即不支持`clear`方法。因此，`WeakMap`只有四个方法可用：`get()`、`set()`、`has()`、`delete()`。

```javascript
const wm = new WeakMap();

// size、forEach、clear 方法都不存在
wm.size // undefined
wm.forEach // undefined
wm.clear // undefined
```

### `WeakMap` 的示例

`WeakMap `的例子很难演示，因为无法观察它里面的引用会自动消失。此时，其他引用都解除了，已经没有引用指向 `WeakMap` 的键名了，导致无法证实那个键名是不是存在。

贺师俊老师[提示](https://github.com/ruanyf/es6tutorial/issues/362#issuecomment-292109104)，如果引用所指向的值占用特别多的内存，就可以通过 `Node` 的`process.memoryUsage`方法看出来。根据这个思路，网友[vtxf](https://github.com/ruanyf/es6tutorial/issues/362#issuecomment-292451925)补充了下面的例子。

首先，打开 `Node` 命令行。

```bash
$ node --expose-gc
```

上面代码中，`--expose-gc`参数表示允许手动执行垃圾回收机制。

然后，执行下面的代码。

```javascript
// 手动执行一次垃圾回收，保证获取的内存使用状态准确
> global.gc();
undefined

// 查看内存占用的初始状态，heapUsed 为 4M 左右
> process.memoryUsage();
{ rss: 21106688,
  heapTotal: 7376896,
  heapUsed: 4153936,
  external: 9059 }

> let wm = new WeakMap();
undefined

// 新建一个变量 key，指向一个 5*1024*1024 的数组
> let key = new Array(5 * 1024 * 1024);
undefined

// 设置 WeakMap 实例的键名，也指向 key 数组
// 这时，key 数组实际被引用了两次，
// 变量 key 引用一次，WeakMap 的键名引用了第二次
// 但是，WeakMap 是弱引用，对于引擎来说，引用计数还是1
> wm.set(key, 1);
WeakMap {}

> global.gc();
undefined

// 这时内存占用 heapUsed 增加到 45M 了
> process.memoryUsage();
{ rss: 67538944,
  heapTotal: 7376896,
  heapUsed: 45782816,
  external: 8945 }

// 清除变量 key 对数组的引用，
// 但没有手动清除 WeakMap 实例的键名对数组的引用
> key = null;
null

// 再次执行垃圾回收
> global.gc();
undefined

// 内存占用 heapUsed 变回 4M 左右，
// 可以看到 WeakMap 的键名引用没有阻止 gc 对内存的回收
> process.memoryUsage();
{ rss: 20639744,
  heapTotal: 8425472,
  heapUsed: 3979792,
  external: 8956 }
```

上面代码中，只要外部的引用消失，`WeakMap` 内部的引用，就会自动被垃圾回收清除。由此可见，有了 `WeakMap` 的帮助，解决内存泄漏就会简单很多。

`Chrome` 浏览器的 `Dev Tools` 的 `Memory` 面板，有一个垃圾桶的按钮，可以强制垃圾回收（`garbage collect`）。这个按钮也能用来观察 `WeakMap` 里面的引用是否消失。

### `WeakMap` 的用途

前文说过，`WeakMap` 应用的典型场合就是 `DOM` 节点作为键名。下面是一个例子。

```javascript
let myWeakmap = new WeakMap();

myWeakmap.set(
  document.getElementById('logo'),
  {timesClicked: 0})
;

document.getElementById('logo').addEventListener('click', function() {
  let logoData = myWeakmap.get(document.getElementById('logo'));
  logoData.timesClicked++;
}, false);
```

上面代码中，`document.getElementById('logo')`是一个 `DOM` 节点，每当发生`click`事件，就更新一下状态。我们将这个状态作为键值放在` WeakMap` 里，对应的键名就是这个节点对象。一旦这个 `DOM` 节点删除，该状态就会自动消失，不存在内存泄漏风险。

`WeakMap` 的另一个用处是部署私有属性。

```javascript
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter);
    _action.set(this, action);
  }
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    counter--;
    _counter.set(this, counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'));

c.dec()
c.dec()
// DONE
```

上面代码中，`Countdown`类的两个内部属性`_counter`和`_action`，是实例的弱引用，所以如果删除实例，它们也就随之消失，不会造成内存泄漏。

## `WeakRef`

`WeakSet` 和 `WeakMap` 是基于弱引用的数据结构，[ES2021](https://github.com/tc39/proposal-weakrefs) 更进一步，提供了 WeakRef 对象，用于直接创建对象的弱引用。

```javascript
let target = {};
let wr = new WeakRef(target);
```

上面示例中，`target`是原始对象，构造函数`WeakRef()`创建了一个基于`target`的新对象`wr`。这里，`wr`就是一个 `WeakRef` 的实例，属于对`target`的弱引用，垃圾回收机制不会计入这个引用，也就是说，`wr`的引用不会妨碍原始对象`target`被垃圾回收机制清除。

`WeakRef` 实例对象有一个`deref()`方法，如果原始对象存在，该方法返回原始对象；如果原始对象已经被垃圾回收机制清除，该方法返回`undefined`。

```javascript
let target = {};
let wr = new WeakRef(target);

let obj = wr.deref();
if (obj) { // target 未被垃圾回收机制清除
  // ...
}
```

上面示例中，`deref()`方法可以判断原始对象是否已被清除。

弱引用对象的一大用处，就是作为缓存，未被清除时可以从缓存取值，一旦清除缓存就自动失效。

```javascript
function makeWeakCached(f) {
  const cache = new Map();
  return key => {
    const ref = cache.get(key);
    if (ref) {
      const cached = ref.deref();
      if (cached !== undefined) return cached;
    }

    const fresh = f(key);
    cache.set(key, new WeakRef(fresh));
    return fresh;
  };
}

const getImageCached = makeWeakCached(getImage);
```

上面示例中，`makeWeakCached()`用于建立一个缓存，缓存里面保存对原始文件的弱引用。

注意，标准规定，一旦使用`WeakRef()`创建了原始对象的弱引用，那么在本轮事件循环（`event loop`），原始对象肯定不会被清除，只会在后面的事件循环才会被清除。