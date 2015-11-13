'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Plate = require('./Plate');

var _Plate2 = _interopRequireDefault(_Plate);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _utilsAttachEventBindings = require('./utils/attachEventBindings');

var _utilsAttachEventBindings2 = _interopRequireDefault(_utilsAttachEventBindings);

var _utilsGetFirstDupInArray = require('./utils/getFirstDupInArray');

var _utilsGetFirstDupInArray2 = _interopRequireDefault(_utilsGetFirstDupInArray);

var _tcombReact = require('tcomb-react');

var _interfaces = require('./interfaces');

var _tcombValidation = require('tcomb-validation');

var _tcombValidation2 = _interopRequireDefault(_tcombValidation);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var Folio = (function (_Component) {
  _inherits(Folio, _Component);

  function Folio() {
    _classCallCheck(this, _Folio);

    _Component.apply(this, arguments);
  }

  Folio.prototype.componentDidMount = function componentDidMount() {
    var _props$schema = this.props.schema;
    var options = _props$schema.options;
    var config = _props$schema.config;
    var on = _props$schema.on;

    var adapter = this.props.schema.adapter({ options: options, config: config });
    if (process.env.NODE_ENV !== 'production') {
      _tcombValidation2['default'].assert(_tcombValidation2['default'].validate(adapter, _interfaces.IAdapterReturn).isValid(), '[folio] Invalid type returned from adapter. Must be an object defining create, update and remove functions.');
    }
    this.map = adapter.create({ node: this.refs.map });
    this.map.decks = {};
    this.map.deckStack = {};
    if (on) {
      _utilsAttachEventBindings2['default'](on, this.map, undefined);
    }
    if (config.ready && _tcomb2['default'].Function.is(config.ready)) {
      config.ready({ map: this.map });
    }
    this.forceUpdate();
  };

  Folio.prototype.componentWillReceiveProps = function componentWillReceiveProps(np) {
    // NOTE: Unable to test this due to a feature of React that causes problems
    // with JSDOM instances.
    // @see: https://github.com/facebook/react/issues/4025#issuecomment-109067628
    if (this.map) {
      if (!_deepEqual2['default'](np.schema.options, this.props.schema.options) || !_deepEqual2['default'](np.schema.config, this.props.schema.config)) {
        var _np$schema = np.schema;
        var options = _np$schema.options;
        var config = _np$schema.config;

        var adapter = np.schema.adapter({ options: options, config: config });
        adapter.update({ element: this.map });
      }
    }
  };

  Folio.prototype.renderPlates = function renderPlates() {
    var _this = this;

    var dex = [];
    if (!this.map) {
      return dex;
    }
    var disabled = this.props.decks.filter(function (o) {
      return o.config.enabled === false;
    }).map(function (o) {
      return o.config.name;
    });
    var enabledDecks = this.props.decks.filter(function (o) {
      return o.config.enabled !== false;
    }) // Filter out disabled decks
    .filter(function (o) {
      return o.config.belongsTo ? disabled.indexOf(o.config.belongsTo.name) === -1 : true;
    }); // Filter out decks associated to disabled decks.

    if (process.env.NODE_ENV !== 'production') {
      (function () {
        var enabledDeckNames = enabledDecks.map(function (o) {
          return o.config.name;
        });
        var dupName = _utilsGetFirstDupInArray2['default'](enabledDeckNames);
        enabledDeckNames.forEach(function (name) {
          _tcombValidation2['default'].assert(_tcomb2['default'].String.is(name), '[folio] InvalidNameError. Decks names must be string. Name: ' + dupName);
        });
        _tcombValidation2['default'].assert(dupName === false, '[folio] DupNameError. Decks must have unique names. Repeated: ' + dupName + '.');
      })();
    }

    enabledDecks.forEach(function (_ref) {
      var adapter = _ref.adapter;
      var config = _ref.config;
      var options = _ref.options;
      var on = _ref.on;

      dex.push(_react2['default'].createElement(_Plate2['default'], { config: config, options: options, map: _this.map, adapter: adapter, key: config.name, on: on }));
    });
    return dex;
  };

  Folio.prototype.render = function render() {
    var mapConfig = this.props.schema.config;
    return _react2['default'].createElement(
      'div',
      { className: 'folio' },
      _react2['default'].createElement('div', { ref: 'map', style: mapConfig.style, className: mapConfig.className }),
      _react2['default'].createElement(
        'div',
        null,
        this.renderPlates()
      )
    );
  };

  var _Folio = Folio;
  Folio = _tcombReact.props(_interfaces.IFolio)(Folio) || Folio;
  return Folio;
})(_react.Component);

exports['default'] = Folio;
module.exports = exports['default'];