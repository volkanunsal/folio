/*globals L*/
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _pluginsControl = require('./plugins/Control');

exports['default'] = function (_ref) {
  var c = _ref.config;
  var o = _ref.options;

  return {
    create: function create(_ref2) {
      var ow = _ref2.owner;

      var e = _pluginsControl.control(o);
      ow.addControl(e);
      return e;
    },
    update: function update(_ref3) {
      var e = _ref3.element;
      var store = _ref3.store;

      _tcomb2['default'].match(c.content, _tcomb2['default'].Function, function () {
        _reactDom2['default'].render(c.content(store), e.getContainer());
      }, _tcomb2['default'].Any, function () {
        e.getContainer().innerHTML = c.content;
      });
      return e;
    },
    remove: function remove(_ref4) {
      var e = _ref4.element;
      var ow = _ref4.owner;

      ow.removeControl(e);
    }
  };
};

module.exports = exports['default'];