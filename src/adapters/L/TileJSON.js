/*globals L*/
import {tileJSON} from './plugins/TileJSONLayer';

export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let {url, json} = c;
      let e = tileJSON({url, json}, o);
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
