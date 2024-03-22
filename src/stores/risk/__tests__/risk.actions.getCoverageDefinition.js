import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState } from 'tests';
import merge from 'lodash/merge';

import {
  getCoverageDefinition,
  getCoverageDefinitionRequest,
  getCoverageDefinitionFailure,
  getCoverageDefinitionSuccess,
} from '../risk.actions.getCoverageDefinition';

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

  describe('Coverage Definition GET', () => {
    const url = 'glob:*/api/v1/products/*?type=COVERAGE_COMPARISON';
    const riskResponseData = { product: [{ id: 1 }, { id: 2 }, { id: 3 }] };

    it('should create an action for fetch start', () => {
      expect(getCoverageDefinitionRequest()).toEqual({ type: 'COVERAGE_DEFINITIONS_GET_REQUEST' });
    });

    it('should create an action for fetch failure', () => {
      expect(getCoverageDefinitionFailure({ status: 404 })).toEqual({
        type: 'COVERAGE_DEFINITIONS_GET_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: { status: 'success', data: riskResponseData } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getCoverageDefinition('WIND_HAIL', 'COVERAGE_COMPARISON'));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'COVERAGE_DEFINITIONS_GET_REQUEST', payload: 'COVERAGE_COMPARISON' },
        { type: 'COVERAGE_DEFINITIONS_GET_SUCCESS', payload: { product: 'WIND_HAIL', definition: riskResponseData.product } },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getCoverageDefinition('WIND_HAIL', 'COVERAGE_COMPARISON'));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'COVERAGE_DEFINITIONS_GET_REQUEST', payload: 'COVERAGE_COMPARISON' },
        {
          type: 'COVERAGE_DEFINITIONS_GET_FAILURE',
          payload: merge(errorNetwork, {
            response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/products/WIND_HAIL?type=COVERAGE_COMPARISON' },
          }),
        },
      ]);
    });

    it('should dispatch the actions following a fetch backend failure', async () => {
      fetchMock.get(url, { body: errorBackendData });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getCoverageDefinition('WIND_HAIL', 'COVERAGE_COMPARISON'));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'COVERAGE_DEFINITIONS_GET_REQUEST', payload: 'COVERAGE_COMPARISON' },
        {
          type: 'COVERAGE_DEFINITIONS_GET_FAILURE',
          payload: { status: 400, error: 'Something went wrong', message: 'API data format error (400)' },
        },
      ]);
    });
  });
});
