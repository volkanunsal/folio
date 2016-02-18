/*eslint no-console: 0, new-cap: 0*/
/*globals L*/
const L = window.L;
import t from 'tcomb';
require('whatwg-fetch');
function lbounds(u) {
  return new L.LatLngBounds([[u[1], u[0]], [u[3], u[2]]]);
}

export const TileJSONLayer = L.TileLayer.extend({
  options: {
    format: 'png'
  },

  formats: ['png', 'png32', 'png64', 'png128', 'png256', 'jpg70', 'jpg80', 'jpg90'],

  scalePrefix: '@2x.',

  initialize(config, options) {
    // Call the initializer of superclass.
    L.TileLayer.prototype.initialize.call(this, void 0, options);
    this._tilejson = {};

    if (options && options.format) {
      if (this.formats.filter(format => format === options.format).length < 1) {
        throw new TypeError('Format is not recognized');
      }
    }
    this._loadTileJSON(config);
  },

  setUrl(url) {
    fetch(url).then(res => res.json())
    .then(
      ::this._setTileJSON,
      e => console.error(e.stack)
    );
    this.redraw();
  },

  _loadTileJSON({url, json}) {
    if (url) {
      this.setUrl(url);
    } else if (json) {
      this._setTileJSON(json);
    }
  },

  _setTileJSON(json) {
    t.Obj(json);
    let {tiles, minzoom, minZoom, maxzoom, maxZoom, attribution, bounds, scheme} = json;

    L.extend(this.options, {
      tiles,
      attribution,
      minZoom: this.options.minZoom || minzoom || minZoom || 0,
      maxZoom: this.options.maxZoom || maxzoom || maxZoom || 18,
      tms: scheme === 'tms',
      bounds: (bounds && lbounds(bounds))
    });
    this._tilejson = json;
    this.redraw();
    return this;
  },

  getTileJSON() {
    return this._tilejson;
  },

  getTileUrl(tilePoint) {
    let {tiles} = this.options;
    let {x, y, z} = tilePoint;
    let index = Math.floor(Math.abs(x + y) % tiles.length);
    let url = tiles[index];
    let templated = L.Util.template(url, {
      s: this._getSubdomain(tilePoint), z, x, y
    });
    if (!templated) {
      return templated;
    }
    return templated.replace('.png', (L.Browser.retina ? this.scalePrefix : '.') + this.options.format);
  },

  _update() {
    if (this.options.tiles) {
      return L.TileLayer.prototype._update.call(this);
    }
  },

  getBounds() {
    return this.options.bounds;
  },

  setOpacity(opacity) {
    this.options.opacity = opacity;
    if (this._map) {
      this._updateOpacity();
    }
    return this;
  }
});

export function tileJSON(config={}, options) {
  return new TileJSONLayer(config, options);
}
