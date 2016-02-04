/*globals L*/
'use strict';

exports.__esModule = true;

exports['default'] = function (_ref) {
  var c = _ref.config;
  var o = _ref.options;

  return {
    create: function create(_ref2) {
      var ow = _ref2.owner;
      var geojson = c.geojson;

      var e = L.geoJson(geojson, o);
      ow.addLayer(e);
      if (o.clickable) {
        e.on('click', function (e) {
          return ow.fire('click', e);
        });
      }
      return e;
    },
    update: function update(_ref3) {
      var e = _ref3.element;
      var geojson = c.geojson;

      if (geojson) {
        e.addData(geojson);
        e.bringToBack();
      }
    },
    remove: function remove(_ref4) {
      var e = _ref4.element;
      var ow = _ref4.owner;

      ow.removeLayer(e);
    }
  };
};

module.exports = exports['default'];