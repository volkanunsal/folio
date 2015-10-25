import React, { Component } from 'react';
import Deck from './Deck';
import deepEqual from 'deep-equal';

let _map = false;
export default class Caravel extends Component {
  componentDidMount() {
    if (!_map) {
      _map = this.props.map.adapter.create(this.props.map.options, this.props.map.config);
    };
  }
  componentWillReceiveProps(np) {
    if (!deepEqual(np.map.options, this.props.map.options)) {
      np.map.adapter.update.call(this, np.map.options, np.map.config);
    };
  }
  render() {
    let children = [];
    if (_map) {
      this.props.decks.filter(o => o.config.enabled).map(({config, options}) => {
        children.push(<Deck config={config} options={options}/>);
      });
    };
    let mapConfig = this.props.map.config;
    return <div className='caravel-container'>
      <div ref='map' style={mapConfig.style} className={mapConfig.className}/>
      <div>{children}</div>
    </div>;
  }
}


