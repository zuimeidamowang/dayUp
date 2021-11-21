function debounce (func, delay, immediate) {
  var timer;
  return function () {
    const context = this;
    const arg = arguments;
    timer && clearTimeout(timer);
    if(immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      callNow && func.apply(context, arg);
    }
    else {
      timer = setTimeout(() => {
        func.apply(context, arg);
      }, delay);
    };
  };
};