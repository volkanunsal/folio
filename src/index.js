import React, { Component } from 'react';
import Deck from './Deck';
import deepEqual from 'deep-equal';
import {attachEventBindings} from './utils';
import {props} from 'tcomb-react';
import {ICaravelContainer} from './interfaces';
let _map = undefined;

@props(ICaravelContainer)
export default class Caravel extends Component {
  componentDidMount() {
    if (!_map) {
      _map = this.props.schema.adapter.create.call(this, this.props.schema.options, this.props.schema.config);
      if (this.props.schema.on) {
        attachEventBindings(this.props.schema.on);
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
        np.schema.adapter.update.call(this, np.schema.options, np.schema.config);
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


