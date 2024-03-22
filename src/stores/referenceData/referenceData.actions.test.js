import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState, publicConfig } from 'tests';
import { getReferenceData } from './referenceData.actions.get';

let store;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('STORES › ACTIONS › referenceData', () => {
  const storeData = {
    user: {
      accessToken: 1,
      departmentIds: [1],
    },
  };

  beforeEach(() => {
    store = mockStore(getInitialState(storeData));
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('getReferenceData', () => {
    it('should dispatch the actions for success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: [1, 2, 3] } });
      const expectedActions = [{ type: 'REFERENCE_DATA_GET_REQUEST' }, { type: 'REFERENCE_DATA_GET_SUCCESS', payload: [1, 2, 3] }];

      // act
      await store.dispatch(getReferenceData());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for network failure', async () => {
      // arrange
      const errorNetwork = {
        json: {},
        response: {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          url: `${publicConfig.endpoint.edge}/api/referenceData`,
        },
      };
      const expectedActions = [{ type: 'REFERENCE_DATA_GET_REQUEST' }, { type: 'REFERENCE_DATA_GET_FAILURE', payload: errorNetwork }];
      fetchMock.get('*', { status: errorNetwork.response.status, body: {} });

      // act
      await store.dispatch(getReferenceData());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for backend failure', async () => {
      // arrange
      const errorData = {
        status: 500,
        message: 'API data format error (500)',
      };
      const expectedActions = [{ type: 'REFERENCE_DATA_GET_REQUEST' }, { type: 'REFERENCE_DATA_GET_FAILURE', payload: errorData }];
      fetchMock.get('*', { body: { status: errorData.status, message: errorData.message } });

      // act
      await store.dispatch(getReferenceData());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });
});
