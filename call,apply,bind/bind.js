Function.prototype.bind = function (context, ...args) {
  const fnc = this;
  context = context || window;
  return function () {
    return fnc.apply(context, ...args);
  };
};