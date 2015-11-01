import { Component } from 'react';
import deepEqual from 'deep-equal';
import {props} from 'tcomb-react';
import {IPlaten, IAdapterReturn} from './interfaces';
import attachEventBindings from './utils/attachEventBindings';
import tcv from 'tcomb-validation';

@props(IPlaten)
export default class Plate extends Component {
  componentDidMount() {
    let {options, config, on} = this.props;
    let adapter = this.props.adapter({options, config});
    if (process.env.NODE_ENV !== 'production') {
      tcv.assert(
        tcv.validate(adapter, IAdapterReturn).isValid(),
        '[folio] Invalid type returned from adapter. Must be an object defining create, update and remove functions.'
      );
    }
    this.element = adapter.create({owner: this.props.map});
    adapter.update({element: this.element});
    if (on) {
      attachEventBindings(on, this.element);
    }
  }
  componentWillUnmount() {
    let {options, config} = this.props;
    let adapter = this.props.adapter({options, config});
    adapter
      .remove({element: this.element, owner: this.props.map});
  }
  componentWillReceiveProps(np) {
    let {options, config} = np;
    let adapter = np.adapter({options, config});
    adapter.update({element: this.element});
  }
  shouldComponentUpdate(np) {
    // OPTIMIZE: can we use a persistent data structure to get rid of deepEqual checks?
    return !this.props.config || !deepEqual(np.config, this.props.config) || !deepEqual(np.options, this.props.options);
  }
  render() {
    return null;
  }
}
