Function.prototype.myApply = function(context, args = []) {
  context = context || window;
  context.fnc = this;
  const result = context.fnc(...args);
  delete context.func;
  return result;
};