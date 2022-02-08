# [Cypress 扫盲](http://conf.ctripcorp.com/pages/viewpage.action?pageId=908544283)

## 1. 常用方法

```
  cy.wait(time)       设置等待时间,等待数毫秒或等待别名资源解析后，再继续执行下一个命令
  cy.get(dom)         获取指定dom,定位元素，用css selector定位选择器
  cy.click()          模拟点击事件
  cy.visit(path)      模拟路由跳转
  cy.find(dom)        精确找到指定元素
  cy.eq(num)          找到指定dom符合num的下标的dom
  cy.fixture(file)    获取模拟数据
  cy.Commands.add(name, callbackFn)           添加自定义方法
  cy.Commands.add(name, options, callbackFn) 添加自定义方法
  cy.Commands.overwrite(name, callbackFn)    添加自定义方法
  cy.reaload()        等同于f5
  cy.radload(true)    等同于ctrl+F5强制刷新
  cy.request()        发起HTTP请求
  cy.type()           给input赋值
  Cypress.env()       获取所有环境变量
  Cypress.env(key)    获取指定环境变量
  cy.should()         断言，hava.value 是元素的value属性值，判断是否为‘某个值’
  cy.get('[aria-label="上个月"]', { timeout: 3000 })  根据属性值获取dom
```

## 2. 默认文件结构

在使用 cypress open 命令首次打开 Cypress，Cypress 会自动进行初始化配置并**生成一个默认的文件夹结构**，如下图

![](https://github.com/zuimeidamowang/dayUp/blob/a68562c9f8d0e5296d363953671645164ccdc0d6/Cypress/WechatIMG83.jpeg)

### 前言

这里先介绍文件结构中每种文件的作用是啥，后面再具体写代码的栗子



### fixtures 测试夹具

#### 简介

- 测试夹具通常配合 cy.fixture() 使用
- 主要用来**存储**测试用例的**外部静态数据**
- fixtures 默认就在 cypress/fixtures 目录下，但也可以配置到另一个目录



#### 外部静态数据的详解

- 测试夹具的静态数据通常存储在 .json 文件中
- 静态数据通常是某个**网络请求对应的响应部分**，包括HTTP状态码和返回值，一般是复制过来更改而不是自己手工填写



#### fixtures 的实际应用场景

如果你的测试需要对某些**外部接口**进行访问并**依赖它的返回值**，则可以使用测试夹具而无须真正访问这个接口**（有点类似 mock）**



#### 使用测试夹具的好处

- 消除了对外部功能模块的依赖
- 已编写的测试用例可以使用测试夹具**提供的固定返回值**，并且你确切知道这个返回值是你想要的
- 因为无须真正地发送网络请求，所以测试更快



#### 命令示例

要查看 Cypress 中每个命令的示例，可以打开 cypress/integration/examples ，里面都是官方提供的栗子



### test file 测试文件

#### 简介

测试文件就是**测试用例**，默认位于 cypress/integration ，但也可以配置到另一个目录



#### 测试文件格式

所有在 integration 文件下，且文件格式是以下的文件都将被 Cypress 识别为测试文件

- .js ：普通的JavaScript 编写的文件
- .jsx ：带有扩展的 JavaScript 文件，其中可以包含处理 XML 的 ECMAScript
- .coffee ：一套 JavaScript 转译的语言。有更严格的语法
- .cjsx ：CoffeeScript 中的 jsx 文件

创建好后，Cypress 的 Test Runner 刷新之后就可以看到对应测试文件了



### plugin file 插件文件

#### 前言

- Cypress 独有优点就是**测试代码运行在浏览器之内**，使得 Cypress 跟其他的测试框架相比，有显著的架构优势
- 这优点虽然提供了可靠性测试，但也使得和在浏览器之外进行通信更加困难**【痛点：和外部通信困难】**



#### 插件文件的诞生

- Cypress 为了解决上述痛点提供了一些现成的插件，使你可以**修改或扩展 Cypress 的内部行为**（如：动态修改配置信息和环境变量等），也可以自定义自己的插件
- 默认情况，插件位于 cypress/plugins/index.js 中，但可以配置到另一个目录
- 为了方便，每个**测试文件运行之前**，Cypress 都会**自动加载插件文件** cypress/plugins/index.js



#### 插件的应用场景　　

- 动态更改来自 cypress.json，cypress.env.json，CLI或系统环境变量的**已解析配置和环境变量**
- 修改特定浏览器的启动参数
- 将消息直接从测试代码传递到后端

后面再详解插件在项目中的实际运用



### support file 支持文件

#### 简介

- 支持文件目录是放置可重用配置项，如**底层通用函数或全局默认配置**
- 支持文件默认位于 cypress/support/index.js 中，但可以配置到另一个目录
- 为了方便，每个**测试文件运行之前**，Cypress 都会**自动加载支持文件** cypress/support/index.js

## 3 Cypress运行流程

![](https://github.com/zuimeidamowang/dayUp/blob/a68562c9f8d0e5296d363953671645164ccdc0d6/Cypress/WechatIMG84.png)

1. 运行测试后，Cypress 使用 **webpack** 将测试代码中的**所有模块 bundle** 到一个 js 文件中
2. 每次测试首次加载 Cypress 时，内部 Cypress Web 应用程序先把自己**托管**在本地的一个随机端口上**【如：[http://localhost:65874](http://localhost:65874/)】**
3. 然后，运行浏览器，并且将测试代码注入到一个空白页中，然后它将在浏览器中运行测试代码【**可以理解成：**Cypress 将测试代码放到一个 **iframe** 中运行】
4. 在识别出测试中发出的第一个 cy.visit() 命令后，Cypress 会更改本地 URL 以匹配你远程应用程序的 Origin**【满足同源策略】**，这使得你的**测试代码和应用程序**可以在**同一个 Run Loop 中运行**

### 速度快，稳定

- Cypress 测试代码和应用程序均运行在由 Cypress 全权控制的浏览器中
- 且它们运行**在同一个Domain 下的不同 iframe 中**，所以 Cypress 的测试代码可以直接操作 DOM、Window Objects、Local Storages而**无须通过网络访问**

- Cypress 还可以在网络层进行**即时读取和更改网络流量**的操作
- Cypress 背后是 **Node.js Process 控制的 Proxy 进行转发**，这使得 Cypress 不仅可以修改进出浏览器的所有内容，还可以更改可能影响自动化操作的代码
- Cypress 相对于其他测试工具来说，能从根本上**控制整个自动化测试的流程**
