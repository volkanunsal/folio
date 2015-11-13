'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _objectsAreEqual = require('../objectsAreEqual');

var _objectsAreEqual2 = _interopRequireDefault(_objectsAreEqual);

describe('objectsAreEqual', function () {
  it('should evaluate the same objects as equal 1', function () {
    _chai.expect(_objectsAreEqual2['default']({ a: 1 }, { a: 1 })).to.eql(true);
  });
  it('should evaluate the same objects as equal 2', function () {
    _chai.expect(_objectsAreEqual2['default']({ a: '1' }, { a: '1' })).to.eql(true);
  });
  it('should evaluate the different objects as unequal 1', function () {
    _chai.expect(_objectsAreEqual2['default']({ a: 1 }, { a: '1' })).to.eql(false);
  });
  it('should evaluate the different objects as unequal 2', function () {
    _chai.expect(_objectsAreEqual2['default']({ a: '1' }, { a: 1 })).to.eql(false);
  });
  it('should evaluate the different objects as unequal 3', function () {
    _chai.expect(_objectsAreEqual2['default']({ b: 1 }, { a: 1 })).to.eql(false);
  });
  it('should ignore functions 1', function () {
    _chai.expect(_objectsAreEqual2['default']({ a: 1 }, { a: 1, b: function b() {} })).to.eql(true);
  });
  it('should ignore functions 2', function () {
    _chai.expect(_objectsAreEqual2['default']({ a: 1, b: function b() {} }, { a: 1 })).to.eql(true);
  });
});