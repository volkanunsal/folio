import t from 'tcomb';

export const IAdapter = t.struct({
  create: t.Function,
  add: t.maybe(t.Function),
  update: t.maybe(t.Function),
  remove: t.Function,
  IOptions: t.maybe(t.Object)
}, 'IAdapter');

export const IConfig = t.struct({
  name: t.String,
  enabled: t.maybe(t.Boolean),
  belongsTo: t.maybe(t.struct({
    name: t.String,
    isOwner: t.Boolean
  }))
}, 'IConfig');

export const IDeck = t.struct({
  adapter: IAdapter,
  options: t.maybe(t.Object),
  config: t.maybe(t.Object),
  on: t.maybe(t.dict(t.String, t.Function))
}, 'IDeck');

export const ICaravel = t.struct({
  map: IDeck,
  decks: t.list(IDeck)
}, 'ICaravel');

export const IDeck = t.struct({
  map: t.Object,
  options: t.Object,
  config: IConfig,
  key: t.Any
}, 'IDeck');
