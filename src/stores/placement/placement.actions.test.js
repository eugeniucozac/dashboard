import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState, publicConfig } from 'tests';
import merge from 'lodash/merge';

import { patchPolicy, patchPolicyRequest, patchPolicyFailure, patchPolicySuccess } from './placement.actions.patchPolicy';
import {
  getPlacementDetails,
  getPlacementDetailsRequest,
  getPlacementDetailsFailure,
  getPlacementDetailsSuccess,
} from './placement.actions.getDetails';
import { getPlacementList, getPlacementListRequest, getPlacementListFailure, getPlacementListSuccess } from './placement.actions.getList';
import { postPlacementAddPolicyMarket } from './placement.actions.addPolicyMarket';
import {
  editPlacementConfig,
  editPlacementConfigRequest,
  editPlacementConfigSuccess,
  editPlacementConfigFailure,
} from './placement.actions.editConfig';
import { removePlacement } from './placement.actions.removePlacement';
import { postNewEnquiry, postNewEnquiryRequest, postNewEnquirySuccess, postNewEnquiryFailure } from './placement.actions.newEnquiry';
import {
  postPlacementEditQuote,
  postPlacementEditQuoteRequest,
  postPlacementEditQuoteSuccess,
  postPlacementEditQuoteFailure,
} from './placement.actions.editQuote';
import {
  postPlacementAddLayer,
  postPlacementAddLayerRequest,
  postPlacementAddLayerSuccess,
  postPlacementAddLayerFailure,
} from './placement.actions.addPlacementLayer';
import {
  bulkToggleSelect,
  disableBulkToggleSelect,
  bulkPlacementLayerToggle,
  bulkPlacementMarketToggle,
} from './placement.actions.bulkUpdate.js';

import {
  bulkToggleSelectMarketingMarket,
  disableBulkToggleSelectMarketingMarket,
  bulkPlacementMarketingMarketSelect,
} from './placement.actions.bulkdeletePlacementMarket.js';

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

const errorData = {
  status: 500,
  message: 'API data format error (500)',
};

const notificationSuccess = {
  key: 1546300800000,
  visible: true,
  type: 'success',
  message: 'notification.submission.success',
};

const notificationFailure = {
  key: 1546300800000,
  visible: true,
  type: 'error',
  message: 'notification.submission.fail',
};

const payloadError = {
  file: 'stores/placement.actions.addPolicyMarket',
  message: 'Data missing for POST request',
};

describe('STORES › ACTIONS › placement', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const storeData = {
    user: {
      accessToken: 1,
      departmentIds: [1, 2],
      departmentSelected: 1,
    },
    market: {
      selected: {
        id: 123,
      },
    },
    placement: {
      list: {},
      sort: {},
      selected: {
        id: 1,
        departmentId: 20,
        policies: [
          {
            id: 2,
            markets: [{ id: 123 }],
          },
        ],
      },
    },
    ui: {
      notification: { queue: [] },
    },
  };

  const responseData = {
    content: [{ id: 1 }],
    pagination: {},
  };

  describe('details', () => {
    it('should create an action for placement fetch started', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_DETAILS_GET_REQUEST' };

      // assert
      expect(getPlacementDetailsRequest()).toEqual(expectedAction);
    });

    it('should create an action for placement fetch success', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_DETAILS_GET_SUCCESS' };

      // assert
      expect(getPlacementDetailsSuccess()).toEqual(expectedAction);
    });

    it('should create an action for placement bulk select layers', () => {
      // arrange
      const marketList = [
        { id: 69, placementlayerId: 41 },
        { id: 80, placementlayerId: 41 },
      ];
      const expectedAction = {
        type: 'PLACEMENT_BULK_TOGGLE_LAYER',
        payload: { selected: 'yes', layerId: 41, marketIdList: [69, 80] },
      };

      // assert
      expect(bulkPlacementLayerToggle('yes', 41, marketList)).toEqual(expectedAction);
    });
    it('should create an action for placement bulk select markets', () => {
      // arrange

      const expectedAction = { type: 'PLACEMENT_BULK_TOGGLE_MARKET', payload: { layerId: 41, marketId: 80 } };

      // assert
      expect(bulkPlacementMarketToggle(41, 80)).toEqual(expectedAction);
    });

    it('should create an action for placement bulk select toggle', () => {
      // arrange
      const expectedAction = { type: 'BULK_SELECT_TOGGLE' };

      // assert
      expect(bulkToggleSelect()).toEqual(expectedAction);
    });

    it('should create an action for placement bulk select markets', () => {
      // arrange

      const expectedAction = { type: 'PLACEMENT_BULK_TOGGLE_MARKET', payload: { layerId: 41, marketId: 80 } };

      // assert
      expect(bulkPlacementMarketToggle(41, 80)).toEqual(expectedAction);
    });
    it('should create an action for disabling bulk placement select toggle', () => {
      // arrange
      const expectedAction = { type: 'BULK_SELECT_TOGGLE_DISABLE' };
      // assert
      expect(disableBulkToggleSelect()).toEqual(expectedAction);
    });

    it('should create an action for placement bulk select toggle for marketing markets', () => {
      // arrange
      const expectedAction = { type: 'BULK_SELECT_TOGGLE_MARKETING_MARKETS' };
      // assert
      expect(bulkToggleSelectMarketingMarket()).toEqual(expectedAction);
    });

    it('should create an action for disabling bulk placement marketing market toggle', () => {
      // arrange
      const expectedAction = { type: 'BULK_SELECT_TOGGLE_DISABLE_MARKETING_MARKETS' };
      // assert
      expect(disableBulkToggleSelectMarketingMarket()).toEqual(expectedAction);
    });

    it('should create an action for placement bulk select marketing markets', () => {
      // arrange

      const expectedAction = { type: 'PLACEMENT_BULK_TOGGLE_MARKETING_MARKETS', payload: { selected: 'YES', marketIdList: 80 } };

      // assert
      expect(bulkPlacementMarketingMarketSelect('YES', 80)).toEqual(expectedAction);
    });

    it('should create an action for placement fetch failure', () => {
      // arrange
      const errorObject = { status: 404 };
      const expectedAction = { type: 'PLACEMENT_DETAILS_GET_FAILURE', payload: errorObject };

      // assert
      expect(getPlacementDetailsFailure(errorObject)).toEqual(expectedAction);
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: { foo: 1 } } });
      const expectedActions = [
        { type: 'PLACEMENT_DETAILS_GET_REQUEST', payload: 1 },
        { type: 'PLACEMENT_LOCATIONS_RESET' },
        { type: 'PLACEMENT_DETAILS_GET_SUCCESS', payload: { foo: 1 } },
        { type: 'LOCATION_GET_PLACEMENT_GROUPS', payload: 1 },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPlacementDetails(1, false, true));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(2);
    });

    it('should dispatch the actions for fetch network failure', async () => {
      // arrange
      fetchMock.get('*', { status: 404, body: {} });
      const expectedActions = [
        { type: 'PLACEMENT_DETAILS_GET_REQUEST', payload: 1 },
        { type: 'PLACEMENT_LOCATIONS_RESET' },
        {
          type: 'PLACEMENT_DETAILS_GET_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/placement/1` } }),
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPlacementDetails(1));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for fetch backend failure', async () => {
      // arrange
      fetchMock.get('*', { body: { status: errorData.status, message: errorData.message } });
      const expectedActions = [
        { type: 'PLACEMENT_DETAILS_GET_REQUEST', payload: 1 },
        { type: 'PLACEMENT_LOCATIONS_RESET' },
        { type: 'PLACEMENT_DETAILS_GET_FAILURE', payload: errorData },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPlacementDetails(1));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('list', () => {
    it('should create an action for placement fetch started', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_LIST_GET_REQUEST' };

      // assert
      expect(getPlacementListRequest()).toEqual(expectedAction);
    });

    it('should create an action for placement list fetch success', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_LIST_GET_SUCCESS', payload: { items: [{ id: 1 }], pagination: {} } };

      // assert
      expect(getPlacementListSuccess(responseData)).toEqual(expectedAction);
    });

    it('should create an action for placement list fetch failure', () => {
      // arrange
      const errorObject = { status: 404 };
      const expectedAction = { type: 'PLACEMENT_LIST_GET_FAILURE', payload: errorObject };

      // assert
      expect(getPlacementListFailure(errorObject)).toEqual(expectedAction);
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.get('glob:*/api/placement/department*', { body: { status: 'success', data: responseData } });
      fetchMock.get('glob:*/api/placement/1*', { body: { status: 'success', data: { id: 1 } } });
      fetchMock.get('glob:*/api/locations/*', { body: { status: 'success', data: [] } });
      // for some reason, the actions inside getPlacementDetails are not captured
      const expectedActions = [
        {
          type: 'PLACEMENT_LIST_GET_REQUEST',
          payload: {
            page: 1,
            size: undefined,
            orderBy: undefined,
            direction: '',
          },
        },
        { type: 'LOADER_ADD', payload: 'getPlacementList' },
        { type: 'PLACEMENT_LIST_GET_SUCCESS', payload: { items: [{ id: 1 }], pagination: {} } },
        { type: 'PLACEMENT_DETAILS_GET_REQUEST', payload: 1 },
        { type: 'PLACEMENT_LOCATIONS_RESET' },
        { type: 'LOADER_REMOVE', payload: 'getPlacementList' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPlacementList());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(2); // the 2nd call is the getPlacementDetails fetch
    });

    it('should dispatch the actions for fetch network failure', async () => {
      // arrange
      fetchMock.get('*', { status: 404, body: {} });
      const expectedActions = [
        {
          type: 'PLACEMENT_LIST_GET_REQUEST',
          payload: {
            page: 1,
            size: undefined,
            orderBy: undefined,
            direction: '',
          },
        },
        { type: 'LOADER_ADD', payload: 'getPlacementList' },
        {
          type: 'PLACEMENT_LIST_GET_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/placement/department/1?page=1&size=undefined&orderBy=undefined&direction=`,
            },
          }),
        },
        { type: 'LOADER_REMOVE', payload: 'getPlacementList' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPlacementList());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for fetch backend failure', async () => {
      // arrange
      fetchMock.get('*', { body: { status: errorData.status, message: errorData.message } });
      const expectedActions = [
        {
          type: 'PLACEMENT_LIST_GET_REQUEST',
          payload: {
            page: 1,
            size: undefined,
            orderBy: undefined,
            direction: '',
          },
        },
        { type: 'LOADER_ADD', payload: 'getPlacementList' },
        { type: 'PLACEMENT_LIST_GET_FAILURE', payload: errorData },
        { type: 'LOADER_REMOVE', payload: 'getPlacementList' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getPlacementList());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('postNewEnquiry', () => {
    const postPayload = {
      departments: 'dept',
      businessTypes: 'business type',
      clients: ['client'],
      insureds: ['insured1', 'insured2'],
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should create an action for placement fetch started', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_NEW_ENQUIRY_POST_REQUEST' };

      // assert
      expect(postNewEnquiryRequest()).toEqual(expectedAction);
    });

    it('should create an action for placement fetch success', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_NEW_ENQUIRY_POST_SUCCESS' };

      // assert
      expect(postNewEnquirySuccess()).toEqual(expectedAction);
    });

    it('should create an action for placement fetch failure', () => {
      // arrange
      const errorObject = { status: 404 };
      const expectedAction = { type: 'PLACEMENT_NEW_ENQUIRY_POST_FAILURE', payload: errorObject };

      // assert
      expect(postNewEnquiryFailure(errorObject)).toEqual(expectedAction);
    });

    it('should dispatch the actions for success', async () => {
      // arrange
      const spy = jest.fn();
      fetchMock.post('*', { body: { status: 'success', data: { id: 1, 2: 'b' } } });
      const expectedActions = [
        { type: 'PLACEMENT_NEW_ENQUIRY_POST_REQUEST', payload: postPayload },
        { type: 'LOADER_ADD', payload: 'postNewEnquiry' },
        { type: 'PLACEMENT_NEW_ENQUIRY_POST_SUCCESS', payload: [{ id: 1, 2: 'b' }] },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postNewEnquiry' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postNewEnquiry({ formData: postPayload, addDocuments: false, redirectionCallback: spy }));

      // assert
      expect(spy).toHaveBeenCalledWith(1);
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for success (adding documents)', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: { 1: 'a', 2: 'b' } } });
      const expectedActions = [
        { type: 'PLACEMENT_NEW_ENQUIRY_POST_REQUEST', payload: postPayload },
        { type: 'LOADER_ADD', payload: 'postNewEnquiry' },
        { type: 'PLACEMENT_NEW_ENQUIRY_POST_SUCCESS', payload: [{ 1: 'a', 2: 'b' }] },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
        { type: 'LOADER_REMOVE', payload: 'postNewEnquiry' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postNewEnquiry({ formData: postPayload, addDocuments: true }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for network failure', async () => {
      // arrange
      fetchMock.post('*', { status: 404, body: {} });
      const expectedActions = [
        { type: 'PLACEMENT_NEW_ENQUIRY_POST_REQUEST', payload: postPayload },
        { type: 'LOADER_ADD', payload: 'postNewEnquiry' },
        {
          type: 'PLACEMENT_NEW_ENQUIRY_POST_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/placement` } }),
        },
        { type: 'NOTIFICATION_ADD', payload: notificationFailure },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postNewEnquiry' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postNewEnquiry({ formData: postPayload }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for backend failure', async () => {
      // arrange
      fetchMock.post('*', { status: errorData.status, message: errorData.message });
      const expectedActions = [
        { type: 'PLACEMENT_NEW_ENQUIRY_POST_REQUEST', payload: postPayload },
        { type: 'LOADER_ADD', payload: 'postNewEnquiry' },
        { type: 'PLACEMENT_NEW_ENQUIRY_POST_FAILURE', payload: errorData },
        { type: 'NOTIFICATION_ADD', payload: notificationFailure },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postNewEnquiry' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postNewEnquiry({ formData: postPayload }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('postPlacementAddPolicyMarket', () => {
    const postPayloadMarket = {
      policy: 1,
      market: [{ id: 2 }],
      underwriter: [{ __isNew__: true, value: 'foo' }],
    };

    const postPayloadNonPFMarket = {
      policy: 1,
      nonPFMarket: [{ capacityTypeId: 3, name: 'bar' }],
      underwriter: [{ value: 'baz' }],
    };

    const postPayloadNeither = {
      policy: 1,
      underwriter: [],
    };

    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should dispatch the actions for postPayloadMarket success', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: { 1: 'a' } } });
      const expectedActions = [
        { type: 'PLACEMENT_ADD_POLICY_MARKET_POST_REQUEST', payload: postPayloadMarket },
        { type: 'LOADER_ADD', payload: 'postPlacementAddPolicyMarket' },
        { type: 'PLACEMENT_POLICY_MARKET_ADD_POST_SUCCESS', payload: { 1: 'a' } },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationSuccess, message: 'notification.addMarket.success' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementAddPolicyMarket' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementAddPolicyMarket(postPayloadMarket));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for postPayloadNonPFMarket success', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: { 1: 'a' } } });
      const expectedActions = [
        { type: 'PLACEMENT_ADD_POLICY_MARKET_POST_REQUEST', payload: postPayloadNonPFMarket },
        { type: 'LOADER_ADD', payload: 'postPlacementAddPolicyMarket' },
        { type: 'PLACEMENT_POLICY_MARKET_ADD_POST_SUCCESS', payload: { 1: 'a' } },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationSuccess, message: 'notification.addMarket.success' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementAddPolicyMarket' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementAddPolicyMarket(postPayloadNonPFMarket));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for postPayloadNeither failure', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: {} } });
      const expectedActions = [
        { type: 'PLACEMENT_ADD_POLICY_MARKET_POST_REQUEST', payload: postPayloadNeither },
        { type: 'LOADER_ADD', payload: 'postPlacementAddPolicyMarket' },
        { type: 'PLACEMENT_ADD_POLICY_MARKET_POST_FAILURE', payload: payloadError },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.addMarket.fail' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementAddPolicyMarket' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementAddPolicyMarket(postPayloadNeither));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(0);
    });

    it('should dispatch the actions for failure', async () => {
      // arrange
      fetchMock.post('*', { status: errorData.status, message: errorData.message });
      const expectedActions = [
        { type: 'PLACEMENT_ADD_POLICY_MARKET_POST_REQUEST', payload: postPayloadMarket },
        { type: 'LOADER_ADD', payload: 'postPlacementAddPolicyMarket' },
        { type: 'PLACEMENT_ADD_POLICY_MARKET_POST_FAILURE', payload: errorData },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.addMarket.fail' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementAddPolicyMarket' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementAddPolicyMarket(postPayloadMarket));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('removePlacement', () => {
    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should dispatch the actions for success', async () => {
      // arrange
      fetchMock.patch('*', { body: { status: 'success', data: { id: '1', isHidden: true } } });
      const expectedActions = [
        { type: 'PLACEMENT_REMOVE_PATCH_REQUEST', payload: { id: '1' } },
        { type: 'LOADER_ADD', payload: 'removePlacement' },
        { type: 'PLACEMENT_REMOVE_PATCH_SUCCESS', payload: { id: '1', isHidden: true } },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationSuccess, message: 'notification.removePlacement.success' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'removePlacement' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(removePlacement({ id: '1' }));

      // assert
      const mockCalls = fetchMock.calls();
      const [, payload] = mockCalls[0];
      expect(store.getActions()).toEqual(expectedActions);
      expect(mockCalls).toHaveLength(1);
      expect(payload.body).toEqual(JSON.stringify({ isHidden: true }));
    });

    it('should dispatch the actions for failure', async () => {
      // arrange
      fetchMock.patch('*', { status: 404, body: {} });
      const expectedActions = [
        { type: 'PLACEMENT_REMOVE_PATCH_REQUEST', payload: { id: '1' } },
        { type: 'LOADER_ADD', payload: 'removePlacement' },
        {
          type: 'PLACEMENT_REMOVE_PATCH_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/placement/1` } }),
        },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.removePlacement.fail' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'removePlacement' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(removePlacement({ id: '1' }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('editConfig', () => {
    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    const configObj = {
      mudmap: {
        100: [
          { id: 1, order: 1, capacityId: 10 },
          { id: 2, order: 2, capacityId: 20 },
        ],
      },
    };

    const configStr = '{"mudmap":{"100":[{"id":1,"order":1,"capacityId":10},{"id":2,"order":2,"capacityId":20}]}}';

    it('should create an action for placement fetch started', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_EDIT_CONFIG_REQUEST', payload: { mudmap: {} } };

      // assert
      expect(editPlacementConfigRequest({ mudmap: {} })).toEqual(expectedAction);
    });

    it('should create an action for placement fetch success', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_EDIT_CONFIG_SUCCESS', payload: 'foo' };

      // assert
      expect(editPlacementConfigSuccess('foo')).toEqual(expectedAction);
    });

    it('should create an action for placement fetch failure', () => {
      // arrange
      const errorObject = { status: 404 };
      const expectedAction = { type: 'PLACEMENT_EDIT_CONFIG_FAILURE', payload: errorObject };

      // assert
      expect(editPlacementConfigFailure(errorObject)).toEqual(expectedAction);
    });

    it('should dispatch the actions for success', async () => {
      // arrange
      fetchMock.patch('glob:*/api/placement/*', {
        body: {
          status: 'success',
          data: {
            id: '1',
            config: configStr,
          },
        },
      });

      const expectedActions = [
        { type: 'PLACEMENT_EDIT_CONFIG_REQUEST', payload: configObj },
        {
          type: 'PLACEMENT_EDIT_CONFIG_SUCCESS',
          payload: { id: '1', config: '{"mudmap":{"100":[{"id":1,"order":1,"capacityId":10},{"id":2,"order":2,"capacityId":20}]}}' },
        },
      ];

      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(editPlacementConfig(configObj));

      // assert
      const mockCalls = fetchMock.calls();

      const [, payload] = mockCalls[0];
      expect(store.getActions()).toEqual(expectedActions);
      expect(mockCalls).toHaveLength(1);
      expect(payload.body).toEqual(JSON.stringify({ config: JSON.stringify(configObj) }));
    });

    it('should dispatch the actions for network failure', async () => {
      // arrange
      fetchMock.patch('glob:*/api/placement/*', { status: 404, body: {} });

      const expectedActions = [
        { type: 'PLACEMENT_EDIT_CONFIG_REQUEST', payload: configObj },
        {
          type: 'PLACEMENT_EDIT_CONFIG_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/placement/1` } }),
        },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.editPlacementConfig.fail' } },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(editPlacementConfig(configObj));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for backend failure', async () => {
      // arrange
      fetchMock.patch('glob:*/api/placement/*', { body: { status: errorData.status, message: errorData.message } });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_CONFIG_REQUEST', payload: configObj },
        { type: 'PLACEMENT_EDIT_CONFIG_FAILURE', payload: errorData },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.editPlacementConfig.fail' } },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(editPlacementConfig(configObj));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('patchPolicy', () => {
    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    const policyId = 1;
    const body = { fromPeriod: 'mockFrom', toPeriod: 'mockTo', umrId: 'UMR1' };

    it('should create an action for placement fetch started', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_EDIT_POLICY_PATCH_REQUEST', payload: { policyId, body } };

      // assert
      expect(patchPolicyRequest(policyId, body)).toEqual(expectedAction);
    });

    it('should create an action for placement fetch success', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_POLICY_PATCH_SUCCESS', payload: { foo: 1 } };

      // assert
      expect(patchPolicySuccess({ foo: 1 })).toEqual(expectedAction);
    });

    it('should create an action for placement fetch failure', () => {
      // arrange
      const error = { status: 404 };
      const expectedAction = { type: 'PLACEMENT_EDIT_POLICY_PATCH_FAILURE', payload: error };

      // assert
      expect(patchPolicyFailure({ status: 404 })).toEqual(expectedAction);
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.patch('*', { body: { status: 'success', data: { foo: 1 } } });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_POLICY_PATCH_REQUEST', payload: { policyId, body } },
        { payload: 'placementPatchPolicy', type: 'LOADER_ADD' },
        { type: 'PLACEMENT_POLICY_PATCH_SUCCESS', payload: { foo: 1 } },
        {
          payload: { ...notificationSuccess, message: 'notification.patchPolicy.success' },
          type: 'NOTIFICATION_ADD',
        },
        { type: 'MODAL_HIDE' },
        {
          payload: 'placementPatchPolicy',
          type: 'LOADER_REMOVE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(patchPolicy(policyId, body));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for fetch network failure', async () => {
      // arrange
      fetchMock.patch('*', { status: 404, body: {} });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_POLICY_PATCH_REQUEST', payload: { policyId, body } },
        { payload: 'placementPatchPolicy', type: 'LOADER_ADD' },
        {
          type: 'PLACEMENT_EDIT_POLICY_PATCH_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/policy/1` } }),
        },
        {
          payload: { ...notificationFailure, message: 'notification.patchPolicy.fail' },
          type: 'NOTIFICATION_ADD',
        },
        { type: 'MODAL_HIDE' },
        {
          payload: 'placementPatchPolicy',
          type: 'LOADER_REMOVE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      try {
        await store.dispatch(patchPolicy(policyId, body));
      } catch (err) {
        expect(err).toEqual({
          json: {},
          response: {
            ok: false,
            status: 404,
            statusText: 'Not Found',
            url: `${publicConfig.endpoint.edge}/api/policy/1`,
          },
        });
      }

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for fetch backend failure', async () => {
      // arrange
      fetchMock.patch('*', { body: { status: errorData.status, message: errorData.message } });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_POLICY_PATCH_REQUEST', payload: { policyId, body } },
        { payload: 'placementPatchPolicy', type: 'LOADER_ADD' },
        { type: 'PLACEMENT_EDIT_POLICY_PATCH_FAILURE', payload: errorData },
        {
          payload: { ...notificationFailure, message: 'notification.patchPolicy.fail' },
          type: 'NOTIFICATION_ADD',
        },
        { type: 'MODAL_HIDE' },
        {
          payload: 'placementPatchPolicy',
          type: 'LOADER_REMOVE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      try {
        await store.dispatch(patchPolicy(policyId, body));
      } catch (err) {
        expect(err).toEqual(errorData);
      }

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('postPlacementEditQuote', () => {
    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    const body = {
      statusId: '2',
      currency: 'USD',
      premium: 10000,
      writtenLinePercentage: 10,
      isLeader: true,
      subjectivities: 'sub',
      quoteDate: '2020-07-03',
      validUntilDate: '2020-07-23',
      policyMarketId: 123,
    };

    const bodyWithCapacityId = {
      ...body,
      capacityTypeId: 4,
    };

    it('should create an action for edit quote fetch started', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_EDIT_QUOTE_POST_REQUEST', payload: body };

      // assert
      expect(postPlacementEditQuoteRequest(body)).toEqual(expectedAction);
    });

    it('should create an action for edit quote fetch success', () => {
      // arrange
      const expectedAction = { type: 'PLACEMENT_POLICY_MARKET_EDIT_POST_SUCCESS', payload: { foo: 1 } };

      // assert
      expect(postPlacementEditQuoteSuccess({ foo: 1 })).toEqual(expectedAction);
    });

    it('should create an action for edit quote fetch failure', () => {
      // arrange
      const error = { status: 404 };
      const expectedAction = { type: 'PLACEMENT_EDIT_QUOTE_POST_FAILURE', payload: error };

      // assert
      expect(postPlacementEditQuoteFailure({ status: 404 })).toEqual(expectedAction);
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.put('*', { body: { status: 'success', data: { foo: 1 } } });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_QUOTE_POST_REQUEST', payload: body },
        { type: 'LOADER_ADD', payload: 'postPlacementEditQuote' },
        { type: 'PLACEMENT_POLICY_MARKET_EDIT_POST_SUCCESS', payload: { foo: 1 } },
        { type: 'MARKET_POLICY_SELECT', payload: { id: 123 } },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationSuccess, message: 'notification.editQuote.success' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementEditQuote' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementEditQuote(body));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for fetch network failure', async () => {
      // arrange
      fetchMock.put('*', { status: 404, body: {} });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_QUOTE_POST_REQUEST', payload: body },
        { type: 'LOADER_ADD', payload: 'postPlacementEditQuote' },
        {
          type: 'PLACEMENT_EDIT_QUOTE_POST_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/policy/market/123` } }),
        },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.editQuote.fail' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementEditQuote' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementEditQuote(body));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for fetch backend failure', async () => {
      // arrange
      fetchMock.put('*', { body: { status: errorData.status, message: errorData.message } });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_QUOTE_POST_REQUEST', payload: body },
        { type: 'LOADER_ADD', payload: 'postPlacementEditQuote' },
        { type: 'PLACEMENT_EDIT_QUOTE_POST_FAILURE', payload: errorData },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.editQuote.fail' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementEditQuote' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementEditQuote(body));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for fetch success if editing market capacity type', async () => {
      // arrange
      fetchMock.put('*', { body: { status: 'success', data: { foo: 1 } } });
      fetchMock.patch('*', { body: { status: 'success', data: { bar: 2 } } });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_QUOTE_POST_REQUEST', payload: bodyWithCapacityId },
        { type: 'LOADER_ADD', payload: 'postPlacementEditQuote' },
        { type: 'PLACEMENT_POLICY_MARKET_EDIT_POST_SUCCESS', payload: { foo: 1, market: { bar: 2 } } },
        { type: 'MARKET_POLICY_SELECT', payload: { id: 123 } },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationSuccess, message: 'notification.editQuote.success' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementEditQuote' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementEditQuote(bodyWithCapacityId));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(2);
    });

    it('should dispatch the actions for fetch network failure if editing market capacity type', async () => {
      // arrange
      fetchMock.put('*', { status: 404, body: {} });
      fetchMock.patch('*', { body: { status: 'success', data: { bar: 2 } } });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_QUOTE_POST_REQUEST', payload: bodyWithCapacityId },
        { type: 'LOADER_ADD', payload: 'postPlacementEditQuote' },
        {
          type: 'PLACEMENT_EDIT_QUOTE_POST_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/policy/market/123` } }),
        },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.editQuote.fail' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementEditQuote' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementEditQuote(bodyWithCapacityId));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(2);
    });

    it('should dispatch the actions for fetch backend failure if editing market capacity type', async () => {
      // arrange
      fetchMock.put('*', { body: { status: errorData.status, message: errorData.message } });
      fetchMock.patch('*', { body: { status: errorData.status, message: errorData.message } });
      const expectedActions = [
        { type: 'PLACEMENT_EDIT_QUOTE_POST_REQUEST', payload: bodyWithCapacityId },
        { type: 'LOADER_ADD', payload: 'postPlacementEditQuote' },
        { type: 'PLACEMENT_EDIT_QUOTE_POST_FAILURE', payload: errorData },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.editQuote.fail' } },
        { type: 'MODAL_HIDE' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementEditQuote' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementEditQuote(bodyWithCapacityId));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(2);
    });
  });

  describe('postPlacementAddLayer', () => {
    beforeEach(() => {
      MockDate.set('2019');
    });

    afterEach(() => {
      MockDate.reset();
    });

    const formData = {
      departmentId: 2,
      businessType: [{ id: 300 }],
      isoCurrencyCode: 'USD',
      amount: 10000,
      excess: 20000,
      notes: 'foo bar',
    };

    it('should create an action for add layer post request', () => {
      // assert
      expect(postPlacementAddLayerRequest({ foo: 1 })).toEqual({
        type: 'PLACEMENT_LAYER_POST_REQUEST',
        payload: { foo: 1 },
      });
    });

    it('should create an action for add layer post success', () => {
      // assert
      expect(postPlacementAddLayerSuccess({ foo: 2 })).toEqual({
        type: 'PLACEMENT_LAYER_POST_SUCCESS',
        payload: { foo: 2 },
      });
    });

    it('should create an action for add layer post failure', () => {
      // assert
      expect(postPlacementAddLayerFailure({ foo: 3 })).toEqual({
        type: 'PLACEMENT_LAYER_POST_FAILURE',
        payload: { foo: 3 },
      });
    });

    it('should dispatch the actions for post success', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: { foo: 1 } } });
      const expectedActions = [
        { type: 'PLACEMENT_LAYER_POST_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'postPlacementAddLayer' },
        { type: 'PLACEMENT_LAYER_POST_SUCCESS', payload: { foo: 1 } },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationSuccess, message: 'notification.addLayer.success' } },
        { type: 'MODAL_HIDE', payload: 'ADD_PLACEMENT_LAYER' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementAddLayer' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementAddLayer(formData));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for post network failure', async () => {
      // arrange
      fetchMock.post('*', { status: 404, body: {} });
      const expectedActions = [
        { type: 'PLACEMENT_LAYER_POST_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'postPlacementAddLayer' },
        {
          type: 'PLACEMENT_LAYER_POST_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/placementlayer` } }),
        },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.addLayer.fail' } },
        { type: 'MODAL_HIDE', payload: 'ADD_PLACEMENT_LAYER' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementAddLayer' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementAddLayer(formData));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for fetch backend failure', async () => {
      // arrange
      fetchMock.post('*', { body: { status: errorData.status, message: errorData.message } });
      const expectedActions = [
        { type: 'PLACEMENT_LAYER_POST_REQUEST', payload: formData },
        { type: 'LOADER_ADD', payload: 'postPlacementAddLayer' },
        { type: 'PLACEMENT_LAYER_POST_FAILURE', payload: errorData },
        { type: 'NOTIFICATION_ADD', payload: { ...notificationFailure, message: 'notification.addLayer.fail' } },
        { type: 'MODAL_HIDE', payload: 'ADD_PLACEMENT_LAYER' },
        { type: 'LOADER_REMOVE', payload: 'postPlacementAddLayer' },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postPlacementAddLayer(formData));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });
});
