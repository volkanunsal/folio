/*globals L*/
const {L} = window;
L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images';
import t from 'tcomb';
import ReactDOM from 'react-dom';
import {BaseAdapter} from './'

let defaults = {
  maxZoom: 19,
  zoomControl: false
};

class Adapter extends BaseAdapter {
  create(options, config) {
    // This method is called in the context of the Carvel component.
    return L.map(ReactDOM.findDOMNode(this.refs.map), {...options, ...defaults})
  }
  update(element, options, config) {
    if (config.center && config.zoom) {
      element.setView(config.center, config.zoom, options.zoomPanOptions || {});
    }
    return element;
  }
  remove(element) {
    element.remove();
  }
}
export default new Adapter()