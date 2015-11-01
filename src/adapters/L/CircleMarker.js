/*globals L*/
const {L} = window;
import getZoomStyle from 'folio/utils/getZoomStyle';
import getLatLon from 'folio/utils/getLatLon';

let defaultZoomStyles = {
  ['<=11']: { radius: 1, weight: 0 },
  12: { radius: 4, weight: 0 },
  13: { radius: 4, weight: 0 },
  14: { radius: 4, weight: 1 },
  15: { radius: 4, weight: 4 },
  16: { radius: 6, weight: 5 },
  17: { radius: 8, weight: 7},
  ['>=18']: { radius: 10, weight: 8 }
};

export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let {coordinates} = c;
      let latlon = getLatLon(coordinates);
      let e = L.circleMarker( latlon, o );
      let {zoomStyles} = o;
      ow.addLayer(e);
      // Listen to zoom level changes on the map. Update the styles of the marker if zoom level has a style.
      ow.on('zoomend', () => {
        let curLevelStyles = getZoomStyle(ow.getZoom(), zoomStyles || defaultZoomStyles);
        e.setStyle(curLevelStyles);
      });
      return e;
    },
    update: ({element: e}) => {
      let {coordinates} = c;
      let latlon = getLatLon(coordinates);
      e.setLatLng(latlon);
      return e;
    },
    remove: ({element: e, owner: ow}) => {
      ow.removeLayer(e);
    }
  };
}
