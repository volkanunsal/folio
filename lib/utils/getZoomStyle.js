/*eslint no-eval: 0*/
'use strict';

exports.__esModule = true;
exports['default'] = getZoomStyle;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

function getZoomStyle(zoom, styles) {
  var style = undefined;
  Object.keys(_tcomb2['default'].Object(styles)).forEach(function (key) {
    var digs = parseInt(key.match(/\d+/)[0], 10);
    var chars = key.match(/\W+/);
    chars = chars ? chars[0] : '===';
    if (digs && chars && eval(zoom + chars + digs)) {
      style = styles[key];
    }
  });
  return _tcomb2['default'].Object(style);
}

module.exports = exports['default'];