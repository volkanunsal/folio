/*globals L*/
'use strict';

exports.__esModule = true;
var L = window.L;

var TileLoaderMixin = {
  _initTileLoader: function _initTileLoader() {
    undefined._tiles = {};
    undefined._tilesLoading = {};
    undefined._tilesToLoad = 0;
    undefined._map.on({
      'moveend': undefined._updateTiles
    }, undefined);
    undefined._updateTiles();
  },

  _removeTileLoader: function _removeTileLoader() {
    undefined._map.off({
      'moveend': undefined._updateTiles
    }, undefined);
    undefined._removeTiles();
  },

  _updateTiles: function _updateTiles() {
    if (!undefined._map) {
      return;
    }

    var bounds = undefined._map.getPixelBounds();
    var zoom = undefined._map.getZoom();
    var tileSize = undefined.options.tileSize;

    if (zoom > undefined.options.maxZoom || zoom < undefined.options.minZoom) {
      return;
    }

    var nwTilePoint = new L.Point(Math.floor(bounds.min.x / tileSize), Math.floor(bounds.min.y / tileSize));

    var seTilePoint = new L.Point(Math.floor(bounds.max.x / tileSize), Math.floor(bounds.max.y / tileSize));

    var tileBounds = new L.Bounds(nwTilePoint, seTilePoint);

    undefined._addTilesFromCenterOut(tileBounds);
    undefined._removeOtherTiles(tileBounds);
  },

  _removeTiles: function _removeTiles() {
    Object.keys(undefined._tiles).forEach(undefined._removeTile.bind(undefined));
  },

  _reloadTiles: function _reloadTiles() {
    undefined._removeTiles();
    undefined._updateTiles();
  },

  _removeOtherTiles: function _removeOtherTiles(bounds) {
    var zoom = undefined._map.getZoom();
    Object.keys(undefined._tiles).forEach(function (key) {
      var kArr = key.split(':');
      var x = parseInt(kArr[0], 10);
      var y = parseInt(kArr[1], 10);
      var z = parseInt(kArr[2], 10);

      // remove tile if it's out of bounds
      if (zoom !== z || x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
        undefined._removeTile(key);
      }
    });
  },

  _removeTile: function _removeTile(key) {
    undefined.fire('tileRemoved', undefined._tiles[key]);
    delete undefined._tiles[key];
    delete undefined._tilesLoading[key];
  },

  _tileKey: function _tileKey(tilePoint) {
    return tilePoint.x + ':' + tilePoint.y + ':' + tilePoint.zoom;
  },

  _tileShouldBeLoaded: function _tileShouldBeLoaded(tilePoint) {
    var k = undefined._tileKey(tilePoint);
    return !(k in undefined._tiles) && !(k in undefined._tilesLoading);
  },

  _tileLoaded: function _tileLoaded(tilePoint, tileData) {
    undefined._tilesToLoad = undefined._tilesToLoad - 1;
    var k = tilePoint.x + ':' + tilePoint.y + ':' + tilePoint.zoom;
    undefined._tiles[k] = tileData;
    delete undefined._tilesLoading[k];
    if (undefined._tilesToLoad === 0) {
      undefined.fire('tilesLoaded');
    }
  },

  getTilePos: function getTilePos(tilePoint) {
    var tp = new L.Point(tilePoint.x, tilePoint.y);
    var origin = undefined._map._getNewTopLeftPoint(undefined._map.getCenter());
    var tileSize = undefined.options.tileSize;
    return tp.multiplyBy(tileSize).subtract(origin);
  },

  _addTilesFromCenterOut: function _addTilesFromCenterOut(bounds) {
    var queue = [];
    var center = bounds.getCenter();
    var zoom = undefined._map.getZoom();

    for (var j = bounds.min.y; j <= bounds.max.y; j++) {
      for (var i = bounds.min.x; i <= bounds.max.x; i++) {
        var point = new L.Point(i, j);
        point.zoom = zoom;

        if (undefined._tileShouldBeLoaded(point)) {
          queue.push(point);
        }
      }
    }

    var tilesToLoad = queue.length;
    if (tilesToLoad === 0) {
      return;
    }

    // load tiles in order of their distance to center
    queue.sort(function (a, b) {
      return a.distanceTo(center) - b.distanceTo(center);
    });

    undefined._tilesToLoad += tilesToLoad;

    for (var i = 0; i < tilesToLoad; i++) {
      var t = queue[i];
      var k = undefined._tileKey(t);
      undefined._tilesLoading[k] = t;
      undefined.fire('tileAdded', t);
    }
    undefined.fire('tilesLoading');
  }
};
exports['default'] = TileLoaderMixin;
module.exports = exports['default'];