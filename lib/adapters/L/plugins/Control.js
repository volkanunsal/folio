/*globals L*/
'use strict';

exports.__esModule = true;
exports.control = control;
var L = window.L;

var Control = {
  includes: L.Mixin.Events,
  options: {
    position: 'topright',
    className: 'my-custom-control'
  },
  initialize: function initialize(options) {
    L.Util.setOptions(this, options);
  },
  onAdd: function onAdd() {
    // create the control container with a particular class name
    var container = L.DomUtil.create('div', this.options.className);
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
    return container;
  }
};

function control(options) {
  var NewControl = L.Control.extend(Control);
  return new NewControl(options);
}