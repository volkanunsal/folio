/*globals L*/

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.featureLayer = featureLayer;

var _utilsSimpleStyles = require('../../../utils/simpleStyles');

var L = window.L;

var FeatureLayer = undefined;
exports['default'] = FeatureLayer = L.FeatureGroup.extend({
  options: {
    // We filter which layers we want to grab with this layer. Could be a useful option.
    filter: function filter() {
      return true;
    },
    style: _utilsSimpleStyles.style
  },

  _layers: {},

  initialize: function initialize(geojson, options) {
    L.setOptions(this, options);
    L.FeatureGroup.prototype.initialize.call(this, null);
    this.setGeoJSON(geojson);
  },

  setGeoJSON: function setGeoJSON(geojson) {
    this._geojson = geojson;
    // Properties also contains some geojson apparently... probably the data fields
    if (geojson) {
      this._geojson = _extends({}, geojson, { properties: this.options.properties });
    }
    this.clearLayers();
    this.initLayers(this._geojson);
    return this;
  },

  getGeoJSON: function getGeoJSON() {
    return this._geojson;
  },

  initLayers: function initLayers(json) {
    if (!json) {
      return;
    }
    // Parse Feature and FeatureCollection objects  and yield
    // a GeoJSON object.
    var features = L.Util.isArray(json) ? json : json.features;
    if (features) {
      var i = 0;
      var len = features.length;
      while (i < len) {
        var f = features[i];
        var geom = f.geometries || f.geometry || f.features;
        if (geom) {
          this.initLayers(features[i]);
        }
        i++;
      }
    } else if (this.options.filter(json)) {
      var layer = L.GeoJSON.geometryToLayer(json, function (feature, latlon) {
        return _utilsSimpleStyles.marker(feature, latlon);
      });
      if ('setStyle' in layer) {
        layer.setStyle(_utilsSimpleStyles.style(json));
      }
      layer.feature = json;
      this.addLayer(layer);
    }
  },

  clearLayers: function clearLayers() {
    // NOTE: This doesn't always work. Your best bet is to remove the layer.
    L.FeatureGroup.prototype.clearLayers.call(this, null);
    this._layers = {};
  }

});

function featureLayer(u, options) {
  return new FeatureLayer(u, options);
}