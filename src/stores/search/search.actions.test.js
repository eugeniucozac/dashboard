import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState, publicConfig } from 'tests';

import { getSearchResults, getSearchRequest, getSearchSuccess, getSearchFailure } from './search.actions.get';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('STORES › ACTIONS › search', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('get', () => {
    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    const storeData = {
      user: {
        accessToken: 1,
        departmentIds: [1],
      },
      search: {
        term: '',
        queue: [],
        results: {},
        resultsTerm: '',
        isLoading: false,
      },
    };

    const errorNetwork = {
      json: {},
      response: {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        url: `${publicConfig.endpoint.edge}/api/search?name=foo&limit=8`,
      },
    };

    it('should create an action for search fetch started', () => {
      // assert
      expect(getSearchRequest()).toEqual({
        type: 'SEARCH_GET_REQUEST',
        payload: undefined,
      });

      expect(getSearchRequest('foo')).toEqual({
        type: 'SEARCH_GET_REQUEST',
        payload: 'foo',
      });
    });

    it('should create an action for search fetch success', () => {
      // assert
      expect(getSearchSuccess()).toEqual({
        type: 'SEARCH_GET_SUCCESS',
        payload: {
          results: undefined,
          term: undefined,
        },
      });

      expect(getSearchSuccess({ something: { foo: 1, bar: 2 } }, 'foo')).toEqual({
        type: 'SEARCH_GET_SUCCESS',
        payload: {
          results: undefined,
          term: 'foo',
        },
      });

      expect(getSearchSuccess({ results: { foo: 1, bar: 2 } }, 'foo')).toEqual({
        type: 'SEARCH_GET_SUCCESS',
        payload: {
          results: { foo: 1, bar: 2 },
          term: 'foo',
        },
      });
    });

    it('should create an action for search fetch failure', () => {
      // assert
      expect(getSearchFailure()).toEqual({
        type: 'SEARCH_GET_FAILURE',
        payload: {
          error: undefined,
          term: undefined,
        },
      });

      expect(getSearchFailure({ error: 1 }, 'foo')).toEqual({
        type: 'SEARCH_GET_FAILURE',
        payload: {
          error: { error: 1 },
          term: 'foo',
        },
      });
    });

    it('should dispatch the actions for success', async () => {
      // arrange
      fetchMock.get('glob:*/api/search*', { body: { results: { foo: 1, bar: 2 }, total: 100 } });
      const expectedActions = [
        { type: 'SEARCH_GET_REQUEST', payload: 'foo' },
        { type: 'SEARCH_GET_SUCCESS', payload: { results: { foo: 1, bar: 2 }, term: 'foo' } },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getSearchResults('foo'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for failure', async () => {
      // arrange
      fetchMock.get('glob:*/api/search*', { status: 404, body: {} });
      const expectedActions = [
        { type: 'SEARCH_GET_REQUEST', payload: 'foo' },
        { type: 'SEARCH_GET_FAILURE', payload: { error: errorNetwork, term: 'foo' } },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getSearchResults('foo'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });
});
