/*globals L*/
import t from 'tcomb';
const {L} = window;

export default {
  add: (element: t.Object, map: t.Object): t.Nil {
    map.addControl(element);
  },
  create: (options: t.maybe(t.Object), config: t.maybe(t.Object)): t.Object {
    return L.control(options)
  },
  update: (element: t.Object, options: t.maybe(t.Object), config: t.maybe(t.Object)): t.Object {
    return L.control(options)
  },
  remove: (element: t.Object, map: t.Object): t.Nil {
    map.removeControl(element);
  }
}