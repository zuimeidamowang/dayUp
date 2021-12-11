# JavaScript中的对象的属性描述符

- Configurable(可配置性)

可配置性决定是否可以使用delete删除属性，以及是否可以修改属性描述符的特性，默认值为true

- Enumerable(可枚举性)

可枚举性决定属性是否出现在对象的属性枚举中，比如是否可以通过for-in循环返回该属性，默认值为true

- Writable(可写性)

可写性决定是否可以修改属性的值，默认值为true

- Value(属性值)

属性值包含这个属性的数据值，读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。默认值为undefined

- getter

在读取属性时调用的函数。默认值为undefined

- setter

在写入属性时调用的函数。默认值为undefined