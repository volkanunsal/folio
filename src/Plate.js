import { Component } from 'react';
import deepEqual from 'deep-equal';
import {props} from 'tcomb-react';
import {IPlaten, IAdapterReturn} from './interfaces';
import attachEventBindings from './utils/attachEventBindings';

@props(IPlaten)
export default class Plate extends Component {
  componentDidMount() {
    let {options, config} = this.props;
    let adapter = this.props.adapter({options, config});

    this.element = IAdapterReturn(adapter).create({owner: this.props.map});
    IAdapterReturn(adapter).update({element: this.element});
  }
  componentWillUnmount() {
    let {options, config} = this.props;
    let adapter = this.props.adapter({options, config});
    IAdapterReturn(adapter)
      .remove({element: this.element, owner: this.props.map});
  }
  componentWillReceiveProps(np) {
    let {options, config} = np;
    let adapter = np.adapter({options, config});
    IAdapterReturn(adapter).update({element: this.element});
  }
  shouldComponentUpdate(np) {
    // OPTIMIZE: can we use a persistent data structure to get rid of deepEqual checks?
    return !this.props.config || !deepEqual(np.config, this.props.config) || !deepEqual(np.options, this.props.options)
  }
  render() {
    return null
  }
}
