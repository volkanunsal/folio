"use strict";

exports.__esModule = true;
exports["default"] = utfDecode;

function utfDecode(C) {
  var c = C;
  if (c >= 93) {
    c--;
  }
  if (c >= 35) {
    c--;
  }
  return c - 32;
}

module.exports = exports["default"];