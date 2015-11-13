/*eslint no-console: 0, new-cap: 0*/
/*globals L*/
'use strict';

exports.__esModule = true;
exports.tileJSON = tileJSON;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var L = window.L;

require('whatwg-fetch');
function lbounds(u) {
  return new L.LatLngBounds([[u[1], u[0]], [u[3], u[2]]]);
}

var TileJSONLayer = L.TileLayer.extend({
  options: {
    format: 'png'
  },

  formats: ['png', 'png32', 'png64', 'png128', 'png256', 'jpg70', 'jpg80', 'jpg90'],

  scalePrefix: '@2x.',

  initialize: function initialize(config, options) {
    // Call the initializer of superclass.
    L.TileLayer.prototype.initialize.call(this, void 0, options);
    this._tilejson = {};

    if (options && options.format) {
      if (this.formats.filter(function (format) {
        return format === options.format;
      }).length < 1) {
        throw new TypeError('Format is not recognized');
      }
    }
    this._loadTileJSON(config);
  },

  setUrl: function setUrl(url) {
    fetch(url).then(function (res) {
      return res.json();
    }).then(this._setTileJSON.bind(this), function (e) {
      return console.error(e.stack);
    });
    this.redraw();
  },

  _loadTileJSON: function _loadTileJSON(_ref) {
    var url = _ref.url;
    var json = _ref.json;

    if (url) {
      this.setUrl(url);
    } else if (json) {
      this._setTileJSON(json);
    }
  },

  _setTileJSON: function _setTileJSON(json) {
    _tcomb2['default'].Obj(json);
    var tiles = json.tiles;
    var minzoom = json.minzoom;
    var minZoom = json.minZoom;
    var maxzoom = json.maxzoom;
    var maxZoom = json.maxZoom;
    var attribution = json.attribution;
    var bounds = json.bounds;
    var scheme = json.scheme;

    L.extend(this.options, {
      tiles: tiles,
      attribution: attribution,
      minZoom: minzoom || minZoom || 0,
      maxZoom: maxzoom || maxZoom || 18,
      tms: scheme === 'tms',
      bounds: bounds && lbounds(bounds)
    });
    this._tilejson = json;
    this.redraw();
    return this;
  },

  getTileJSON: function getTileJSON() {
    return this._tilejson;
  },

  getTileUrl: function getTileUrl(tilePoint) {
    var tiles = this.options.tiles;
    var x = tilePoint.x;
    var y = tilePoint.y;
    var z = tilePoint.z;

    var index = Math.floor(Math.abs(x + y) % tiles.length);
    var url = tiles[index];
    var templated = L.Util.template(url, {
      s: this._getSubdomain(tilePoint), z: z, x: x, y: y
    });
    if (!templated) {
      return templated;
    }
    return templated.replace('.png', (L.Browser.retina ? this.scalePrefix : '.') + this.options.format);
  },

  _update: function _update() {
    if (this.options.tiles) {
      return L.TileLayer.prototype._update.call(this);
    }
  },

  getBounds: function getBounds() {
    return this.options.bounds;
  },

  setOpacity: function setOpacity(opacity) {
    this.options.opacity = opacity;
    if (this._map) {
      this._updateOpacity();
    }
    return this;
  }
});

exports.TileJSONLayer = TileJSONLayer;

function tileJSON(config, options) {
  if (config === undefined) config = {};

  return new TileJSONLayer(config, options);
}