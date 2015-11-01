/*globals L*/

const {L} = window;
import TileLayerAjax from './TileLayer.Ajax';

// Constructor:
//    GeoJSONTileLayer( urlTemplate: ?string, options: ?mixed, geojsonOptions: ?mixed )
// see: https://github.com/glenrobertson/leaflet-tilelayer-geojson/
export default TileLayerAjax.extend({
  // Store each GeometryCollection's layer by key, if options.unique function is present
  _keyLayers: {},

  // Used to calculate svg path string for clip path elements
  _clipPathRectangles: {},

  initialize(url, options, geojsonOptions) {
    TileLayerAjax.prototype.initialize.call(this, url, options);
    this.geojsonLayer = new L.GeoJSON(null, geojsonOptions);
  },
  onAdd(map) {
    this._map = map;
    TileLayerAjax.prototype.onAdd.call(this, map);
    map.addLayer(this.geojsonLayer);
  },
  onRemove(map) {
    map.removeLayer(this.geojsonLayer);
    TileLayerAjax.prototype.onRemove.call(this, map);
  },
  _reset() {
    this.geojsonLayer.clearLayers();
    this._keyLayers = {};
    this._removeOldClipPaths();
    TileLayerAjax.prototype._reset.apply(this, arguments);
  },

  // Remove clip path elements from other earlier zoom levels
  _removeOldClipPaths() {
    for (let clipPathId in this._clipPathRectangles) {
      if (!this._clipPathRectangles.hasOwnProperty(clipPathId)) { continue; }
      let clipPathZXY = clipPathId.split('_').slice(1);
      let zoom = parseInt(clipPathZXY[0], 10);
      if (zoom !== this._map.getZoom()) {
        let rectangle = this._clipPathRectangles[clipPathId];
        this._map.removeLayer(rectangle);
        let clipPath = document.getElementById(clipPathId);
        if (clipPath !== null) {
          clipPath.parentNode.removeChild(clipPath);
        }
        delete this._clipPathRectangles[clipPathId];
      }
    }
  },

  // Recurse LayerGroups and call func() on L.Path layer instances
  _recurseLayerUntilPath(func, layer) {
    if (layer instanceof L.Path) {
      func(layer);
    } else if (layer instanceof L.LayerGroup) {
      // Recurse each child layer
      layer.getLayers().forEach(this._recurseLayerUntilPath.bind(this, func), this);
    }
  },

  _clipLayerToTileBoundary(layer, tilePoint) {
    // Only perform SVG clipping if the browser is using SVG
    if (!L.Path.SVG) { return; }
    if (!this._map) { return; }

    if (!this._map._pathRoot) {
      this._map._pathRoot = L.Path.prototype._createElement('svg');
      this._map._panes.overlayPane.appendChild(this._map._pathRoot);
    }
    let svg = this._map._pathRoot;

    // create the defs container if it doesn't exist
    let defs = null;
    if (svg.getElementsByTagName('defs').length === 0) {
      defs = document.createElementNS(L.Path.SVG_NS, 'defs');
      svg.insertBefore(defs, svg.firstChild);
    } else {
      defs = svg.getElementsByTagName('defs')[0];
    }

    // Create the clipPath for the tile if it doesn't exist
    let clipPathId = 'tileClipPath_' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y;
    let clipPath = document.getElementById(clipPathId);
    if (clipPath === null) {
      clipPath = document.createElementNS(L.Path.SVG_NS, 'clipPath');
      clipPath.id = clipPathId;

      // Create a hidden L.Rectangle to represent the tile's area
      let tileSize = this.options.tileSize;
      let nwPoint = tilePoint.multiplyBy(tileSize);
      let sePoint = nwPoint.add([tileSize, tileSize]);
      let nw = this._map.unproject(nwPoint);
      let se = this._map.unproject(sePoint);

      this._clipPathRectangles[clipPathId] = new L.Rectangle(new L.LatLngBounds([nw, se]), {
          opacity: 0,
          fillOpacity: 0,
          clickable: false,
          noClip: true
      });
      this._map.addLayer(this._clipPathRectangles[clipPathId]);

      // Add a clip path element to the SVG defs element
      // With a path element that has the hidden rectangle's SVG path string
      let path = document.createElementNS(L.Path.SVG_NS, 'path');
      let pathString = this._clipPathRectangles[clipPathId].getPathString();
      path.setAttribute('d', pathString);
      clipPath.appendChild(path);
      defs.appendChild(clipPath);
    }

    // Add the clip-path attribute to reference the id of the tile clipPath
    this._recurseLayerUntilPath((pathLayer) => {
      pathLayer._container.setAttribute('clip-path', 'url(#' + clipPathId + ')');
    }, layer);
  },

  // Add a geojson object from a tile to the GeoJSON layer
  // * If the options.unique function is specified, merge geometries into GeometryCollections
  // grouped by the key returned by options.unique(feature) for each GeoJSON feature
  // * If options.clipTiles is set, and the browser is using SVG, perform SVG clipping on each
  // tile's GeometryCollection
  addTileData(geojson, tilePoint) {
    let features = L.Util.isArray(geojson) ? geojson : geojson.features;

    if (features) {
      let len = features.length;
      for (let i = 0; i < len; i++) {
        // Only add this if geometry or geometries are set and not null
        let feature = features[i];
        if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
          this.addTileData(features[i], tilePoint);
        }
      }
      return this;
    }

    let options = this.geojsonLayer.options;

    if (options.filter && !options.filter(geojson)) { return this; }

    let parentLayer = this.geojsonLayer;
    let incomingLayer = null;
    if (this.options.unique && typeof this.options.unique === 'function') {
      let key = this.options.unique(geojson);

      // When creating the layer for a unique key,
      // Force the geojson to be a geometry collection
      if (!(key in this._keyLayers && geojson.geometry.type !== 'GeometryCollection')) {
        geojson.geometry = {
          type: 'GeometryCollection',
          geometries: [geojson.geometry]
        };
      }

      // Transform the geojson into a new Layer
      try {
        incomingLayer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng);
      } catch (e) {
        // Ignore GeoJSON objects that could not be parsed
        return this;
      }

      incomingLayer.feature = L.GeoJSON.asFeature(geojson);
      // Add the incoming Layer to existing key's GeometryCollection
      if (key in this._keyLayers) {
        parentLayer = this._keyLayers[key];
        parentLayer.feature.geometry.geometries.push(geojson.geometry);
      } else {
        // Convert the incoming GeoJSON feature into a new GeometryCollection layer
        this._keyLayers[key] = incomingLayer;
      }
    } else {
      // Add the incoming geojson feature to the L.GeoJSON Layer
      // Transform the geojson into a new layer
      try {
        incomingLayer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng);
      } catch (e) {
        // Ignore GeoJSON objects that could not be parsed
        return this;
      }
      incomingLayer.feature = L.GeoJSON.asFeature(geojson);
    }
    incomingLayer.defaultOptions = incomingLayer.options;

    this.geojsonLayer.resetStyle(incomingLayer);

    if (options.onEachFeature) {
      options.onEachFeature(geojson, incomingLayer);
    }
    parentLayer.addLayer(incomingLayer);

    // If options.clipTiles is set and the browser is using SVG
    // then clip the layer using SVG clipping
    if (this.options.clipTiles) {
      this._clipLayerToTileBoundary(incomingLayer, tilePoint);
    }
    return this;
  },

  _tileLoaded(tile, tilePoint) {
    TileLayerAjax.prototype._tileLoaded.apply(this, arguments);
    if (tile.datum === null) { return null; }
    this.addTileData(tile.datum, tilePoint);
  }
});
