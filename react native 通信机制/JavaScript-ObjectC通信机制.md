# `JavaScript-ObjectC`通信机制(以下简称`JS/OC`)

## 1 概括

`React Native`用`iOS`自带的`JavaScriptCore`作为`JS`的解析引擎，但并没有用到`JavaScriptCore`提供的一些可以让`JS`与`OC`互调的特性，而是自己实现了一套机制，这套机制可以通用于所有`JS`引擎上，在没有`JavaScriptCore`的情况下也可以用`webview`代替，实际上项目里就已经有了用`webview`作为解析引擎的实现，应该是用于兼容`iOS7`以下没有`JavaScriptCore`的版本。

普通的`JS-OC`通信实际上很简单，`OC`向`JS`传信息有现成的接口，像`webview`提供的-`stringByEvaluatingJavaScriptFromString`方法可以直接在当前`context`上执行一段JS脚本，并且可以获取执行后的返回值，这个返回值就相当于`JS`向`OC`传递信息。`React Native`也是以此为基础，通过各种手段，实现了在`OC`定义一个模块方法，JS可以直接调用这个模块方法并还可以无缝衔接回调。

![](https://github.com/zuimeidamowang/dayUp/blob/28f633d9513a24513949209cea39211aece886cd/react%20native%20%E9%80%9A%E4%BF%A1%E6%9C%BA%E5%88%B6/react%20native%20%E9%80%9A%E4%BF%A1%E6%9C%BA%E5%88%B61.jpeg)

`OC`端和`JS`端分别各有一个`bridge`，两个`bridge`都保存了同样一份模块配置表，`JS`调用`OC`模块方法时，通过`bridge`里的配置表把模块方法转为模块`ID`和方法`ID`传给`OC`，`OC`通过`bridge`的模块配置表找到对应的方法执行之。

## 2 调用流程

![](https://github.com/zuimeidamowang/dayUp/blob/28f633d9513a24513949209cea39211aece886cd/react%20native%20%E9%80%9A%E4%BF%A1%E6%9C%BA%E5%88%B6/react%20native%20%E9%80%9A%E4%BF%A1%E6%9C%BA%E5%88%B62.jpeg)

1. `JS`端调用某个`OC`模块暴露出来的方法。

2. 把上一步的调用分解为`ModuleName`,`MethodName`,`arguments`，再扔给`MessageQueue`处理。在初始化时模块配置表上的每一个模块都生成了对应的`remoteModule`对象，对象里也生成了跟模块配置表里一一对应的方法，这些方法里可以拿到自身的模块名，方法名，并对`callback`进行一些处理，再移交给`MessageQueue`。具体实现在`BatchedBridgeFactory.js`的[`_createBridgedModule`](https://github.com/facebook/react-native/blob/72d3d724a3a0c6bc46981efd0dad8f7f61121a47/Libraries/BatchedBridge/BatchingImplementation/BatchedBridgeFactory.js#L37)里，整个实现区区24行代码，感受下`JS`的魔力吧。

3. 在这一步把`JS`的`callback`函数缓存在`MessageQueue`的一个成员变量里，用`CallbackID`代表`callback`。在通过保存在`MessageQueue`的模块配置表把上一步传进来的`ModuleName`和`MethodName`转为`ModuleID`和`MethodID`。

4. 把上述步骤得到的`ModuleID`,`MethodId`,`CallbackID`和其他参数`argus`传给`OC`。至于具体是怎么传的，后面再说。

5. `OC`接收到消息，通过模块配置表拿到对应的模块和方法。实际上模块配置表已经经过处理了，跟`JS`一样，在初始化时`OC`也对模块配置表上的每一个模块生成了对应的实例并缓存起来，模块上的每一个方法也都生成了对应的`RCTModuleMethod`对象，这里通过`ModuleID`和`MethodID`取到对应的`Module`实例和[`RCTModuleMethod`](https://github.com/facebook/react-native/blob/72d3d724a3a0c6bc46981efd0dad8f7f61121a47/React/Base/RCTBridge.m#L111)实例进行调用。具体实现在`_handleRequestNumber:moduleID:methodID:params:`。

6. `RCTModuleMethod`对`JS`传过来的每一个参数进行处理。`RCTModuleMethod`可以拿到`OC`要调用的目标方法的每个参数类型，处理`JS`类型到目标类型的转换，所有JS传过来的数字都是`NSNumber`，这里会转成对应的`int/long/double`等类型，更重要的是会为`block`类型参数的生成一个`block`。例如`-(void)select:(int)index response:(RCTResponseSenderBlock)callback `这个方法，拿到两个参数的类型为`int,block`，`JS`传过来的两个参数类型是`NSNumber`,`NSString(CallbackID)`，这时会把`NSNumber`转为`int`，`NSString(CallbackID)`转为一个`block`，`block`的内容是把回调的值和`CallbackID`传回给`JS`。这些参数组装完毕后，通过`NSInvocation`动态调用相应的`OC`模块方法。

7. `OC`模块方法调用完，执行`block`回调。

8. 调用到第6步说明的`RCTModuleMethod`生成的`block`。

9. `block`里带着`CallbackID`和`block`传过来的参数去调`JS`里`MessageQueue`的方法`invokeCallbackAndReturnFlushedQueue`。

10. `MessageQueue`通过`CallbackID`找到相应的`JS callback`方法。

11. 调用`callback`方法，并把`OC`带过来的参数一起传过去，完成回调。

整个流程就是这样，简单概括下，差不多就是：`JS`函数调用转`ModuleID/MethodID` ->` callback`转`CallbackID`-> `OC`根据`ID`拿到方法 -> 处理参数 -> 调用`OC`方法 -> 回调`CallbackID` ->` JS`通过`CallbackID`拿到`callback`执行。

## 3 事件响应

`JS`是怎样把数据传给`OC`，让`OC`去调相应方法的？

答案是通过返回值。`JS`不会主动传递数据给`OC`，在调`OC`方法时，会在上述第4步把`ModuleID,MethodID`等数据加到一个队列里，等`OC`过来调`JS`的任意方法时，再把这个队列返回给`OC`，此时`OC`再执行这个队列里要调用的方法。

一开始不明白，设计成JS无法直接调用`OC`，需要在`OC`去调`JS`时才通过返回值触发调用，整个程序还能跑得通吗。后来想想纯`native`开发里的事件响应机制，就有点理解了。`native`开发里，什么时候会执行代码？只在有事件触发的时候，这个事件可以是启动事件，触摸事件，`timer`事件，系统事件，回调事件。而在`React Native`里，这些事件发生时`OC`都会调用`JS`相应的模块方法去处理，处理完这些事件后再执行`JS`想让`OC`执行的方法，而没有事件发生的时候，是不会执行任何代码的，这跟`native`开发里事件响应机制是一致的。

说到`OC`调用`JS`，再补充一下，实际上模块配置表除了有上述`OC`的模块`remoteModules`外，还保存了`JS`模块`localModules`，`OC`调`JS`某些模块的方法时，也是通过传递`ModuleID和MethodID`去调用的，都会走到[`-enqueueJSCall:args:`](https://github.com/facebook/react-native/blob/72d3d724a3a0c6bc46981efd0dad8f7f61121a47/React/Base/RCTBridge.m#L641)方法把两个`ID`和参数传给`JS`的[`BatchedBridge.callFunctionReturnFlushedQueue`](https://github.com/facebook/react-native/blob/72d3d724a3a0c6bc46981efd0dad8f7f61121a47/Libraries/Utilities/MessageQueue.js#L298)，跟`JS`调`OC`原理差不多，就不再赘述了。

