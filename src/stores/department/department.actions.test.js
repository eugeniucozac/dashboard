import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState, publicConfig } from 'tests';
import merge from 'lodash/merge';

import {
  deleteDepartmentMarket,
  deleteDepartmentMarketRequest,
  deleteDepartmentMarketSuccess,
  deleteDepartmentMarketFailure,
} from './department.actions.deleteMarket';
import {
  addDepartmentMarket,
  postDepartmentMarketRequest,
  postDepartmentMarketSuccess,
  postDepartmentMarketFailure,
} from './department.actions.postMarket';
import {
  editDepartmentMarket,
  putDepartmentMarketRequest,
  putDepartmentMarketSuccess,
  putDepartmentMarketFailure,
} from './department.actions.putMarket';
import {
  getDepartmentMarkets,
  getDepartmentMarketsRequest,
  getDepartmentMarketsSuccess,
  getDepartmentMarketsFailure,
} from './department.actions.getMarkets';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
  },
};

const errorBackendData = {
  status: 400,
  message: 'API data format error (400)',
};

describe('STORES › ACTIONS › department', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const storeData = {
    user: {
      accessToken: 1,
      departmentIds: [1, 2],
      departmentSelected: 1,
    },
    department: {
      list: {},
      selected: {},
    },
    ui: {
      notification: { queue: [] },
    },
  };

  describe('department markets list GET', () => {
    const url = 'glob:*/api/departmentMarket/department/*';
    const responseData = [{ id: 1 }, { id: 2 }, { id: 3 }];

    it('should create an action for fetch start', () => {
      expect(getDepartmentMarketsRequest(1)).toEqual({
        type: 'DEPARTMENT_MARKETS_LIST_GET_REQUEST',
        payload: 1,
      });
    });

    it('should create an action for fetch success', () => {
      expect(getDepartmentMarketsSuccess(responseData)).toEqual({
        type: 'DEPARTMENT_MARKETS_LIST_GET_SUCCESS',
        payload: responseData,
      });
    });

    it('should create an action for fetch failure', () => {
      expect(getDepartmentMarketsFailure({ status: 404 })).toEqual({
        type: 'DEPARTMENT_MARKETS_LIST_GET_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: { status: 'success', data: responseData } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getDepartmentMarkets(10));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKETS_LIST_GET_REQUEST', payload: 10 },
        { type: 'LOADER_ADD', payload: 'getDepartmentMarkets' },
        { type: 'DEPARTMENT_MARKETS_LIST_GET_SUCCESS', payload: responseData },
        { type: 'LOADER_REMOVE', payload: 'getDepartmentMarkets' },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: 404, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getDepartmentMarkets(10));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKETS_LIST_GET_REQUEST', payload: 10 },
        { type: 'LOADER_ADD', payload: 'getDepartmentMarkets' },
        {
          type: 'DEPARTMENT_MARKETS_LIST_GET_FAILURE',
          payload: merge(errorNetwork, {
            response: { url: `${publicConfig.endpoint.edge}/api/departmentMarket/department/10` },
          }),
        },
        { type: 'LOADER_REMOVE', payload: 'getDepartmentMarkets' },
      ]);
    });

    it('should dispatch the actions following a fetch backend failure', async () => {
      fetchMock.get(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getDepartmentMarkets(10));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKETS_LIST_GET_REQUEST', payload: 10 },
        { type: 'LOADER_ADD', payload: 'getDepartmentMarkets' },
        { type: 'DEPARTMENT_MARKETS_LIST_GET_FAILURE', payload: errorBackendData },
        { type: 'LOADER_REMOVE', payload: 'getDepartmentMarkets' },
      ]);
    });
  });

  describe('department market add POST', () => {
    const url = 'glob:*/api/departmentMarket';
    const formData = {
      departmentId: 1,
      departmentMarketId: 10,
      markets: [{ id: 100 }],
    };

    const formDataWithUWs = {
      departmentId: 1,
      departmentMarketId: 10,
      markets: [{ id: 100 }],
      underwriters: [{ firstName: 'Foo' }, { firstName: 'Bar' }],
    };

    const responseData = {
      id: 10,
      market: { id: 100 },
    };

    const responseDataWithUWs = {
      id: 10,
      market: { id: 100 },
      underwriters: [
        { id: 20, firstName: 'Foo' },
        { id: 21, firstName: 'Bar' },
      ],
    };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.addDepartmentMarket.success',
    };

    const notificationError = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'error',
      message: 'notification.addDepartmentMarket.fail',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action for post started', () => {
      expect(postDepartmentMarketRequest(formData)).toEqual({ type: 'DEPARTMENT_MARKET_POST_REQUEST', payload: formData });
    });

    it('should create an action for post success', () => {
      expect(postDepartmentMarketSuccess(responseData)).toEqual({ type: 'DEPARTMENT_MARKET_POST_SUCCESS', payload: responseData });
    });

    it('should create an action for post failure', () => {
      expect(postDepartmentMarketFailure({ status: 404 })).toEqual({ type: 'DEPARTMENT_MARKET_POST_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following a post success (without underwriters)', async () => {
      fetchMock.post(url, { body: { status: 'success', data: responseData } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(addDepartmentMarket(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_POST_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'addDepartmentMarket' },
        { type: 'DEPARTMENT_MARKET_POST_SUCCESS', payload: responseData },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'addDepartmentMarket' },
      ]);
    });

    it('should dispatch the actions following a post success (with underwriters)', async () => {
      fetchMock.post(url, { body: { status: 'success', data: responseDataWithUWs } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(addDepartmentMarket(formDataWithUWs));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_POST_REQUEST', payload: formDataWithUWs },
        { type: 'LOADER_ADD', payload: 'addDepartmentMarket' },
        { type: 'DEPARTMENT_MARKET_POST_SUCCESS', payload: responseDataWithUWs },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'addDepartmentMarket' },
      ]);
    });

    it('should dispatch the actions following a post network failure', async () => {
      fetchMock.post(url, { status: 404, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(addDepartmentMarket(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_POST_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'addDepartmentMarket' },
        {
          type: 'DEPARTMENT_MARKET_POST_FAILURE',
          payload: merge(errorNetwork, {
            response: { url: `${publicConfig.endpoint.edge}/api/departmentMarket` },
          }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'addDepartmentMarket' },
      ]);
    });

    it('should dispatch the actions following a post backend failure', async () => {
      fetchMock.post(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(addDepartmentMarket(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_POST_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'addDepartmentMarket' },
        { type: 'DEPARTMENT_MARKET_POST_FAILURE', payload: errorBackendData },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'addDepartmentMarket' },
      ]);
    });
  });

  describe('department market edit PUT', () => {
    const url = 'glob:*/api/departmentMarket/*';

    const formData = {
      departmentId: 1,
      departmentMarketId: 10,
      marketId: 100,
      market: { id: 100 },
    };

    const formDataWithUWs = {
      departmentId: 1,
      departmentMarketId: 10,
      marketId: 100,
      market: { id: 100 },
      underwriters: [
        { id: 20, firstName: 'Foo', isOrigin: true },
        { id: 21, firstName: 'Bar', isOrigin: true },
      ],
    };

    const responseData = {
      id: 10,
      market: { id: 100 },
    };

    const responseDataWithUWs = {
      id: 10,
      market: { id: 100 },
      underwriters: [
        { id: 20, firstName: 'Foo' },
        { id: 21, firstName: 'Bar' },
      ],
    };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.editDepartmentMarket.success',
    };

    const notificationError = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'error',
      message: 'notification.editDepartmentMarket.fail',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action for put started', () => {
      expect(putDepartmentMarketRequest(formData)).toEqual({ type: 'DEPARTMENT_MARKET_PUT_REQUEST', payload: formData });
    });

    it('should create an action for put success', () => {
      expect(putDepartmentMarketSuccess(responseData)).toEqual({ type: 'DEPARTMENT_MARKET_PUT_SUCCESS', payload: responseData });
    });

    it('should create an action for put failure', () => {
      expect(putDepartmentMarketFailure({ status: 404 })).toEqual({ type: 'DEPARTMENT_MARKET_PUT_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following a put success (without underwriters)', async () => {
      fetchMock.put(url, { body: { status: 'success', data: responseData } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(editDepartmentMarket(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_PUT_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'editDepartmentMarket' },
        { type: 'DEPARTMENT_MARKET_PUT_SUCCESS', payload: responseData },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'editDepartmentMarket' },
      ]);
    });

    it('should dispatch the actions following a put success (with underwriters)', async () => {
      fetchMock.put(url, { body: { status: 'success', data: responseDataWithUWs } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(editDepartmentMarket(formDataWithUWs));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_PUT_REQUEST', payload: formDataWithUWs },
        { type: 'LOADER_ADD', payload: 'editDepartmentMarket' },
        { type: 'DEPARTMENT_MARKET_PUT_SUCCESS', payload: responseDataWithUWs },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'editDepartmentMarket' },
      ]);
    });

    it('should dispatch the actions following a put network failure', async () => {
      fetchMock.put(url, { status: 404, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(editDepartmentMarket(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_PUT_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'editDepartmentMarket' },
        {
          type: 'DEPARTMENT_MARKET_PUT_FAILURE',
          payload: merge(errorNetwork, {
            response: { url: `${publicConfig.endpoint.edge}/api/departmentMarket/10` },
          }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'editDepartmentMarket' },
      ]);
    });

    it('should dispatch the actions following a put backend failure', async () => {
      fetchMock.put(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(editDepartmentMarket(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_PUT_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'editDepartmentMarket' },
        { type: 'DEPARTMENT_MARKET_PUT_FAILURE', payload: errorBackendData },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'editDepartmentMarket' },
      ]);
    });
  });

  describe('department market DELETE', () => {
    const url = 'glob:*/api/departmentMarket/*';

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.deleteDepartmentMarket.success',
    };

    const notificationError = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'error',
      message: 'notification.deleteDepartmentMarket.fail',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action for delete started', () => {
      expect(deleteDepartmentMarketRequest(1)).toEqual({ type: 'DEPARTMENT_MARKET_DELETE_REQUEST', payload: 1 });
    });

    it('should create an action for delete success', () => {
      expect(deleteDepartmentMarketSuccess(2)).toEqual({ type: 'DEPARTMENT_MARKET_DELETE_SUCCESS', payload: 2 });
    });

    it('should create an action for delete failure', () => {
      expect(deleteDepartmentMarketFailure({ status: 404 })).toEqual({
        type: 'DEPARTMENT_MARKET_DELETE_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a delete success', async () => {
      fetchMock.delete(url, { body: { status: 'success', data: null } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(deleteDepartmentMarket(1));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_DELETE_REQUEST', payload: 1 },
        { type: 'LOADER_ADD', payload: 'deleteDepartmentMarket' },
        { type: 'DEPARTMENT_MARKET_DELETE_SUCCESS', payload: 1 },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'deleteDepartmentMarket' },
      ]);
    });

    it('should dispatch the actions following a delete network failure', async () => {
      fetchMock.delete(url, { status: 404, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(deleteDepartmentMarket(2));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_DELETE_REQUEST', payload: 2 },
        { type: 'LOADER_ADD', payload: 'deleteDepartmentMarket' },
        {
          type: 'DEPARTMENT_MARKET_DELETE_FAILURE',
          payload: merge(errorNetwork, {
            response: { url: `${publicConfig.endpoint.edge}/api/departmentMarket/2` },
          }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'deleteDepartmentMarket' },
      ]);
    });

    it('should dispatch the actions following a delete backend failure', async () => {
      fetchMock.delete(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(deleteDepartmentMarket(3));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'DEPARTMENT_MARKET_DELETE_REQUEST', payload: 3 },
        { type: 'LOADER_ADD', payload: 'deleteDepartmentMarket' },
        { type: 'DEPARTMENT_MARKET_DELETE_FAILURE', payload: errorBackendData },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'deleteDepartmentMarket' },
      ]);
    });
  });
});
