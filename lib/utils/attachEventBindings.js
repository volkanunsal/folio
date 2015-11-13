"use strict";

exports.__esModule = true;
exports["default"] = attachEventBindings;

function attachEventBindings(obj, element, map) {
  Object.keys(obj).forEach(function (k) {
    var callback = obj[k];
    // Detach the event binding (if it exists).
    element.off(k).on(k, function (e) {
      return callback({ e: e, element: element, map: map });
    });
  });
}

module.exports = exports["default"];