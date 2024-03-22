import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState, publicConfig } from 'tests';
import {
  getReportByPlacement,
  getReportByPlacementRequest,
  getReportByPlacementSuccess,
  getReportByPlacementFailure,
} from './analytics.actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    url: `${publicConfig.endpoint.edge}/api/analytics/placement/1`,
  },
};

const errorBackendData = {
  status: 400,
  message: 'API data format error (400)',
};

describe('STORES › ACTIONS › analytics', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const storeData = {
    user: {
      accessToken: 1,
    },
    ui: {
      notification: { queue: [] },
    },
  };

  describe('report GET', () => {
    const url = 'glob:*/api/analytics*';
    const placementId = 1;
    const response = [
      {
        embedUrl: 'mockEmbedUrl',
        embedToken: 'mockEmbedToken',
        reportId: 'mockReportId',
        other: 'mockOther',
        insuredName: 'mockInsured',
        modellingDueDate: 'mockDate',
      },
    ];
    const transformedResponse = [
      {
        embedUrl: 'mockEmbedUrl',
        accessToken: 'mockEmbedToken',
        id: 'mockReportId',
        label: 'mockInsured - format.date(mockDate)',
        other: 'mockOther',
      },
    ];

    it('should create an action for fetch start', () => {
      expect(getReportByPlacementRequest(1)).toEqual({ type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_REQUEST', payload: placementId });
    });

    it('should create an action for fetch success', () => {
      expect(getReportByPlacementSuccess({ reports: transformedResponse, placementId })).toEqual({
        type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_SUCCESS',
        payload: { reports: transformedResponse, placementId },
      });
    });

    it('should create an action for fetch failure', () => {
      expect(getReportByPlacementFailure({ status: 404 })).toEqual({
        type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: { data: response, status: 'success' } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getReportByPlacement(1));

      expect(fetchMock.calls()).toHaveLength(placementId);
      expect(store.getActions()).toEqual([
        { type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_REQUEST', payload: placementId },
        { payload: 'getReportByPlacement', type: 'LOADER_ADD' },
        { type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_SUCCESS', payload: { reports: transformedResponse, placementId } },
        { payload: 'getReportByPlacement', type: 'LOADER_REMOVE' },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getReportByPlacement(1));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_REQUEST', payload: 1 },
        { payload: 'getReportByPlacement', type: 'LOADER_ADD' },
        { type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_FAILURE', payload: errorNetwork },
        { payload: 'getReportByPlacement', type: 'LOADER_REMOVE' },
      ]);
    });

    it('should dispatch the actions following a fetch backend failure', async () => {
      fetchMock.get(url, { body: { status: errorBackendData.status, error: errorBackendData.error } });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getReportByPlacement(1));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_REQUEST', payload: 1 },
        { payload: 'getReportByPlacement', type: 'LOADER_ADD' },
        { type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_FAILURE', payload: errorBackendData },
        { payload: 'getReportByPlacement', type: 'LOADER_REMOVE' },
      ]);
    });
  });
});
