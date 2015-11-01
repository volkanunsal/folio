/*globals L*/

const {L} = window;
import {style, marker} from '../../../utils/simpleStyles';

let FeatureLayer;
export default FeatureLayer = L.FeatureGroup.extend({
  options: {
    // We filter which layers we want to grab with this layer. Could be a useful option.
    filter() { return true; },
    style
  },

  _layers: {},

  initialize(geojson, options) {
    L.setOptions(this, options);
    L.FeatureGroup.prototype.initialize.call(this, null);
    this.setGeoJSON(geojson);
  },

  setGeoJSON(geojson) {
    this._geojson = geojson;
    // Properties also contains some geojson apparently... probably the data fields
    if (geojson) {
      this._geojson = {...geojson, properties: this.options.properties};
    }
    this.clearLayers();
    this.initLayers(this._geojson);
    return this;
  },

  getGeoJSON() {
    return this._geojson;
  },

  initLayers(json) {
    if (!json) { return; }
    // Parse Feature and FeatureCollection objects  and yield
    // a GeoJSON object.
    let features = (L.Util.isArray(json) ? json : json.features);
    if (features) {
      let i = 0;
      let len = features.length;
      while (i < len) {
        let f = features[i];
        let geom = f.geometries || f.geometry || f.features;
        if (geom) {
          this.initLayers(features[i]);
        }
        i++;
      }
    } else if (this.options.filter(json)) {
      let layer = L.GeoJSON
        .geometryToLayer(json, (feature, latlon) => marker(feature, latlon));
      if ('setStyle' in layer) { layer.setStyle(style(json)); }
      layer.feature = json;
      this.addLayer(layer);
    }
  },

  clearLayers() {
    // NOTE: This doesn't always work. Your best bet is to remove the layer.
    L.FeatureGroup.prototype.clearLayers.call(this, null);
    this._layers = {};
  }

});

export function featureLayer(u, options) {
  return new FeatureLayer(u, options);
}
