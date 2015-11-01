/*globals L*/

const {L} = window;
import TileLoaderMixin from './TileLoaderMixin';

let CanvasLayer = L.Class.extend({
  includes: [L.Mixin.Events, TileLoaderMixin],

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

  initialize: (options = {}) => {
    this.render = this.render.bind(this);
    L.Util.setOptions(this, options);
    this._canvas = this._createCanvas();
    // backCanvas for zoom animation
    this._backCanvas = this._createCanvas();
    this._ctx = this._canvas.getContext('2d');
    this.currentAnimationFrame = -1;

    let cb = (callback) => window.setTimeout(callback, 1000 / 60);
    this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || cb;
    this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || clearTimeout;
  },

  _createCanvas: () => {
    let canvas;
    canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = this.options.zIndex || 0;
    let className = 'leaflet-tile-container leaflet-zoom-animated';
    canvas.setAttribute('class', className);
    return canvas;
  },

  onAdd: (map) => {
    this._map = map;

    // add container with the canvas to the tile pane
    // the container is moved in the oposite direction of the
    // map pane to keep the canvas always in (0, 0)
    let tilePane = this._map._panes.tilePane;
    let _container = L.DomUtil.create('div', 'leaflet-layer');
    _container.appendChild(this._canvas);
    _container.appendChild(this._backCanvas);
    this._backCanvas.style.display = 'none';
    tilePane.appendChild(_container);

    this._container = _container;

    // hack: listen to predrag event launched by dragging to
    // set container in position (0, 0) in screen coordinates
    if (map.dragging.enabled()) {
      map.dragging._draggable.on('predrag', () => {
        let d = map.dragging._draggable;
        L.DomUtil.setPosition(this._canvas, { x: -d._newPos.x, y: -d._newPos.y });
      }, this);
    }

    map.on({'viewreset': this._reset }, this);
    map.on('move', this.redraw, this);
    map.on('resize', this._reset, this);
    map.on({
      'zoomanim': this._animateZoom,
      'zoomend': this._endZoomAnim
    }, this);

    if (this.options.tileLoader) {
      this._initTileLoader();
    }

    this._reset();
  },

  _animateZoom: (e) => {
    if (!this._animating) {
      this._animating = true;
    }
    let back = this._backCanvas;

    back.width = this._canvas.width;
    back.height = this._canvas.height;

    // paint current canvas in back canvas with trasnformation
    // let pos = this._canvas._leaflet_pos || { x: 0, y: 0 };
    back.getContext('2d').drawImage(this._canvas, 0, 0);

    // hide original
    this._canvas.style.display = 'none';
    back.style.display = 'block';
    let map = this._map;
    // let scale = map.getZoomScale(e.zoom);
    let newCenter = map._latLngToNewLayerPoint(map.getCenter(), e.zoom, e.center);
    let oldCenter = map._latLngToNewLayerPoint(e.center, e.zoom, e.center);

    let origin = {
      x: newCenter.x - oldCenter.x,
      y: newCenter.y - oldCenter.y
    };

    let bg = back;
    let transform = L.DomUtil.TRANSFORM;
    bg.style[transform] = L.DomUtil.getTranslateString(origin) + ' scale(' + e.scale + ') ';
  },

  _endZoomAnim: () => {
    this._animating = false;
    this._canvas.style.display = 'block';
    this._backCanvas.style.display = 'none';
  },

  getCanvas: () => {
    return this._canvas;
  },

  getAttribution: () => {
    return this.options.attribution;
  },

  draw: () => {
    return this._reset();
  },

  onRemove: (map) => {
    this._container.parentNode.removeChild(this._container);
    map.off({
      'viewreset': this._reset,
      'move': this._render,
      'resize': this._reset,
      'zoomanim': this._animateZoom,
      'zoomend': this._endZoomAnim
    }, this);
  },

  addTo: (map) => {
    map.addLayer(this);
    return this;
  },

  setOpacity: (opacity) => {
    this.options.opacity = opacity;
    this._updateOpacity();
    return this;
  },

  setZIndex: (zIndex) => {
    this._canvas.style.zIndex = zIndex;
  },

  bringToFront: () => {
    return this;
  },

  bringToBack: () => {
    return this;
  },

  _reset: () => {
    let size = this._map.getSize();
    this._canvas.width = size.x;
    this._canvas.height = size.y;

    // fix position
    let pos = L.DomUtil.getPosition(this._map.getPanes().mapPane);
    if (pos) {
      L.DomUtil.setPosition(this._canvas, { x: -pos.x, y: -pos.y });
    }
    this.onResize();
    this._render();
  },

  /*
  _project: (x) => {
    let point = this._map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
    return [point.x, point.y];
  },
  */

  _updateOpacity: () => { },

  _render: () => {
    if (this.currentAnimationFrame >= 0) {
      this.cancelAnimationFrame.call(window, this.currentAnimationFrame);
    }
    this.currentAnimationFrame = this.requestAnimationFrame.call(window, this.render);
  },

  // use direct: true if you are inside an animation frame call
  redraw: (direct) => {
    let domPosition = L.DomUtil.getPosition(this._map.getPanes().mapPane);
    if (domPosition) {
      L.DomUtil.setPosition(this._canvas, { x: -domPosition.x, y: -domPosition.y });
    }
    if (direct) {
      this.render();
    } else {
      this._render();
    }
  },

  onResize: () => {
  },

  render: () => {
    throw new Error('render function should be implemented');
  }

});
export default CanvasLayer;
