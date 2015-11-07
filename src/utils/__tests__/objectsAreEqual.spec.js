import {expect} from 'chai';
import objectsAreEqual from '../objectsAreEqual';

describe('objectsAreEqual', () => {
  it('should evaluate the same objects as equal 1', () => {
    expect(objectsAreEqual({a: 1}, {a: 1})).to.eql(true);
  });
  it('should evaluate the same objects as equal 2', () => {
    expect(objectsAreEqual({a: '1'}, {a: '1'})).to.eql(true);
  });
  it('should evaluate the different objects as unequal 1', () => {
    expect(objectsAreEqual({a: 1}, {a: '1'})).to.eql(false);
  });
  it('should evaluate the different objects as unequal 2', () => {
    expect(objectsAreEqual({a: '1'}, {a: 1})).to.eql(false);
  });
  it('should evaluate the different objects as unequal 3', () => {
    expect(objectsAreEqual({b: 1}, {a: 1})).to.eql(false);
  });
  it('should ignore functions 1', () => {
    expect(objectsAreEqual({a: 1}, {a: 1, b: () => {}})).to.eql(true);
  });
  it('should ignore functions 2', () => {
    expect(objectsAreEqual({a: 1, b: () => {}}, {a: 1})).to.eql(true)
  });
});
