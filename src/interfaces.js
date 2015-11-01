import t from 'tcomb';

export const IEventBindings = t.maybe(t.dict(t.String, t.Function));

export const IAdapter = t.Function;
export const  IAdapterReturn = t.struct({
  create: t.Function,
  update: t.Function,
  remove: t.Function
}, 'IAdapterReturn');

export const IConfig = t.struct({
  name: t.String,
  enabled: t.maybe(t.Boolean),
  belongsTo: t.maybe(t.struct({
    name: t.String,
    owner: t.maybe(t.Boolean)
  }))
}, 'IConfig');

export const IDeck = t.struct({
  adapter: IAdapter,
  config: IConfig,
  options: t.maybe(t.Object),
  on: IEventBindings
}, 'IDeck');

export const IFolio = t.struct({
  schema: IDeck,
  decks: t.maybe(t.list(IDeck))
}, 'IFolio');

export const IPlaten = t.struct({
  adapter: IAdapter,
  options: t.maybe(t.Object),
  config: IConfig,
  on: IEventBindings,
  map: t.Object
}, 'IPlaten');
