import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  getMarketParentList,
  getMarketParentListRequest,
  getMarketParentListSuccess,
  getMarketParentListFailure,
} from './marketParent.actions.getList';
import { addEditMarkets } from './marketParent.actions.addEditMarkets';
import { getInitialState, publicConfig } from 'tests';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const storeState = {
  user: {
    accessToken: 1,
    departmentSelected: 333,
  },
  referenceData: { departments: [{ id: 333, users: [{ id: 11 }, { id: 22 }] }] },
  ui: {
    notification: {
      queue: [],
    },
  },
};

const notificationSuccess = {
  key: 1546300800000,
  visible: true,
  type: 'success',
};

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    url: `${publicConfig.endpoint.edge}/api/marketParent`,
  },
};

describe('STORES › ACTIONS › marketParent', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
    MockDate.set('2019');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should create an action for placement fetch started', () => {
    // arrange
    const expectedAction = { type: 'MARKET_PARENT_LIST_GET_REQUEST' };

    // assert
    expect(getMarketParentListRequest()).toEqual(expectedAction);
  });

  it('should create an action for placement fetch success', () => {
    // arrange
    const expectedAction = {
      type: 'MARKET_PARENT_LIST_GET_SUCCESS',
      payload: [{ id: 1 }],
    };

    // assert
    expect(getMarketParentListSuccess([{ id: 1 }])).toEqual(expectedAction);
  });

  it('should create an action for placement fetch failure', () => {
    // arrange
    const expectedAction = { type: 'MARKET_PARENT_LIST_GET_FAILURE' };

    // assert
    expect(getMarketParentListFailure()).toEqual(expectedAction);
  });

  it('should dispatch the actions for fetch success', async () => {
    // arrange
    fetchMock.get('*', { body: { status: 'success', data: [{ foo: 1 }] } });
    const expectedActions = [
      { type: 'MARKET_PARENT_LIST_GET_REQUEST' },
      { type: 'LOADER_ADD', payload: 'getMarketParentList' },
      { type: 'MARKET_PARENT_LIST_GET_SUCCESS', payload: [{ foo: 1 }] },
      { type: 'LOADER_REMOVE', payload: 'getMarketParentList' },
    ];
    const store = mockStore(getInitialState(storeState));

    // act
    await store.dispatch(getMarketParentList(1));

    // assert
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch the actions for fetch failure', async () => {
    // arrange
    fetchMock.get('*', { status: 404, body: {} });
    const expectedActions = [
      { type: 'MARKET_PARENT_LIST_GET_REQUEST' },
      { type: 'LOADER_ADD', payload: 'getMarketParentList' },
      { type: 'MARKET_PARENT_LIST_GET_FAILURE', payload: errorNetwork },
      { type: 'LOADER_REMOVE', payload: 'getMarketParentList' },
    ];
    const store = mockStore(getInitialState(storeState));

    // act
    await store.dispatch(getMarketParentList(1));

    // assert
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch the actions for put success', async () => {
    // arrange
    fetchMock.put('*', { body: { status: 'success', data: { id: 1, markets: [{ id: 2 }] } } });
    const expectedActions = [
      { type: 'MARKET_PARENT_EDIT_MARKETS_REQUEST', payload: { id: 1, markets: [{ id: 2 }] } },
      { type: 'LOADER_ADD', payload: 'addEditMarkets' },
      { type: 'MARKET_PARENT_EDIT_MARKETS_SUCCESS', payload: { id: 1, markets: [{ id: 2 }] } },
      { type: 'NOTIFICATION_ADD', payload: { ...notificationSuccess, data: undefined, message: 'notification.marketParent.putSuccess' } },
      { type: 'LOADER_REMOVE', payload: 'addEditMarkets' },
      { type: 'MODAL_HIDE', payload: undefined },
    ];
    const store = mockStore(getInitialState(storeState));

    // act
    await store.dispatch(addEditMarkets({ id: 1, markets: [{ id: 2 }] }));

    // assert
    expect(store.getActions()).toEqual(expectedActions);
  });
});
