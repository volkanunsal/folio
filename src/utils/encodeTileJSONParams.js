/*globals encodeURIComponent*/
import t from 'tcomb';

export default function encodeTileJSONParams(params, _included) {
  if (!params) { return ''; }
  let urlParams = [];
  let included = _included || Object.keys(params);
  for (let i in included) {
    if (!included.hasOwnProperty(i)) { continue; }
    let k = included[i];
    let p = params[k];
    if (p) {
      if (t.Array.is(p)) {
        let j = 0;
        let len = p.length;
        while (j < len) {
          urlParams.push(k + '[]=' + encodeURIComponent(p[j]));
          j++;
        }
      } else {
        let q = encodeURIComponent(p);
        q = q.replace(/%7Bx%7D/g, '{x}').replace(/%7By%7D/g, '{y}').replace(/%7Bz%7D/g, '{z}');
        urlParams.push(k + '=' + q);
      }
    }
  }
  return urlParams.join('&');
}
