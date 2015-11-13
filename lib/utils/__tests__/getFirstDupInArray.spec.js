'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _getFirstDupInArray = require('../getFirstDupInArray');

var _getFirstDupInArray2 = _interopRequireDefault(_getFirstDupInArray);

describe('getFirstDupInArray', function () {
  it('should return first dup in array 1', function () {
    _chai.expect(_getFirstDupInArray2['default']([1, 1, 2, 2])).to.eql(1);
  });
  it('should return first dup in array 2', function () {
    _chai.expect(_getFirstDupInArray2['default']([1, 2, 1, 2])).to.eql(1);
  });
  it('should return first dup in array 3', function () {
    _chai.expect(_getFirstDupInArray2['default']([1, 2, 3, 3])).to.eql(3);
  });
  it('should return false when no dups found 1', function () {
    _chai.expect(_getFirstDupInArray2['default']([1, 2, 3, 4])).to.eql(false);
  });
});