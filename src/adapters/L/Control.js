/*globals L*/
import t from 'tcomb';
const {L} = window;
import ReactDOM from 'react-dom';
import {control} from '../../plugins/Control';

export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let e = control(o);
      ow.addControl(e);
      return e;
    },
    update: ({element: e}) => {
      if (t.Function.is(c.content)) {
        ReactDOM.render(c.content(), e.getContainer());
      } else {
        e.getContainer().innerHTML = content;
      }
      return e;
    },
    remove: ({element: e, owner: ow}) => {
      ow.removeControl(e);
    }
  };
}
