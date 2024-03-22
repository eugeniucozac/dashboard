import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getRiskFacilities, getFacilitiesRequest, getFacilitiesSuccess, getFacilitiesFailure } from './risk.actions.getFacilities';
import { getInitialState } from 'tests';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    url: 'https://edge-auth-service.azurewebsites.net/api/v1/facilities?page=1',
  },
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
      facilities: {
        list: [],
        selected: {},
      },
    },
    ui: {
      notification: { queue: [] },
    },
  };

  describe('getFacilities', () => {
    const url = 'glob:*/api/v1/facilities*';
    const response = {
      content: [{ id: 1 }, { id: 2 }, { id: 3 }],
      pagination: { page: 1 },
    };

    it('should create an action for fetch start', () => {
      expect(getFacilitiesRequest()).toEqual({ type: 'RISK_FACILITIES_GET_REQUEST' });
    });

    it('should create an action for fetch success', () => {
      expect(getFacilitiesSuccess(response)).toEqual({
        type: 'RISK_FACILITIES_GET_SUCCESS',
        payload: {
          content: [{ id: 1 }, { id: 2 }, { id: 3 }],
          pagination: { page: 1 },
        },
      });
    });

    it('should create an action for fetch failure', () => {
      expect(getFacilitiesFailure({ status: 404 })).toEqual({
        type: 'RISK_FACILITIES_GET_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a fetch success', async () => {
      // TODO added on 01/04/2020: temporary fix until B/E adapts the response to follow normal pattern
      // fetchMock.get(url, { body: { status: 'success', data: riskResponseData } });
      fetchMock.get(url, { body: response });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskFacilities());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_FACILITIES_GET_REQUEST', payload: { page: 1 } },
        { type: 'RISK_FACILITIES_GET_SUCCESS', payload: { content: [{ id: 1 }, { id: 2 }, { id: 3 }], pagination: { page: 1 } } },
      ]);
    });

    it('should fetch risk facilities based on risk.id', async () => {
      const riskFacilitesUrl = 'glob:*/api/v1/facilities/risk/*';
      fetchMock.get(riskFacilitesUrl, { body: [{ id: 1 }, { id: 2 }] });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskFacilities({ id: 2 }));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_FACILITIES_GET_REQUEST', payload: { page: 1 } },
        { type: 'RISK_FACILITIES_GET_SUCCESS', payload: { content: [{ id: 1 }, { id: 2 }] } },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getRiskFacilities());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_FACILITIES_GET_REQUEST', payload: { page: 1 } },
        { type: 'RISK_FACILITIES_GET_FAILURE', payload: errorNetwork },
      ]);
    });
  });
});
