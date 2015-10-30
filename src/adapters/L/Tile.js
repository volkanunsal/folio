/*globals L*/
import t from 'tcomb';
const {L} = window;


export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let {url} = c;
      let e = L.tileLayer(url, o);
      ow.addLayer(e);
      return e;
    },
    update: ({element: e}) => {
      let {url} = c;
      e.setUrl(url);
      return e;
    },
    remove: ({element: e, owner: ow}) => {
      ow.removeLayer(e);
    }
  };
}
