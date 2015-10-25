import { Component } from 'react';
import deepEqual from 'deep-equal';
import {props} from 'tcomb-react';
import {IDeckContainer} from './interfaces';

@props(IDeckContainer)
export default class Deck extends Component {
  componentDidMount() {
    this.element = this.props.adapter.create(this.props.options, this.props.config);
    this.props.adapter.add(this.element, this.props.map);
    this.props.adapter.update ? this.props.adapter.update.call(this, this.element, this.props.options, this.props.config) : undefined;
  }
  componentWillUnmount() {
    this.props.adapter.remove(this.element, this.props.map);
  }
  componentWillReceiveProps(np) {
    np.adapter.update.call(this, this.element, np.options, np.config);
  }
  shouldComponentUpdate(np) {
    return !this.props.config || !deepEqual(np.config, this.props.config) || !deepEqual(np.options, this.props.options)
  }
  render() {
    return null
  }
}
