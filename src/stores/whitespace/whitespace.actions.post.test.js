import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState } from 'tests';

import {
  createWhitespacePolicy,
  createWhitespaceRequest,
  createWhitespaceSuccess,
  createWhitespaceFailure,
} from './whitespace.actions.post';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    url: 'https://edgewhitespacedev1.azurewebsites.net/api/v1/mrcContracts/undefined',
  },
};

describe('STORES › ACTIONS › whitespace', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const storeData = {
    user: {
      accessToken: 1,
    },
    whitespace: {
      templates: {
        items: [],
        loading: false,
      },
    },
    placement: {
      selected: {
        insureds: [{ name: 'Foo' }, { name: 'Bar' }],
      },
    },
    ui: {
      notification: { queue: [] },
    },
  };

  describe('createWhitespacePolicy', () => {
    const url = 'glob:*/api/v1/mrcContracts*';
    const clientPostBody = { name: 'Foo' };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.createWhitespacePolicy.success',
    };

    const notificationError = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'error',
      message: 'notification.createWhitespacePolicy.fail',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action for client post started', () => {
      expect(createWhitespaceRequest({ name: 'foo' })).toEqual({ type: 'CREATE_WHITESPACE_POST_REQUEST', payload: { name: 'foo' } });
    });

    it('should create an action for client post success', () => {
      expect(createWhitespaceSuccess()).toEqual({ type: 'CREATE_WHITESPACE_POST_SUCCESS' });
    });

    it('should create an action for client post failure', () => {
      expect(createWhitespaceFailure({ status: 404 })).toEqual({ type: 'CREATE_WHITESPACE_POST_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following a client post success', async () => {
      fetchMock.post(url, { body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(createWhitespacePolicy(clientPostBody));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'CREATE_WHITESPACE_POST_REQUEST', payload: clientPostBody },
        { type: 'LOADER_ADD', payload: 'createWhitespacePolicy' },
        { type: 'CREATE_WHITESPACE_POST_SUCCESS' },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'createWhitespacePolicy' },
      ]);
    });

    it('should dispatch the actions following a client post network failure', async () => {
      fetchMock.post(url, { status: 404, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(createWhitespacePolicy(clientPostBody));

      expect(fetchMock.calls()).toHaveLength(1);
    });
  });
});
