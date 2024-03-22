import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState } from 'tests';
import merge from 'lodash/merge';

import { getLocationSummary } from './portfolioMap.actions.get';
import {
  updatePortfolioMapLevel,
  resetPortfolioMapLocations,
  resetPortfolioMapLevel,
  resetPortfolioMapLevelOverride,
  updatePortfolioMapLevelOverride,
} from './portfolioMap.actions';

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

describe('STORES › ACTIONS › portfolioMap', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
    MockDate.set('2019');
  });

  afterEach(() => {
    MockDate.reset();
  });

  const storeData = {
    user: {
      accessToken: 1,
      departmentSelected: 333,
    },
    portfolioMap: {
      tiv: {
        placementIds: null,
        level: 'state',
        levels: {
          country: [],
          state: [],
          county: [],
          zip: [],
          address: [],
        },
        loading: false,
      },
    },
    ui: {
      notification: {
        queue: [],
      },
    },
  };

  describe('getLocationSummary', () => {
    it('should dispatch the correct actions following a location GET success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: [{ foo: 1 }] } });
      const expectedActions = [
        {
          type: 'PORTFOLIO_MAP_GET_REQUEST',
          payload: {
            level: undefined,
            levelOverride: undefined,
            placementIds: ['1', '2', '3'],
          },
        },
        {
          type: 'PORTFOLIO_MAP_GET_SUCCESS',
          payload: {
            placementIds: ['1', '2', '3'],
            level: 'state',
            data: [{ foo: 1 }],
          },
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getLocationSummary({ placementIds: ['1', '2', '3'] }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following a location GET failure', async () => {
      // arrange
      fetchMock.get('*', { status: 404, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'PORTFOLIO_MAP_GET_REQUEST',
          payload: { level: undefined, levelOverride: undefined, placementIds: ['1', '2', '3'] },
        },
        {
          type: 'PORTFOLIO_MAP_GET_FAILURE',
          payload: merge(errorNetwork, {
            response: { url: 'https://priceforbeslocationboot.azurewebsites.net/api/summary?level=state&placementIds=1,2,3' },
          }),
        },
      ];

      // act
      await store.dispatch(getLocationSummary({ placementIds: ['1', '2', '3'] }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('updatePortfolioMapLevel', () => {
    it('should dispatch the correct actions following a location update', async () => {
      // arrange
      const store = mockStore(getInitialState(storeData));
      await store.dispatch(updatePortfolioMapLevel({ level: 'country' }));
      const expectedActions = [
        {
          type: 'PORTFOLIO_MAP_UPDATE_LEVEL',
          payload: { level: 'country' },
        },
      ];

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('updatePortfolioMapLevelOverride', () => {
    it('should dispatch the correct actions following a location update', async () => {
      // arrange
      const store = mockStore(getInitialState(storeData));
      await store.dispatch(updatePortfolioMapLevelOverride({ levelOverride: 'country' }));
      const expectedActions = [
        {
          type: 'PORTFOLIO_MAP_UPDATE_LEVEL_OVERRIDE',
          payload: { levelOverride: 'country' },
        },
      ];

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('resetPortfolioMapLocations', () => {
    it('should dispatch the correct actions following a location reset', async () => {
      // arrange
      const store = mockStore(getInitialState(storeData));
      await store.dispatch(resetPortfolioMapLocations());
      const expectedActions = [
        {
          type: 'PORTFOLIO_MAP_RESET_LOCATIONS',
        },
      ];

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('resetPortfolioMapLevel', () => {
    it('should dispatch the correct actions following a level reset', async () => {
      // arrange
      const store = mockStore(getInitialState(storeData));
      await store.dispatch(resetPortfolioMapLevel());
      const expectedActions = [
        {
          type: 'PORTFOLIO_MAP_RESET_LEVEL',
        },
      ];

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('resetPortfolioMapLevelOverride', () => {
    it('should dispatch the correct actions following a levelOverride reset', async () => {
      // arrange
      const store = mockStore(getInitialState(storeData));
      await store.dispatch(resetPortfolioMapLevelOverride());
      const expectedActions = [
        {
          type: 'PORTFOLIO_MAP_RESET_LEVEL_OVERRIDE',
        },
      ];

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
