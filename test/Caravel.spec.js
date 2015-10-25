/*eslint no-unused-expressions: 0*/
import {expect} from 'chai';
import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import Caravel from '../src';
import React from 'react';
import ReactDOM from 'react-dom';
import t from 'tcomb';

let props = {
  map: {
    adapter: {
      create: sinon.spy(),
      update: sinon.spy()
    },
    config: {
      style: {width: 800},
      className: 'yo'
    },
    on: sinon.spy()
  },
  decks: [
    {
      config: {
        name: 'Deck1',
        enabled: true
      }
    },
    {
      config: {
        name: 'Deck2',
        enabled: false
      }
    }
  ]
};

function shallowRender( _props = props, comp = Caravel) {
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

function deepRender(_props = props, comp = Caravel) {
  let factory = React.createFactory(comp);
  let instance = TestUtils.renderIntoDocument(factory(_props));
  return {
    instance
  };
}

let TestParent = React.createClass({
    getInitialState() {
      return {...this.props};
    },
    render() {
      return <Caravel ref='sot' {...this.state} />
    }
  })
;

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
        Caravel.__Rewire__('_map', true);
      });
      afterEach(() => {
        Caravel.__ResetDependency__('_map');
      });
      it('should render the enabled decks', () => {
        deepRender();
        let enabled = props.decks.filter(o => o.config.enabled)[0];
        let disabled = props.decks.filter(o => !o.config.enabled)[0];
        expect(deckSpy).to.have.been.calledWithMatch(enabled);
        expect(deckSpy).to.have.not.been.calledWithMatch(disabled);
      });
    });
    describe('if the map has NOT been mounted', () => {
      it('should NOT render any decks', () => {
        deepRender();
        expect(deckSpy).to.have.not.been.called;
      });
      it('should create a new map', () => {
        deepRender();
        expect(props.map.adapter.create).to.have.been.called;
        expect(props.map.adapter.update).to.have.not.been.called;
      });
    });
  });
  describe('when new props are received', () => {

    describe('if the map has been mounted', () => {
      beforeEach(() => {
        Caravel.__Rewire__('_map', true);
      });
      afterEach(() => {
        Caravel.__ResetDependency__('_map');
      });

      it.only('should render the enabled decks', () => {
        let {instance} = shallowRender(props, TestParent);
        let deck3 = {config: {name: 'Deck3', enabled: true}};
        let updatedProps = t.update(props, {decks: {$push: [deck3]}});
        instance.setState(updatedProps);
        expect(deckSpy).to.have.been.calledWithMatch(deck3);
      });

      describe('and the the map options have changed', () => {
        it('should update the map', () => {
          let updatedProps = t.update(props, {map: {options: {$merge: {oh: 'my'}}}});
          expect(props.map.adapter.create).to.have.not.been.called;
          expect(props.map.adapter.update).to.have.been.calledWithMatch(sinon.match({oh: 'my'}));
        });
      });
      describe('and the the map name has changed', () => {
        it('should create a new map', () => {
          deepRender(t.update(props, {map: {config: {name: {$set: 'yolo'}}}}));
          expect(props.map.adapter.create).to.have.been.called;
          expect(props.map.adapter.update).to.have.not.been.called;
        });
      });
      describe('and the the map configs have changed', () => {
        it('should update the map', () => {
          deepRender(t.update(props, {map: {config: {$merge: {oh: 'my'}}}}));
          expect(props.map.adapter.create).to.have.not.been.called;
          expect(props.map.adapter.update).to.have.been.called;
        });
        it('should update the map node props', () => {
          const {instance} = deepRender(t.update(props, {map: {config: {$set: {className: 'my'}}}}));
          TestUtils.findRenderedDOMComponentWithClass(instance, 'my')
        });
      });
    });
  });

  describe('#renderMap', () => {
    describe('when event bindings are set on map', () => {
      it('should attach the event bindings to the map', () => {
        let deckSpy = sinon.spy();
        Caravel.__Rewire__('attachEventBindings', deckSpy);
        shallowRender();
        expect(deckSpy).to.have.been.calledWith(props.map.on);
        Caravel.__ResetDependency__('attachEventBindings');
      });
    });
    describe('when event bindings are not set on map', () => {
      it('should not attach the event bindings to the map', () => {
        let deckSpy = sinon.spy();
        Caravel.__Rewire__('attachEventBindings', deckSpy);
        shallowRender(t.update(props, {on: {$set: false}}));
        expect(deckSpy).to.have.not.been.called;
        Caravel.__ResetDependency__('attachEventBindings');
      });
    });
  });

  it('should render correctly', () => {
    const { instance, output } = shallowRender();
    // let output = TestUtils.findRenderedDOMComponentWithClass(instance, 'caravel-container');
    let [div1, div2] = output.props.children;

    expect(div1.ref).to.eql('map');
    expect(div1.props.style).to.deep.eql({width: 800});
    expect(div1.props.className).to.eql('yo');
  });
});
