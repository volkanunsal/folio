'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var IEventBindings = _tcomb2['default'].maybe(_tcomb2['default'].dict(_tcomb2['default'].String, _tcomb2['default'].Function));

exports.IEventBindings = IEventBindings;
var IAdapter = _tcomb2['default'].Function;
exports.IAdapter = IAdapter;
var IAdapterReturn = _tcomb2['default'].struct({
  create: _tcomb2['default'].Function,
  update: _tcomb2['default'].Function,
  remove: _tcomb2['default'].Function
}, 'IAdapterReturn');

exports.IAdapterReturn = IAdapterReturn;
var IConfig = _tcomb2['default'].struct({
  name: _tcomb2['default'].String,
  enabled: _tcomb2['default'].maybe(_tcomb2['default'].Boolean),
  belongsTo: _tcomb2['default'].maybe(_tcomb2['default'].struct({
    name: _tcomb2['default'].String,
    owner: _tcomb2['default'].maybe(_tcomb2['default'].Boolean)
  }))
}, 'IConfig');

exports.IConfig = IConfig;
var IDeck = _tcomb2['default'].struct({
  adapter: IAdapter,
  config: IConfig,
  options: _tcomb2['default'].maybe(_tcomb2['default'].Object),
  on: IEventBindings
}, 'IDeck');

exports.IDeck = IDeck;
var IFolio = _tcomb2['default'].struct({
  schema: IDeck,
  decks: _tcomb2['default'].maybe(_tcomb2['default'].list(IDeck))
}, 'IFolio');

exports.IFolio = IFolio;
var IPlaten = _tcomb2['default'].struct({
  adapter: IAdapter,
  options: _tcomb2['default'].maybe(_tcomb2['default'].Object),
  config: IConfig,
  on: IEventBindings,
  map: _tcomb2['default'].Object
}, 'IPlaten');
exports.IPlaten = IPlaten;