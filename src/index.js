import React, { Component } from 'react';
import Plate from './Plate';
import deepEqual from 'deep-equal';
import attachEventBindings from './utils/attachEventBindings';
import {props} from 'tcomb-react';
import {IFolio, IAdapterReturn} from './interfaces';
import tcv from 'tcomb-validation';
let _map;

@props(IFolio)
export default class Folio extends Component {
  componentDidMount() {
    if (!_map) {
      let {options, config, on} = this.props.schema;
      let adapter = this.props.schema.adapter({options, config});

      if (process.env.NODE_ENV !== 'production') {
        tcv.assert(
          tcv.validate(adapter, IAdapterReturn).isValid(),
          '[folio] Invalid type returned from adapter. Must be an object defining create, update and remove functions.'
        );
      }
      _map = adapter.create({node: this.refs.map});
      _map.decks = {};
      _map.deckStack = {};
      if (on) {
        attachEventBindings(on, _map, undefined);
      }
      this.forceUpdate();
    }
  }
  componentWillReceiveProps(np) {
    // NOTE: Unable to test this due to a feature of React that causes problems
    // with JSDOM instances.
    // @see: https://github.com/facebook/react/issues/4025#issuecomment-109067628
    if (_map) {
      if (!deepEqual(np.schema.options, this.props.schema.options) || !deepEqual(np.schema.config, this.props.schema.config)) {
        let {options, config} = np.schema;
        let adapter = np.schema.adapter({options, config});
        adapter.update({element: _map});
      }
    }
  }
  renderPlates() {
    let dex = [];
    let disabled = this.props.decks.filter(o => o.config.enabled === false).map(o => o.config.name );

    this.props.decks
    .filter(o => o.config.enabled !== false) // Filter out disabled decks
    .filter(o => o.config.belongsTo ? disabled.indexOf(o.config.belongsTo.name) === -1 : true) // Filter out decks whose parent decks have been disabled.
    .forEach(({adapter, config, options, on}) => {
      dex.push(<Plate config={config} options={options} map={_map} adapter={adapter} key={config.name} on={on} />);
    });
    return dex;
  }
  render() {
    let dex = _map ? this.renderPlates() : [];
    let mapConfig = this.props.schema.config;
    return <div className='folio'>
      <div ref='map' style={mapConfig.style} className={mapConfig.className}/>
      <div>{dex}</div>
    </div>;
  }
}


