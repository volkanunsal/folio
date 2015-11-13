/*globals L*/

"use strict";

exports.__esModule = true;
exports["default"] = lbounds;
var L = window.L;

function lbounds(u) {
  return new L.LatLngBounds([[u[1], u[0]], [u[3], u[2]]]);
}

module.exports = exports["default"];