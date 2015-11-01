/*eslint no-eval: 0*/
import t from 'tcomb';

export default function getZoomStyle(zoom, styles) {
  let style;
  Object.keys(t.Object(styles)).forEach(key => {
    let digs = parseInt(key.match(/\d+/)[0], 10);
    let chars = key.match(/\W+/);
    chars = chars ? chars[0] : '===';
    if (digs && chars && eval(zoom + chars + digs)) {
      style = styles[key];
    }
  });
  return t.Object(style);
}
