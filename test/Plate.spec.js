/*eslint-disable*/
import {expect} from 'chai';
import sinon from 'sinon';
import {deepRender, shallowRender} from './test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Plate from '../src/Plate';

let props = {
  adapter: () => ({
    create: () => sinon.stub().return(() => {}),
    update: () => sinon.stub().return(() => {}),
    remove: () => sinon.stub().return(() => {})
  }),
  config: {
    name: 'testPlate',
  },
  options: {name: 'some options'},
  map: {name: 'the map object'}
};

let plateSpy;
describe('Plate', () => {
  beforeEach(() => {
    plateSpy = sinon.spy();
  });
  

});
