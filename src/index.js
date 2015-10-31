import React, { Component } from 'react';
import Plate from './Plate';
import deepEqual from 'deep-equal';
import attachEventBindings from './utils/attachEventBindings';
import {props} from 'tcomb-react';
import {IFolio, IAdapterReturn} from './interfaces';
let _map = undefined;

@props(IFolio)
export default class Folio extends Component {
  componentDidMount() {
    if (!_map) {
      let {options, config, on} = this.props.schema;
      let adapter = this.props.schema.adapter({options, config});
      _map = IAdapterReturn(adapter).create({node: this.refs.map});
      if (on) {
        attachEventBindings(on, _map);
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
        IAdapterReturn(adapter).update({element: _map});
      };
    }
  }
  renderPlates() {
    let dex = [];
    this.props.decks.filter(o => o.config.enabled != false).map(({adapter, config, options, on}) => {
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


