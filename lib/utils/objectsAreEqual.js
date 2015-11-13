'use strict';

exports.__esModule = true;
exports['default'] = objectsAreEqual;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _removeKeysWithFunctionValues = require('./removeKeysWithFunctionValues');

var _removeKeysWithFunctionValues2 = _interopRequireDefault(_removeKeysWithFunctionValues);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function objectsAreEqual(a, b) {
  return _deepEqual2['default'].apply(undefined, [a, b].map(function (o) {
    return _removeKeysWithFunctionValues2['default'](o);
  }).concat([{ strict: true }]));
}

module.exports = exports['default'];