/*globals L*/
import React, { Component } from 'react';
import Folio from 'folio';
import LMap from 'folio/adapters/L/Map';
import LTile from 'folio/adapters/L/Tile';
import LMarker from 'folio/adapters/L/Marker';
import LControl from 'folio/adapters/L/Control';
import LCircle from 'folio/adapters/L/Circle';
import t from 'tcomb';

export default class App extends Component {
  toggleBasemap() {
    this.setState(t.update(this.state, {decks: {$apply: (ls) => ls.map(o => {
      if (o.config.name === 'Basemap') {
        o.config.enabled = o.config.enabled === false ? true : false;
      }
      return o;
    })}}));
  }
  state = {
    schema: {
      adapter: LMap,
      config: {
        name: 'myMap',
        style: {width: '100%', height: 800},
        className: 'myMap'
      },
      options: {
        zoom: 13,
        center: [51.5, -0.09],
        zoomControl: true
      },
      on: {
        click: (/*{e}*/) => {
        }
      }
    },
    decks: [
      {
        /*
          Adapter manages all interaction with the Leaflet.
        */
        adapter: LTile,

        /*
          Any configuraiton option that is not specifically required by a Leaflet plugin
          should be included in the config object. The only required config option
          is `name`.
        */
        config: {
          name: 'Basemap',
          url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        },
        options: {
          // The options are passed directly into Leaflet
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
      },
      {
        adapter: LMarker,
        config: {
          name: 'Marker 1', // Names must be unique
          coordinates: [51.5, -0.09],
          belongsTo: {
            /*
              Must belong to an existing deck.
            */
            name: 'Basemap'
            /*
              When this property is set to true, the associated object is passed
              to the adapter methods as the `owner`. By default, `owner` is the map
              object.
            */
            //, owner: true
          }
        },
        /*
          Event bindings attached to the Leaflet layer.
        */
        on: {
          // Map object is always the second argument of a callback.
          click: ({e, map}) => {
            L.popup({closeButton: false, offset: L.point(0, -15)})
              .setLatLng(e.target.getLatLng())
              .setContent('Hello world!')
              .openOn(map);
          }
        }
      },
      {
        adapter: LControl,
        config: {
          name: 'Control 1',
          // Content can be a string or a function that returns the content,
          // e.g. React component.
          content: () => <div style={{background: 'white', padding: 20}}>
            <a href='javascript:;' onClick={::this.toggleBasemap}>Toggle basemap</a>
          </div>
        },
        options: {
          position: 'topright',
          className: 'my-control'
        }
      },
      {
        adapter: LCircle,
        config: {
          name: 'Circle 1',
          coordinates: [51.5, -0.09],
          radius: 1000, // meters
          belongsTo: {
            name: 'Basemap'
          }
        },
        options: {
          color: 'red',
          fillOpacity: 0.3,
          stroke: false
        }
      }
    ]
  }

  render() {
    return <Folio schema={this.state.schema} decks={this.state.decks} />;
  }
}
