import {expect} from 'chai';
import getFirstDupInArray from '../getFirstDupInArray';

describe('getFirstDupInArray', () => {
  it('should return first dup in array 1', () => {
    expect(getFirstDupInArray([1, 1, 2, 2])).to.eql(1);
  });
  it('should return first dup in array 2', () => {
    expect(getFirstDupInArray([1, 2, 1, 2])).to.eql(1);
  });
  it('should return first dup in array 3', () => {
    expect(getFirstDupInArray([1, 2, 3, 3])).to.eql(3);
  });
  it('should return false when no dups found 1', () => {
    expect(getFirstDupInArray([1, 2, 3, 4])).to.eql(false);
  });
});
