import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState } from 'tests';

import { patchPolicyPostWhitespace } from './bundled.actions.patchPolicyPostWhitespace';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('STORES › ACTIONS › bundled', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('patchPolicyPostWhitespace', () => {
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
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };

    const patchPolicySuccessActions = [
      {
        type: 'PLACEMENT_EDIT_POLICY_PATCH_REQUEST',
        payload: {
          body: { umrId: 'UMR1' },
          policyId: 1,
        },
      },
      {
        payload: 'placementPatchPolicy',
        type: 'LOADER_ADD',
      },
      {
        payload: { foo: 1 },
        type: 'PLACEMENT_POLICY_PATCH_SUCCESS',
      },
      {
        payload: {
          data: undefined,
          key: 1546300800000,
          message: 'notification.patchPolicy.success',
          type: 'success',
          visible: true,
        },
        type: 'NOTIFICATION_ADD',
      },
      { type: 'MODAL_HIDE' },
      {
        payload: 'placementPatchPolicy',
        type: 'LOADER_REMOVE',
      },
    ];

    const createWhitespacePolicySuccessActions = [
      {
        type: 'CREATE_WHITESPACE_POST_REQUEST',
        payload: {
          fromPeriod: 'mockFrom',
          toPeriod: 'mockTo',
          umrId: 'UMR1',
        },
      },
      {
        type: 'LOADER_ADD',
        payload: 'createWhitespacePolicy',
      },
      {
        type: 'CREATE_WHITESPACE_POST_SUCCESS',
      },
      {
        type: 'NOTIFICATION_ADD',
        payload: {
          data: undefined,
          key: 1546300800000,
          message: 'notification.createWhitespacePolicy.success',
          type: 'success',
          visible: true,
        },
      },
      {
        type: 'MODAL_HIDE',
      },
      {
        type: 'LOADER_REMOVE',
        payload: 'createWhitespacePolicy',
      },
    ];

    const patchPolicyFailureActions = [
      {
        type: 'PLACEMENT_EDIT_POLICY_PATCH_REQUEST',
        payload: {
          body: { umrId: 'UMR1' },
          policyId: 1,
        },
      },
      {
        payload: 'placementPatchPolicy',
        type: 'LOADER_ADD',
      },
      {
        payload: {
          data: {},
          status: 404,
          message: 'API data format error (404)',
        },
        type: 'PLACEMENT_EDIT_POLICY_PATCH_FAILURE',
      },
      {
        payload: {
          data: undefined,
          key: 1546300800000,
          message: 'notification.patchPolicy.fail',
          type: 'error',
          visible: true,
        },
        type: 'NOTIFICATION_ADD',
      },
      {
        type: 'MODAL_HIDE',
      },
      {
        payload: 'placementPatchPolicy',
        type: 'LOADER_REMOVE',
      },
    ];

    it('should dispatch the actions for success', async () => {
      // arrange
      const policy = { id: 1 };
      const body = { umrId: 'UMR1', fromPeriod: 'mockFrom', toPeriod: 'mockTo' };
      fetchMock.patch('*', { body: { status: 'success', data: { foo: 1 } } });
      fetchMock.post('*', { body: { status: 'success', data: { foo: 2 } } });
      const expectedActions = [
        {
          type: 'PATCH_POLICY_POST_WHITESPACE_REQUEST',
          payload: { policy, body },
        },
        ...patchPolicySuccessActions,
        ...createWhitespacePolicySuccessActions,
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(patchPolicyPostWhitespace(policy, body));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(2);
    });

    it('should dispatch the actions for patchPolicy failure', async () => {
      // arrange
      const policy = { id: 1 };
      const body = { umrId: 'UMR1', fromPeriod: 'mockFrom', toPeriod: 'mockTo' };
      fetchMock.patch('*', { body: { status: errorNetwork.status, data: {} } });
      const expectedActions = [
        {
          type: 'PATCH_POLICY_POST_WHITESPACE_REQUEST',
          payload: { policy, body },
        },
        ...patchPolicyFailureActions,
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(patchPolicyPostWhitespace(policy, body));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });
});
