# fo·li·o

**/ˈfōlēˌō/**

*noun*. a book or pamphlet made up of one or more full sheets of paper.


Super simple, declarative React bindings for Leaflet maps.


## Get started

```
  npm install folio-leaflet
```

## How it works

folio is a React component that manages Leaflet maps using native Javascript data structures.

```jsx
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
        center: [51.5, -0.09],
        zoomControl: true
      }
    },
    decks: [
      {
        adapter: LTile,
        config: {
          name: 'Basemap',
          url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        },
        options: {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
      }
    ]
  }
  render() {
    return <Folio schema={this.state.schema} decks={this.state.decks} />
  }
}
```

## Motivation

* Provide a declarative interface to Leaflet
* Create associations between map elements.
* Simplify configuration with Javascript objects.


## Terminology


## Deck

In folio, a deck is the term for a configuration object for a Leaflet map element, e.g. layer, control, overlay, marker, etc.

Deck is a simple Javascript object and it looks like this:

```javascript
{
  adapter: LTile,
  config: {
    name: 'Basemap',
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
  },
  options: {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
}
```

You will use decks to configure any of these elements, with the notable exception of the 'map' itself. For that, you need to use schema.

## Schema

Schema has exactly the same interface as deck, but it's used exclusively for configuring the map.

```javascript
{
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
  }
}
```

## Adapter

Each deck includes an adapter, which provides the bridge to Leaflet. An adapter is a function that takes an object as a function and returns three methods: create, update, and remove.

```javascript
export default function({ config: c, options: o }) {
  return {
    create: ({owner: ow}) => {  },
    update: ({element: e}) => {  },
    remove: ({element: e, owner: ow}) => {  }
  };
}
```

Other interfaces in the domain [can be found here.](https://github.com/volkanunsal/folio/blob/master/src%2Finterfaces.js)

## TODO

- [ ] Associations
- [ ] Write tests
