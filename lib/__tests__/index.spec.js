/*eslint no-unused-expressions: 0*/
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _utilsTestUtils = require('../utils/test-utils');

var makeAdapter = function makeAdapter() {
  return function () {
    return (/*{options, config}*/{
        create: _sinon2['default'].spy(),
        update: _sinon2['default'].spy(),
        remove: _sinon2['default'].spy()
      }
    );
  };
};
var props = {
  schema: {
    adapter: makeAdapter(),
    config: {
      name: 'map1',
      style: { width: 800 },
      className: 'yo'
    },
    on: {
      click: function click() {}
    }
  },
  decks: [{
    adapter: makeAdapter(),
    config: {
      name: 'Plate1',
      enabled: true
    },
    on: {
      click: function click() {}
    }
  }, {
    adapter: makeAdapter(),
    config: {
      name: 'Plate2',
      enabled: false
    },
    on: {
      click: function click() {}
    }
  }, {
    adapter: makeAdapter(),
    config: {
      name: 'Plate3',
      belongsTo: {
        name: 'Plate2'
      }
    },
    on: {
      click: function click() {}
    }
  }]
};

describe('Folio', function () {
  it('should render the HTML correctly', function () {
    var _shallowRender = _utilsTestUtils.shallowRender(props, _2['default']);

    var output = _shallowRender.output;
    var _output$props$children = output.props.children;
    var div1 = _output$props$children[0];

    _chai.expect(div1.ref).to.eql('map');
    _chai.expect(div1.props.style).to.deep.eql({ width: 800 });
    _chai.expect(div1.props.className).to.eql('yo');
  });
});