import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState, publicConfig } from 'tests';
import merge from 'lodash/merge';

import { resetModellingTask, resetModellingList } from './modelling.actions';
import { getModellingTask } from './modelling.actions.get';
import { getModellingList } from './modelling.actions.getModellingList';
import { createModellingTask } from './modelling.actions.post';
import { updateModellingTask } from './modelling.actions.put';

import MockDate from 'mockdate';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    url: `${publicConfig.endpoint.edge}/api/modelling/1`,
  },
};

const errorNotification = {
  data: undefined,
  key: 1546300800000,
  type: 'error',
  visible: true,
};

const notificationSuccess = {
  key: 1546300800000,
  visible: true,
  type: 'success',
};

const notificationError = {
  key: 1546300800000,
  visible: true,
  type: 'error',
};

describe('STORES › ACTIONS › modelling', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
    MockDate.set('2019');
  });

  afterEach(() => {
    MockDate.reset();
  });

  const storeData = {
    user: {
      accessToken: 1,
      departmentSelected: 333,
    },
    modelling: {
      list: { items: [{ id: 1, foo: 'bar' }] },
      selected: { id: 1, foo: 2, bar: 3 },
    },
    ui: {
      notification: {
        queue: [],
      },
    },
  };

  describe('getModellingTask', () => {
    it('should dispatch the correct actions following a model GET success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: { foo: 1 } } });
      const expectedActions = [
        {
          type: 'MODELLING_GET_REQUEST',
          payload: '1',
        },
        {
          type: 'LOADER_ADD',
          payload: 'modelling',
        },
        {
          type: 'MODELLING_GET_SUCCESS',
          payload: {
            foo: 1,
          },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'modelling',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getModellingTask('1'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following a model GET failure', async () => {
      // arrange
      fetchMock.get('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'MODELLING_GET_REQUEST',
          payload: '1',
        },
        {
          type: 'LOADER_ADD',
          payload: 'modelling',
        },
        {
          type: 'MODELLING_GET_FAILURE',
          payload: errorNetwork,
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'modelling',
        },
      ];

      // act
      await store.dispatch(getModellingTask('1'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('createModellingTask', () => {
    it('should dispatch the correct actions following a model POST success', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: { id: 1 } } });
      const expectedActions = [
        {
          payload: {
            id: 1,
          },
          type: 'MODELLING_POST_REQUEST',
        },
        {
          payload: 'createModelling',
          type: 'LOADER_ADD',
        },
        {
          payload: {
            id: 1,
          },
          type: 'MODELLING_POST_SUCCESS',
        },
        {
          payload: {
            data: undefined,
            delay: undefined,
            key: 1546300800000,
            message: 'notification.modelling.postSuccess',
            type: 'success',
            visible: true,
          },
          type: 'NOTIFICATION_ADD',
        },
        {
          payload: undefined,
          type: 'MODAL_HIDE',
        },
        {
          payload: 'createModelling',
          type: 'LOADER_REMOVE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(createModellingTask({ id: 1 }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following a model POST failure', async () => {
      // arrange
      fetchMock.post('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'MODELLING_POST_REQUEST',
          payload: { id: 1 },
        },
        {
          type: 'LOADER_ADD',
          payload: 'createModelling',
        },
        {
          type: 'MODELLING_POST_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/modelling` } }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationError, message: 'notification.modelling.postFail' },
        },
        {
          type: 'MODAL_HIDE',
          payload: undefined,
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'createModelling',
        },
      ];
      // act
      await store.dispatch(createModellingTask({ id: 1 }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('getModellingList', () => {
    it('should dispatch the correct actions following an getModellingList GET success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: { content: [{ foo: 1 }, { foo: 2 }], pagination: { foo: 3 } } } });
      const expectedActions = [
        {
          type: 'MODELLING_LIST_GET_REQUEST',
          payload: '1',
        },
        {
          type: 'LOADER_ADD',
          payload: 'getModellingList',
        },
        {
          type: 'MODELLING_LIST_GET_SUCCESS',
          payload: {
            content: [{ foo: 1 }, { foo: 2 }],
            pagination: { foo: 3 },
          },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'getModellingList',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getModellingList('1'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following an getModellingList GET failure', async () => {
      // arrange
      fetchMock.get('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'MODELLING_LIST_GET_REQUEST',
          payload: '1',
        },
        {
          type: 'LOADER_ADD',
          payload: 'getModellingList',
        },
        {
          type: 'MODELLING_LIST_GET_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/modelling/placement/1?page=1&size=undefined&orderBy=undefined&direction=undefined`,
            },
          }),
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'getModellingList',
        },
      ];

      // act
      await store.dispatch(getModellingList('1'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('updateModellingTask', () => {
    const mockChanges = { id: 2 };

    it('should dispatch the correct actions following a model PUT success', async () => {
      // arrange
      fetchMock.put('*', { body: { status: 'success', data: { id: 2, bar: 3 } } });
      const expectedActions = [
        {
          type: 'MODELLING_PUT_REQUEST',
          payload: { id: 2 },
        },
        {
          type: 'LOADER_ADD',
          payload: 'createModelling',
        },
        {
          type: 'MODELLING_PUT_SUCCESS',
          payload: { id: 2, bar: 3 },
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationSuccess, message: 'notification.modelling.putSuccess' },
        },
        {
          type: 'MODAL_HIDE',
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'createModelling',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(updateModellingTask(mockChanges));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the correct actions following an openingMemo PUT failure', async () => {
      // arrange
      fetchMock.put('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'MODELLING_PUT_REQUEST',
          payload: { id: 2 },
        },
        {
          type: 'LOADER_ADD',
          payload: 'createModelling',
        },
        {
          type: 'MODELLING_PUT_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/modelling/2` } }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...errorNotification, message: 'notification.modelling.putFail' },
        },
        {
          type: 'MODAL_HIDE',
        },
        {
          payload: 'createModelling',
          type: 'LOADER_REMOVE',
        },
      ];

      // act
      await store.dispatch(updateModellingTask(mockChanges));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('resetModellingTask', () => {
    it('should dispatch the correct actions when calling resetModellingTask', async () => {
      // arrange
      const expectedActions = [{ type: 'MODELLING_RESET' }];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(resetModellingTask());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('resetModellingList', () => {
    it('should dispatch the correct actions when calling resetModellingList', async () => {
      // arrange
      const expectedActions = [{ type: 'MODELLING_LIST_RESET' }];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(resetModellingList());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
