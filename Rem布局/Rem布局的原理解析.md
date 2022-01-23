# Rem布局的原理解析

## 什么是Rem

rem和em很容易混淆，其实两个都是css的单位，并且也都是相对单位，现有的em，css3才引入的rem，在介绍rem之前，我们先来了解下em

> em作为font-size的单位时，其代表父元素的字体大小，em作为其他属性单位时，代表自身字体大小——MDN

问s1、s2、s5、s6的`font-size`和`line-height`分别是多少px，先来想一想，结尾处有答案和解释

```
<div class="p1">
    <div class="s1">1</div>
    <div class="s2">1</div>
</div>
<div class="p2">
    <div class="s5">1</div>
    <div class="s6">1</div>
</div>
.p1 {font-size: 16px; line-height: 32px;}
.s1 {font-size: 2em;}
.s2 {font-size: 2em; line-height: 2em;}

.p2 {font-size: 16px; line-height: 2;}
.s5 {font-size: 2em;}
.s6 {font-size: 2em; line-height: 2em;}
```

em可以让我们的页面更灵活，更健壮，比起到处写死的px值，em似乎更有张力，改动父元素的字体大小，子元素会等比例变化，这一变化似乎预示了无限可能

有些人提出用em来做弹性布局页面，但其复杂的计算让人诟病，甚至有人专门做了个px和em的[计算器](https://vasilis.nl/nerd/code/emcalc/)，不同节点像素值对应的em值，o(╯□╰)o

![img](https://yanhaijing.com/blog/519.png)

em做弹性布局的缺点还在于牵一发而动全身，一旦某个节点的字体大小发生变化，那么其后代元素都得重新计算，X﹏X

> rem作用于非根元素时，相对于根元素字体大小；rem作用于根元素字体大小时，相对于其出初始字体大小——MDN

rem取值分为两种情况，设置在根元素时和非根元素时，举个例子

```
/* 作用于根元素，相对于原始大小（16px），所以html的font-size为32px*/
html {font-size: 2rem}

/* 作用于非根元素，相对于根元素字体大小，所以为64px */
p {font-size: 2rem}
```

rem有rem的优点，em有em的优点，尺有所短，寸有所长，我一直不觉得技术没有什么对错，只有适合不适合，有对错的是使用技术的人，杰出与优秀的区别就在于能否选择合适的技术，并让其发挥优势

我一直觉得em就是为字体和行高而生的，有些时候子元素字体就应该相对于父元素，元素行高就应该相对于字体大小；而rem的有点在于统一的参考系