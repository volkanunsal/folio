/*eslint no-unused-expressions: 0*/
import {expect} from 'chai';
import sinon from 'sinon';
import t from 'tcomb';
import {deepRender, shallowRender} from './test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Deck from '../src/Deck';

let props = {
  adapter: {
    create: sinon.spy(),
    add: sinon.spy()
  },
  config: {
    name: 'testDeck',
  },
  options: {name: 'some options'},
  map: {name: 'the map object'}
};

let deckSpy;
describe('Deck', () => {
  beforeEach(() => {
    deckSpy = sinon.spy();
  });
  describe('when mounted', () => {
    it('should call adapter.create with options and config', () => {
      deepRender(props, Deck);
      expect(props.adapter.create).to.have.been.calledWith(props.options, props.config);
    });

    it('should call add on the deck adapter with the returned element', () => {
      deepRender(t.update(props, {adapter: {create: {$set: sinon.stub().returns('yo')}}}), Deck);
      expect(props.adapter.add).to.have.been.calledWith('yo', props.map);
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
