"use strict";

exports.__esModule = true;
exports["default"] = getFirstDupInArray;

function getFirstDupInArray(arr) {
  var map = {};
  var size = arr.length;
  for (var i = 0; i < size; i++) {
    if (map[arr[i]]) {
      return arr[i];
    }
    map[arr[i]] = true;
  }
  return false;
}

module.exports = exports["default"];