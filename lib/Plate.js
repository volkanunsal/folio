'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _tcombReact = require('tcomb-react');

var _interfaces = require('./interfaces');

var _utilsAttachEventBindings = require('./utils/attachEventBindings');

var _utilsAttachEventBindings2 = _interopRequireDefault(_utilsAttachEventBindings);

var _utilsObjectsAreEqual = require('./utils/objectsAreEqual');

var _utilsObjectsAreEqual2 = _interopRequireDefault(_utilsObjectsAreEqual);

var _tcombValidation = require('tcomb-validation');

var _tcombValidation2 = _interopRequireDefault(_tcombValidation);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var Plate = (function (_Component) {
  _inherits(Plate, _Component);

  function Plate() {
    _classCallCheck(this, _Plate);

    _Component.apply(this, arguments);
  }

  Plate.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props;
    var options = _props.options;
    var config = _props.config;
    var on = _props.on;

    var adapter = this.props.adapter({ options: options, config: config });
    if (process.env.NODE_ENV !== 'production') {
      _tcombValidation2['default'].assert(_tcombValidation2['default'].validate(adapter, _interfaces.IAdapterReturn).isValid(), '[folio] Invalid type returned from adapter. Must be an object defining create, update and remove functions.');
    }
    // Configure ownership
    var owner = this.getOwner();
    if (owner) {
      this.element = adapter.create({ owner: owner });
      this.props.map.decks[config.name] = this.element;
      adapter.update({ store: this.context.store, element: this.element });
      if (on) {
        _utilsAttachEventBindings2['default'](on, this.element, this.props.map);
      }
      // TODO: If this deck has other decks that refer to it as owner, make sure
      // those decks are added after this has been added.
      if (config.ready && _tcomb2['default'].Function.is(config.ready)) {
        config.ready({ element: this.element, map: this.props.map });
      }
    }
  };

  Plate.prototype.getOwner = function getOwner() {
    var config = this.props.config;

    var owner = undefined;
    if (config.belongsTo && config.belongsTo.owner) {
      owner = this.props.map.decks[config.belongsTo.name];
      if (!owner) {
        // TODO: add the deck name into the stack.
        return null;
      }
    } else {
      owner = this.props.map;
    }
    return owner;
  };

  Plate.prototype.componentWillUnmount = function componentWillUnmount() {
    var _props2 = this.props;
    var options = _props2.options;
    var config = _props2.config;

    var owner = this.getOwner();
    var adapter = this.props.adapter({ options: options, config: config });
    adapter.remove({ element: this.element, owner: owner });
    delete this.props.map.decks[config.name];
  };

  Plate.prototype.componentWillReceiveProps = function componentWillReceiveProps(np) {
    var options = np.options;
    var config = np.config;

    if (!_utilsObjectsAreEqual2['default'](np.config, this.props.config) || !_utilsObjectsAreEqual2['default'](np.options, this.props.options)) {
      var adapter = np.adapter({ options: options, config: config });
      adapter.update({ store: this.context.store, element: this.element });
    }
  };

  Plate.prototype.render = function render() {
    return null;
  };

  _createClass(Plate, null, [{
    key: 'contextTypes',
    value: {
      store: _react.PropTypes.any
    },
    enumerable: true
  }]);

  var _Plate = Plate;
  Plate = _tcombReact.props(_interfaces.IPlaten)(Plate) || Plate;
  return Plate;
})(_react.Component);

exports['default'] = Plate;
module.exports = exports['default'];