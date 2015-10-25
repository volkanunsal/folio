/*globals L*/
import t from 'tcomb';
const {L} = window;
import ReactDOM from 'react-dom';
import {BaseAdapter} from './';
import {control} from '../plugins/Control';

class Adapter extends BaseAdapter {
  create(options, config) {
    return control(options)
  }
  add(element, owner) {
    owner.addControl(element);
    return element;
  }
  update(element, options, config) {
    if (t.Function.is(config.content)) {
      ReactDOM.render(config.content(), element.getContainer());
    } else {
      element.getContainer().innerHTML = content;
    }
    return element;
  }
  remove(element, owner) {
    owner.removeControl(element);
  }
}

export default new Adapter();