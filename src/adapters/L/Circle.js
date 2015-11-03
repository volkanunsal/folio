/*globals L*/
const {L} = window;
import t from 'tcomb';
import getLatLon from '../../utils/getLatLon';

export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let {coordinates, radius} = c;
      let latlon = getLatLon(coordinates);
      radius = t.Number(radius);
      let e = L.circle( latlon, radius, o );
      ow.addLayer(e);
      return e;
    },
    update: ({element: e}) => {
      let {coordinates, radius} = c;
      if (coordinates) {
        e.setLatLng(coordinates);
      }
      if (radius) {
        e.setRadius(radius);
      }
      return e;
    },
    remove: ({element: e, owner: ow}) => {
      ow.removeLayer(e);
    }
  };
}
