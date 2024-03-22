import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getPolicy, getPolicyRequest, getPolicySuccess, getPolicyFailure } from './policy.actions.get';
import {
  getPolicyPlacement,
  getPolicyPlacementRequest,
  getPolicyPlacementSuccess,
  getPolicyPlacementFailure,
} from './policy.actions.getPlacement';
import { resetPolicy, resetPolicyPlacement } from './policy.actions';
import { getInitialState } from 'tests';
import fetchMock from 'fetch-mock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let storeData = {
  policy: {
    selected: null,
    placement: null,
    loading: {
      selected: false,
      placement: false,
    },
  },
};

describe('STORES › ACTIONS › policy', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('get', () => {
    it('should create an action for policy fetch request', () => {
      // assert
      expect(getPolicyRequest(1)).toEqual({ type: 'POLICY_GET_REQUEST', payload: { umrIds: 1, savePolicy: undefined } });
    });

    it('should create an action for policy fetch success', () => {
      // assert
      expect(getPolicySuccess({ id: 1 })).toEqual({ type: 'POLICY_GET_SUCCESS', payload: { id: 1 } });
    });

    it('should create an action for policy fetch failure', () => {
      // assert
      expect(getPolicyFailure({ error: 500 })).toEqual({ type: 'POLICY_GET_FAILURE', payload: { error: 500 } });
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.get('glob:*/api/policy/xb/*', { body: { status: 'success', data: { id: 1 } } });
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPolicy('1'));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'POLICY_GET_REQUEST', payload: { umrIds: '1', savePolicy: true } },
        { type: 'LOADER_ADD', payload: 'getPolicy' },
        { type: 'POLICY_GET_SUCCESS', payload: { id: 1 } },
        { type: 'LOADER_REMOVE', payload: 'getPolicy' },
      ]);
    });

    it('should dispatch the actions for fetch success - with "savePolicy" set to false', async () => {
      // arrange
      fetchMock.get('glob:*/api/policy/xb/*', { body: { status: 'success', data: { id: 1 } } });
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPolicy('1,2,3', false));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'POLICY_GET_REQUEST', payload: { umrIds: '1,2,3', savePolicy: false } },
        { type: 'LOADER_ADD', payload: 'getPolicy' },
        { type: 'POLICY_GET_SUCCESS', payload: null },
        { type: 'LOADER_REMOVE', payload: 'getPolicy' },
      ]);
    });

    it('should dispatch the actions for fetch failure - missing ID', async () => {
      // arrange
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPolicy());

      // assert
      expect(fetchMock.calls()).toHaveLength(0);
      expect(store.getActions()).toEqual([
        { type: 'POLICY_GET_REQUEST', payload: { umrIds: undefined, savePolicy: true } },
        { type: 'LOADER_ADD', payload: 'getPolicy' },
        {
          type: 'POLICY_GET_FAILURE',
          payload: {
            file: 'stores/policy.actions.get',
            message: 'Missing policy ID',
          },
        },
        { type: 'LOADER_REMOVE', payload: 'getPolicy' },
      ]);
    });

    it('should dispatch the actions for fetch failure - api error', async () => {
      // arrange
      fetchMock.get('glob:*/api/policy/xb/*', { body: { status: 'error', data: { msg: 'error 500' } } });
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPolicy('2'));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'POLICY_GET_REQUEST', payload: { umrIds: '2', savePolicy: true } },
        { type: 'LOADER_ADD', payload: 'getPolicy' },
        {
          type: 'POLICY_GET_FAILURE',
          payload: {
            status: 'error',
            message: 'API data format error (error)',
            data: { msg: 'error 500' },
          },
        },
        { type: 'LOADER_REMOVE', payload: 'getPolicy' },
      ]);
    });
  });

  describe('get placement', () => {
    it('should create an action for policy fetch request', () => {
      // assert
      expect(getPolicyPlacementRequest(1)).toEqual({ type: 'POLICY_PLACEMENT_GET_REQUEST', payload: 1 });
    });

    it('should create an action for policy fetch success', () => {
      // assert
      expect(getPolicyPlacementSuccess({ id: 1 })).toEqual({ type: 'POLICY_PLACEMENT_GET_SUCCESS', payload: { id: 1 } });
    });

    it('should create an action for policy fetch failure', () => {
      // assert
      expect(getPolicyPlacementFailure({ error: 500 })).toEqual({ type: 'POLICY_PLACEMENT_GET_FAILURE', payload: { error: 500 } });
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.get('glob:*/api/placement/*', { body: { status: 'success', data: { id: 1 } } });
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPolicyPlacement(1));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'POLICY_PLACEMENT_GET_REQUEST', payload: 1 },
        { type: 'POLICY_PLACEMENT_GET_SUCCESS', payload: { id: 1 } },
      ]);
    });

    it('should dispatch the actions for fetch failure - missing ID', async () => {
      // arrange
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPolicyPlacement());

      // assert
      expect(fetchMock.calls()).toHaveLength(0);
      expect(store.getActions()).toEqual([
        { type: 'POLICY_PLACEMENT_GET_REQUEST', payload: undefined },
        {
          type: 'POLICY_PLACEMENT_GET_FAILURE',
          payload: {
            file: 'stores/policy.actions.getPlacement',
            message: 'Missing placement ID',
          },
        },
      ]);
    });

    it('should dispatch the actions for fetch failure - api error', async () => {
      // arrange
      fetchMock.get('glob:*/api/placement/*', { body: { status: 'error', data: { msg: 'error 500' } } });
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPolicyPlacement(1));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'POLICY_PLACEMENT_GET_REQUEST', payload: 1 },
        {
          type: 'POLICY_PLACEMENT_GET_FAILURE',
          payload: {
            status: 'error',
            message: 'API data format error (error)',
            data: { msg: 'error 500' },
          },
        },
      ]);
    });
  });

  describe('others', () => {
    it('should create an action for policy reset', () => {
      // assert
      expect(resetPolicy()).toEqual({ type: 'POLICY_RESET' });
    });

    it('should create an action for policy reset', () => {
      // assert
      expect(resetPolicyPlacement()).toEqual({ type: 'POLICY_PLACEMENT_RESET' });
    });
  });
});
