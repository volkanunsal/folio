import React, { Component } from 'react';
import Plate from './Plate';
import deepEqual from 'deep-equal';
import attachEventBindings from './utils/attachEventBindings';
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
    if (config.ready && t.Function.is(config.ready)) { config.ready({map: this.map}) }
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
    this.props.decks
    .filter(o => o.config.enabled !== false) // Filter out disabled decks
    .filter(o => o.config.belongsTo ? disabled.indexOf(o.config.belongsTo.name) === -1 : true) // Filter out decks whose parent decks have been disabled.
    .forEach(({adapter, config, options, on}) => {
      dex.push(<Plate config={config} options={options} map={this.map} adapter={adapter} key={config.name} on={on} />);
    });
    return dex;
  }
  render() {
    let mapConfig = this.props.schema.config;
    return <div className='folio/src'>
      <div ref='map' style={mapConfig.style} className={mapConfig.className}/>
      <div>{this.renderPlates()}</div>
    </div>;
  }
}
