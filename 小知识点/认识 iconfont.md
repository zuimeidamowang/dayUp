# 认识 `iconfont`

## 1 什么是iconfont

iconfont，顾名思义，就是icon + font，即以字体的方式来显示图标，这个十分好理解，因为中文有时候也像一个个小图形。iconfont可以完美解决以上的问题，并具有以下的优点

1. 由于请求的是一整个文件字体，所以减少了http的请求
2. 可以像字体一样，任意变换大小和颜色；
3. 矢量图，不会发生放大模糊的问题
4. 结合CSS3的text-shadow，transform这些功能可以给字体添加一些旋转，阴影和透明度的视觉特效。
5. 强兼容性，他的实现方式是使用CSS3的font-face, 但是这个属性从IE4开始就支持，可以完美适配IE6及以上的浏览器。

## 2 字体格式 —— .eot、.woff、.ttf、.svg

### 2.1 概述

在阿里图标库中下载图标到本地后，目录结构如下：

 

![img](https://upload-images.jianshu.io/upload_images/6693922-ca950bfdfcb106ab.png)

图标库下载到本地目录结构

第一次看到这几个文件时，不知道有什么用，可能会直接删除，但万万不可，打开 iconfont.css 文件可以在 @font-face 中都有引用这几个文件。查询资料后得知：虽然现代浏览器支持自定义字体样式，并且可以通过 @font-face 引入自定义的字体，但是各个浏览器对于字体样式是存在兼容性问题的，而这几个文件就是分别处理对应浏览兼容性问题的。

### 2.2 字体格式介绍

目前最主要的几种网络字体(web font)格式包括WOFF，SVG，EOT，OTF/TTF。

+ WOFF: WOFF是Web Open Font Format几个词的首字母简写。这种字体格式专门用于网上，由Mozilla联合其它几大组织共同开发。WOFF字体通常比其它字体加载的要快些，因为使用了OpenType (OTF)和TrueType (TTF)字体里的存储结构和压缩算法。这种字体格式还可以加入元信息和授权信息。这种字体格式有君临天下的趋势，因为所有的现代浏览器都开始支持这种字体格式。【支持的浏览器：IE9+,Firefox3.5+,Chrome6+,Safari3.6+,Opera11.1+】

+ SVG / SVGZ: Scalable Vector Graphics (Font). SVG是一种用矢量图格式改进的字体格式，体积上比矢量图更小，适合在手机设备上使用。【支持的浏览器：Chrome4+,Safari3.1+,Opera10.0+,iOS Mobile Safari3.2+】

+ EOT: Embedded Open Type。这是微软创造的字体格式。这种格式只在IE6-IE8里使用。【支持的浏览器：IE4+】

+ OTF / TTF: OpenType Font 和 TrueType Font。部分的因为这种格式容易被复制(非法的)，这才催生了WOFF字体格式。然而，OpenType有很多独特的地方，受到很多设计者的喜爱。【支持的浏览器：IE9+,Firefox3.5+,Chrome4+,Safari3+,Opera10+,iOS Mobile Safari4.2+】

## 3 使用 @font-face 引入字体格式

因为各个浏览器对字体格式的不兼容，作为前端开发人员，我们需要考虑的全面性，将各个格式的字体都引入进来，这样就不怕刁钻的用户使用哪种浏览器了。

常见兼容性写法：

```
@font-face {
  font-family: 'yourfontname';
  src: url('../fonts/singlemalta-webfont.eot');
  src: url('../fonts/singlemalta-webfont.eot?#iefix') format('embedded-opentype'),
       url('../fonts/singlemalta-webfont.woff') format('woff'),
       url('../fonts/singlemalta-webfont.ttf') format('truetype'),
       url('../fonts/singlemalta-webfont.svg#defineName') format('svg');
  font-weight: normal;
  font-style: normal;
}
```

如果你是使用 Iconfont 下载字体到本地，那么恭喜你，打开 iconfont.css 文件，可以看到 Iconfont 已经帮助你配好了这些内容，你只需要在页面中引入 iconfont.css 即可直接使用。