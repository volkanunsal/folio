/*globals L*/
'use strict';

exports.__esModule = true;

var _pluginsTileJSONLayer = require('./plugins/TileJSONLayer');

var L = window.L;

exports['default'] = function (_ref) {
  var c = _ref.config;
  var o = _ref.options;

  return {
    create: function create(_ref2) {
      var ow = _ref2.owner;
      var url = c.url;
      var json = c.json;

      var e = undefined;
      if (url.match(/\{x\}/)) {
        e = L.tileLayer(url, o);
      } else {
        e = _pluginsTileJSONLayer.tileJSON({ url: url, json: json }, o);
      }
      ow.addLayer(e);
      return e;
    },
    update: function update(_ref3) {
      var e = _ref3.element;
      var url = c.url;

      if (url.match(/\{x\}/)) {
        e.setUrl(url);
      } else {
        _pluginsTileJSONLayer.TileJSONLayer.prototype.setUrl.call(e, url);
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