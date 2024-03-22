import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState } from 'tests';

import { updateTopics } from './articles.actions';
import { getArticles } from './articles.actions.get';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('STORES › ACTIONS › articles', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const mockTopics = [{ foo: 1 }];

  describe('actions', () => {
    it('should dispatch the actions for updateTopicsSuccess', async () => {
      // arrange
      const expectedActions = [{ type: 'ARTICLES_UPDATE_TOPICS_SUCCESS', payload: mockTopics }];
      const store = mockStore();

      // act
      await store.dispatch(updateTopics(mockTopics));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
    it('should dispatch the actions for updateTopicsSuccess, and initialLoadSuccess', async () => {
      // arrange
      const expectedActions = [{ type: 'ARTICLES_UPDATE_TOPICS_SUCCESS', payload: mockTopics }, { type: 'ARTICLES_INITIAL_LOAD_SUCCESS' }];
      const store = mockStore();

      // act
      await store.dispatch(updateTopics(mockTopics, true));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
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
      ui: {
        notification: { queue: [] },
      },
      articles: {
        list: {
          items: [],
          topics: [],
          page: 0,
          pageSize: 25,
          itemsTotal: 100,
        },
        initialLoad: false,
        isLoading: false,
      },
    };

    const errorNetwork = {
      json: {},
      response: {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        url: 'https://widget.slipcase.com/api/v1/feed/?apiKey=5c0192578add277855ed33deb28d2c27b8e074b5&output=json&includePaywalled=1&limit=25&offset=0',
      },
    };

    it('should dispatch the actions for success', async () => {
      // arrange
      fetchMock.get('*', { body: [{ foo: 2 }] });
      const expectedActions = [
        { type: 'ARTICLES_GET_REQUEST' },
        { type: 'ARTICLES_GET_SUCCESS', payload: { items: [{ foo: 2 }], page: 0, pageSize: 25 } },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getArticles());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for failure', async () => {
      // arrange
      fetchMock.get('*', { status: errorNetwork.response.status, body: {} });
      const expectedActions = [{ type: 'ARTICLES_GET_REQUEST' }, { type: 'ARTICLES_GET_FAILURE', payload: errorNetwork }];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getArticles());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });
});
