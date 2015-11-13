'use strict';

exports.__esModule = true;
exports.noop = noop;
exports.shallowRender = shallowRender;
exports.deepRender = deepRender;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function noop() {}

function shallowRender(_props, comp) {
  var renderer = _reactAddonsTestUtils2['default'].createRenderer();
  var factory = _react2['default'].createFactory(comp);
  renderer.render(factory(_props));
  var output = renderer.getRenderOutput();
  var instance = renderer._instance._instance;
  return {
    output: output,
    renderer: renderer,
    instance: instance
  };
}

function deepRender(_props, comp) {
  var factory = _react2['default'].createFactory(comp);
  var instance = _reactAddonsTestUtils2['default'].renderIntoDocument(factory(_props));
  return {
    instance: instance
  };
}