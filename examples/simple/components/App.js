/*globals L*/
import React, { Component } from 'react';
import Caravel from 'caravel';
import LMap from 'caravel/adapters/LMap';
import LTile from 'caravel/adapters/LTile';
import LMarker from 'caravel/adapters/LMarker';
import LControl from 'caravel/adapters/LControl';
import LCircle from 'caravel/adapters/LCircle';
import LPopup from 'caravel/adapters/LPopup';

export default class App extends Component {
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
        center: [51.5, -0.09]
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
          coordinates: [51.5, -0.09]
        },

        /*
          Event bindings attached to the Leaflet layer.
        */
        on: {
          // Map object is always the second argument of a callback.
          click: (e, map) => {
            L.popup()
              .setLatLng(e.target.getLatLng())
              .setContent('Hello world!')
              .bindTo(e.target)
              .openOn(map);
          }
        }
      },
      {
        adapter: LPopup,
        config: {
          name: 'Popup 2',
          belongsTo: {
            /*
              Must belong to an existing deck.
            */
            name: 'Marker 1',
            /*
              When this property is set to true, the associated object is passed
              to the adapter methods as the `owner`. By default, `owner` is the map
              object.
            */
            isOwner: true
          }
        }
      },
      {
        adapter: LControl,
        config: {
          name: 'Control 1',
          // Content can be a string or a function that returns the content,
          // e.g. React component.
          content: () => <div style={{background: 'white', padding: 20}}>I am in a box!</div>
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
          radius: 1000 // meters
        },
        options: {
          color: 'red',
          stroke: false
        }
      }
    ]
  }

  render() {
    return <Caravel schema={this.state.schema} decks={this.state.decks} />;
  }
}
