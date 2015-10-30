import { Component } from 'react';
import deepEqual from 'deep-equal';
import {props} from 'tcomb-react';
import {IDeckContainer, IAdapterReturnType} from './interfaces';
import attachEventBindings from './utils/attachEventBindings';

@props(IDeckContainer)
export default class Deck extends Component {
  componentDidMount() {
    let {options, config} = this.props;
    let adapter = this.props.adapter({options, config});

    this.element = IAdapterReturnType(adapter).create({owner: this.props.map});
    IAdapterReturnType(adapter).update({element: this.element});
  }
  componentWillUnmount() {
    let {options, config} = this.props;
    let adapter = this.props.adapter({options, config});
    IAdapterReturnType(adapter)
      .remove({element: this.element, owner: this.props.map});
  }
  componentWillReceiveProps(np) {
    let {options, config} = np;
    let adapter = np.adapter({options, config});
    IAdapterReturnType(adapter).update({element: this.element});
  }
  shouldComponentUpdate(np) {
    // OPTIMIZE: can we use a persistent data structure to get rid of deepEqual checks?
    return !this.props.config || !deepEqual(np.config, this.props.config) || !deepEqual(np.options, this.props.options)
  }
  render() {
    return null
  }
}
