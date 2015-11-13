import React, { Component } from 'react';
import Plate from './Plate';
import deepEqual from 'deep-equal';
import attachEventBindings from './utils/attachEventBindings';
import getFirstDupInArray from './utils/getFirstDupInArray';
import {props} from 'tcomb-react';
import {IFolio, IAdapterReturn} from './interfaces';
import tcv from 'tcomb-validation';
import t from 'tcomb';

@props(IFolio)
export default class Folio extends Component {
  componentDidMount() {
    let {options, config, on} = this.props.schema;
    let adapter = this.props.schema.adapter({options, config});
    if (process.env.NODE_ENV !== 'production') {
      tcv.assert(
        tcv.validate(adapter, IAdapterReturn).isValid(),
        '[folio] Invalid type returned from adapter. Must be an object defining create, update and remove functions.'
      );
    }
    this.map = adapter.create({node: this.refs.map});
    this.map.decks = {};
    this.map.deckStack = {};
    if (on) {
      attachEventBindings(on, this.map, undefined);
    }
    if (config.ready && t.Function.is(config.ready)) { config.ready({map: this.map}); }
    this.forceUpdate();
  }
  componentWillReceiveProps(np) {
    // NOTE: Unable to test this due to a feature of React that causes problems
    // with JSDOM instances.
    // @see: https://github.com/facebook/react/issues/4025#issuecomment-109067628
    if (this.map) {
      if (!deepEqual(np.schema.options, this.props.schema.options) || !deepEqual(np.schema.config, this.props.schema.config)) {
        let {options, config} = np.schema;
        let adapter = np.schema.adapter({options, config});
        adapter.update({element: this.map});
      }
    }
  }
  renderPlates() {
    let dex = [];
    if (!this.map) { return dex; }
    let disabled = this.props.decks.filter(o => o.config.enabled === false).map(o => o.config.name );
    let enabledDecks = this.props.decks
      .filter(o => o.config.enabled !== false) // Filter out disabled decks
      .filter(o => o.config.belongsTo ? disabled.indexOf(o.config.belongsTo.name) === -1 : true); // Filter out decks associated to disabled decks.

    if (process.env.NODE_ENV !== 'production') {
      let enabledDeckNames = enabledDecks.map(o => o.config.name);
      let dupName = getFirstDupInArray(enabledDeckNames);
      enabledDeckNames.forEach( name => {
        tcv.assert(
          t.String.is(name),
          `[folio] InvalidNameError. Decks names must be string. Name: ${dupName}`
        );
      });
      tcv.assert(
        dupName === false,
        `[folio] DupNameError. Decks must have unique names. Repeated: ${dupName}.`
      );
    }

    enabledDecks
    .forEach(({adapter, config, options, on}) => {
      dex.push(<Plate config={config} options={options} map={this.map} adapter={adapter} key={config.name} on={on} />);
    });
    return dex;
  }
  render() {
    let mapConfig = this.props.schema.config;
    return <div className='folio'>
      <div ref='map' style={mapConfig.style} className={mapConfig.className}/>
      <div>{this.renderPlates()}</div>
    </div>;
  }
}
