/*eslint no-unused-expressions: 0*/
import {expect} from 'chai';
import sinon from 'sinon';
import Folio from '../src';
import {shallowRender} from './test-utils';
let makeAdapter = () => (/*{options, config}*/) => ({
  create: sinon.spy(),
  update: sinon.spy(),
  remove: sinon.spy()
});
let mapObj = {name: 'lefletElement'};
let props = {
  schema: {
    adapter: makeAdapter(),
    config: {
      name: 'map1',
      style: {width: 800},
      className: 'yo'
    },
    on: sinon.spy()
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
  afterEach(() => { Folio.__RewireAPI__.__ResetDependency__('Plate'); });
  describe('if _map exists', () => {
    beforeEach(() => { Folio.__Rewire__('_map', mapObj); });
    afterEach(() => { Folio.__ResetDependency__('_map'); });
    it('should render the enabled decks', () => {
      const {output} = shallowRender(props, Folio);
      expect(output.props.children[1].props.children.map(o => o.props.config.name)).to.contain('Plate1');
    });
    it('should not render disabled decks', () => {
      const {output} = shallowRender(props, Folio);
      expect(output.props.children[1].props.children.map(o => o.props.config.name)).to.not.contain('Plate2');
    });

    it('should not render decks that belong to disabled decks', () => {
      const {output} = shallowRender(props, Folio);
      expect(output.props.children[1].props.children.map(o => o.props.config.name)).to.not.contain('Plate3');
    });
  });

  it('should render the HTML correctly', () => {
    const { output } = shallowRender(props, Folio);
    let [div1] = output.props.children;
    expect(div1.ref).to.eql('map');
    expect(div1.props.style).to.deep.eql({width: 800});
    expect(div1.props.className).to.eql('yo');
  });
});
