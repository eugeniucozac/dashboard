import reducer from './ui.reducers';
import types from './types';

describe('STORES › REDUCERS › ui', () => {
  const initialState = {
    brand: '',
    nav: {
      expanded: false,
    },
    sidebar: {
      expanded: false,
    },
    modal: [],
    loader: {
      queue: [],
    },
    notification: {
      queue: [],
    },
    files: [],
    dmsContext: '',
  };

  // it('should return the initial state', () => {
  //   // assert
  //   expect(reducer(undefined, {})).toEqual(initialState);
  // });

  describe('NAV', () => {
    it('should handle NAV_EXPAND', () => {
      // arrange
      const action = {
        type: 'NAV_EXPAND',
      };
      const prevState = {
        dummy: 1,
        nav: {
          dummy: 2,
          expanded: false,
        },
      };
      const expectedState = {
        ...prevState,
        nav: {
          ...prevState.nav,
          expanded: true,
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });

    it('should handle NAV_COLLAPSE', () => {
      // arrange
      const action = {
        type: 'NAV_COLLAPSE',
      };
      const prevState = {
        dummy: 1,
        nav: {
          dummy: 2,
          expanded: true,
        },
      };
      const expectedState = {
        ...prevState,
        nav: {
          ...prevState.nav,
          expanded: false,
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });
  });

  describe('SIDEBAR', () => {
    it('should handle SIDEBAR_EXPAND', () => {
      // arrange
      const action = {
        type: 'SIDEBAR_EXPAND',
      };
      const prevState = {
        dummy: 1,
        sidebar: {
          dummy: 2,
          expanded: false,
        },
      };
      const expectedState = {
        ...prevState,
        sidebar: {
          ...prevState.sidebar,
          expanded: true,
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });

    it('should handle SIDEBAR_COLLAPSE', () => {
      // arrange
      const action = {
        type: 'SIDEBAR_COLLAPSE',
      };
      const prevState = {
        dummy: 1,
        sidebar: {
          dummy: 2,
          expanded: true,
        },
      };
      const expectedState = {
        ...prevState,
        sidebar: {
          ...prevState.sidebar,
          expanded: false,
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });
  });

  describe('LOADER', () => {
    it('should handle LOADER_ADD', () => {
      // arrange
      const action = {
        type: 'LOADER_ADD',
        payload: 'bar',
      };
      const prevState = {
        dummy: 1,
        loader: {
          queue: [{ key: 'foo', message: 'app.loading' }],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, loader: { queue: [{ key: 'bar', message: 'app.loading' }] } });
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        loader: {
          queue: [
            { key: 'foo', message: 'app.loading' },
            { key: 'bar', message: 'app.loading' },
          ],
        },
      });
    });

    it('should handle LOADER_ADD with duplicate keys', () => {
      // arrange
      const action = {
        type: 'LOADER_ADD',
        payload: 2,
      };
      const prevState = {
        dummy: 1,
        loader: {
          queue: [
            { key: 1, message: 'app.loading' },
            { key: 2, message: 'app.loading' },
            { key: 3, message: 'app.loading' },
          ],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, loader: { queue: [{ key: 2, message: 'app.loading' }] } });
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        loader: {
          queue: [
            { key: 1, message: 'app.loading' },
            { key: 2, message: 'app.loading' },
            { key: 3, message: 'app.loading' },
            { key: 2, message: 'app.loading' },
          ],
        },
      });
    });

    it('should handle LOADER_REMOVE', () => {
      // arrange
      const action = {
        type: 'LOADER_REMOVE',
        payload: 2,
      };
      const prevState = {
        dummy: 1,
        loader: {
          queue: [{ key: 1 }, { key: 2 }, { key: 2 }, { key: 2 }, { key: 3 }],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, loader: { queue: [] } });
      expect(reducer(prevState, action)).toEqual({ ...prevState, loader: { queue: [{ key: 1 }, { key: 2 }, { key: 2 }, { key: 3 }] } });
    });

    it('should handle LOADER_REMOVE with non-existent keys', () => {
      // arrange
      const action = {
        type: 'LOADER_REMOVE',
        payload: 'foo',
      };
      const prevState = {
        dummy: 1,
        loader: {
          queue: [1, 2, 3],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, loader: { queue: [] } });
      expect(reducer(prevState, action)).toEqual({ ...prevState, loader: { queue: [1, 2, 3] } });
    });
  });

  describe('MODAL', () => {
    it('should handle MODAL_SHOW', () => {
      // arrange
      const action = {
        type: 'MODAL_SHOW',
        payload: {
          component: 'lorem-ipsum',
          props: 'props',
          actions: 'actions',
        },
      };

      const prevState = {
        ...initialState,
        modal: [
          {
            visible: true,
            type: 'foo',
            props: 'props foo',
            actions: 'actions foo',
          },
        ],
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        modal: [
          {
            visible: true,
            type: 'lorem-ipsum',
            props: 'props',
            actions: 'actions',
          },
        ],
      });

      expect(reducer(prevState, action)).toEqual({
        ...initialState,
        modal: [
          ...prevState.modal,
          {
            visible: true,
            type: 'lorem-ipsum',
            props: 'props',
            actions: 'actions',
          },
        ],
      });
    });

    it('should handle MODAL_HIDE', () => {
      // arrange
      const prevState = {
        ...initialState,
        modal: [
          {
            visible: true,
            type: 'foo',
            props: 'props',
            actions: 'actions',
          },
        ],
      };

      // assert
      expect(reducer(prevState, { type: 'MODAL_HIDE', payload: 'foo' })).toEqual(initialState);
      expect(reducer(prevState, { type: 'MODAL_HIDE', payload: 'bar' })).toEqual(prevState);
    });
  });

  describe('NOTIFICATION', () => {
    it('should handle NOTIFICATION_ADD', () => {
      // arrange
      const action = {
        type: 'NOTIFICATION_ADD',
        payload: { foo: 'bar' },
      };
      const expectedState = {
        ...initialState,
        notification: {
          queue: [action.payload],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle NOTIFICATION_HIDE', () => {
      // arrange
      const action = {
        type: 'NOTIFICATION_HIDE',
        payload: 101,
      };
      const prevState = {
        dummy: 1,
        notification: {
          queue: [
            { key: 100, message: 'foo', visible: true },
            { key: 101, message: 'bar', visible: true },
            { key: 102, message: 'qwerty', visible: true },
          ],
        },
      };
      const expectedState = {
        dummy: 1,
        notification: {
          queue: [
            { key: 100, message: 'foo', visible: true },
            { key: 101, message: 'bar', visible: false },
            { key: 102, message: 'qwerty', visible: true },
          ],
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });

    it('should handle NOTIFICATION_REMOVE', () => {
      // arrange
      const action = {
        type: 'NOTIFICATION_REMOVE',
        payload: 101,
      };
      const prevState = {
        dummy: 1,
        notification: {
          queue: [
            { key: 100, message: 'foo', visible: true },
            { key: 101, message: 'bar', visible: false },
            { key: 102, message: 'qwerty', visible: false },
          ],
        },
      };
      const expectedState = {
        dummy: 1,
        notification: {
          queue: [
            { key: 100, message: 'foo', visible: true },
            { key: 102, message: 'qwerty', visible: false },
          ],
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });
  });

  describe('BRAND', () => {
    it('should handle BRAND_SET', () => {
      // arrange
      const action = {
        type: 'BRAND_SET',
        payload: 'bar',
      };
      const prevState = {
        brand: 'foo',
        dummy: 2,
      };
      const expectedState = {
        ...prevState,
        brand: 'bar',
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });
  });

  describe('DMS UPLOAD', () => {
    it('should handle DMS_FILE_UPLOAD', () => {
      const payload = [
        {
          file: 'foobar.jpg',
          path: 'foobar.jpg',
          type: null,
        },
      ];

      const state = reducer(initialState, { type: types.DMS_FILE_UPLOAD, payload });
      const expectedState = {
        ...state,
        files: [
          {
            file: 'foobar.jpg',
            path: 'foobar.jpg',
            type: null,
          },
        ],
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle REMOVE_DMS_FILE_UPLOAD', () => {
      const actualState = {
        ...initialState,
        files: [
          {
            file: {
              path: 'foo.jpg',
              type: null,
            },
            name: 'foo.jpg',
          },
          {
            file: {
              path: 'bar.jpg',
              type: null,
            },
            name: 'bar.jpg',
          },
        ],
      };

      const payload = 'bar.jpg';

      const state = reducer(actualState, { type: types.REMOVE_DMS_FILE_UPLOAD, payload });

      const expectedState = {
        ...state,
        files: [
          {
            file: {
              path: 'foo.jpg',
              type: null,
            },
            name: 'foo.jpg',
          },
        ],
      };
      expect(state).toEqual(expectedState);
    });
  });
});
