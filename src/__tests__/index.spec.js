/*eslint no-unused-expressions: 0*/
import {expect} from 'chai';
import sinon from 'sinon';
import Folio from '../';
import {shallowRender} from '../utils/test-utils';
let makeAdapter = () => (/*{options, config}*/) => ({
  create: sinon.spy(),
  update: sinon.spy(),
  remove: sinon.spy()
});
let props = {
  schema: {
    adapter: makeAdapter(),
    config: {
      name: 'map1',
      style: {width: 800},
      className: 'yo'
    },
    on: {
      click: () => {}
    }
  },
  decks: [
    {
      adapter: makeAdapter(),
      config: {
        name: 'Plate1',
        enabled: true
      },
      on: {
        click: () => {}
      }
    },
    {
      adapter: makeAdapter(),
      config: {
        name: 'Plate2',
        enabled: false
      },
      on: {
        click: () => {}
      }
    },
    {
      adapter: makeAdapter(),
      config: {
        name: 'Plate3',
        belongsTo: {
          name: 'Plate2'
        }
      },
      on: {
        click: () => {}
      }
    }
  ]
};

describe('Folio', () => {
  it('should render the HTML correctly', () => {
    const { output } = shallowRender(props, Folio);
    let [div1] = output.props.children;
    expect(div1.ref).to.eql('map');
    expect(div1.props.style).to.deep.eql({width: 800});
    expect(div1.props.className).to.eql('yo');
  });
});
