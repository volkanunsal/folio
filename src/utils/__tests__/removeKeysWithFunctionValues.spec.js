import {expect} from 'chai';
import removeKeysWithFunctionValues from '../removeKeysWithFunctionValues';
import {noop} from '../test-utils';

describe('removeKeysWithFunctionValues', () => {
  it('should remove keys with function values 1', () => {
    expect(removeKeysWithFunctionValues({a: noop, b: 1})).to.deep.eql({b: 1});
  });
  it('should return the same input when given non-object 1', () => {
    expect(removeKeysWithFunctionValues(undefined)).to.eql(undefined);
  });
  it('should return the same input when given non-object 2', () => {
    expect(removeKeysWithFunctionValues(1)).to.eql(1);
  });
});
