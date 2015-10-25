/*globals L*/
import t from 'tcomb';
const {L} = window;
import {BaseAdapter} from './'

class Adapter extends BaseAdapter {
  create(options, config) {
    let {url} = config;
    return L.tileLayer(url, options);
  }
  add(element, owner) {
    owner.addLayer(element);
  }
  update(element, options, config) {
    let {url} = config;
    element.setUrl(url);
    return element;
  }
  remove(element, owner) {
    owner.removeLayer(element);
  }
}

export default new Adapter();