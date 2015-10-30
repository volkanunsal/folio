/*globals L*/
const {L} = window;
L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images';
import t from 'tcomb';
import ReactDOM from 'react-dom';


let defaults = {
  maxZoom: 19,
  zoomControl: false
};

export default function({ config: c, options: o }) {
  return {
    create: ({node: n}) => {
      return L.map(ReactDOM.findDOMNode(n), {...o, ...defaults})
    },
    update: ({element: e}) => {
      if (c.center && c.zoom) {
        e.setView(c.center, c.zoom, o.zoomPanOptions || {});
      }
      return e;
    },
    remove: ({element: e}) => {
      e.remove();
    }
  };
}