import removeKeysWithFunctionValues from './removeKeysWithFunctionValues';
import deepEqual from 'deep-equal';

export default function objectsAreEqual(a, b) {
  return deepEqual(...[a, b].map(o => removeKeysWithFunctionValues(o)), {strict: true});
}
