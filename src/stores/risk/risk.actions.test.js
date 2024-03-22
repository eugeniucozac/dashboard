import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState } from 'tests';
import merge from 'lodash/merge';

import {
  downloadRiskBordereaux,
  downloadRiskBordereauxRequest,
  downloadRiskBordereauxSuccess,
  downloadRiskBordereauxFailure,
} from './risk.actions.downloadBordereaux';
import { getRiskList, getRiskListRequest, getRiskListFailure, getRiskListSuccess } from './risk.actions.getList';
import { getRiskProducts, getProductsRequest, getProductsFailure, getProductsSuccess } from './risk.actions.getProducts';
import {
  getRiskProductsWithReports,
  getProductsWithReportsRequest,
  getProductsWithReportsFailure,
  getProductsWithReportsSuccess,
} from './risk.actions.getProductsWithReports';
import { getRiskDefinitions, getDefinitionsRequest, getDefinitionsFailure, getDefinitionsSuccess } from './risk.actions.getDefinitions';
import { getRiskQuotes, getRiskQuotesRequest, getRiskQuotesFailure, getRiskQuotesSuccess } from './risk.actions.getQuotes';
import { postRiskQuote, postQuoteRequest, postQuoteSuccess, postQuoteFailure } from './risk.actions.postQuote';
import { patchRiskQuote, patchQuoteRequest, patchQuoteSuccess, patchQuoteFailure } from './risk.actions.patchQuote';
import { acceptRiskQuote, acceptQuoteRequest, acceptQuoteSuccess, acceptQuoteFailure } from './risk.actions.acceptQuote';
import { declineRiskQuote, declineQuoteRequest, declineQuoteSuccess, declineQuoteFailure } from './risk.actions.declineQuote';
import {
  postRiskQuoteResponse,
  postQuoteResponseRequest,
  postQuoteResponseSuccess,
  postQuoteResponseFailure,
} from './risk.actions.postQuoteResponse';
import { postRiskRequest, postRiskSuccess, postRiskFailure, postRisk } from './risk.actions.postRisk';
import { patchRiskRequest, patchRiskSuccess, patchRiskFailure, patchRisk } from './risk.actions.patchRisk';
import { resetRiskSelected, setRiskSelected, selectRiskProduct, resetRiskProduct } from './risk.actions';
import {
  getFacilityRates,
  getFacilityRatesRequest,
  getFacilityRatesSuccess,
  getFacilityRatesFailure,
} from './risk.actions.getFacilityRates';
import {
  postFacilityRates,
  postFacilityRatesRequest,
  postFacilityRatesSuccess,
  postFacilityRatesFailure,
} from './risk.actions.postFacilityRates';
import {
  getFacilityLimitsRequest,
  getFacilityLimitsFailure,
  getFacilityLimitsSuccess,
  getFacilityLimitsDefinition,
} from './risk.actions.getFacilityLimitsDefinition';

import { getAggLimitsGraphRequest, getAggLimitsGraphFailure, getAggLimitsGraphSuccess } from './risk.actions.getLimitsGraph';

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

const errorData = {
  status: 500,
  message: 'API data format error (500)',
};

const errorBackendData = {
  status: 400,
  error: 'Something went wrong',
};

const notificationError = {
  key: 1546300800000,
  visible: true,
  data: undefined,
  type: 'error',
  message: 'notification.generic.request',
};

describe('STORES › ACTIONS › risk', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const storeData = {
    user: {
      accessToken: 1,
      departmentIds: [1, 2],
      departmentSelected: 1,
    },
    risk: {
      list: {},
      draftList: {},
      selected: {},
    },
    limits: {
      items: [],
      loading: false,
    },
    ui: {
      notification: { queue: [] },
    },
  };

  describe('risk list GET', () => {
    const url = 'glob:*/api/v1/risks*';
    const riskResponseData = {
      content: [{ id: 1 }, { id: 2 }, { id: 3 }],
      pagination: { page: 1 },
    };

    it('should create an action for fetch start', () => {
      expect(getRiskListRequest()).toEqual({ type: 'RISK_LIST_GET_REQUEST' });
    });

    it('should create an action for fetch success', () => {
      expect(getRiskListSuccess(riskResponseData)).toEqual({
        type: 'RISK_LIST_GET_SUCCESS',
        payload: {
          content: [{ id: 1 }, { id: 2 }, { id: 3 }],
          pagination: { page: 1 },
        },
      });
    });

    it('should create an action for fetch failure', () => {
      expect(getRiskListFailure({ status: 404 })).toEqual({
        type: 'RISK_LIST_GET_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: riskResponseData });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskList());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_LIST_GET_REQUEST', payload: { page: 1 } },
        { type: 'RISK_LIST_GET_SUCCESS', payload: { content: [{ id: 1 }, { id: 2 }, { id: 3 }], pagination: { page: 1 } } },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskList());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_LIST_GET_REQUEST', payload: { page: 1 } },
        {
          type: 'RISK_LIST_GET_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/risks?page=1' } }),
        },
      ]);
    });

    it('should dispatch the actions following a fetch backend failure', async () => {
      fetchMock.get(url, { body: errorBackendData });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskList());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_LIST_GET_REQUEST', payload: { page: 1 } },
        { type: 'RISK_LIST_GET_FAILURE', payload: { ...errorBackendData, message: 'API data format error' } },
      ]);
    });
  });

  describe('product types GET', () => {
    const url = 'glob:*/api/v1/products*';
    const productResponseData = ['apple', 'banana', 'orange'];

    it('should create an action for fetch started', () => {
      expect(getProductsRequest()).toEqual({
        type: 'RISK_PRODUCTS_GET_REQUEST',
      });
    });

    it('should create an action for fetch success', () => {
      expect(getProductsSuccess(productResponseData)).toEqual({
        type: 'RISK_PRODUCTS_GET_SUCCESS',
        payload: productResponseData,
      });
    });

    it('should create an action for fetch failure', () => {
      const errorObject = { status: 404 };
      const expectedAction = { type: 'RISK_PRODUCTS_GET_FAILURE', payload: errorObject };
      expect(getProductsFailure(errorObject)).toEqual(expectedAction);
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: { status: 'success', data: productResponseData } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskProducts());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_PRODUCTS_GET_REQUEST' },
        { type: 'RISK_PRODUCTS_GET_SUCCESS', payload: productResponseData },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskProducts());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_PRODUCTS_GET_REQUEST' },
        {
          type: 'RISK_PRODUCTS_GET_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/products' } }),
        },
      ]);
    });

    it('should dispatch the actions following a fetch backend failure', async () => {
      fetchMock.get(url, { body: { status: errorData.status, message: errorData.message } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskProducts());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_PRODUCTS_GET_REQUEST' },
        { type: 'RISK_PRODUCTS_GET_FAILURE', payload: errorData },
      ]);
    });
  });

  describe('product reports types GET', () => {
    const url = 'glob:*/api/v1/products/reports*';
    const productResponseData = ['apple', 'banana', 'orange'];

    it('should create an action for fetch started', () => {
      expect(getProductsWithReportsRequest()).toEqual({
        type: 'RISK_PRODUCTS_REPORTS_GET_REQUEST',
      });
    });

    it('should create an action for fetch success', () => {
      expect(getProductsWithReportsSuccess(productResponseData)).toEqual({
        type: 'RISK_PRODUCTS_REPORTS_GET_SUCCESS',
        payload: productResponseData,
      });
    });

    it('should create an action for fetch failure', () => {
      const errorObject = { status: 404 };
      const expectedAction = { type: 'RISK_PRODUCTS_REPORTS_GET_FAILURE', payload: errorObject };
      expect(getProductsWithReportsFailure(errorObject)).toEqual(expectedAction);
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: { status: 'success', data: productResponseData } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskProductsWithReports());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_PRODUCTS_REPORTS_GET_REQUEST' },
        { type: 'RISK_PRODUCTS_REPORTS_GET_SUCCESS', payload: productResponseData },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskProductsWithReports());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_PRODUCTS_REPORTS_GET_REQUEST' },
        {
          type: 'RISK_PRODUCTS_REPORTS_GET_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/products/reports' } }),
        },
      ]);
    });

    it('should dispatch the actions following a fetch backend failure', async () => {
      fetchMock.get(url, { body: { status: errorData.status, message: errorData.message } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskProductsWithReports());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_PRODUCTS_REPORTS_GET_REQUEST' },
        { type: 'RISK_PRODUCTS_REPORTS_GET_FAILURE', payload: errorData },
      ]);
    });
  });

  describe('definitions GET', () => {
    const url = 'glob:*/api/v1/products*';
    const definitionsResponseData = [
      { id: 1, name: 'apple', group: 'FRUIT' },
      { id: 2, name: 'banana', group: 'FRUIT' },
      { id: 3, name: 'potato', group: 'VEGETABLE' },
    ];

    it('should create an action for fetch started', () => {
      expect(getDefinitionsRequest('FOO')).toEqual({
        type: 'RISK_DEFINITIONS_GET_REQUEST',
        payload: 'FOO',
      });
    });

    it('should create an action for fetch success', () => {
      expect(getDefinitionsSuccess('FOO', definitionsResponseData)).toEqual({
        type: 'RISK_DEFINITIONS_GET_SUCCESS',
        payload: {
          type: 'FOO',
          data: definitionsResponseData,
        },
      });
    });

    it('should create an action for fetch failure', () => {
      expect(getDefinitionsFailure({ status: 404 })).toEqual({
        type: 'RISK_DEFINITIONS_GET_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: { status: 'success', data: definitionsResponseData } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskDefinitions('FOO'));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_DEFINITIONS_GET_REQUEST', payload: 'FOO' },
        {
          type: 'RISK_DEFINITIONS_GET_SUCCESS',
          payload: {
            type: 'FOO',
            data: definitionsResponseData,
          },
        },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskDefinitions('FOO'));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_DEFINITIONS_GET_REQUEST', payload: 'FOO' },
        {
          type: 'RISK_DEFINITIONS_GET_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/products/FOO' } }),
        },
      ]);
    });

    it('should dispatch the actions following a fetch backend failure', async () => {
      fetchMock.get(url, { body: { status: errorData.status, message: errorData.message } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskDefinitions('FOO'));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_DEFINITIONS_GET_REQUEST', payload: 'FOO' },
        { type: 'RISK_DEFINITIONS_GET_FAILURE', payload: errorData },
      ]);
    });
  });

  describe('risk POST', () => {
    const url = 'glob:*/api/v1/risks*';
    const riskPostBody = { name: 'Joe' };
    const riskResponseData = { id: 100 };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.saveRisk.success',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action for risk post started', () => {
      expect(postRiskRequest({ name: 'foo' })).toEqual({ type: 'RISK_POST_REQUEST', payload: { name: 'foo' } });
    });

    it('should create an action for risk post success', () => {
      expect(postRiskSuccess(riskResponseData)).toEqual({ type: 'RISK_POST_SUCCESS', payload: riskResponseData });
    });

    it('should create an action for risk post failure', () => {
      expect(postRiskFailure({ status: 404 })).toEqual({ type: 'RISK_POST_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following a risk post success', async () => {
      fetchMock.post(url, { body: riskResponseData });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postRisk(riskPostBody, 'FOO', []));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_POST_REQUEST', payload: riskPostBody },
        { type: 'LOADER_ADD', payload: 'postRisk' },
        { type: 'RISK_POST_SUCCESS', payload: riskResponseData },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postRisk' },
      ]);
    });

    it('should dispatch the actions following a risk post network failure', async () => {
      fetchMock.post(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postRisk(riskPostBody, 'FOO', []));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_POST_REQUEST', payload: riskPostBody },
        { type: 'LOADER_ADD', payload: 'postRisk' },
        {
          type: 'RISK_POST_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/risks' } }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postRisk' },
      ]);
    });

    it('should dispatch the actions following a risk post backend failure', async () => {
      fetchMock.post(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postRisk(riskPostBody, 'FOO', []));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_POST_REQUEST', payload: riskPostBody },
        { type: 'LOADER_ADD', payload: 'postRisk' },
        { type: 'RISK_POST_FAILURE', payload: { ...errorBackendData, message: 'API data format error' } },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postRisk' },
      ]);
    });

    xit('should parse the values/body before sending to POST', async () => {
      // todo
    });
  });

  // start
  describe('risk PATCH', () => {
    const url = 'glob:*/api/v1/risks/100';
    const riskPostBody = { name: 'Joe' };
    const riskResponseData = { id: 100 };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.reQuote.success',
    };

    const definitions = [
      {
        group: 'GENERAL',
        indicative: false,
        label: 'Name',
        name: 'name',
        type: 'text',
      },
    ];

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action for risk patch started', () => {
      expect(patchRiskRequest({ name: 'foo' })).toEqual({ type: 'RISK_PATCH_REQUEST', payload: { name: 'foo' } });
    });

    it('should create an action for risk patch success', () => {
      expect(patchRiskSuccess(riskResponseData)).toEqual({ type: 'RISK_PATCH_SUCCESS', payload: riskResponseData });
    });

    it('should create an action for risk patch failure', () => {
      expect(patchRiskFailure({ status: 404 })).toEqual({ type: 'RISK_PATCH_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following a risk patch success', async () => {
      fetchMock.patch('*', { body: riskResponseData });

      fetchMock.get('glob:*/api/v1/risks/*/refresh', { body: riskResponseData });

      fetchMock.get('glob:*/api/v1/risks/*/quotes', { body: riskResponseData }, { overwriteRoutes: false });
      fetchMock.get('glob:*/api/v1/risks/*/coverages', { body: riskResponseData }, { overwriteRoutes: false });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(patchRisk(riskPostBody, 'FOO', definitions, 100));

      expect(fetchMock.calls()).toHaveLength(4);

      expect(store.getActions()).toEqual([
        { type: 'RISK_PATCH_REQUEST', payload: riskPostBody },
        { type: 'RISK_PATCH_SUCCESS', payload: riskResponseData },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'RISK_DETAILS_GET_REQUEST', payload: 100 },
        { type: 'RISK_QUOTES_GET_REQUEST', payload: 100 },
        { type: 'RISK_COVERAGE_GET_REQUEST', payload: 100 },
        { type: 'MODAL_HIDE' },
      ]);
    });

    it('should dispatch the actions following a risk patch backend failure', async () => {
      fetchMock.patch(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(patchRisk(riskPostBody, 'FOO', definitions, 100));

      expect(fetchMock.calls()).toHaveLength(1);

      expect(store.getActions()).toEqual([
        { type: 'RISK_PATCH_REQUEST', payload: riskPostBody },
        { type: 'RISK_PATCH_FAILURE', payload: { ...errorBackendData, message: 'API data format error' } },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
      ]);
    });
  });

  describe('quotes GET', () => {
    const url = 'glob:*/api/v1/risks/*/quotes';
    const quotesResponseData = [{ id: 1 }, { id: 2 }, { id: 3 }];

    it('should create an action for fetch start', () => {
      expect(getRiskQuotesRequest(100)).toEqual({ type: 'RISK_QUOTES_GET_REQUEST', payload: 100 });
    });

    it('should create an action for fetch success', () => {
      expect(getRiskQuotesSuccess(quotesResponseData, 123)).toEqual({
        type: 'RISK_QUOTES_GET_SUCCESS',
        payload: { items: [{ id: 1 }, { id: 2 }, { id: 3 }], riskId: 123 },
      });
    });

    it('should create an action for fetch failure', () => {
      expect(getRiskQuotesFailure({ status: 404 })).toEqual({
        type: 'RISK_QUOTES_GET_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: quotesResponseData });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskQuotes('foo'));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_QUOTES_GET_REQUEST', payload: 'foo' },
        { type: 'RISK_QUOTES_GET_SUCCESS', payload: { items: [{ id: 1 }, { id: 2 }, { id: 3 }], riskId: 'foo' } },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskQuotes('foo'));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_QUOTES_GET_REQUEST', payload: 'foo' },
        {
          type: 'RISK_QUOTES_GET_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/risks/foo/quotes' } }),
        },
      ]);
    });

    it('should dispatch the actions following a fetch backend failure', async () => {
      fetchMock.get(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskQuotes('foo'));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_QUOTES_GET_REQUEST', payload: 'foo' },
        { type: 'RISK_QUOTES_GET_FAILURE', payload: { ...errorBackendData, message: 'API data format error' } },
      ]);
    });
  });

  describe('quote POST', () => {
    const url = 'glob:*/api/v1/quotes*';
    const formData = { riskId: 1, facility: '{ "facilityId":"2", "carrierId":"3"}' };
    const responseData = { id: 123, riskId: 12 };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.postRiskQuote.success',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action for post started', () => {
      expect(postQuoteRequest(formData)).toEqual({ type: 'RISK_POST_QUOTE_REQUEST', payload: formData });
    });

    it('should create an action for post success', () => {
      expect(postQuoteSuccess(responseData)).toEqual({ type: 'RISK_POST_QUOTE_SUCCESS', payload: responseData });
    });

    it('should create an action for post failure', () => {
      expect(postQuoteFailure({ status: 404 })).toEqual({ type: 'RISK_POST_QUOTE_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following a post success', async () => {
      const response = { ...responseData, riskStatus: 'BOUND' };
      const quotesResponseData = [{ id: 1 }, { id: 2 }, { id: 3 }];
      fetchMock.post('glob:*/api/v1/quotes', { body: response });
      fetchMock.get('glob:*/api/v1/risks/*/quotes', { body: quotesResponseData }, { overwriteRoutes: false });
      fetchMock.get('glob:*/api/v1/risks/*', { body: response }, { overwriteRoutes: false });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postRiskQuote(formData));

      expect(fetchMock.calls()).toHaveLength(3);

      expect(store.getActions()).toEqual([
        { type: 'RISK_POST_QUOTE_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'postQuote' },
        { type: 'RISK_POST_QUOTE_SUCCESS', payload: response },
        { type: 'RISK_DETAILS_GET_REQUEST', payload: response.riskId },
        { type: 'RISK_QUOTES_GET_REQUEST', payload: response.riskId },
        { type: 'RISK_DETAILS_GET_SUCCESS', payload: response },
        { type: 'RISK_LIST_UPDATE_ITEM_RISK_STATUS', payload: { riskId: response.id, riskStatus: response.riskStatus } },
        { type: 'RISK_QUOTES_GET_SUCCESS', payload: { items: quotesResponseData, riskId: response.riskId } },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postQuote' },
      ]);
    });

    it('should dispatch the actions following a post network failure', async () => {
      fetchMock.post(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postRiskQuote(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_POST_QUOTE_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'postQuote' },
        {
          type: 'RISK_POST_QUOTE_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/quotes' } }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postQuote' },
      ]);
    });

    it('should dispatch the actions following a post backend failure', async () => {
      fetchMock.post(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postRiskQuote(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_POST_QUOTE_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'postQuote' },
        { type: 'RISK_POST_QUOTE_FAILURE', payload: { ...errorBackendData, message: 'API data format error' } },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postQuote' },
      ]);
    });
  });

  describe('quote PATCH', () => {
    const url = 'glob:*/api/v1/quotes*';
    const formData = { riskId: 1, facility: '{ "facilityId":"2", "carrierId":"3"}' };
    const responseData = { id: 123, riskId: 12 };

    const quote = { id: 1 };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.patchRiskQuote.success',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action for patch started', () => {
      expect(patchQuoteRequest(formData)).toEqual({ type: 'RISK_PATCH_QUOTE_REQUEST', payload: formData });
    });

    it('should create an action for patch success', () => {
      expect(patchQuoteSuccess(responseData)).toEqual({ type: 'RISK_PATCH_QUOTE_SUCCESS', payload: responseData });
    });

    it('should create an action for patch failure', () => {
      expect(patchQuoteFailure({ status: 404 })).toEqual({ type: 'RISK_PATCH_QUOTE_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following a patch success', async () => {
      const response = { ...responseData, riskStatus: 'BOUND' };
      const quotesResponseData = [{ id: 1 }, { id: 2 }, { id: 3 }];
      fetchMock.post('glob:*/api/v1/quotes/*', { body: response });
      fetchMock.get('glob:*/api/v1/risks/*/quotes', { body: quotesResponseData }, { overwriteRoutes: false });
      fetchMock.get('glob:*/api/v1/risks/*', { body: response }, { overwriteRoutes: false });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(patchRiskQuote(formData, quote));

      expect(fetchMock.calls()).toHaveLength(3);

      expect(store.getActions()).toEqual([
        { type: 'RISK_PATCH_QUOTE_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'patchQuote' },
        { type: 'RISK_PATCH_QUOTE_SUCCESS', payload: response },
        { type: 'RISK_DETAILS_GET_REQUEST', payload: response.riskId },
        { type: 'RISK_QUOTES_GET_REQUEST', payload: response.riskId },
        { type: 'RISK_DETAILS_GET_SUCCESS', payload: response },
        { type: 'RISK_LIST_UPDATE_ITEM_RISK_STATUS', payload: { riskId: response.id, riskStatus: response.riskStatus } },
        { type: 'RISK_QUOTES_GET_SUCCESS', payload: { items: quotesResponseData, riskId: response.riskId } },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'patchQuote' },
      ]);
    });

    it('should dispatch the actions following a patch network failure', async () => {
      fetchMock.post(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(patchRiskQuote(formData, quote));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_PATCH_QUOTE_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'patchQuote' },
        {
          type: 'RISK_PATCH_QUOTE_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/quotes/1/patch' } }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'patchQuote' },
      ]);
    });

    it('should dispatch the actions following a patch backend failure', async () => {
      fetchMock.post(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(patchRiskQuote(formData, quote));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_PATCH_QUOTE_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'patchQuote' },
        { type: 'RISK_PATCH_QUOTE_FAILURE', payload: { ...errorBackendData, message: 'API data format error' } },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'patchQuote' },
      ]);
    });
  });

  describe('accept quote PUT', () => {
    const url = 'glob:*/api/v1/quotes*';
    const responseData = { id: 123, riskId: 12 };
    const quote = { id: 1 };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.acceptRiskQuote.success',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action when accept started', () => {
      expect(acceptQuoteRequest(quote.id)).toEqual({ type: 'RISK_ACCEPT_QUOTE_REQUEST', payload: quote.id });
    });

    it('should create an action when accept success', () => {
      expect(acceptQuoteSuccess(responseData)).toEqual({ type: 'RISK_ACCEPT_QUOTE_SUCCESS', payload: responseData });
    });

    it('should create an action when accept failure', () => {
      expect(acceptQuoteFailure({ status: 404 })).toEqual({ type: 'RISK_ACCEPT_QUOTE_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following accept success', async () => {
      const response = { ...responseData, riskStatus: 'BOUND' };
      const quotesResponseData = [{ id: 1 }, { id: 2 }, { id: 3 }];
      fetchMock.put('glob:*/api/v1/quotes/*', { body: response });
      fetchMock.get('glob:*/api/v1/risks/*/quotes', { body: quotesResponseData }, { overwriteRoutes: false });
      fetchMock.get('glob:*/api/v1/risks/*', { body: response }, { overwriteRoutes: false });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(acceptRiskQuote(quote.id));

      expect(fetchMock.calls()).toHaveLength(3);

      expect(store.getActions()).toEqual([
        { type: 'RISK_ACCEPT_QUOTE_REQUEST', payload: quote.id },
        { type: 'LOADER_ADD', payload: 'acceptQuote' },
        { type: 'RISK_ACCEPT_QUOTE_SUCCESS', payload: response },
        { type: 'RISK_DETAILS_GET_REQUEST', payload: response.riskId },
        { type: 'RISK_QUOTES_GET_REQUEST', payload: response.riskId },
        { type: 'RISK_DETAILS_GET_SUCCESS', payload: response },
        { type: 'RISK_LIST_UPDATE_ITEM_RISK_STATUS', payload: { riskId: response.id, riskStatus: response.riskStatus } },
        { type: 'RISK_QUOTES_GET_SUCCESS', payload: { items: quotesResponseData, riskId: response.riskId } },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'acceptQuote' },
      ]);
    });

    it('should dispatch the actions following accept network failure', async () => {
      fetchMock.put(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(acceptRiskQuote(quote.id));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_ACCEPT_QUOTE_REQUEST', payload: quote.id },
        { type: 'LOADER_ADD', payload: 'acceptQuote' },
        {
          type: 'RISK_ACCEPT_QUOTE_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/quotes/1/accept' } }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'acceptQuote' },
      ]);
    });

    it('should dispatch the actions following accept backend failure', async () => {
      fetchMock.put(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(acceptRiskQuote(quote.id));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_ACCEPT_QUOTE_REQUEST', payload: quote.id },
        { type: 'LOADER_ADD', payload: 'acceptQuote' },
        { type: 'RISK_ACCEPT_QUOTE_FAILURE', payload: { ...errorBackendData, message: 'API data format error' } },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'acceptQuote' },
      ]);
    });
  });

  //
  describe('decline quote PUT', () => {
    const url = 'glob:*/api/v1/quotes*';
    const responseData = { id: 123, riskId: 12 };
    const quote = { id: 1 };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.declineRiskQuote.success',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action when decline started', () => {
      expect(declineQuoteRequest(quote.id)).toEqual({ type: 'RISK_DECLINE_QUOTE_REQUEST', payload: quote.id });
    });

    it('should create an action when decline success', () => {
      expect(declineQuoteSuccess(responseData)).toEqual({ type: 'RISK_DECLINE_QUOTE_SUCCESS', payload: responseData });
    });

    it('should create an action when decline failure', () => {
      expect(declineQuoteFailure({ status: 404 })).toEqual({ type: 'RISK_DECLINE_QUOTE_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following decline success', async () => {
      const response = { ...responseData, riskStatus: 'BOUND' };
      const quotesResponseData = [{ id: 1 }, { id: 2 }, { id: 3 }];
      fetchMock.put('glob:*/api/v1/quotes/*', { body: response });
      fetchMock.get('glob:*/api/v1/risks/*/quotes', { body: quotesResponseData }, { overwriteRoutes: false });
      fetchMock.get('glob:*/api/v1/risks/*', { body: response }, { overwriteRoutes: false });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(declineRiskQuote(quote.id));

      expect(fetchMock.calls()).toHaveLength(3);

      expect(store.getActions()).toEqual([
        { type: 'RISK_DECLINE_QUOTE_REQUEST', payload: quote.id },
        { type: 'LOADER_ADD', payload: 'declineQuote' },
        { type: 'RISK_DECLINE_QUOTE_SUCCESS', payload: response },
        { type: 'RISK_DETAILS_GET_REQUEST', payload: response.riskId },
        { type: 'RISK_QUOTES_GET_REQUEST', payload: response.riskId },
        { type: 'RISK_DETAILS_GET_SUCCESS', payload: response },
        { type: 'RISK_LIST_UPDATE_ITEM_RISK_STATUS', payload: { riskId: response.id, riskStatus: response.riskStatus } },
        { type: 'RISK_QUOTES_GET_SUCCESS', payload: { items: quotesResponseData, riskId: response.riskId } },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'declineQuote' },
      ]);
    });

    it('should dispatch the actions following decline network failure', async () => {
      fetchMock.put(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(declineRiskQuote(quote.id));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_DECLINE_QUOTE_REQUEST', payload: quote.id },
        { type: 'LOADER_ADD', payload: 'declineQuote' },
        {
          type: 'RISK_DECLINE_QUOTE_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/quotes/1/decline' } }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'declineQuote' },
      ]);
    });

    it('should dispatch the actions following decline backend failure', async () => {
      fetchMock.put(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(declineRiskQuote(quote.id));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_DECLINE_QUOTE_REQUEST', payload: quote.id },
        { type: 'LOADER_ADD', payload: 'declineQuote' },
        { type: 'RISK_DECLINE_QUOTE_FAILURE', payload: { ...errorBackendData, message: 'API data format error' } },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'declineQuote' },
      ]);
    });
  });

  //

  describe('quote response POST', () => {
    const url = 'glob:*/api/v1/quotes/*/response';
    const formData = { riskId: 100, quoteId: 1, status: 'BOUND', effectiveFrom: '2019', effectiveTo: '2020' };
    const responseData = { quoteId: 1, status: 'BOUND', effectiveFrom: '2019', effectiveTo: '2020', id: 123456789 };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.postRiskQuoteBind.success',
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
      fetchMock.restore();
    });

    it('should create an action for post started', () => {
      expect(postQuoteResponseRequest(formData)).toEqual({ type: 'RISK_POST_QUOTE_RESPONSE_REQUEST', payload: formData });
    });

    it('should create an action for post success', () => {
      expect(postQuoteResponseSuccess(responseData)).toEqual({ type: 'RISK_POST_QUOTE_RESPONSE_SUCCESS', payload: responseData });
    });

    it('should create an action for post failure', () => {
      expect(postQuoteResponseFailure({ status: 404 })).toEqual({ type: 'RISK_POST_QUOTE_RESPONSE_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following a post success', async () => {
      const response = { ...responseData, riskId: 100, riskStatus: 'BOUND' };
      fetchMock.mock('*', { body: response });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postRiskQuoteResponse(formData));

      expect(fetchMock.calls()).toHaveLength(2);
      expect(store.getActions()).toEqual([
        { type: 'RISK_POST_QUOTE_RESPONSE_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'postQuoteResponse' },
        { type: 'RISK_POST_QUOTE_RESPONSE_SUCCESS', payload: response },
        { type: 'RISK_DETAILS_GET_REQUEST', payload: response.riskId },
        { type: 'RISK_DETAILS_GET_SUCCESS', payload: response },
        { type: 'RISK_LIST_UPDATE_ITEM_RISK_STATUS', payload: { riskId: response.id, riskStatus: response.riskStatus } },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postQuoteResponse' },
      ]);
    });

    it('should dispatch the actions following a post network failure', async () => {
      fetchMock.post(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postRiskQuoteResponse(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_POST_QUOTE_RESPONSE_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'postQuoteResponse' },
        {
          type: 'RISK_POST_QUOTE_RESPONSE_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/quotes/1/response' } }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postQuoteResponse' },
      ]);
    });

    it('should dispatch the actions following a post backend failure', async () => {
      fetchMock.post(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postRiskQuoteResponse(formData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_POST_QUOTE_RESPONSE_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'postQuoteResponse' },
        { type: 'RISK_POST_QUOTE_RESPONSE_FAILURE', payload: { ...errorBackendData, message: 'API data format error' } },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postQuoteResponse' },
      ]);
    });
  });

  describe('bordereaux download GET', () => {
    const url = 'glob:*/api/v1/products/*/bordereaux*';

    it('should create an action for fetch start', () => {
      expect(downloadRiskBordereauxRequest(123)).toEqual({ type: 'DOWNLOAD_RISK_BORDEREAUX_REQUEST', payload: 123 });
    });

    it('should create an action for fetch success', () => {
      expect(downloadRiskBordereauxSuccess()).toEqual({
        type: 'DOWNLOAD_RISK_BORDEREAUX_SUCCESS',
      });
    });

    it('should create an action for fetch failure', () => {
      expect(downloadRiskBordereauxFailure({ status: 404 })).toEqual({
        type: 'DOWNLOAD_RISK_BORDEREAUX_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: 123 });

      const params = { product: 'foo', facility: null, from: '2020-01', to: '2020-06' };
      const store = mockStore(getInitialState(storeData));
      await store.dispatch(downloadRiskBordereaux(params));

      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('facility rates', () => {
    describe('get', () => {
      const url = 'glob:*/api/v1/rates?facilityId=*';

      it('should create an action for fetch start', () => {
        expect(getFacilityRatesRequest(123)).toEqual({ type: 'RISK_FACILITY_RATES_GET_REQUEST', payload: 123 });
      });

      it('should create an action for fetch success', () => {
        expect(getFacilityRatesSuccess({ id: 1 })).toEqual({
          type: 'RISK_FACILITY_RATES_GET_SUCCESS',
          payload: { id: 1 },
        });
      });

      it('should create an action for fetch failure', () => {
        expect(getFacilityRatesFailure({ status: 404 }, 123)).toEqual({
          type: 'RISK_FACILITY_RATES_GET_FAILURE',
          payload: { error: { status: 404 }, facilityId: 123 },
        });
      });

      it('should dispatch the actions following a fetch success', async () => {
        // arrange
        fetchMock.get(url, { body: { id: 1, facilityId: 20 } });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getFacilityRates(20));

        // assert
        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'RISK_FACILITY_RATES_GET_REQUEST', payload: 20 },
          { type: 'RISK_FACILITY_RATES_GET_SUCCESS', payload: { id: 1, facilityId: 20 } },
        ]);
      });

      it('should dispatch the actions following a fetch failure', async () => {
        // arrange
        fetchMock.get(url, { body: { error: 500 } });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getFacilityRates(20));

        // assert
        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'RISK_FACILITY_RATES_GET_REQUEST', payload: 20 },
          { type: 'RISK_FACILITY_RATES_GET_FAILURE', payload: { error: { message: 'API data format error', error: 500 }, facilityId: 20 } },
        ]);
      });
    });

    describe('post', () => {
      beforeEach(() => {
        MockDate.set('2019');
      });

      afterEach(() => {
        MockDate.reset();
      });

      const url = 'glob:*/api/v1/rates?facilityId=*';
      const formValues = {
        brokerageFee: 2.5,
        clientCommissionRate: 1,
        brokerCommissionRate: 5,
        reinsuranceRate: 2,
        countries: [],
      };

      const notificationSuccess = {
        key: 1546300800000,
        visible: true,
        data: undefined,
        type: 'success',
        message: 'notification.postFacilityRates.success',
      };

      it('should create an action for fetch start', () => {
        expect(postFacilityRatesRequest(20)).toEqual({
          type: 'RISK_FACILITY_RATES_POST_REQUEST',
          payload: 20,
        });
      });

      it('should create an action for fetch success', () => {
        expect(postFacilityRatesSuccess({ id: 1 })).toEqual({
          type: 'RISK_FACILITY_RATES_POST_SUCCESS',
          payload: { id: 1 },
        });
      });

      it('should create an action for fetch failure', () => {
        expect(postFacilityRatesFailure({ status: 404 })).toEqual({
          type: 'RISK_FACILITY_RATES_POST_FAILURE',
          payload: { status: 404 },
        });
      });

      it('should dispatch the actions following a fetch success', async () => {
        fetchMock.post(url, { body: { id: 1, facilityId: 20 } });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(postFacilityRates(formValues, 20, 1));

        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          {
            type: 'RISK_FACILITY_RATES_POST_REQUEST',
            payload: {
              formData: formValues,
              facilityId: 20,
              ratesId: 1,
            },
          },
          { type: 'LOADER_ADD', payload: 'postFacilityRates' },
          { type: 'RISK_FACILITY_RATES_POST_SUCCESS', payload: { id: 1, facilityId: 20 } },
          { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
          { type: 'MODAL_HIDE', payload: undefined },
          { type: 'LOADER_REMOVE', payload: 'postFacilityRates' },
        ]);
      });

      it('should dispatch the actions following a fetch failure', async () => {
        // arrange
        fetchMock.post(url, { body: { error: 500 } });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(postFacilityRates(formValues, 20, 1));

        // assert
        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          {
            type: 'RISK_FACILITY_RATES_POST_REQUEST',
            payload: {
              formData: formValues,
              facilityId: 20,
              ratesId: 1,
            },
          },
          { type: 'LOADER_ADD', payload: 'postFacilityRates' },
          { type: 'RISK_FACILITY_RATES_POST_FAILURE', payload: { message: 'API data format error', error: 500 } },
          { type: 'NOTIFICATION_ADD', payload: notificationError },
          { type: 'MODAL_HIDE' },
          { type: 'LOADER_REMOVE', payload: 'postFacilityRates' },
        ]);
      });
    });
  });

  describe('other', () => {
    it('should create an action for set risk selected', () => {
      expect(setRiskSelected(100)).toEqual({
        type: 'RISK_SELECTED_SET',
        payload: 100,
      });
    });

    it('should create an action for reset risk selected', () => {
      expect(resetRiskSelected()).toEqual({
        type: 'RISK_SELECTED_RESET',
      });
    });

    it('should create an action for select risk product type', () => {
      expect(selectRiskProduct(1)).toEqual({
        type: 'RISK_PRODUCTS_SELECT',
        payload: 1,
      });
    });

    it('should create an action for reset risk product type', () => {
      expect(resetRiskProduct()).toEqual({
        type: 'RISK_PRODUCTS_RESET',
      });
    });
  });

  describe('limts definitions GET', () => {
    describe('get', () => {
      const url = 'glob:*/api/v1/products/WIND_HAIL_DBB?type=LIMIT_APPLICABLE&facilityId=*';
      const data = {
        product: [
          {
            id: 1,
          },
        ],
      };

      it('should create an action for fetch start', () => {
        expect(getFacilityLimitsRequest('1')).toEqual({ type: 'RISK_FACILITY_LIMITS_DEF_GET_REQUEST', payload: '1' });
      });

      it('should create an action for fetch success', () => {
        expect(getFacilityLimitsSuccess(data)).toEqual({
          type: 'RISK_FACILITY_LIMITS_DEF_GET_SUCCESS',
          payload: [{ id: 1 }],
        });
      });

      it('should create an action for fetch failure', () => {
        expect(getFacilityLimitsFailure({ status: 404 }, '1')).toEqual({
          type: 'RISK_FACILITY_LIMITS_DEF_GET_FAILURE',
          payload: { error: { status: 404 }, facilityId: '1' },
        });
      });

      it('should dispatch the actions following a fetch success', async () => {
        // arrange
        fetchMock.get(url, {
          body: {
            data: {
              product: [
                {
                  name: 'limitState',
                  type: 'SELECT',
                  indicative: false,
                  group: 'LIMIT_APPLICABLE',
                  label: 'State',
                  qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
                  options: [
                    {
                      label: 'Alabama',
                      value: 'ALABAMA',
                    },
                    {
                      label: 'Alaska',
                      value: 'ALASKA',
                    },
                  ],
                },
              ],
            },
          },
        });

        const store = mockStore(getInitialState(storeData));
        await store.dispatch(getFacilityLimitsDefinition(1, 'WIND_HAIL_DBB'));

        // assert
        expect(fetchMock.calls()).toHaveLength(1);
        expect(store.getActions()).toEqual([
          { type: 'RISK_FACILITY_LIMITS_DEF_GET_REQUEST', payload: 1 },
          {
            type: 'RISK_FACILITY_LIMITS_DEF_GET_SUCCESS',
            payload: [
              {
                name: 'limitState',
                type: 'SELECT',
                indicative: false,
                group: 'LIMIT_APPLICABLE',
                label: 'State',
                qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
                options: [
                  {
                    label: 'Alabama',
                    value: 'ALABAMA',
                  },
                  {
                    label: 'Alaska',
                    value: 'ALASKA',
                  },
                ],
              },
            ],
          },
        ]);
      });
    });
  });
  describe('graph', () => {
    it('should create an action for limitsgraphs fetch started', () => {
      // arrange
      const expectedAction = { type: 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_REQUEST' };

      // assert
      expect(getAggLimitsGraphRequest()).toEqual(expectedAction);
    });

    it('should create an action for limitsgraphs fetch success', () => {
      // arrange
      const data = {
        aggregateFieldLimits: [
          {
            fieldName: 'limitState',
            label: 'State',
            qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
            valueLimits: [
              { fieldValue: 'ALABAMA', facilityLimit: 10000000, boundQuotesLimit: 1262998, alertRate: 80, label: 'Alabama' },
              { fieldValue: 'ALASKA', facilityLimit: 10000000, boundQuotesLimit: 1534694, alertRate: 80, label: 'Alaska' },
            ],
          },
          {
            fieldName: 'limitCountry',
            label: 'Country',
            qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
            valueLimits: [
              { alertRate: 10, boundQuotesLimit: 167173, facilityLimit: 200000, fieldValue: 'UK', label: 'United Kingdom' },
              { alertRate: 50, boundQuotesLimit: 200000, facilityLimit: 6000000, fieldValue: 'US', label: 'United State' },
            ],
          },
        ],
      };
      const expectedAction = { type: 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_SUCCESS', payload: data };

      // assert
      expect(getAggLimitsGraphSuccess(data)).toEqual(expectedAction);
    });

    it('should create an action for reporting group fetch failure', () => {
      // arrange
      const errorObject = { status: 404 };
      const facilityId = '1';
      const expectedAction = { type: 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_FAILURE', payload: { error: errorObject, facilityId: '1' } };

      // assert
      expect(getAggLimitsGraphFailure(errorObject, facilityId)).toEqual(expectedAction);
    });
  });
});
