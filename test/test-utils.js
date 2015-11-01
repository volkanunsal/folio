import TestUtils from 'react-addons-test-utils';
import React from 'react';

export function shallowRender( _props, comp) {
  let renderer = TestUtils.createRenderer();
  let factory = React.createFactory(comp);
  renderer.render(factory(_props));
  let output = renderer.getRenderOutput();
  let instance = renderer._instance._instance;
  return {
    output,
    renderer,
    instance
  };
}

export function deepRender(_props, comp) {
  let factory = React.createFactory(comp);
  let instance = TestUtils.renderIntoDocument(factory(_props));
  return {
    instance
  };
}
