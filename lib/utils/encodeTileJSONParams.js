/*globals encodeURIComponent*/
'use strict';

exports.__esModule = true;
exports['default'] = encodeTileJSONParams;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

function encodeTileJSONParams(params, _included) {
  if (!params) {
    return '';
  }
  var urlParams = [];
  var included = _included || Object.keys(params);
  for (var i in included) {
    if (!included.hasOwnProperty(i)) {
      continue;
    }
    var k = included[i];
    var p = params[k];
    if (p) {
      if (_tcomb2['default'].Array.is(p)) {
        var j = 0;
        var len = p.length;
        while (j < len) {
          urlParams.push(k + '[]=' + encodeURIComponent(p[j]));
          j++;
        }
      } else {
        var q = encodeURIComponent(p);
        q = q.replace(/%7Bx%7D/g, '{x}').replace(/%7By%7D/g, '{y}').replace(/%7Bz%7D/g, '{z}');
        urlParams.push(k + '=' + q);
      }
    }
  }
  return urlParams.join('&');
}

module.exports = exports['default'];