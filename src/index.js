import React, { Component } from 'react';
import Deck from './Deck';
import deepEqual from 'deep-equal';
import attachEventBindings from './utils/attachEventBindings';
import {props} from 'tcomb-react';
import {ICaravelContainer, IAdapterReturnType} from './interfaces';
let _map = undefined;

@props(ICaravelContainer)
export default class Caravel extends Component {
  componentDidMount() {
    if (!_map) {
      let {options, config, on} = this.props.schema;
      let adapter = this.props.schema.adapter({options, config});
      _map = IAdapterReturnType(adapter).create({node: this.refs.map});
      if (on) {
        attachEventBindings(on);
      }
      this.forceUpdate();
    };
  }
  componentWillReceiveProps(np) {
    // NOTE: Unable to test this due to a feature of React that causes problems
    // with JSDOM instances.
    // @see: https://github.com/facebook/react/issues/4025#issuecomment-109067628
    if (_map) {
      if (!deepEqual(np.schema.options, this.props.schema.options) || !deepEqual(np.schema.config, this.props.schema.config)) {
        let {options, config} = np.schema;
        let adapter = np.schema.adapter({options, config});
        IAdapterReturnType(adapter).update({element: _map});
      };
    }
  }
  renderDecks() {
    let dex = [];
    this.props.decks.filter(o => o.config.enabled != false).map(({adapter, config, options, on}) => {
      dex.push(<Deck config={config} options={options} map={_map} adapter={adapter} key={config.name} on={on} />);
    });
    return dex;
  }
  render() {
    let dex = _map ? this.renderDecks() : [];
    let mapConfig = this.props.schema.config;
    return <div className='caravel-container'>
      <div ref='map' style={mapConfig.style} className={mapConfig.className}/>
      <div>{dex}</div>
    </div>;
  }
}


