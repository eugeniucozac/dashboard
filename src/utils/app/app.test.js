import * as utils from 'utils';
import MockDate from 'mockdate';
import { setLocation, resetLocation } from 'tests';

describe('UTILS › app', () => {
  afterEach(() => MockDate.reset());

  it('should export the required methods', () => {
    // assert
    expect(utils.app).toHaveProperty('isProduction');
    expect(utils.app).toHaveProperty('isDevelopment');
    expect(utils.app).toHaveProperty('getCurrentYear');
    expect(utils.app).toHaveProperty('getBrandName');
    expect(utils.app).toHaveProperty('getAppName');
    expect(utils.app).toHaveProperty('getHostName');
    expect(utils.app).toHaveProperty('getElement');
    expect(utils.app).toHaveProperty('scrollTo');
    expect(utils.app).toHaveProperty('getEllipsisString');
  });

  describe('isProduction', () => {
    it('should return true when in production mode', () => {
      // arrange
      const originalLocation = setLocation('anyNonDevHostname');

      // assert
      expect(utils.app.isProduction()).toBeTruthy();

      // revert
      resetLocation(originalLocation);
    });

    it('should return false when not in production mode', () => {
      // arrange
      const originalLocation = setLocation('localhost');

      // assert
      expect(utils.app.isProduction()).toBeFalsy();

      // revert
      resetLocation(originalLocation);
    });
  });

  describe('isDevelopment', () => {
    it('should return true when in development mode', () => {
      // assert
      expect(utils.app.isDevelopment()).toBeFalsy();
      expect(utils.app.isDevelopment({})).toBeFalsy();
      expect(utils.app.isDevelopment({ type: null })).toBeFalsy();
      expect(utils.app.isDevelopment({ type: 'foo' })).toBeFalsy();
      expect(utils.app.isDevelopment({ type: 'production' })).toBeFalsy();
      expect(utils.app.isDevelopment({ type: 'development' })).toBeTruthy();
    });
  });

  describe('getCurrentYear', () => {
    it('should return the current year', () => {
      // arrange
      MockDate.set('2000');

      // assert
      expect(utils.app.getCurrentYear()).toEqual(2000);
    });
  });

  describe('getBrandName', () => {
    it('should return the brand name from constants', () => {
      // assert
      expect(utils.app.getBrandName()).toEqual('');
      expect(utils.app.getBrandName(null)).toEqual('');
      expect(utils.app.getBrandName('')).toEqual('');
      expect(utils.app.getBrandName(1)).toEqual('');
      expect(utils.app.getBrandName('foo')).toEqual('Price Forbes');
      expect(utils.app.getBrandName('priceforbes')).toEqual('Price Forbes');
      expect(utils.app.getBrandName('priceforbes')).toEqual('Price Forbes');
      expect(utils.app.getBrandName('PRICEFORBES')).toEqual('Price Forbes');
      expect(utils.app.getBrandName('bishopsgate')).toEqual('Bishopsgate');
      expect(utils.app.getBrandName('Bishopsgate')).toEqual('Bishopsgate');
      expect(utils.app.getBrandName('BISHOPSGATE')).toEqual('Bishopsgate');
    });
  });

  describe('getAppName', () => {
    it('should return the app name from constants', () => {
      // assert
      expect(utils.app.getAppName()).toEqual('');
      expect(utils.app.getAppName(null)).toEqual('');
      expect(utils.app.getAppName('')).toEqual('');
      expect(utils.app.getAppName(1)).toEqual('');
      expect(utils.app.getAppName('foo')).toEqual('EDGE Price Forbes Online');
      expect(utils.app.getAppName('priceforbes')).toEqual('EDGE Price Forbes Online');
      expect(utils.app.getAppName('priceforbes')).toEqual('EDGE Price Forbes Online');
      expect(utils.app.getAppName('PRICEFORBES')).toEqual('EDGE Price Forbes Online');
      expect(utils.app.getAppName('bishopsgate')).toEqual('EDGE Bishopsgate Online');
      expect(utils.app.getAppName('Bishopsgate')).toEqual('EDGE Bishopsgate Online');
      expect(utils.app.getAppName('BISHOPSGATE')).toEqual('EDGE Bishopsgate Online');
    });
  });

  describe('getHostName', () => {
    it('should return the hostname', () => {
      // arrange
      const locationOriginal = global.window.location;
      delete global.window.location;

      global.window = Object.create(window);
      global.window.location = {
        origin: 'http://dummy.com',
        protocol: 'http:',
        host: 'dummy',
        hostname: 'dummy',
        port: '3000',
        pathname: '/dummy',
        search: '',
        hash: '',
        href: 'http://dummy.com/placements',
      };

      // assert
      expect(utils.app.getHostName()).toEqual('dummy');

      // arrange
      // revert global.window to original value
      global.window.location = locationOriginal;
    });
  });

  describe('getElement', () => {
    it('should return the DOM element by ID', () => {
      // arrange
      const foo = '<div id="foo">Foo</div>';
      const bar = `<div id="bar">Bar</div>`;
      const foobar = `<div id="foobar">FooBar</div>`;
      const qwertyA = `<div class="qwerty">Aaa</div>`;
      const qwertyB = `<div class="qwerty">Bbb</div>`;
      const qwertyC = `<div class="qwerty">Ccc</div>`;
      document.body.innerHTML = '<div></div>';
      document.body.querySelector('div').insertAdjacentHTML('beforeend', foo);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', bar);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', foobar);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', qwertyA);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', qwertyB);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', qwertyC);

      // assert
      expect(utils.app.getElement()).toBeNull();
      expect(utils.app.getElement(null)).toBeNull();
      expect(utils.app.getElement('')).toBeNull();
      expect(utils.app.getElement(1)).toBeNull();
      expect(utils.app.getElement('#foo').outerHTML).toEqual(foo);
      expect(utils.app.getElement('#bar').outerHTML).toEqual(bar);
      expect(utils.app.getElement('.qwerty').outerHTML).toEqual(qwertyA);
    });
  });

  describe('getBrandName', () => {
    it('should return the brand name from constants', () => {
      // assert
      expect(utils.app.getBrandName()).toEqual('');
      expect(utils.app.getBrandName(null)).toEqual('');
      expect(utils.app.getBrandName('')).toEqual('');
      expect(utils.app.getBrandName(1)).toEqual('');
      expect(utils.app.getBrandName('foo')).toEqual('Price Forbes');
      expect(utils.app.getBrandName('priceforbes')).toEqual('Price Forbes');
      expect(utils.app.getBrandName('priceforbes')).toEqual('Price Forbes');
      expect(utils.app.getBrandName('PRICEFORBES')).toEqual('Price Forbes');
      expect(utils.app.getBrandName('bishopsgate')).toEqual('Bishopsgate');
      expect(utils.app.getBrandName('Bishopsgate')).toEqual('Bishopsgate');
      expect(utils.app.getBrandName('BISHOPSGATE')).toEqual('Bishopsgate');
    });
  });

  describe('getAppName', () => {
    it('should return the app name from constants', () => {
      // assert
      expect(utils.app.getAppName()).toEqual('');
      expect(utils.app.getAppName(null)).toEqual('');
      expect(utils.app.getAppName('')).toEqual('');
      expect(utils.app.getAppName(1)).toEqual('');
      expect(utils.app.getAppName('foo')).toEqual('EDGE Price Forbes Online');
      expect(utils.app.getAppName('priceforbes')).toEqual('EDGE Price Forbes Online');
      expect(utils.app.getAppName('priceforbes')).toEqual('EDGE Price Forbes Online');
      expect(utils.app.getAppName('PRICEFORBES')).toEqual('EDGE Price Forbes Online');
      expect(utils.app.getAppName('bishopsgate')).toEqual('EDGE Bishopsgate Online');
      expect(utils.app.getAppName('Bishopsgate')).toEqual('EDGE Bishopsgate Online');
      expect(utils.app.getAppName('BISHOPSGATE')).toEqual('EDGE Bishopsgate Online');
    });
  });

  describe('getElement', () => {
    it('should return the DOM element by ID', () => {
      // arrange
      const foo = '<div id="foo">Foo</div>';
      const bar = `<div id="bar">Bar</div>`;
      const foobar = `<div id="foobar">FooBar</div>`;
      const qwertyA = `<div class="qwerty">Aaa</div>`;
      const qwertyB = `<div class="qwerty">Bbb</div>`;
      const qwertyC = `<div class="qwerty">Ccc</div>`;
      document.body.innerHTML = '<div></div>';
      document.body.querySelector('div').insertAdjacentHTML('beforeend', foo);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', bar);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', foobar);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', qwertyA);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', qwertyB);
      document.body.querySelector('div').insertAdjacentHTML('beforeend', qwertyC);

      // assert
      expect(utils.app.getElement()).toBeNull();
      expect(utils.app.getElement(null)).toBeNull();
      expect(utils.app.getElement('')).toBeNull();
      expect(utils.app.getElement(1)).toBeNull();
      expect(utils.app.getElement('#foo').outerHTML).toEqual(foo);
      expect(utils.app.getElement('#bar').outerHTML).toEqual(bar);
      expect(utils.app.getElement('.qwerty').outerHTML).toEqual(qwertyA);
    });
  });

  fdescribe('access', () => {
    describe('permissions', () => {
      describe('requested', () => {
        it('should return an array of requested permissions', () => {
          // assert
          expect(utils.app.access.permissions.requested()).toEqual([undefined]);
          expect(utils.app.access.permissions.requested(null)).toEqual([null]);
          expect(utils.app.access.permissions.requested('')).toEqual(['']);
          expect(utils.app.access.permissions.requested('foo')).toEqual(['foo']);
          expect(utils.app.access.permissions.requested(1)).toEqual([1]);
          expect(utils.app.access.permissions.requested({})).toEqual([{}]);
          expect(utils.app.access.permissions.requested({ id: 1 })).toEqual([{ id: 1 }]);
          expect(utils.app.access.permissions.requested([])).toEqual([]);
          expect(utils.app.access.permissions.requested([1])).toEqual([1]);
          expect(utils.app.access.permissions.requested([1, 2, 3])).toEqual([1, 2, 3]);
        });
      });

      describe('allowed', () => {
        it('should return null if params are not valid', () => {
          // assert
          expect(utils.app.access.permissions.allowed()).toBeNull();
          expect(utils.app.access.permissions.allowed(null)).toBeNull();
          expect(utils.app.access.permissions.allowed(null, null)).toBeNull();
          expect(utils.app.access.permissions.allowed('foo', null)).toBeNull();
          expect(utils.app.access.permissions.allowed(1)).toBeNull();
          expect(utils.app.access.permissions.allowed({})).toBeNull();
        });

        it("should return null if user doesn't have privilege", () => {
          // arrange
          const user = {
            userDetails: { id: 1 },
            privilege: {},
            routes: [],
          };

          // assert
          expect(utils.app.access.permissions.allowed('foo', user)).toBeNull();
          expect(utils.app.access.permissions.allowed('foo', { ...user, privilege: null })).toBeNull();
        });

        it("should return the user's privilege object", () => {
          // arrange
          const user = {
            userDetails: { id: 1 },
            privilege: {
              foo: [],
              bar: [1, 2, 3],
              qwe: null,
              rty: {
                one: [1],
                two: [1, 2],
              },
            },
            routes: [],
          };

          // assert
          expect(utils.app.access.permissions.allowed('foo', user)).toEqual([]);
          expect(utils.app.access.permissions.allowed('bar', user)).toEqual([1, 2, 3]);
          expect(utils.app.access.permissions.allowed('qwe', user)).toBeNull();
          expect(utils.app.access.permissions.allowed('rty', user)).toEqual({
            one: [1],
            two: [1, 2],
          });
          expect(utils.app.access.permissions.allowed('rty.one', user)).toEqual([1]);
          expect(utils.app.access.permissions.allowed('rty.two', user)).toEqual([1, 2]);
          expect(utils.app.access.permissions.allowed('something.else', user)).toBeUndefined();
        });
      });
    });
  });

  describe('feature', () => {
    it('should return if the user has access to this feature', () => {
      // assert
    });
  });

  describe('route', () => {
    it('should return if the user has access to this route', () => {
      // assert
    });
  });
});
