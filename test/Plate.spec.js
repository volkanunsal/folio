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
  xdescribe('when mounted', () => {
    it('should call adapter.create', () => {
      deepRender(props, Plate);
      expect(props.adapter().create).to.have.been.called;
    });
  });
  xdescribe('when unmounted', () => {
    it('should call adapter.destroy with element, options and config', () => {
      // body...
    });
  });
  xdescribe('when it will receive props', () => {
    describe('when the options or config have changed', () => {
      it('should call adapter.update with proper arguments', () => {
      });
    });
  });

});
