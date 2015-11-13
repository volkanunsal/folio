/*globals L*/
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _utilsGetLatLon = require('../../utils/getLatLon');

var _utilsGetLatLon2 = _interopRequireDefault(_utilsGetLatLon);

var L = window.L;

exports['default'] = function (_ref) {
  var c = _ref.config;
  var o = _ref.options;

  return {
    create: function create(_ref2) {
      var ow = _ref2.owner;
      var coordinates = c.coordinates;
      var radius = c.radius;

      var latlon = _utilsGetLatLon2['default'](coordinates);
      radius = _tcomb2['default'].Number(radius);
      var e = L.circle(latlon, radius, o);
      ow.addLayer(e);
      return e;
    },
    update: function update(_ref3) {
      var e = _ref3.element;
      var coordinates = c.coordinates;
      var radius = c.radius;

      if (coordinates) {
        e.setLatLng(coordinates);
      }
      if (radius) {
        e.setRadius(radius);
      }
      return e;
    },
    remove: function remove(_ref4) {
      var e = _ref4.element;
      var ow = _ref4.owner;

      ow.removeLayer(e);
    }
  };
};

module.exports = exports['default'];