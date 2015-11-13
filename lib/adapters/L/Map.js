/*globals L*/
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var L = window.L;

L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images';

var defaults = {
  maxZoom: 19,
  zoomControl: false
};

exports['default'] = function (_ref) {
  var c = _ref.config;
  var o = _ref.options;

  return {
    create: function create(_ref2) {
      var n = _ref2.node;

      return L.map(_reactDom2['default'].findDOMNode(n), _extends({}, defaults, o));
    },
    update: function update(_ref3) {
      var e = _ref3.element;

      if (c.center && c.zoom) {
        e.setView(c.center, c.zoom, o.zoomPanOptions || {});
      }
      return e;
    },
    remove: function remove(_ref4) {
      var e = _ref4.element;

      e.remove();
    }
  };
};

module.exports = exports['default'];