/*globals L*/
const {L} = window;
L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images';
import ReactDOM from 'react-dom';

let defaults = {
  maxZoom: 19,
  zoomControl: false
};

export default function({ options: o }) {
  return {
    create: ({node: n}) => {
      return L.map(ReactDOM.findDOMNode(n), {...defaults, ...o});
    },
    update: ({element: e}) => {
      if (o.center && o.zoom) {
        e.setView(o.center, o.zoom, o.zoomPanOptions || {});
      }
      return e;
    },
    remove: ({element: e}) => {
      e.remove();
    }
  };
}
