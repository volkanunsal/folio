'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _removeKeysWithFunctionValues = require('../removeKeysWithFunctionValues');

var _removeKeysWithFunctionValues2 = _interopRequireDefault(_removeKeysWithFunctionValues);

var _testUtils = require('../test-utils');

describe('removeKeysWithFunctionValues', function () {
  it('should remove keys with function values 1', function () {
    _chai.expect(_removeKeysWithFunctionValues2['default']({ a: _testUtils.noop, b: 1 })).to.deep.eql({ b: 1 });
  });
  it('should return the same input when given non-object 1', function () {
    _chai.expect(_removeKeysWithFunctionValues2['default'](undefined)).to.eql(undefined);
  });
  it('should return the same input when given non-object 2', function () {
    _chai.expect(_removeKeysWithFunctionValues2['default'](1)).to.eql(1);
  });
});