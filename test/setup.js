/*eslint-disable*/
var jsdom = require('jsdom').jsdom;
var chai = require('chai');
var sinonChai = require('sinon-chai');

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.L = require('leaflet');

chai.should();
chai.use(sinonChai);
