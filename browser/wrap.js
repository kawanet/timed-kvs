var TimedStorage = (function(load, defined, main, className) {
  var require = defined.require = function(name) {return defined[name]};
  if ("undefined" != typeof exports) defined[main] = exports;
  load(function(name, deps, fn) {
    defined.exports = defined[name] || (defined[name] = {});
    fn.apply(null, deps.map(require));
  });
  return defined[main][className];
})(function(define) {
  // AMD
}, {}, "timed-storage", "TimedStorage"); // END
