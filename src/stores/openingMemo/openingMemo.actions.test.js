import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState, publicConfig } from 'tests';
import MockDate from 'mockdate';
import merge from 'lodash/merge';

import { resetOpeningMemo, updateOpeningMemoDirty, resetOpeningMemoList } from './openingMemo.actions';
import { getOpeningMemo } from './openingMemo.actions.get';
import { getOpeningMemoPlacementList } from './openingMemo.actions.getPlacementList';
import { createOpeningMemo } from './openingMemo.actions.post';
import {
  postOpeningMemoPDF,
  postOpeningMemoPDFRequest,
  postOpeningMemoPDFSuccess,
  postOpeningMemoPDFFailure,
} from './openingMemo.actions.postPDF';
import { updateOpeningMemo } from './openingMemo.actions.put';
import { patchOpeningMemo } from './openingMemo.actions.patch';
import { searchOpeningMemoList } from './openingMemo.actions.search';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    url: `${publicConfig.endpoint.edge}/api/openingMemo/1`,
  },
};

const errorNotification = {
  data: undefined,
  key: 1546300800000,
  type: 'error',
  visible: true,
};

const notificationSuccess = {
  key: 1546300800000,
  visible: true,
  type: 'success',
};

const notificationError = {
  key: 1546300800000,
  visible: true,
  type: 'error',
};

describe('STORES › ACTIONS › openingMemo', () => {
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
    referenceData: { departments: [{ id: 333, users: [{ id: 11 }, { id: 22 }] }] },
    openingMemo: {
      list: { items: [{ id: 1, foo: 'bar' }] },
      selected: { id: 1, foo: 2, bar: 3 },
    },
    ui: {
      notification: {
        queue: [],
      },
    },
  };

  describe('getOpeningMemo', () => {
    const users = [{}];

    it('should dispatch the correct actions following an openingMemo GET success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: { foo: 1 } } });
      const expectedActions = [
        {
          type: 'OPENING_MEMO_GET_REQUEST',
          payload: '1',
        },
        {
          type: 'LOADER_ADD',
          payload: 'openingMemo',
        },
        {
          type: 'OPENING_MEMO_GET_SUCCESS',
          payload: {
            status: 'NOT_STARTED',
            lineItems: [],
            foo: 1,
          },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'openingMemo',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getOpeningMemo('1', users));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following an openingMemo GET failure', async () => {
      // arrange
      fetchMock.get('*', { status: 404, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'OPENING_MEMO_GET_REQUEST',
          payload: '1',
        },
        {
          type: 'LOADER_ADD',
          payload: 'openingMemo',
        },
        {
          type: 'OPENING_MEMO_GET_FAILURE',
          payload: errorNetwork,
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'openingMemo',
        },
      ];

      // act
      await store.dispatch(getOpeningMemo('1', users));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('createOpeningMemo', () => {
    it('should dispatch the correct actions following an openingMemo POST success', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: { uniqueMarketReference: 'UMR123455', departmentId: 111 } } });
      const expectedActions = [
        {
          type: 'OPENING_MEMO_POST_REQUEST',
          payload: { uniqueMarketReference: 'UMR123455', departmentId: 111 },
        },
        {
          type: 'LOADER_ADD',
          payload: 'createOpeningMemo',
        },
        {
          type: 'OPENING_MEMO_POST_SUCCESS',
          payload: { uniqueMarketReference: 'UMR123455', departmentId: 111 },
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationSuccess, message: 'notification.openingMemo.postSuccess' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'createOpeningMemo',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(createOpeningMemo('UMR123455', 111));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following an openingMemo POST failure', async () => {
      // arrange
      fetchMock.post('*', { status: 404, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'OPENING_MEMO_POST_REQUEST',
          payload: { uniqueMarketReference: 'UMR123455', departmentId: 111 },
        },
        {
          type: 'LOADER_ADD',
          payload: 'createOpeningMemo',
        },
        {
          type: 'OPENING_MEMO_POST_FAILURE',
          payload: merge(errorNetwork, { response: { url: `${publicConfig.endpoint.edge}/api/openingMemo` } }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationError, message: 'notification.openingMemo.postFail' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'createOpeningMemo',
        },
      ];

      // act
      await store.dispatch(createOpeningMemo('UMR123455', 111));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('postOpeningMemoPDF', () => {
    it('should create an action for fetch started', () => {
      // assert
      expect(postOpeningMemoPDFRequest(123)).toEqual({
        type: 'OPENING_MEMO_PDF_POST_REQUEST',
        payload: 123,
      });
    });

    it('should create an action for fetch success', () => {
      // assert
      expect(postOpeningMemoPDFSuccess({ foo: 1 })).toEqual({
        type: 'OPENING_MEMO_PDF_POST_SUCCESS',
        payload: { foo: 1 },
      });
    });

    it('should create an action for fetch failure', () => {
      // assert
      expect(postOpeningMemoPDFFailure({ status: 404 })).toEqual({
        type: 'OPENING_MEMO_PDF_POST_FAILURE',
        payload: { status: 404 },
      });
    });

    it('should dispatch the correct actions following an openingMemo PDF POST success', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: { id: 123 } } });
      const expectedActions = [
        {
          type: 'OPENING_MEMO_PDF_POST_REQUEST',
          payload: { openingMemoId: 123, pdfOutput: 'pdf blob...' },
        },
        {
          type: 'LOADER_ADD',
          payload: 'postOpeningMemoPDF',
        },
        {
          type: 'OPENING_MEMO_PDF_POST_SUCCESS',
          payload: { id: 123 },
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationSuccess, message: 'notification.openingMemo.postPdfSuccess' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'postOpeningMemoPDF',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postOpeningMemoPDF(123, 'pdf blob...'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following an openingMemo PDF POST failure', async () => {
      // arrange
      fetchMock.post('*', { status: 404, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'OPENING_MEMO_PDF_POST_REQUEST',
          payload: { openingMemoId: 123, pdfOutput: 'pdf blob...' },
        },
        {
          type: 'LOADER_ADD',
          payload: 'postOpeningMemoPDF',
        },
        {
          type: 'OPENING_MEMO_PDF_POST_FAILURE',
          payload: merge(errorNetwork, {
            response: { url: `${publicConfig.endpoint.edge}/api/openingMemo/123/documents/attachFile` },
          }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationError, message: 'notification.openingMemo.postPdfFail' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'postOpeningMemoPDF',
        },
      ];

      // act
      await store.dispatch(postOpeningMemoPDF(123, 'pdf blob...'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('searchOpeningMemoList', () => {
    const searchParams = {
      type: 'uniqueMarketReference',
      query: 'foo',
      origin: { id: '243244', path: 'placement' },
    };

    it('should dispatch the correct actions following a searchOpeningMemoList (placement) GET success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: { content: [{ foo: 1 }, { foo: 2 }], pagination: { foo: 3 } } } });
      const expectedActions = [
        {
          type: 'OPENING_MEMO_LIST_SEARCH_REQUEST',
          payload: {
            origin: { id: '243244', path: 'placement' },
            query: 'foo',
            type: 'uniqueMarketReference',
          },
        },
        {
          type: 'OPENING_MEMO_LIST_SEARCH_SUCCESS',
          payload: {
            content: [{ foo: 1 }, { foo: 2 }],
            pagination: { foo: 3 },
          },
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(searchOpeningMemoList(searchParams));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
      expect(fetchMock.calls()[0][0]).toContain('/api/openingMemo/placement/243244?query=foo&orderBy=uniqueMarketReference&direction=desc');
    });

    it('should dispatch the correct actions following a searchOpeningMemoList (department) GET success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: { content: [{ foo: 1 }, { foo: 2 }], pagination: { foo: 3 } } } });
      const expectedActions = [
        {
          type: 'OPENING_MEMO_LIST_SEARCH_REQUEST',
          payload: {
            origin: { id: '243244', path: 'department' },
            query: 'foo',
            type: 'uniqueMarketReference',
          },
        },
        {
          type: 'OPENING_MEMO_LIST_SEARCH_SUCCESS',
          payload: {
            content: [{ foo: 1 }, { foo: 2 }],
            pagination: { foo: 3 },
          },
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(searchOpeningMemoList({ ...searchParams, origin: { id: '243244', path: 'department' } }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
      expect(fetchMock.calls()[0][0]).toContain(
        '/api/openingMemo/department/243244?query=foo&orderBy=uniqueMarketReference&direction=desc'
      );
    });

    it('should dispatch the correct actions following an openingMemoList GET failure', async () => {
      // arrange
      fetchMock.get('*', { status: 404, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'OPENING_MEMO_LIST_SEARCH_REQUEST',
          payload: {
            origin: { id: '243244', path: 'placement' },
            query: 'foo',
            type: 'uniqueMarketReference',
          },
        },
        {
          type: 'OPENING_MEMO_LIST_SEARCH_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/openingMemo/placement/243244?query=foo&orderBy=uniqueMarketReference&direction=desc`,
            },
          }),
        },
      ];

      // act
      await store.dispatch(searchOpeningMemoList(searchParams));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('getOpeningMemoPlacementList', () => {
    it('should dispatch the correct actions following an openingMemoPlacementList GET success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: { content: [{ foo: 1 }, { foo: 2 }], pagination: { foo: 3 } } } });
      const expectedActions = [
        {
          type: 'OPENING_MEMO_PLACEMENT_LIST_GET_REQUEST',
          payload: { origin: { id: 1, path: 'placement' } },
        },
        {
          type: 'LOADER_ADD',
          payload: 'getOpeningMemoPlacementList',
        },
        {
          type: 'OPENING_MEMO_PLACEMENT_LIST_GET_SUCCESS',
          payload: {
            content: [{ foo: 1 }, { foo: 2 }],
            pagination: { foo: 3 },
          },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'getOpeningMemoPlacementList',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getOpeningMemoPlacementList({ origin: { id: 1, path: 'placement' } }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following an openingMemoPlacementList GET failure', async () => {
      // arrange
      fetchMock.get('*', { status: 404, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'OPENING_MEMO_PLACEMENT_LIST_GET_REQUEST',
          payload: { origin: { id: 1, path: 'placement' } },
        },
        {
          type: 'LOADER_ADD',
          payload: 'getOpeningMemoPlacementList',
        },
        {
          type: 'OPENING_MEMO_PLACEMENT_LIST_GET_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/openingMemo/placement/1?page=1&size=undefined&orderBy=undefined&direction=undefined&status=undefined`,
            },
          }),
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'getOpeningMemoPlacementList',
        },
      ];

      // act
      await store.dispatch(getOpeningMemoPlacementList({ origin: { id: 1, path: 'placement' } }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('updateOpeningMemo', () => {
    const mockChanges = { foo: 2 };
    const mockOpeningMemoId = 1;

    it('should dispatch the correct actions following an openingMemo PUT success', async () => {
      // arrange
      fetchMock.put('*', { body: { status: 'success', data: { id: 1, bar: 3, foo: 2 } } });
      const expectedActions = [
        {
          type: 'OPENING_MEMO_PUT_REQUEST',
          payload: { foo: 2 },
        },
        {
          type: 'LOADER_ADD',
          payload: 'updateOpeningMemo',
        },
        {
          type: 'OPENING_MEMO_PUT_SUCCESS',
          payload: {
            id: 1,
            lineItems: [],
            bar: 3,
            foo: 2,
            status: 'NOT_STARTED',
          },
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationSuccess, message: 'notification.openingMemo.editSuccess' },
        },
        {
          payload: 'updateOpeningMemo',
          type: 'LOADER_REMOVE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(updateOpeningMemo(mockChanges, mockOpeningMemoId));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the correct actions following an openingMemo PUT failure', async () => {
      // arrange
      fetchMock.put('*', { status: 404, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'OPENING_MEMO_PUT_REQUEST',
          payload: { foo: 2 },
        },
        {
          type: 'LOADER_ADD',
          payload: 'updateOpeningMemo',
        },
        {
          type: 'OPENING_MEMO_PUT_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/openingMemo/1`,
            },
          }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...errorNotification, message: 'notification.openingMemo.editFail' },
        },
        {
          payload: 'updateOpeningMemo',
          type: 'LOADER_REMOVE',
        },
      ];

      // act
      await store.dispatch(updateOpeningMemo(mockChanges, mockOpeningMemoId));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('patchOpeningMemo', () => {
    const mockChanges = { foo: 2 };
    const mockOpeningMemoId = 1;

    it('should dispatch the correct actions following an openingMemo PATCH success', async () => {
      // arrange
      fetchMock.patch('*', { body: { status: 'success', data: { id: 1, bar: 3, foo: 2 } } });
      const expectedActions = [
        {
          type: 'OPENING_MEMO_PATCH_REQUEST',
          payload: { foo: 2 },
        },
        {
          type: 'LOADER_ADD',
          payload: 'patchOpeningMemo',
        },
        {
          type: 'OPENING_MEMO_PATCH_SUCCESS',
          payload: {
            id: 1,
            lineItems: [],
            foo: 2,
            bar: 3,
            status: 'NOT_STARTED',
          },
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationSuccess, message: 'notification.openingMemo.editSuccess' },
        },
        {
          type: 'MODAL_HIDE',
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'patchOpeningMemo',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(patchOpeningMemo(mockChanges, mockOpeningMemoId));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the correct actions following an openingMemo PATCH failure', async () => {
      // arrange
      fetchMock.patch('*', { status: 404, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'OPENING_MEMO_PATCH_REQUEST',
          payload: { foo: 2 },
        },
        {
          type: 'LOADER_ADD',
          payload: 'patchOpeningMemo',
        },
        {
          type: 'OPENING_MEMO_PATCH_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/openingMemo/1`,
            },
          }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...errorNotification, message: 'notification.openingMemo.editFail' },
        },
        {
          type: 'MODAL_HIDE',
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'patchOpeningMemo',
        },
      ];

      // act
      await store.dispatch(patchOpeningMemo(mockChanges, mockOpeningMemoId));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('resetOpeningMemoList', () => {
    it('should dispatch the correct actions when calling resetOpeningMemoList', async () => {
      // arrange
      const expectedActions = [{ type: 'RESET_OPENING_MEMO_LIST' }];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(resetOpeningMemoList());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('resetOpeningMemo', () => {
    it('should dispatch the correct actions when calling resetOpeningMemo', async () => {
      // arrange
      const expectedActions = [{ type: 'RESET_OPENING_MEMO' }];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(resetOpeningMemo());

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('updateOpeningMemoDirty', () => {
    it('should dispatch the correct actions when calling updateOpeningMemoDirty', async () => {
      // arrange
      const expectedActions = [{ type: 'UPDATE_DIRTY_OPENING_MEMO', payload: true }];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(updateOpeningMemoDirty(true));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
