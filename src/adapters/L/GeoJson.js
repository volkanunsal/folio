/*globals L*/
export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let {geojson} = c;
      let e = L.geoJson(geojson, o);
      ow.addLayer(e);
      if (o.clickable) {
        e.on('click', (z) => ow.fire('click', z));
      }
      return e;
    },
    update: ({element: e}) => {
      let {geojson} = c;

      if (geojson) {
        e.addData(geojson);
        e.bringToBack();
      }
    },
    remove: ({element: e, owner: ow}) => {
      ow.removeLayer(e);
    }
  };
}
