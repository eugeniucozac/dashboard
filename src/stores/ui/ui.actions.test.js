import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';
import * as actions from './ui.actions';
import { getInitialState } from 'tests';
import types from './types';

let store;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockStoreState = {
  ui: {
    notification: {
      queue: [],
    },
  },
};

describe('STORES › ACTIONS › ui', () => {
  beforeEach(() => {
    MockDate.set('2019');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('nav', () => {
    it('should create an action for expand', () => {
      // arrange
      const expectedAction = {
        type: 'NAV_EXPAND',
      };

      // assert
      expect(actions.expandNav()).toEqual(expectedAction);
    });

    it('should create an action for collapse', () => {
      // arrange
      const expectedAction = {
        type: 'NAV_COLLAPSE',
      };

      // assert
      expect(actions.collapseNav()).toEqual(expectedAction);
    });
  });

  describe('loader', () => {
    it('should create an action for add', () => {
      // arrange
      const expectedAction = {
        type: 'LOADER_ADD',
        payload: 1,
      };

      // assert
      expect(actions.addLoader(1)).toEqual(expectedAction);
    });

    it('should create an action for remove', () => {
      // arrange
      const expectedAction = {
        type: 'LOADER_REMOVE',
        payload: 1,
      };

      // assert
      expect(actions.removeLoader(1)).toEqual(expectedAction);
    });
  });

  describe('modal', () => {
    it('should create an action for show', () => {
      // arrange
      const payload = {
        type: 'FOO',
        props: {},
        actions: [],
      };
      const expectedAction = {
        type: 'MODAL_SHOW',
        payload,
      };

      // assert
      expect(actions.showModal(payload)).toEqual(expectedAction);
    });

    it('should create an action for hide', () => {
      // arrange
      const expectedAction = {
        type: 'MODAL_HIDE',
      };

      // assert
      expect(actions.hideModal()).toEqual(expectedAction);
    });
  });

  describe('notification', () => {
    it('should create an action to queue the 1st success notification', () => {
      // arrange
      store = mockStore(getInitialState(mockStoreState));
      const payloadSuccess = {
        key: 1546300800000,
        visible: true,
        type: 'success',
        message: 'yay',
      };
      const expectedActionsSuccess = [{ type: 'NOTIFICATION_ADD', payload: payloadSuccess }];

      // act
      store.dispatch(actions.enqueueNotification('yay', 'success'));

      // assert
      expect(store.getActions()).toEqual(expectedActionsSuccess);
    });

    it('should create an action to queue the 1st error notification', () => {
      // arrange
      store = mockStore(getInitialState(mockStoreState));
      const payloadFail = {
        key: 1546300800000,
        visible: true,
        type: 'error',
        message: 'boo',
      };
      const expectedActionsFail = [{ type: 'NOTIFICATION_ADD', payload: payloadFail }];

      // act
      store.dispatch(actions.enqueueNotification('boo', 'error'));

      // assert
      expect(store.getActions()).toEqual(expectedActionsFail);
    });

    it('should create an action to queue additional notifications', () => {
      // arrange
      mockStoreState.ui.notification.queue.push({
        key: 123456,
        visible: true,
        type: 'success',
        message: 'currently visible notification',
      });
      store = mockStore(getInitialState(mockStoreState));
      const payload = {
        key: 1546300800000,
        visible: true,
        type: 'bar',
        message: 'foo',
      };
      const expectedActions = [
        { type: 'NOTIFICATION_HIDE', payload: 123456 },
        { type: 'NOTIFICATION_ADD', payload: payload },
      ];

      // act
      store.dispatch(actions.enqueueNotification('foo', 'bar'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action for add', () => {
      // arrange
      const payload = {
        key: 1546300800000,
        visible: true,
        type: 'success',
        message: 'foo',
      };
      const expectedAction = {
        type: 'NOTIFICATION_ADD',
        payload,
      };

      // assert
      expect(actions.addNotification(payload)).toEqual(expectedAction);
    });

    it('should create an action for hide', () => {
      // arrange
      const expectedAction = {
        type: 'NOTIFICATION_HIDE',
      };

      // assert
      expect(actions.hideNotification()).toEqual(expectedAction);
    });

    it('should create an action for remove', () => {
      // arrange
      const expectedAction = {
        type: 'NOTIFICATION_REMOVE',
      };

      // assert
      expect(actions.removeNotification()).toEqual(expectedAction);
    });
  });

  describe('brand', () => {
    it('should create an action for set', () => {
      // assert
      expect(actions.setBrand('foo')).toEqual({ type: 'BRAND_SET', payload: 'priceforbes' });
      expect(actions.setBrand('priceforbes')).toEqual({ type: 'BRAND_SET', payload: 'priceforbes' });
      expect(actions.setBrand('bishopsgate')).toEqual({ type: 'BRAND_SET', payload: 'bishopsgate' });
    });
  });

  describe('DMS upload', () => {
    it('should dispatch DMS FILE UPLOAD action', () => {
      const store = mockStore({});

      const payload = {
        file: 'foobar.jpg',
        path: 'foobar.jpg',
        type: null,
      };

      const expectedAction = [
        {
          type: types.DMS_FILE_UPLOAD,
          payload,
        },
      ];

      store.dispatch(actions.uploadFiles(payload));
      const actualActions = store.getActions();
      expect(actualActions).toEqual(expectedAction);
    });

    it('should dispatch REMOVE DMS FILE UPLOAD action', () => {
      const store = mockStore();

      const payload = 'foobar.jpg';

      const expectedAction = [
        {
          type: types.REMOVE_DMS_FILE_UPLOAD,
          payload,
        },
      ];

      store.dispatch(actions.removeFileUpload(payload));
      const actualActions = store.getActions();
      expect(actualActions).toEqual(expectedAction);
    });
  });
});
