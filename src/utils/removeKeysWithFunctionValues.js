import t from 'tcomb';

export default function removeKeysWithFunctionValues(options) {
  if (!t.Object.is(options)) {
    return options;
  }
  let nextOptions = {};
  Object.keys(options)
  .forEach(key => {
    if (!t.Function.is(options[key])) {
      nextOptions[key] = options[key];
    }
  });
  return nextOptions;
}
