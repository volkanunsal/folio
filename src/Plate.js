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
    // Configure ownership
    let owner = this.getOwner();
    if (owner) {
      this.element = adapter.create({owner});
      this.props.map.decks[config.name] = this.element;
      adapter.update({element: this.element});
      if (on) {
        attachEventBindings(on, this.element, this.props.map);
      }
      // TODO: If this deck has other decks that refer to it as owner, make sure
      // those decks are added after this has been added.
    }
  }
  getOwner() {
    let {config} = this.props;
    let owner;
    if (config.belongsTo && config.belongsTo.owner) {
      owner = this.props.map.decks[config.belongsTo.name];
      if (!owner) {
        // TODO: add the deck name into the stack.
        return;
      }
    } else {
      owner = this.props.map;
    }
    return owner;
  }
  componentWillUnmount() {
    let {options, config} = this.props;
    let owner = this.getOwner();
    let adapter = this.props.adapter({options, config});
    adapter.remove({element: this.element, owner});
    delete this.props.map.decks[config.name];
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
