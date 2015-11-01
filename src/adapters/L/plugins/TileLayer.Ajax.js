/*globals L*/

const {L} = window;

// Load data tiles from an AJAX data source
export default L.TileLayer.extend({
  _requests: [],
  _addTile: (tilePoint) => {
    let tile = { datum: null, processed: false };
    this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
    this._loadTile(tile, tilePoint);
  },
  // XMLHttpRequest handler; closure over the XHR object, the layer, and the tile
  _xhrHandler: (req, layer, tile, tilePoint) => {
    return () => {
      if (req.readyState !== 4) {
        return;
      }
      let s = req.status;
      if ((s >= 200 && s < 300) || s === 304) {
        tile.datum = JSON.parse(req.responseText);
        layer._tileLoaded(tile, tilePoint);
      } else {
        layer._tileLoaded(tile, tilePoint);
      }
    };
  },
  // Load the requested tile via AJAX
  _loadTile: (tile, tilePoint) => {
    this._adjustTilePoint(tilePoint);
    let layer = this;
    let req = new XMLHttpRequest();
    this._requests.push(req);
    req.onreadystatechange = this._xhrHandler(req, layer, tile, tilePoint);
    req.open('GET', this.getTileUrl(tilePoint), true);
    req.send();
  },
  _reset: () => {
    L.TileLayer.prototype._reset.apply(this, arguments);
    for (let k in this._requests) {
      if (!this._requests.hasOwnProperty(k)) { continue; }
      this._requests[k].abort();
    }
    this._requests = [];
  },
  _update: () => {
    if (this._map && this._map._panTransition && this._map._panTransition._inProgress) { return; }
    if (this._tilesToLoad < 0) { this._tilesToLoad = 0; }
    L.TileLayer.prototype._update.apply(this, arguments);
  }
});

