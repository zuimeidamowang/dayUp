Function.prototype.myCall = function (context, ...args) {
  context = context || window;
  context.fnc = this;
  const result = context.fuc(...args);
  delete context.fnc;
  return result;
};