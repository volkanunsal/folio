'use strict';

exports.__esModule = true;
var defaults = {
  stroke: '#555555',
  'stroke-width': 2,
  'stroke-opacity': 1,
  fill: '#555555',
  'fill-opacity': 0.5
};

var mapping = [['stroke', 'color'], ['stroke-width', 'weight'], ['stroke-opacity', 'opacity'], ['fill', 'fillColor'], ['fill-opacity', 'fillOpacity']];

function fallback(a, b) {
  var c = {};
  for (var k in b) {
    if (a[k] === undefined) {
      c[k] = b[k];
    } else {
      c[k] = a[k];
    }
  }
  return c;
}

function remap(a) {
  var d = {};
  var i = 0;
  while (i < mapping.length) {
    d[mapping[i][1]] = a[mapping[i][0]];
    i++;
  }
  return d;
}

function style(feature) {
  return remap(fallback(feature.properties || {}, defaults));
}

exports['default'] = { style: style, defaults: defaults };
module.exports = exports['default'];