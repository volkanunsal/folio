/*eslint no-unused-expressions: 0*/
import {expect} from 'chai';
import sinon from 'sinon';
import Caravel from '../src';
import React from 'react';
import t from 'tcomb';
import {deepRender, shallowRender} from './test-utils';
let makeAdapter = () => ({
  add: sinon.spy(),
  create: sinon.spy(),
  update: sinon.spy(),
  remove: sinon.spy()
});
let mapObj = {name: 'lefletElement'};
let props = {
  schema: {
    adapter: makeAdapter(),
    config: {
      name: 'map1',
      style: {width: 800},
      className: 'yo'
    },
    on: sinon.spy()
  },
  decks: [
    {
      adapter: makeAdapter(),
      config: {
        name: 'Deck1',
        enabled: true
      },
      on: {
        click: 'event bindings 1'
      }
    },
    {
      adapter: makeAdapter(),
      config: {
        name: 'Deck2',
        enabled: false
      },
      on: {
        click: 'event bindings 2'
      }
    }
  ]
};

let deckSpy;
describe('Caravel', () => {
  beforeEach(() => {
    deckSpy = sinon.spy();
    Caravel.__Rewire__('Deck', (args) => {
      deckSpy(args);
      return <div/>
    });
  });
  afterEach(() => {
    Caravel.__RewireAPI__.__ResetDependency__('Deck');
  });
  describe('when the component is mounted', () => {
    describe('if the map has been mounted', () => {
      beforeEach(() => {
        Caravel.__Rewire__('_map', mapObj);
      });
      afterEach(() => {
        Caravel.__ResetDependency__('_map');
      });
      it('should render the enabled decks', () => {
        deepRender(props, Caravel);
        let enabled = props.decks.filter(o => o.config.enabled)[0];
        let disabled = props.decks.filter(o => !o.config.enabled)[0];
        expect(deckSpy).to.have.been.calledWithMatch(enabled);
        expect(deckSpy).to.have.not.been.calledWithMatch(disabled);
      });
      it('should pass the map object to deck container', () => {
        // Replace the spy with a stub that can return a value.
        deepRender(props, Caravel);
        expect(deckSpy).to.have.been.calledWithMatch({map: mapObj});
      });
      it('should pass the adapter to deck container', () => {
        deepRender(props, Caravel);
        expect(deckSpy).to.have.been.calledWithMatch({adapter: props.decks[0].adapter});
      });
      it('should pass the event bindings to deck container', () => {
        deepRender(props, Caravel);
        expect(deckSpy).to.have.been.calledWithMatch({on: props.decks[0].on});
      });
    });
    describe('if the map has NOT been mounted', () => {
      it('should NOT render any decks', () => {
        deepRender(props, Caravel);
        expect(deckSpy).to.have.not.been.called;
      });
      it('should create a new map', () => {
        deepRender(props, Caravel);
        expect(props.schema.adapter.create).to.have.been.called;
        expect(props.schema.adapter.update).to.have.not.been.called;
      });
    });
  });
  describe('when event bindings are specified for map', () => {
    it('should attach the event bindings to the map', () => {
      let eventSpy = sinon.spy();
      Caravel.__RewireAPI__.__Rewire__('attachEventBindings', eventSpy);
      deepRender(props, Caravel);
      expect(eventSpy).to.have.been.calledWith(props.schema.on);
      Caravel.__RewireAPI__.__ResetDependency__('attachEventBindings');
    });
  });
  describe('when event bindings are not specified for map', () => {
    it('should not attach the event bindings to the map', () => {
      let eventSpy = sinon.spy();
      Caravel.__RewireAPI__.__Rewire__('attachEventBindings', eventSpy);
      deepRender(t.update(props, {schema: {on: {$set: undefined}}}), Caravel);
      expect(eventSpy).to.have.not.been.called;
      Caravel.__RewireAPI__.__ResetDependency__('attachEventBindings');
    });
  });
  xdescribe('when it will receive props', () => {
    describe('when the options or config have changed and map is present', () => {
      it('should call adapter.update with proper arguments', () => {
      });
    });
  });
  it('should render correctly', () => {
    const { output } = shallowRender(props, Caravel);
    let [div1] = output.props.children;
    expect(div1.ref).to.eql('map');
    expect(div1.props.style).to.deep.eql({width: 800});
    expect(div1.props.className).to.eql('yo');
  });
});
