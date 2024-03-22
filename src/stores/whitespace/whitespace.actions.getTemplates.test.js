import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState } from 'tests';
import { getTemplates, getTemplatesRequest, getTemplatesFailure, getTemplatesSuccess } from './whitespace.actions.getTemplates';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    url: 'https://edgewhitespacedev1.azurewebsites.net/api/v1/templates',
  },
};

describe('STORES › ACTIONS › whitespace', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const storeData = {
    user: {
      accessToken: 1,
      departmentIds: [1, 2],
      departmentSelected: 1,
    },
    whitespace: {
      teampltes: {
        list: [],
        loading: false,
      },
    },
    ui: {
      notification: { queue: [] },
    },
  };

  describe('templates types GET', () => {
    const url = 'glob:*/api/v1/templates*';
    const templatesResponseData = ['apple', 'banana', 'orange'];

    it('should create an action for fetch started', () => {
      expect(getTemplatesRequest()).toEqual({
        type: 'TEMPLATES_GET_REQUEST',
      });
    });

    it('should create an action for fetch success', () => {
      expect(getTemplatesSuccess(templatesResponseData)).toEqual({
        type: 'TEMPLATES_GET_SUCCESS',
        payload: templatesResponseData,
      });
    });

    it('should create an action for fetch failure', () => {
      const errorObject = { status: 404 };
      const expectedAction = { type: 'TEMPLATES_GET_FAILURE', payload: errorObject };
      expect(getTemplatesFailure(errorObject)).toEqual(expectedAction);
    });

    it('should dispatch the actions following a fetch success', async () => {
      fetchMock.get(url, { body: templatesResponseData });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getTemplates());

      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'TEMPLATES_GET_REQUEST' },
        { type: 'TEMPLATES_GET_SUCCESS', payload: templatesResponseData },
      ]);
    });

    it('should dispatch the actions following a fetch network failure', async () => {
      fetchMock.get(url, { status: errorNetwork.response.status, body: {} });

      const store = mockStore(getInitialState(storeData));
      await store.dispatch(getTemplates());

      expect(fetchMock.calls()).toHaveLength(1);
    });
  });
});
