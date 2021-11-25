/**
 * 1. 递归
 */
function flat(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flat(arr[i]));
    }
    else {
      result.push(arr[i]);
    }
  }
  return result;
}

/**
 * 2. toString
 * 用场有限，类似 [1, '1', 2, '2'] 就会改变。因为我们要的是[1, '1', 2, '2']， 但是结果是[1, 1, 2, 2]。
 */
function flat2(arr) {
  return arr.toString().split(',').map(Number);
}

/**
 * 3. 使用拓展运算符
 * 因为 ... 每次只能扁平一层，所以这里做一个判断，每当该数组的元素中还有数组时，就继续运行一遍。
 */
function flat3(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
}

/**
 * 同时绑定调用的方法和调用的主体，只留下一个参数的位置
 * 这个只能处理第一层扁平。
 */
flat4 = Function.apply.bind([].concat, []);

/*
// 相当于
function(arg) {
  return Function.apply.call([].concat, [], arg)
}
// 相当于
function(arg) {
  return [].concat.apply([], arg)
}
// 相当于
function (arg) {
  return [].concat(...arg)
} 
*/