/*globals L*/
const {L} = window;
let Control = {
  includes: L.Mixin.Events,
  options: {
    position: 'topright',
    className: 'my-custom-control'
  },
  initialize(options) {
    L.Util.setOptions(this, options);
  },
  onAdd() {
    // create the control container with a particular class name
    const container = L.DomUtil.create('div', this.options.className);
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
    return container;
  }
};
export function control(options) {
  let NewControl = L.Control.extend(Control);
  return new NewControl(options);
}
