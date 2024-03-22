import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState } from 'tests';
import merge from 'lodash/merge';

import { postCoverages, postCoverageRequest, postCoverageFailure, postCoverageSuccess } from '../risk.actions.postCoverages';

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

const notificationError = {
  key: 1640995200000,
  visible: true,
  data: undefined,
  type: 'error',
  message: 'notification.generic.request',
};

describe('STORES › ACTIONS › risk', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  beforeEach(() => {
    MockDate.set('2022');
  });

  afterEach(() => {
    MockDate.reset();
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

  describe(' Coverage POST', () => {
    const url = 'glob:*/api/v1/risks/*/coverages';
    const riskId = 1;
    const formData = { field1: 'value1', field2: 'value2' };
    const riskType = 'riskType';
    const responseData = { field1: 'value1', field2: 'value2' };

    const notificationSuccess = {
      delay: undefined,
      key: 1640995200000,
      visible: true,
      data: undefined,
      type: 'success',
      message: 'notification.coverage.postSuccess',
    };

    it('should create an action for post started', () => {
      expect(postCoverageRequest(formData)).toEqual({ type: 'RISK_COVERAGE_POST_REQUEST', payload: formData });
    });

    it('should create an action for post success', () => {
      expect(postCoverageSuccess(responseData)).toEqual({ type: 'RISK_COVERAGE_POST_SUCCESS', payload: responseData });
    });

    it('should create an action for post failure', () => {
      expect(postCoverageFailure({ status: 404 })).toEqual({ type: 'RISK_COVERAGE_POST_FAILURE', payload: { status: 404 } });
    });

    it('should dispatch the actions following a post success', async () => {
      const response = { ...responseData, riskId: 100 };
      fetchMock.post(url, { body: response });
      const postData = { riskId, riskType, data: formData, definitions: [] };

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postCoverages(postData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_COVERAGE_POST_REQUEST', payload: formData },
        { type: 'RISK_COVERAGE_POST_SUCCESS', payload: response },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
      ]);
    });

    it('should dispatch the actions following a post network failure', async () => {
      fetchMock.post(url, { status: errorNetwork.response.status, body: {} });
      const postData = { riskId, riskType, data: formData, definitions: [] };

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(postCoverages(postData));

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'RISK_COVERAGE_POST_REQUEST', payload: formData },
        {
          type: 'RISK_COVERAGE_POST_FAILURE',
          payload: merge(errorNetwork, { response: { url: 'https://edge-auth-service.azurewebsites.net/api/v1/risks/1/coverages' } }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
      ]);
    });
  });
});
