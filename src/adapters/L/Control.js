/*globals L*/
import t from 'tcomb';
import ReactDOM from 'react-dom';
import {control} from './plugins/Control';

export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {
      let e = control(o);
      ow.addControl(e);
      return e;
    },
    update: ({element: e}) => {
      t.match(c.content,
        t.Function, () => {
          ReactDOM.render(c.content(), e.getContainer());
        },
        t.Any, () => {
          e.getContainer().innerHTML = c.content;
        }
      );
      return e;
    },
    remove: ({element: e, owner: ow}) => {
      ow.removeControl(e);
    }
  };
}
