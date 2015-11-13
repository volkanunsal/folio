'use strict';

exports.__esModule = true;
exports['default'] = removeKeysWithFunctionValues;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

function removeKeysWithFunctionValues(options) {
  if (!_tcomb2['default'].Object.is(options)) {
    return options;
  }
  var nextOptions = {};
  Object.keys(options).forEach(function (key) {
    if (!_tcomb2['default'].Function.is(options[key])) {
      nextOptions[key] = options[key];
    }
  });
  return nextOptions;
}

module.exports = exports['default'];