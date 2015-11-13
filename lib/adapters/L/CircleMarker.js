/*globals L*/
'use strict';

exports.__esModule = true;

var _defaultZoomStyles;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetZoomStyle = require('../../utils/getZoomStyle');

var _utilsGetZoomStyle2 = _interopRequireDefault(_utilsGetZoomStyle);

var _utilsGetLatLon = require('../../utils/getLatLon');

var _utilsGetLatLon2 = _interopRequireDefault(_utilsGetLatLon);

var L = window.L;

var defaultZoomStyles = (_defaultZoomStyles = {}, _defaultZoomStyles['<=11'] = { radius: 1, weight: 0 }, _defaultZoomStyles[12] = { radius: 4, weight: 0 }, _defaultZoomStyles[13] = { radius: 4, weight: 0 }, _defaultZoomStyles[14] = { radius: 4, weight: 1 }, _defaultZoomStyles[15] = { radius: 4, weight: 4 }, _defaultZoomStyles[16] = { radius: 6, weight: 5 }, _defaultZoomStyles[17] = { radius: 8, weight: 7 }, _defaultZoomStyles['>=18'] = { radius: 10, weight: 8 }, _defaultZoomStyles);

exports['default'] = function (_ref) {
  var c = _ref.config;
  var o = _ref.options;

  return {
    create: function create(_ref2) {
      var ow = _ref2.owner;
      var coordinates = c.coordinates;

      var latlon = _utilsGetLatLon2['default'](coordinates);
      var e = L.circleMarker(latlon, o);
      var zoomStyles = o.zoomStyles;

      ow.addLayer(e);
      // Listen to zoom level changes on the map. Update the styles of the marker if zoom level has a style.
      ow.on('zoomend', function () {
        var curLevelStyles = _utilsGetZoomStyle2['default'](ow.getZoom(), zoomStyles || defaultZoomStyles);
        e.setStyle(curLevelStyles);
      });
      return e;
    },
    update: function update(_ref3) {
      var e = _ref3.element;
      var coordinates = c.coordinates;

      var latlon = _utilsGetLatLon2['default'](coordinates);
      e.setLatLng(latlon);
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