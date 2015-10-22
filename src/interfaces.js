import t from 'tcomb';

const ILeafletLayerAndControl = t.struct({
  initialize: t.maybe(t.Function),
  onAdd: t.maybe(t.Function),
  onRemove: t.maybe(t.Function)
}, 'ILeafletLayerAndControl');

const IAdapter = t.struct({
  add: t.Function,
  create: t.Function,
  update: t.maybe(t.Function),
  remove: t.maybe(t.Function)
}, 'IAdapter');

const IConfig = t.struct({
  enabled: t.maybe(t.Boolean),
  belongsTo: t.maybe(t.String)
}, 'IConfig');

const IDeck = t.struct({
  name: t.String,
  adapter: IAdapter,
  options: t.maybe(t.Object),
  config: t.maybe(t.Object),
  on: t.maybe(t.dict(t.String, t.Function))
}, 'IDeck');

const IMap = IDeck.extend({
  decks: t.maybe(t.list(IDeck))
}, 'IMap');

const IMapContainer = t.struct({
  model: IMap,
  style: t.maybe(t.Object)
})

const IDeckContainer = t.struct({
  map: t.Object,
  options: t.Object,
  config: IConfig,
  key: t.Any
})

