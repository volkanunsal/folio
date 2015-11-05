/*globals L*/
const {L} = window;
import t from 'tcomb';

export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let {coordinates} = c;
      let e = L.marker(L.latLng(coordinates), o);
      ow.addLayer(e);
      return e;
    },
    update: ({element: e}) => {
      let {coordinates} = c;
      e.setLatLng(coordinates);
      if (t.Number.is(o.opacity)) {
        e.setOpacity(o.opacity);
      }
      if (o.icon) {
        e.setIcon(o.icon);
      }
      return e;
    },
    remove: ({element: e, owner: ow}) => {
      ow.removeLayer(e);
    }
  };
}
