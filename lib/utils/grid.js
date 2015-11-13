'use strict';

exports.__esModule = true;
exports['default'] = grid;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utfDecode = require('./utfDecode');

var _utfDecode2 = _interopRequireDefault(_utfDecode);

function grid(data) {
  return function (x, y) {
    if (!data) {
      return '';
    }
    var idx = _utfDecode2['default'](data.grid[y].charCodeAt(x));
    var key = data.keys[idx];
    return data.data[key];
  };
}

module.exports = exports['default'];