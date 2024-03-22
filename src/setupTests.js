import 'core-js/features/promise/finally';
import 'core-js/features/array/flat';
import matchMediaPolyfill from 'mq-polyfill';

// MutationObserver
// https://spectrum.chat/react-testing-library/general/jest-missing-mutationobserver-using-react-hook-form~98b7f07a-77a6-4094-8c83-b1acbc5b351f
// global.MutationObserver = global.window.MutationObserver;

// fixes getContext issue with PDF creation
HTMLCanvasElement.prototype.getContext = () => {};

// disable (some) console logs in jest
global.console = {
  log: global.console.log,
  warn: global.console.warn,
  info: global.console.info,
  error: jest.fn(), // disabled missing props logs
};

// mock URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock URL');

// mock window.location
delete window.location;
window.location = {
  replace: jest.fn(),
  href: jest.fn(),
};

// mock matchMedia
// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

// mock Mapbox
// https://github.com/mapbox/mapbox-gl-js/issues/3436#issuecomment-485535598
jest.mock('mapbox-gl', () => ({
  GeolocateControl: jest.fn(),
  LngLatBounds: function () {
    return {
      extend: jest.fn(() => ({})),
    };
  },
  Map: function () {
    return {
      addControl: jest.fn(),
      on: jest.fn(),
      remove: jest.fn(),
      resize: jest.fn(),
      getZoom: jest.fn(),
    };
  },
  Marker: function () {
    return {
      setLngLat: jest.fn(() => ({})),
    };
  },
  NavigationControl: jest.fn(),
  Popup: jest.fn(),
}));

// mock powerbi
jest.mock('powerbi-client', () => ({
  getRandomValues: jest.fn(),
  service: {
    Service: function () {
      return {
        embed: jest.fn(),
      };
    },
  },
  factories: {},
}));

// define window width/height
// https://spectrum.chat/testing-library/help-react/how-to-set-window-innerwidth-to-test-mobile~70aa9572-b7cc-4397-92f5-a09d75ed24b8
matchMediaPolyfill(window);

window.resizeTo = function resizeTo(width, height) {
  Object.assign(this, {
    innerWidth: width || window.innerWidth,
    innerHeight: height || window.innerHeight,
    outerWidth: width || window.outerWidth,
    outerHeight: height || window.outerHeight,
  }).dispatchEvent(new this.Event('resize'));
};
