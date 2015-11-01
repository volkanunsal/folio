/*globals L*/
const {L} = window;

let TileLoaderMixin = {
  _initTileLoader: () => {
    this._tiles = {};
    this._tilesLoading = {};
    this._tilesToLoad = 0;
    this._map.on({
      'moveend': this._updateTiles
    }, this);
    this._updateTiles();
  },

  _removeTileLoader: () => {
    this._map.off({
      'moveend': this._updateTiles
    }, this);
    this._removeTiles();
  },

  _updateTiles: () => {
    if (!this._map) { return; }

    let bounds = this._map.getPixelBounds();
    let zoom = this._map.getZoom();
    let tileSize = this.options.tileSize;

    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return;
    }

    let nwTilePoint = new L.Point(
            Math.floor(bounds.min.x / tileSize),
            Math.floor(bounds.min.y / tileSize));

    let seTilePoint = new L.Point(
            Math.floor(bounds.max.x / tileSize),
            Math.floor(bounds.max.y / tileSize));

    let tileBounds = new L.Bounds(nwTilePoint, seTilePoint);

    this._addTilesFromCenterOut(tileBounds);
    this._removeOtherTiles(tileBounds);
  },

  _removeTiles: () => {
    Object.keys(this._tiles).forEach(::this._removeTile);
  },

  _reloadTiles: () => {
    this._removeTiles();
    this._updateTiles();
  },

  _removeOtherTiles: (bounds) => {
    let zoom = this._map.getZoom();
    Object.keys(this._tiles).forEach(key => {
      let kArr = key.split(':');
      let x = parseInt(kArr[0], 10);
      let y = parseInt(kArr[1], 10);
      let z = parseInt(kArr[2], 10);

      // remove tile if it's out of bounds
      if (zoom !== z || x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
        this._removeTile(key);
      }
    });
  },

  _removeTile: (key) => {
    this.fire('tileRemoved', this._tiles[key]);
    delete this._tiles[key];
    delete this._tilesLoading[key];
  },

  _tileKey: (tilePoint) => {
    return tilePoint.x + ':' + tilePoint.y + ':' + tilePoint.zoom;
  },

  _tileShouldBeLoaded: (tilePoint) => {
    let k = this._tileKey(tilePoint);
    return !(k in this._tiles) && !(k in this._tilesLoading);
  },

  _tileLoaded: (tilePoint, tileData) => {
    this._tilesToLoad = this._tilesToLoad - 1;
    let k = tilePoint.x + ':' + tilePoint.y + ':' + tilePoint.zoom;
    this._tiles[k] = tileData;
    delete this._tilesLoading[k];
    if (this._tilesToLoad === 0) {
      this.fire('tilesLoaded');
    }
  },

  getTilePos: (tilePoint) => {
    let tp = new L.Point(tilePoint.x, tilePoint.y);
    let origin = this._map._getNewTopLeftPoint(this._map.getCenter());
    let tileSize = this.options.tileSize;
    return tp.multiplyBy(tileSize).subtract(origin);
  },

  _addTilesFromCenterOut: (bounds) => {
    let queue = [];
    let center = bounds.getCenter();
    let zoom = this._map.getZoom();

    for (let j = bounds.min.y; j <= bounds.max.y; j++) {
      for (let i = bounds.min.x; i <= bounds.max.x; i++) {
        let point = new L.Point(i, j);
        point.zoom = zoom;

        if (this._tileShouldBeLoaded(point)) {
          queue.push(point);
        }
      }
    }

    let tilesToLoad = queue.length;
    if (tilesToLoad === 0) { return; }

    // load tiles in order of their distance to center
    queue.sort((a, b) => {
      return a.distanceTo(center) - b.distanceTo(center);
    });

    this._tilesToLoad += tilesToLoad;

    for (let i = 0; i < tilesToLoad; i++) {
      let t = queue[i];
      let k = this._tileKey(t);
      this._tilesLoading[k] = t;
      this.fire('tileAdded', t);
    }
    this.fire('tilesLoading');
  }
};
export default TileLoaderMixin;
