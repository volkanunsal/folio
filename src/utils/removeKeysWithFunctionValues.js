import t from 'tcomb';

export let removeKeysWithFunctionValues = (options) => {
  let nextOptions = {};
  Object.keys(options)
  .forEach(key => {
    if (!t.Function.is(options[key])) {
      nextOptions[key] = options[key];
    };
  });
  return nextOptions;
}
