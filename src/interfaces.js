import t from 'tcomb';

export const IEventBindings = t.maybe(t.dict(t.String, t.Function));

export const IAdapter = t.Function;
export const  IAdapterReturnType = t.struct({
  create: t.Function,
  update: t.maybe(t.Function),
  remove: t.Function
}, 'IAdapterReturnType');

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
  config: IConfig,
  options: t.maybe(t.Object),
  on: IEventBindings
}, 'IDeck');

export const ICaravelContainer = t.struct({
  schema: IDeck,
  decks: t.maybe(t.list(IDeck))
}, 'ICaravelContainer');

export const IDeckContainer = t.struct({
  adapter: IAdapter,
  options: t.maybe(t.Object),
  config: IConfig,
  on: IEventBindings,
  map: t.Object
}, 'IDeckContainer');
