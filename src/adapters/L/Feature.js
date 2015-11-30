/*globals L*/
import { featureLayer } from './plugins/FeatureLayer';

export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let {geojson} = c;
      let e = featureLayer(geojson, o);
      ow.addLayer(e);
      return e;
    },
    update: ({element: e}) => {
      let {geojson} = c;

      if (geojson) {
        e.setGeoJSON(geojson);
        e.bringToBack();
      }
    },
    remove: ({element: e, owner: ow}) => {
      ow.removeLayer(e);
    }
  };
}

