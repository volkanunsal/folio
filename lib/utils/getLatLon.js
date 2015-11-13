/*globals L*/
'use strict';

exports.__esModule = true;
exports['default'] = getLatLon;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

function getLatLon(coordinates) {
  return _tcomb2['default'].Array.is(coordinates) ? L.latLng(coordinates) : coordinates;
}

module.exports = exports['default'];