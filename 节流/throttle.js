function throttle (func, delay, immediate) {
  var timer;
  return function () {
    const context = this;
    const arg = arguments;
    if(immediate) {
      if(timer === null) {
        timer = setTimeout(() => {
          timer = undefined;
          func.apply(context, arg);
        }, delay);
      }
      else if(timer === undefined){
        func.apply(context);
        timer = null;
      }
    }
    else {
      if(!timer) {
        timer = setTimeout(() => {
          timer = null;
          func.apply(context, arg);
        }, delay);
      }
    };
  };
};