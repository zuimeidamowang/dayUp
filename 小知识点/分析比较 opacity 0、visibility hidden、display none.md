# 分析比较 `opacity: 0`、`visibility: hidden`、`display: none`

## `DOM`结构

1. `display: none `(不占空间，不能点击)（场景，显示出原来这里不存在的结构）
2. `visibility: hidden`（占据空间，不能点击）（场景：显示不会导致页面结构发生变动，不会撑开）
3. `opacity: 0`（占据空间，可以点击）（场景：可以跟`transition`搭配）

## 性能方面

1. `display: none` 会回流操作 性能开销较大
2. `visibility: hidden` 是重回操作 比回流操作性能高一些，（回流会计算相邻元素甚至组先级元素的位置，属性等）
3. `opacity: 0` 重建图层，性能较高

## 继承

1. `display: none` 不会被子元素继承，毕竟子类也不会被渲染
2. `visibility: hidden` 会被子元素继承，子元素可以通过设置 `visibility: visible;` 来取消隐藏；
3. `opacity: 0` 会被子元素继承,且，子元素并不能通过 `opacity: 1` 来取消隐藏；