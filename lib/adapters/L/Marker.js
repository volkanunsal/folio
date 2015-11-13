/*globals L*/
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var L = window.L;

exports['default'] = function (_ref) {
  var c = _ref.config;
  var o = _ref.options;

  return {
    create: function create(_ref2) {
      var ow = _ref2.owner;
      var coordinates = c.coordinates;

      var e = L.marker(L.latLng(coordinates), o);
      ow.addLayer(e);
      return e;
    },
    update: function update(_ref3) {
      var e = _ref3.element;
      var coordinates = c.coordinates;

      e.setLatLng(coordinates);
      if (o) {
        if (_tcomb2['default'].Number.is(o.opacity)) {
          e.setOpacity(o.opacity);
        }
        if (o.icon) {
          e.setIcon(o.icon);
        }
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