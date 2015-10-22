import React, { Component } from 'react';
import { MapContainer } from 'caravel';
import { LeafletImageTile, LeafletMarker, LeafletControl, LeafletMap } from 'caravel/adapters';

class Magellan extends Component {
  render() {
    return <div>I navigate you around this map.</div>
  }
}

export default class App extends Component {
  state = {
    name: 'myMap',
    adapter: LeafletMap,
    options: {
      zoom: 13,
      center: [51.5, -0.09]
    },
    decks: [
      {
        name: 'Basemap',
        adapter: LeafletImageTile, // Adapter adds and removes the Leaflet objects
        config: {
          // Anything that is not specifically needed by the Leaflet options
          // but you want to be able to configure via method calls should go here.
          url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        },
        options: {
          // The options are passed directly to Leaflet
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
      },
      {
        name: 'Marker 1', // Names must be unique
        adapter: LeafletMarker,
        config: {
          coordinates: [51.5, -0.09]
        },
        // Event bindings attached to the Leaflet layer
        on: {
          // Map object is always the second argument of a callback
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
        name: 'Control 1',
        adapter: LeafletControl,
        config: {
          // Content can be a string or a function that returns the content,
          // e.g. React component.
          content: () => <Magellan />
        },
        options: {
          position: 'topright',
          className: 'my-control'
        }
      }
    ]
  }

  render() {
    return <MapContainer
      style={{width: '100%', height: 800}}
      model={this.state}
    />
  }
}
