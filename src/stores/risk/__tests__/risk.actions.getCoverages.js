import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState } from 'tests';
import merge from 'lodash/merge';

import { getCoverages, getCoverageRequest, getCoverageFailure, getCoverageSuccess } from '../risk.actions.getCoverages';

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
      coverage: {},
    },
    ui: {
      notification: { queue: [] },
    },
  };

  describe('coverages GET', () => {
    const url = 'glob:*/api/v1/risks/*/coverages';
    const riskResponseData = [{ id: 1 }, { id: 2 }, { id: 3 }];

    it('should create an action for fetch start', () => {
      expect(getCoverageRequest()).toEqual({ type: 'RISK_COVERAGE_GET_REQUEST' });
    });

    it('should create an action for fetch success', () => {
      expect(getCoverageSuccess(riskResponseData)).toEqual({
        type: 'RISK_COVERAGE_GET_SUCCESS',
        payload: [{ id: 1 }, { id: 2 }, { id: 3 }],
      });
    });

    it('should create an action for fetch failure', () => {
      expect(getCoverageFailure({ status: 404 })).toEqual({
        type: 'RISK_COVERAGE_GET_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: riskResponseData });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getCoverages(1));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_COVERAGE_GET_REQUEST', payload: 1 },
        { type: 'RISK_COVERAGE_GET_SUCCESS', payload: riskResponseData },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getCoverages(1));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_COVERAGE_GET_REQUEST', payload: 1 },
        {
          type: 'RISK_COVERAGE_GET_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/risks/1/coverages' } }),
        },
      ]);
    });

    it('should dispatch the actions following a fetch backend failure', async () => {
      fetchMock.get(url, { body: errorBackendData });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getCoverages(1));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_COVERAGE_GET_REQUEST', payload: 1 },
        {
          type: 'RISK_COVERAGE_GET_FAILURE',
          payload: { status: 400, error: 'Something went wrong', message: 'API data format error' },
        },
      ]);
    });
  });
});
