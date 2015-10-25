/*globals L*/
// import t from 'tcomb';
// const {L} = window;
// import ReactDOM from 'react-dom';

// export default {
//   create: (options: t.maybe(t.Object), config: t.maybe(t.Object)
//   ): t.Object => {
//     return L.control(options)
//   },
//   add: (element: t.Object, owner: t.Object): t.Nil => {
//     owner.addControl(element);
//   },
//   update: (element: t.Object, options: t.maybe(t.Object), config: t.maybe(t.Object)
//   ): t.Object => {
//     if (t.Function.is(config.content)) {
//       ReactDOM.render(config.content, element.getContainer());
//     } else {
//       element.getContainer().innerHTML = content;
//     }
//     return element;
//   },
//   remove: (element: t.Object, owner: t.Object): t.Nil => {
//     owner.removeControl(element);
//   }
// }
