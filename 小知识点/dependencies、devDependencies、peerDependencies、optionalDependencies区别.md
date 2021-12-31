# dependencies、devDependencies、peerDependencies、optionalDependencies区别

在一个[Node.js](https://so.csdn.net/so/search?q=Node.js)项目中，**package.json**几乎是一个必须的文件，它的主要作用就是管理项目中所使用到的外部依赖包，同时它也是**npm**命令的入口文件。

## **npm** 目前支持以下几类依赖包管理：

- dependencies
- devDependencies
- peerDependencies
- optionalDependencies
- bundledDependencies / bundleDependencies

如果你想使用哪种依赖管理，那么你可以将它放在[package](https://so.csdn.net/so/search?q=package).json中对应的依赖对象中，比如：

```json
"devDependencies": {
    "fw2": "^0.3.2",
    "grunt": "^1.0.1",
    "webpack": "^3.6.0"
  },
  "dependencies": {
    "gulp": "^3.9.1",
    "hello-else": "^1.0.0"
  },
  "peerDependencies": { },
  "optionalDependencies": { },
  "bundledDependencies": []  
```

## dependencies

应用依赖，或者叫做业务依赖，这是我们最常用的依赖包管理对象！它用于指定应用依赖的外部包，这些依赖是应用发布后正常执行时所需要的，但不包含测试时或者本地打包时所使用的包。可使用下面的命令来安装：

```css
npm install packageName --save
```

**dependencies**是一个简单的JSON对象，包含**包名**与**包版本**，其中**包版本**可以是版本号或者URL地址。比如：

```perl
{ 
  "dependencies" :{ 
    "foo" : "1.0.0 - 2.9999.9999", // 指定版本范围
    "bar" : ">=1.0.2 <2.1.2", 
    "baz" : ">1.0.2 <=2.3.4", 
    "boo" : "2.0.1", // 指定版本
    "qux" : "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0", 
    "asd" : "http://asdf.com/asdf.tar.gz", // 指定包地址
    "til" : "~1.2",  // 最近可用版本
    "elf" : "~1.2.3", 
    "elf" : "^1.2.3", // 兼容版本
    "two" : "2.x", // 2.1、2.2、...、2.9皆可用
    "thr" : "*",  // 任意版本
    "thr2": "", // 任意版本
    "lat" : "latest", // 当前最新
    "dyl" : "file:../dyl", // 本地地址
    "xyz" : "git+ssh://git@github.com:npm/npm.git#v1.0.27", // git 地址
    "fir" : "git+ssh://git@github.com:npm/npm#semver:^5.0",
    "wdy" : "git+https://isaacs@github.com/npm/npm.git",
    "xxy" : "git://github.com/npm/npm.git#v1.0.27",
  }
}
```

## devDependencies

开发环境依赖，仅次于**dependencies**的使用频率！它的对象定义和**dependencies**一样，只不过它里面的包只用于开发环境，不用于生产环境，这些包通常是单元测试或者打包工具等，例如**gulp, grunt, webpack, moca, coffee**等，可使用以下命令来安装：

```css
npm install packageName --save-dev
```

举个栗子：

```json
{ "name": "ethopia-waza",
  "description": "a delightfully fruity coffee varietal",
  "version": "1.2.3",
  "devDependencies": {
    "coffee-script": "~1.6.3"
  },
  "scripts": {
    "prepare": "coffee -o lib/ -c src/waza.coffee"
  },
  "main": "lib/waza.js"
}
```

prepare脚本会在发布前运行，因此使用者在编译项目时不用依赖它。在开发模式下，运行npm install, 同时也会执行prepare脚本，开发时可以很容易的测试。

## peerDependencies

同等依赖，或者叫同伴依赖，用于指定当前包（也就是你写的包）兼容的宿主版本。如何理解呢？ 试想一下，我们编写一个gulp的插件，而gulp却有多个主版本，我们只想兼容最新的版本，此时就可以用同等依赖（**peerDependencies**）来指定：

```json
{
  "name": "gulp-my-plugin",
  "version": "0.0.1",
  "peerDependencies": {
    "gulp": "3.x"
  }
}
```

当别人使用我们的插件时，**peerDependencies**就会告诉明确告诉使用方，你需要安装该插件哪个宿主版本。

## optionalDependencies

可选依赖，如果有一些依赖包即使安装失败，项目仍然能够运行或者希望npm继续运行，就可以使用**optionalDependencies**。另外**optionalDependencies**会覆盖**dependencies**中的同名依赖包，所以不要在两个地方都写。

举个栗子，可选依赖包就像程序的插件一样，如果存在就执行存在的逻辑，不存在就执行另一个逻辑。

```javascript
try {
  var foo = require('foo')
  var fooVersion = require('foo/package.json').version
} catch (er) {
  foo = null
}
if ( notGoodFooVersion(fooVersion) ) {
  foo = null
}
 
// .. then later in your program ..
 
if (foo) {
  foo.doFooThings()
}
```

## bundledDependencies / bundleDependencies

打包依赖，**bundledDependencies**是一个包含依赖包名的数组对象，在发布时会将这个对象中的包打包到最终的发布包里。如：

```json
{
  "name": "fe-weekly",
  "description": "ELSE 周刊",
  "version": "1.0.0",
  "main": "index.js",
  "devDependencies": {
    "fw2": "^0.3.2",
    "grunt": "^1.0.1",
    "webpack": "^3.6.0"
  },
  "dependencies": {
    "gulp": "^3.9.1",
    "hello-else": "^1.0.0"
  },
  "bundledDependencies": [
    "fw2",
    "hello-else"
  ]
}
```

执行打包命令**npm pack**, 在生成的**fe-weekly-1.0.0.tgz**包中，将包含**fw2**和**hello-else**。 但是值得注意的是，这两个包必须先在**devDependencies**或**dependencies**声明过，否则打包会报错。