/*globals L*/

/*
  import GeoJSONTileLayer from './GeoJSONTileLayer';
  import topojson from 'topojson/topojson';

  // Constructor:
  //    TopoTileLayer( <String> urlTemplate, <TopoTileLayer options> options?, <GeoJSON options> geojsonOptions? )
  //
  // see: https://github.com/glenrobertson/leaflet-tilelayer-geojson/
  export default GeoJSONTileLayer.extend({
    _tileLoaded(tile, tilePoint) {
      GeoJSONTileLayer.prototype._tileLoaded.apply(this, arguments);
      if (tile.datum === null) { return null; }

      let o = typeof tile.datum === 'string' ?
          JSON.parse(tile.datum) : tile.datum;
      for (let k in o.objects) {
        if (!o.objects.hasOwnProperty(k)) { continue; }
        let ft = topojson.feature(o, o.objects[k]);
        this.addTileData(ft, tilePoint);
      }
    }
  })
*/
