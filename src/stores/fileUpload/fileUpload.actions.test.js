import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  getFileUploadGuiData,
  getFileUploadGuiDataRequest,
  getFileUploadGuiDataSuccess,
  getFileUploadGuiDataFailure,
} from './fileUpload.actions.getGuiData';
import { searchRiskIds, searchRiskIdsRequest, searchRiskIdsSuccess, searchRiskIdsFailure } from './fileUpload.actions.searchRiskIds';
import { searchInsureds, searchInsuredsRequest, searchInsuredsSuccess, searchInsuredsFailure } from './fileUpload.actions.searchInsureds';
import {
  searchDepartmentsByXbInstance,
  searchDepartmentsByXbInstanceRequest,
  searchDepartmentsByXbInstanceSuccess,
  searchDepartmentsByXbInstanceFailure,
} from './fileUpload.actions.searchDepartmentsByXbInstance';
import {
  getFileUploadPolicyDetails,
  getFileUploadPolicyDetailsRequest,
  getFileUploadPolicyDetailsSuccess,
  getFileUploadPolicyDetailsFailure,
} from './fileUpload.actions.getPolicyDetails';
import { getInitialState } from 'tests';
import fetchMock from 'fetch-mock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('STORES › ACTIONS › fileUpload', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('searchRiskIds', () => {
    it('should create an action for search risk Ids request', () => {
      // assert
      expect(searchRiskIdsRequest('foo')).toEqual({ type: 'FILE_UPLOAD_SEARCH_RISK_IDS_REQUEST', payload: 'foo' });
    });

    it('should create an action for search risk Ids fetch success', () => {
      // assert
      expect(searchRiskIdsSuccess([1, 2, 3])).toEqual({
        type: 'FILE_UPLOAD_SEARCH_RISK_IDS_SUCCESS',
        payload: [1, 2, 3],
      });
    });

    it('should create an action for search risk Ids fetch failure', () => {
      // assert
      expect(searchRiskIdsFailure({ error: 500 })).toEqual({ type: 'FILE_UPLOAD_SEARCH_RISK_IDS_FAILURE', payload: { error: 500 } });
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.get('glob:*/data/risk/reference/*', { body: { status: 'OK', data: [1, 2] } });
      const store = mockStore(getInitialState({}));

      // act
      await store.dispatch(searchRiskIds('foo'));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'FILE_UPLOAD_SEARCH_RISK_IDS_REQUEST', payload: 'foo' },
        {
          type: 'FILE_UPLOAD_SEARCH_RISK_IDS_SUCCESS',
          payload: [1, 2],
        },
      ]);
    });
  });

  describe('searchInsureds', () => {
    it('should create an action for search insureds request', () => {
      // assert
      expect(searchInsuredsRequest('foo')).toEqual({ type: 'FILE_UPLOAD_SEARCH_INSUREDS_REQUEST', payload: 'foo' });
    });

    it('should create an action for search insureds fetch success', () => {
      // assert
      expect(searchInsuredsSuccess([1, 2, 3])).toEqual({
        type: 'FILE_UPLOAD_SEARCH_INSUREDS_SUCCESS',
        payload: [1, 2, 3],
      });
    });

    it('should create an action for search insureds fetch failure', () => {
      // assert
      expect(searchInsuredsFailure({ error: 500 })).toEqual({ type: 'FILE_UPLOAD_SEARCH_INSUREDS_FAILURE', payload: { error: 500 } });
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.post('glob:*/api/insured/search', { body: { status: 'success', data: { content: [1, 2, 3, 4, 5, 6] } } });
      const store = mockStore(getInitialState({}));

      // act
      await store.dispatch(searchInsureds('foo'));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'FILE_UPLOAD_SEARCH_INSUREDS_REQUEST', payload: 'foo' },
        {
          type: 'FILE_UPLOAD_SEARCH_INSUREDS_SUCCESS',
          payload: { content: [1, 2, 3, 4, 5, 6] },
        },
      ]);
    });
  });

  describe('searchDepartmentsByXbInstance', () => {
    it('should create an action for search departments by XB instance request', () => {
      // assert
      expect(searchDepartmentsByXbInstanceRequest({ id: 1, value: 'one' })).toEqual({
        type: 'FILE_UPLOAD_SEARCH_DEPARTMENTS_BY_XBINSTANCE_REQUEST',
        payload: { id: 1, value: 'one' },
      });
    });

    it('should create an action for search departments by XB instance fetch success', () => {
      // assert
      expect(searchDepartmentsByXbInstanceSuccess(1, [1, 2, 3])).toEqual({
        type: 'FILE_UPLOAD_SEARCH_DEPARTMENTS_BY_XBINSTANCE_SUCCESS',
        payload: {
          id: 1,
          departments: [1, 2, 3],
        },
      });
    });

    it('should create an action for search departments by XB instance fetch failure', () => {
      // assert
      expect(searchDepartmentsByXbInstanceFailure({ error: 500 })).toEqual({
        type: 'FILE_UPLOAD_SEARCH_DEPARTMENTS_BY_XBINSTANCE_FAILURE',
        payload: { error: 500 },
      });
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.get('glob:*/data/departments/*', { body: { status: 'OK', data: [1, 2] } });
      const store = mockStore(getInitialState({}));

      // act
      await store.dispatch(searchDepartmentsByXbInstance({ id: 123, value: 'one-two-three' }));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'FILE_UPLOAD_SEARCH_DEPARTMENTS_BY_XBINSTANCE_REQUEST', payload: { id: 123, value: 'one-two-three' } },
        {
          type: 'REFERENCE_DATA_GET_XB_INSTANCES_DEPARTMENTS_SUCCESS',
          payload: {
            id: 123,
            departments: [1, 2],
          },
        },
        {
          type: 'FILE_UPLOAD_SEARCH_DEPARTMENTS_BY_XBINSTANCE_SUCCESS',
          payload: {
            id: 123,
            departments: [1, 2],
          },
        },
      ]);
    });
  });

  describe('getFileUploadGuiData', () => {
    it('should create an action for GUI data request', () => {
      // assert
      expect(getFileUploadGuiDataRequest(['foo'])).toEqual({ type: 'FILE_UPLOAD_GET_GUI_DATA_REQUEST', payload: ['foo'] });
    });

    it('should create an action for GUI data fetch success', () => {
      // assert
      expect(getFileUploadGuiDataSuccess([1, 2, 3])).toEqual({
        type: 'FILE_UPLOAD_GET_GUI_DATA_SUCCESS',
        payload: [1, 2, 3],
      });
    });

    it('should create an action for GUI data fetch failure', () => {
      // assert
      expect(getFileUploadGuiDataFailure({ error: 500 })).toEqual({ type: 'FILE_UPLOAD_GET_GUI_DATA_FAILURE', payload: { error: 500 } });
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.post('glob:*/data/gui/screen/fileupload', {
        body: {
          status: 'OK',
          data: {
            guiResponseList: [
              { componentName: 'One', entity: [1, 2, 3] },
              { componentName: 'Two', entity: [4, 5, 6] },
              { componentName: 'Three', entity: [7, 8, 9] },
              { componentName: 'XBInstance', entity: [10, 11, 12] },
              { foo: 'Four', entity: [10] },
            ],
          },
        },
      });
      const store = mockStore(getInitialState({}));

      // act
      await store.dispatch(getFileUploadGuiData(['One', 'Two', 'Three', 'XBInstance']));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'FILE_UPLOAD_GET_GUI_DATA_REQUEST', payload: ['One', 'Two', 'Three', 'XBInstance'] },
        {
          type: 'REFERENCE_DATA_GET_XB_INSTANCES_SUCCESS',
          payload: [10, 11, 12],
        },
        {
          type: 'FILE_UPLOAD_GET_GUI_DATA_SUCCESS',
          payload: {
            One: [1, 2, 3],
            Two: [4, 5, 6],
            Three: [7, 8, 9],
            XBInstance: [10, 11, 12],
          },
        },
      ]);
    });
  });

  describe('getFileUploadPolicyDetails', () => {
    it('should create an action for policy details request', () => {
      // assert
      expect(getFileUploadPolicyDetailsRequest('foo', { policyRef: 123, xbInstanceId: 4 })).toEqual({
        type: 'FILE_UPLOAD_GET_POLICY_DETAILS_REQUEST',
        payload: { type: 'foo', riskRefObject: { policyRef: 123, xbInstanceId: 4 } },
      });
    });

    it('should create an action for policy details fetch success', () => {
      // assert
      expect(getFileUploadPolicyDetailsSuccess({ id: 1 })).toEqual({
        type: 'FILE_UPLOAD_GET_POLICY_DETAILS_SUCCESS',
        payload: { id: 1 },
      });
    });

    it('should create an action for policy details fetch failure', () => {
      // assert
      expect(getFileUploadPolicyDetailsFailure({ error: 500 })).toEqual({
        type: 'FILE_UPLOAD_GET_POLICY_DETAILS_FAILURE',
        payload: { error: 500 },
      });
    });

    it('should dispatch the actions for fetch success - risk', async () => {
      // arrange
      fetchMock.get('glob:*/data/risk/reference/123456/1', {
        body: {
          status: 'OK',
          data: {
            id: 1,
            name: 'One',
          },
        },
      });
      const store = mockStore(getInitialState({}));

      // act
      await store.dispatch(getFileUploadPolicyDetails('risk', { policyRef: 123456, xbInstanceId: 1 }));

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        {
          type: 'FILE_UPLOAD_GET_POLICY_DETAILS_REQUEST',
          payload: { type: 'risk', riskRefObject: { policyRef: 123456, xbInstanceId: 1 } },
        },
        {
          type: 'FILE_UPLOAD_GET_POLICY_DETAILS_SUCCESS',
          payload: {
            id: 1,
            name: 'One',
          },
        },
      ]);
    });

    // it('should dispatch the actions for fetch success - claim', async () => {
    //   // arrange
    //   fetchMock.get('glob:*/api/claim/reference/123456', {
    //     body: {
    //       status: 'OK',
    //       data: {
    //         id: 1,
    //         name: 'One',
    //       },
    //     },
    //   });
    //   const store = mockStore(getInitialState({}));

    //   // act
    //   await store.dispatch(getFileUploadPolicyDetails('claim', 123456));

    //   // assert
    //   expect(fetchMock.calls()).toHaveLength(1);
    //   expect(store.getActions()).toEqual([
    //     { type: 'FILE_UPLOAD_GET_POLICY_DETAILS_REQUEST', payload: { type: 'claim', referenceId: 123456 } },
    //     {
    //       type: 'FILE_UPLOAD_GET_POLICY_DETAILS_SUCCESS',
    //       payload: {
    //         id: 1,
    //         name: 'One',
    //       },
    //     },
    //   ]);
    // });
  });
});
