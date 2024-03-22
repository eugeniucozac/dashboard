import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState } from 'tests';
import merge from 'lodash/merge';

import { getCarriers, getCarriersRequest, getCarriersSuccess, getCarriersFailure } from './party.actions.getCarriers';
import { getPricerModule, getPricerModuleRequest, getPricerModuleSuccess, getPricerModuleFailure } from './party.actions.getPricerModule';
import { getClients, getClientsRequest, getClientsSuccess, getClientsFailure } from './party.actions.getClients';
import { postClient, postClientRequest, postClientSuccess, postClientFailure } from './party.actions.postClient';
import { getInsureds, getInsuredsRequest, getInsuredsSuccess, getInsuredsFailure } from './party.actions.getInsureds';
import { getReinsureds, getReinsuredsRequest, getReinsuredsSuccess, getReinsuredsFailure } from './party.actions.getReinsureds';
import { postInsured, postInsuredRequest, postInsuredSuccess, postInsuredFailure } from './party.actions.postInsured';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    url: 'https://edge-auth-service.azurewebsites.net/api/v1/carriers?page=1',
  },
};

describe('STORES › ACTIONS › party', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const storeData = {
    user: {
      accessToken: 1,
    },
    party: {
      clients: {
        items: [],
      },
      insureds: {
        items: [],
      },
    },
    ui: {
      notification: { queue: [] },
    },
  };

  describe('carriers', () => {
    describe('get', () => {
      const url = 'glob:*/api/v1/carriers*';
      const response = {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        pagination: {
          direction: 'asc',
          orderBy: 'name',
          page: 1,
          size: 10,
          totalElements: 3,
          totalPages: 1,
        },
      };

      it('should create an action for fetch start', () => {
        expect(getCarriersRequest()).toEqual({ type: 'CARRIERS_GET_REQUEST' });
      });

      it('should create an action for fetch success', () => {
        expect(getCarriersSuccess(response)).toEqual({
          type: 'CARRIERS_GET_SUCCESS',
          payload: response,
        });
      });

      it('should create an action for fetch failure', () => {
        expect(getCarriersFailure({ status: 404 })).toEqual({
          type: 'CARRIERS_GET_FAILURE',
          payload: { status: 404 },
        });
      });

      it('should dispatch the actions following a fetch success', async () => {
        fetchMock.get(url, { body: response });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getCarriers());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([{ type: 'CARRIERS_GET_REQUEST' }, { type: 'CARRIERS_GET_SUCCESS', payload: response }]);
      });

      it('should dispatch the actions following a fetch network failure', async () => {
        fetchMock.get(url, { status: 404, body: {} });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getCarriers());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([{ type: 'CARRIERS_GET_REQUEST' }, { type: 'CARRIERS_GET_FAILURE', payload: errorNetwork }]);
      });
    });
  });

  describe('getPricerModule', () => {
    describe('get', () => {
      const url = 'glob:*/api/v1/facilities/modules';
      const response = [
        {
          label: 'Epic - Terror Property v1',
          value: 'EPIC_TERROR_PROP',
        },
        {
          label: 'MarketScout - US Residential v1',
          value: 'MarketScout',
        },
        {
          label: 'Chubb - Aviation Fixed Wing v1',
          value: 'CHUBB_AVIATION_V1',
        },
      ];

      it('should create an action for fetch start', () => {
        expect(getPricerModuleRequest()).toEqual({ type: 'PRICER_MODULE_GET_REQUEST' });
      });

      it('should create an action for fetch success', () => {
        expect(getPricerModuleSuccess(response)).toEqual({
          type: 'PRICER_MODULE_GET_SUCCESS',
          payload: response,
        });
      });

      it('should create an action for fetch failure', () => {
        expect(getPricerModuleFailure({ status: 404 })).toEqual({
          type: 'PRICER_MODULE_GET_FAILURE',
          payload: { status: 404 },
        });
      });

      it('should dispatch the actions following a fetch success', async () => {
        fetchMock.get(url, { body: response });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getPricerModule());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'PRICER_MODULE_GET_REQUEST' },
          { type: 'PRICER_MODULE_GET_SUCCESS', payload: response },
        ]);
      });

      it('should dispatch the actions following a fetch network failure', async () => {
        fetchMock.get(url, { status: 404, body: {} });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getPricerModule());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'PRICER_MODULE_GET_REQUEST' },
          {
            type: 'PRICER_MODULE_GET_FAILURE',
            payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/facilities/modules' } }),
          },
        ]);
      });
    });
  });

  describe('clients', () => {
    describe('get', () => {
      const url = 'glob:*/api/v1/clients*';
      const response = {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        pagination: {
          direction: 'asc',
          orderBy: 'name',
          page: 1,
          size: 10,
          totalElements: 3,
          totalPages: 1,
        },
      };

      it('should create an action for fetch start', () => {
        expect(getClientsRequest()).toEqual({ type: 'CLIENTS_GET_REQUEST' });
      });

      it('should create an action for fetch success', () => {
        expect(getClientsSuccess(response)).toEqual({
          type: 'CLIENTS_GET_SUCCESS',
          payload: response,
        });
      });

      it('should create an action for fetch failure', () => {
        expect(getClientsFailure({ status: 404 })).toEqual({
          type: 'CLIENTS_GET_FAILURE',
          payload: { status: 404 },
        });
      });

      it('should dispatch the actions following a fetch success', async () => {
        fetchMock.get(url, { body: response });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getClients());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([{ type: 'CLIENTS_GET_REQUEST' }, { type: 'CLIENTS_GET_SUCCESS', payload: response }]);
      });

      it('should dispatch the actions following a fetch network failure', async () => {
        fetchMock.get(url, { status: 404, body: {} });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getClients());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'CLIENTS_GET_REQUEST' },
          {
            type: 'CLIENTS_GET_FAILURE',
            payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/clients?page=1' } }),
          },
        ]);
      });
    });

    describe('post', () => {
      const url = 'glob:*/api/v1/clients*';
      const clientPostBody = { name: 'Foo' };
      const clientResponseData = { id: 1, name: 'Foo' };

      const notificationSuccess = {
        key: 1546300800000,
        visible: true,
        data: undefined,
        type: 'success',
        message: 'notification.client.postSuccess',
      };

      const notificationError = {
        key: 1546300800000,
        visible: true,
        data: undefined,
        type: 'error',
        message: 'notification.generic.request',
      };

      beforeEach(() => {
        MockDate.set('2019');
      });

      afterEach(() => {
        MockDate.reset();
      });

      it('should create an action for client post started', () => {
        expect(postClientRequest({ name: 'foo' })).toEqual({ type: 'CLIENT_POST_REQUEST', payload: { name: 'foo' } });
      });

      it('should create an action for client post success', () => {
        expect(postClientSuccess(clientResponseData)).toEqual({ type: 'CLIENT_POST_SUCCESS', payload: clientResponseData });
      });

      it('should create an action for client post failure', () => {
        expect(postClientFailure({ status: 404 })).toEqual({ type: 'CLIENT_POST_FAILURE', payload: { status: 404 } });
      });

      it('should dispatch the actions following a client post success', async () => {
        fetchMock.post(url, { body: clientResponseData });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(postClient(clientPostBody));

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'CLIENT_POST_REQUEST', payload: clientPostBody },
          { type: 'LOADER_ADD', payload: 'postClient' },
          { type: 'CLIENT_POST_SUCCESS', payload: clientResponseData },
          { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
          { type: 'MODAL_HIDE' },
          { type: 'LOADER_REMOVE', payload: 'postClient' },
        ]);
      });

      it('should dispatch the actions following a client post network failure', async () => {
        fetchMock.post(url, { status: 404, body: {} });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(postClient(clientPostBody));

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'CLIENT_POST_REQUEST', payload: clientPostBody },
          { type: 'LOADER_ADD', payload: 'postClient' },
          {
            type: 'CLIENT_POST_FAILURE',
            payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/clients' } }),
          },
          { type: 'NOTIFICATION_ADD', payload: notificationError },
          { type: 'MODAL_HIDE' },
          { type: 'LOADER_REMOVE', payload: 'postClient' },
        ]);
      });
    });
  });

  describe('insureds', () => {
    describe('get', () => {
      const url = 'glob:*/api/v1/insured*';
      const response = {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        pagination: {
          direction: 'asc',
          orderBy: 'name',
          page: 1,
          size: 10,
          totalElements: 3,
          totalPages: 1,
        },
      };

      it('should create an action for fetch start', () => {
        expect(getInsuredsRequest()).toEqual({ type: 'INSUREDS_GET_REQUEST' });
      });

      it('should create an action for fetch success', () => {
        expect(getInsuredsSuccess(response)).toEqual({
          type: 'INSUREDS_GET_SUCCESS',
          payload: response,
        });
      });

      it('should create an action for fetch failure', () => {
        expect(getInsuredsFailure({ status: 404 })).toEqual({
          type: 'INSUREDS_GET_FAILURE',
          payload: { status: 404 },
        });
      });

      it('should dispatch the actions following a fetch success', async () => {
        fetchMock.get(url, { body: response });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getInsureds());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([{ type: 'INSUREDS_GET_REQUEST' }, { type: 'INSUREDS_GET_SUCCESS', payload: response }]);
      });

      it('should dispatch the actions following a fetch network failure', async () => {
        fetchMock.get(url, { status: 404, body: {} });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getInsureds());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'INSUREDS_GET_REQUEST' },
          {
            type: 'INSUREDS_GET_FAILURE',
            payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/insured?page=1' } }),
          },
        ]);
      });
    });

    describe('post', () => {
      const url = 'glob:*/api/v1/insured*';
      const insuredPostBody = { name: 'Foo' };
      const insuredResponseData = { id: 1, name: 'Foo' };

      const notificationSuccess = {
        key: 1546300800000,
        visible: true,
        data: undefined,
        type: 'success',
        message: 'notification.insured.postSuccess',
      };

      const notificationError = {
        key: 1546300800000,
        visible: true,
        data: undefined,
        type: 'error',
        message: 'notification.generic.request',
      };

      beforeEach(() => {
        MockDate.set('2019');
      });

      afterEach(() => {
        MockDate.reset();
      });

      it('should create an action for insured post started', () => {
        expect(postInsuredRequest({ name: 'foo' })).toEqual({ type: 'INSURED_POST_REQUEST', payload: { name: 'foo' } });
      });

      it('should create an action for insured post success', () => {
        expect(postInsuredSuccess(insuredResponseData)).toEqual({ type: 'INSURED_POST_SUCCESS', payload: insuredResponseData });
      });

      it('should create an action for insured post failure', () => {
        expect(postInsuredFailure({ status: 404 })).toEqual({ type: 'INSURED_POST_FAILURE', payload: { status: 404 } });
      });

      it('should dispatch the actions following a insured post success', async () => {
        fetchMock.post(url, { body: insuredResponseData });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(postInsured(insuredPostBody));

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'INSURED_POST_REQUEST', payload: insuredPostBody },
          { type: 'LOADER_ADD', payload: 'postInsured' },
          { type: 'INSURED_POST_SUCCESS', payload: insuredResponseData },
          { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
          { type: 'MODAL_HIDE' },
          { type: 'LOADER_REMOVE', payload: 'postInsured' },
        ]);
      });

      it('should dispatch the actions following a insured post network failure', async () => {
        fetchMock.post(url, { status: 404, body: {} });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(postInsured(insuredPostBody));

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'INSURED_POST_REQUEST', payload: insuredPostBody },
          { type: 'LOADER_ADD', payload: 'postInsured' },
          {
            type: 'INSURED_POST_FAILURE',
            payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/insured' } }),
          },
          { type: 'NOTIFICATION_ADD', payload: notificationError },
          { type: 'MODAL_HIDE' },
          { type: 'LOADER_REMOVE', payload: 'postInsured' },
        ]);
      });
    });
  });

  describe('reinsureds', () => {
    describe('get', () => {
      const url = 'glob:*/api/v1/reinsured*';
      const response = {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        pagination: {
          direction: 'asc',
          orderBy: 'name',
          page: 1,
          size: 10,
          totalElements: 3,
          totalPages: 1,
        },
      };

      it('should create an action for fetch start', () => {
        expect(getReinsuredsRequest()).toEqual({ type: 'REINSUREDS_GET_REQUEST' });
      });

      it('should create an action for fetch success', () => {
        expect(getReinsuredsSuccess(response)).toEqual({
          type: 'REINSUREDS_GET_SUCCESS',
          payload: response,
        });
      });

      it('should create an action for fetch failure', () => {
        expect(getReinsuredsFailure({ status: 404 })).toEqual({
          type: 'REINSUREDS_GET_FAILURE',
          payload: { status: 404 },
        });
      });

      it('should dispatch the actions following a fetch success', async () => {
        fetchMock.get(url, { body: response });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getReinsureds());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([{ type: 'REINSUREDS_GET_REQUEST' }, { type: 'REINSUREDS_GET_SUCCESS', payload: response }]);
      });

      it('should dispatch the actions following a fetch network failure', async () => {
        fetchMock.get(url, { status: 404, body: {} });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getReinsureds());

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'REINSUREDS_GET_REQUEST' },
          {
            type: 'REINSUREDS_GET_FAILURE',
            payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/reinsured?page=1' } }),
          },
        ]);
      });
    });
  });
});
