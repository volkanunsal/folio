/*globals L*/
const {L} = window;
import {tileJSON} from './plugins/TileJSONLayer';

export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let {url, json} = c;
      let e;
      if (url.match(/\{x\}/)) {
        e = L.tileLayer(url, o);
      } else {
        e = tileJSON({url, json}, o);
      }
      ow.addLayer(e);
      return e;
    },
    update: ({element: e}) => {
      let {url} = c;
      if (url.match(/\{x\}/)) {
        e.setUrl(url);
      } else {
        tileJSON.prototype.setUrl.call(e, url);
      }
      return e;
    },
    remove: ({element: e, owner: ow}) => {
      ow.removeLayer(e);
    }
  };
}
