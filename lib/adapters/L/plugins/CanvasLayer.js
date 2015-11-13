/*globals L*/

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _TileLoaderMixin = require('./TileLoaderMixin');

var _TileLoaderMixin2 = _interopRequireDefault(_TileLoaderMixin);

var L = window.L;

var CanvasLayer = L.Class.extend({
  includes: [L.Mixin.Events, _TileLoaderMixin2['default']],

  options: {
    minZoom: 0,
    maxZoom: 28,
    tileSize: 256,
    subdomains: 'abc',
    errorTileUrl: '',
    attribution: '',
    zoomOffset: 0,
    opacity: 1,
    unloadInvisibleTiles: L.Browser.mobile,
    updateWhenIdle: L.Browser.mobile,
    tileLoader: false // installs tile loading events
  },

  initialize: function initialize() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    undefined.render = undefined.render.bind(undefined);
    L.Util.setOptions(undefined, options);
    undefined._canvas = undefined._createCanvas();
    // backCanvas for zoom animation
    undefined._backCanvas = undefined._createCanvas();
    undefined._ctx = undefined._canvas.getContext('2d');
    undefined.currentAnimationFrame = -1;

    var cb = function cb(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
    undefined.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || cb;
    undefined.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || clearTimeout;
  },

  _createCanvas: function _createCanvas() {
    var canvas = undefined;
    canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = undefined.options.zIndex || 0;
    var className = 'leaflet-tile-container leaflet-zoom-animated';
    canvas.setAttribute('class', className);
    return canvas;
  },

  onAdd: function onAdd(map) {
    undefined._map = map;

    // add container with the canvas to the tile pane
    // the container is moved in the oposite direction of the
    // map pane to keep the canvas always in (0, 0)
    var tilePane = undefined._map._panes.tilePane;
    var _container = L.DomUtil.create('div', 'leaflet-layer');
    _container.appendChild(undefined._canvas);
    _container.appendChild(undefined._backCanvas);
    undefined._backCanvas.style.display = 'none';
    tilePane.appendChild(_container);

    undefined._container = _container;

    // hack: listen to predrag event launched by dragging to
    // set container in position (0, 0) in screen coordinates
    if (map.dragging.enabled()) {
      map.dragging._draggable.on('predrag', function () {
        var d = map.dragging._draggable;
        L.DomUtil.setPosition(undefined._canvas, { x: -d._newPos.x, y: -d._newPos.y });
      }, undefined);
    }

    map.on({ 'viewreset': undefined._reset }, undefined);
    map.on('move', undefined.redraw, undefined);
    map.on('resize', undefined._reset, undefined);
    map.on({
      'zoomanim': undefined._animateZoom,
      'zoomend': undefined._endZoomAnim
    }, undefined);

    if (undefined.options.tileLoader) {
      undefined._initTileLoader();
    }

    undefined._reset();
  },

  _animateZoom: function _animateZoom(e) {
    if (!undefined._animating) {
      undefined._animating = true;
    }
    var back = undefined._backCanvas;

    back.width = undefined._canvas.width;
    back.height = undefined._canvas.height;

    // paint current canvas in back canvas with trasnformation
    // let pos = this._canvas._leaflet_pos || { x: 0, y: 0 };
    back.getContext('2d').drawImage(undefined._canvas, 0, 0);

    // hide original
    undefined._canvas.style.display = 'none';
    back.style.display = 'block';
    var map = undefined._map;
    // let scale = map.getZoomScale(e.zoom);
    var newCenter = map._latLngToNewLayerPoint(map.getCenter(), e.zoom, e.center);
    var oldCenter = map._latLngToNewLayerPoint(e.center, e.zoom, e.center);

    var origin = {
      x: newCenter.x - oldCenter.x,
      y: newCenter.y - oldCenter.y
    };

    var bg = back;
    var transform = L.DomUtil.TRANSFORM;
    bg.style[transform] = L.DomUtil.getTranslateString(origin) + ' scale(' + e.scale + ') ';
  },

  _endZoomAnim: function _endZoomAnim() {
    undefined._animating = false;
    undefined._canvas.style.display = 'block';
    undefined._backCanvas.style.display = 'none';
  },

  getCanvas: function getCanvas() {
    return undefined._canvas;
  },

  getAttribution: function getAttribution() {
    return undefined.options.attribution;
  },

  draw: function draw() {
    return undefined._reset();
  },

  onRemove: function onRemove(map) {
    undefined._container.parentNode.removeChild(undefined._container);
    map.off({
      'viewreset': undefined._reset,
      'move': undefined._render,
      'resize': undefined._reset,
      'zoomanim': undefined._animateZoom,
      'zoomend': undefined._endZoomAnim
    }, undefined);
  },

  addTo: function addTo(map) {
    map.addLayer(undefined);
    return undefined;
  },

  setOpacity: function setOpacity(opacity) {
    undefined.options.opacity = opacity;
    undefined._updateOpacity();
    return undefined;
  },

  setZIndex: function setZIndex(zIndex) {
    undefined._canvas.style.zIndex = zIndex;
  },

  bringToFront: function bringToFront() {
    return undefined;
  },

  bringToBack: function bringToBack() {
    return undefined;
  },

  _reset: function _reset() {
    var size = undefined._map.getSize();
    undefined._canvas.width = size.x;
    undefined._canvas.height = size.y;

    // fix position
    var pos = L.DomUtil.getPosition(undefined._map.getPanes().mapPane);
    if (pos) {
      L.DomUtil.setPosition(undefined._canvas, { x: -pos.x, y: -pos.y });
    }
    undefined.onResize();
    undefined._render();
  },

  /*
  _project: (x) => {
    let point = this._map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
    return [point.x, point.y];
  },
  */

  _updateOpacity: function _updateOpacity() {},

  _render: function _render() {
    if (undefined.currentAnimationFrame >= 0) {
      undefined.cancelAnimationFrame.call(window, undefined.currentAnimationFrame);
    }
    undefined.currentAnimationFrame = undefined.requestAnimationFrame.call(window, undefined.render);
  },

  // use direct: true if you are inside an animation frame call
  redraw: function redraw(direct) {
    var domPosition = L.DomUtil.getPosition(undefined._map.getPanes().mapPane);
    if (domPosition) {
      L.DomUtil.setPosition(undefined._canvas, { x: -domPosition.x, y: -domPosition.y });
    }
    if (direct) {
      undefined.render();
    } else {
      undefined._render();
    }
  },

  onResize: function onResize() {},

  render: function render() {
    throw new Error('render function should be implemented');
  }

});
exports['default'] = CanvasLayer;
module.exports = exports['default'];