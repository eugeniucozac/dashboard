import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState, publicConfig } from 'tests';
import merge from 'lodash/merge';

import { emailSearch } from './admin.actions.emailSearch';
import { getUserList } from './admin.actions.getUserList';
import { createUser } from './admin.actions.createUser';
import { createClientOffice } from './admin.actions.createClientOffice';
import { editUser } from './admin.actions.editUser';
import { editClientOffice } from './admin.actions.editClientOffice';

import MockDate from 'mockdate';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const errorNetwork = {
  json: {},
  response: {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    url: `${publicConfig.endpoint.edge}/api/user/department/1?page=1&size=10&orderBy=fullName&direction=asc&fullName=Foo`,
  },
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

describe('STORES › ACTIONS › admin', () => {
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
    admin: {
      userList: {
        items: [{ id: 1, foo: 'bar' }],
        itemsTotal: 0,
        page: 1,
        pageSize: 10,
        pageTotal: 0,
        sortBy: 'fullName',
        sortType: 'text',
        sortDirection: 'asc',
      },
    },
    ui: {
      notification: {
        queue: [],
      },
    },
  };

  describe('emailSearch', () => {
    it('should dispatch the correct actions following an adminEmailSearch GET success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: [{ foo: 1 }, { foo: 2 }] } });
      const expectedActions = [
        {
          type: 'ADMIN_EMAIL_SEARCH_REQUEST',
          payload: 'test@test.com',
        },
        {
          type: 'ADMIN_EMAIL_SEARCH_SUCCESS',
          payload: [{ foo: 1 }, { foo: 2 }],
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(emailSearch('test@test.com'));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
      expect(fetchMock.calls()[0][0]).toContain('/api/user/emailId/test@test.com');
    });
  });

  describe('getUserList', () => {
    it('should dispatch the correct actions following an getUserList GET `department` success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: { content: [{ foo: 1 }, { foo: 2 }], pagination: { foo: 3 } } } });
      const expectedActions = [
        {
          type: 'ADMIN_USER_LIST_GET_REQUEST',
          payload: {
            departmentId: 1,
            endpointParams: {
              fullName: 'Foo',
              direction: 'asc',
              orderBy: 'fullName',
              page: 1,
              size: 10,
            },
          },
        },
        {
          type: 'LOADER_ADD',
          payload: 'getUserList',
        },
        {
          type: 'ADMIN_USER_LIST_GET_SUCCESS',
          payload: {
            content: [{ foo: 1 }, { foo: 2 }],
            pagination: { foo: 3 },
          },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'getUserList',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getUserList({ departmentId: 1, fullName: 'Foo' }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
      expect(fetchMock.calls()[0][0]).toContain('/api/user/department/1?page=1&size=10&orderBy=fullName&direction=asc&fullName=Foo');
    });

    it('should dispatch the correct actions following an getUserList GET `all` success', async () => {
      // arrange
      fetchMock.get('*', { body: { status: 'success', data: { content: [{ foo: 1 }, { foo: 2 }], pagination: { foo: 3 } } } });
      const expectedActions = [
        {
          type: 'ADMIN_USER_LIST_GET_REQUEST',
          payload: {
            departmentId: undefined,
            endpointParams: {
              fullName: 'Foo',
              direction: 'asc',
              orderBy: 'fullName',
              page: 1,
              size: 10,
            },
          },
        },
        {
          type: 'LOADER_ADD',
          payload: 'getUserList',
        },
        {
          type: 'ADMIN_USER_LIST_GET_SUCCESS',
          payload: {
            content: [{ foo: 1 }, { foo: 2 }],
            pagination: { foo: 3 },
          },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'getUserList',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(getUserList({ fullName: 'Foo' }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
      expect(fetchMock.calls()[0][0]).toContain('/api/user/all?page=1&size=10&orderBy=fullName&direction=asc&fullName=Foo');
    });

    it('should dispatch the correct actions following an getUserList GET failure', async () => {
      // arrange
      fetchMock.get('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'ADMIN_USER_LIST_GET_REQUEST',
          payload: {
            departmentId: 1,
            endpointParams: {
              fullName: 'Foo',
              direction: 'asc',
              orderBy: 'fullName',
              page: 1,
              size: 10,
            },
          },
        },
        {
          type: 'LOADER_ADD',
          payload: 'getUserList',
        },
        {
          type: 'ADMIN_USER_LIST_GET_FAILURE',
          payload: errorNetwork,
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'getUserList',
        },
      ];

      // act
      await store.dispatch(getUserList({ departmentId: 1, fullName: 'Foo' }));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('createUser', () => {
    const user = {
      role: 'BROKER',
      contactPhone: '01234876876',
      departmentIds: [21],
      emailId: 'test@test.com',
      firstName: 'Bill',
      lastName: 'Murray',
    };

    it('should dispatch the correct actions following a broker user POST success', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: user } });
      const expectedActions = [
        {
          type: 'ADMIN_USER_CREATE_REQUEST',
          payload: user,
        },
        {
          type: 'LOADER_ADD',
          payload: 'createUser',
        },
        {
          type: 'ADMIN_USER_CREATE_SUCCESS',
          payload: user,
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationSuccess, message: 'notification.admin.userPostSuccess' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'createUser',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(createUser(user));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following an invalid user role', async () => {
      // arrange
      const userFOO = {
        ...user,
        role: 'FOO',
      };
      fetchMock.post('*', { body: { status: 'success', data: userFOO } });
      const expectedActions = [
        {
          type: 'ADMIN_USER_CREATE_REQUEST',
          payload: userFOO,
        },
        {
          type: 'LOADER_ADD',
          payload: 'createUser',
        },
        {
          type: 'ADMIN_USER_CREATE_FAILURE',
          payload: {
            file: 'stores/admin.actions.createUser',
            message: 'Invalid role type',
          },
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationError, message: 'notification.admin.userPostFail' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'createUser',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(createUser(userFOO));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(0);
    });

    it('should dispatch the correct actions following a user POST failure', async () => {
      // arrange
      fetchMock.post('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'ADMIN_USER_CREATE_REQUEST',
          payload: user,
        },
        {
          type: 'LOADER_ADD',
          payload: 'createUser',
        },
        {
          type: 'ADMIN_USER_CREATE_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/user/`,
            },
          }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationError, message: 'notification.admin.userPostFail' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'createUser',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];

      // act
      await store.dispatch(createUser(user));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('editUser', () => {
    const user = {
      id: 111,
      role: 'BROKER',
      contactPhone: '01234876876',
      departmentIds: [21],
      offices: [],
      emailId: 'test@test.com',
      firstName: 'Bill',
      lastName: 'Murray',
    };

    const previousUser = {
      id: 111,
      role: 'COBROKER',
      contactPhone: '01234876876',
      departmentIds: [21],
      offices: [{ id: 1, name: 'Office 1' }],
      emailId: 'test2@test.com',
      firstName: 'Bill',
      lastName: 'Murray',
    };

    it('should dispatch the correct actions following a broker user PATCH success', async () => {
      // arrange
      fetchMock.patch('*', { body: { status: 'success', data: user } });
      const expectedActions = [
        {
          type: 'ADMIN_USER_EDIT_REQUEST',
          payload: user,
        },
        {
          type: 'LOADER_ADD',
          payload: 'editUser',
        },
        {
          type: 'ADMIN_USER_EDIT_SUCCESS',
          payload: user,
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationSuccess, message: 'notification.admin.userPatchSuccess' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'editUser',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(editUser(user, previousUser));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following an invalid user role', async () => {
      // arrange
      const userFOO = {
        ...user,
        role: 'FOO',
      };
      fetchMock.patch('*', { body: { status: 'success', data: userFOO } });
      const expectedActions = [
        {
          type: 'ADMIN_USER_EDIT_REQUEST',
          payload: userFOO,
        },
        {
          type: 'LOADER_ADD',
          payload: 'editUser',
        },
        {
          type: 'ADMIN_USER_EDIT_FAILURE',
          payload: {
            file: 'stores/admin.actions.editUser',
            message: 'Invalid role type',
          },
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationError, message: 'notification.admin.userPatchFail' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'editUser',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(editUser(userFOO, previousUser));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(0);
    });

    it('should dispatch the correct actions following a user PATCH failure', async () => {
      // arrange
      fetchMock.patch('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'ADMIN_USER_EDIT_REQUEST',
          payload: user,
        },
        {
          type: 'LOADER_ADD',
          payload: 'editUser',
        },
        {
          type: 'ADMIN_USER_EDIT_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/user/111`,
            },
          }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationError, message: 'notification.admin.userPatchFail' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'editUser',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];

      // act
      await store.dispatch(editUser(user, previousUser));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('createClientOffice', () => {
    const clientOffice = {
      name: 'Office 1',
      clients: [
        { id: 1, name: 'Client 1' },
        { id: 2, name: 'Client 2' },
      ],
      parent: [{ id: 3, name: 'Parent 1' }],
    };

    const response = {
      name: 'Office 1',
      clients: [
        { id: 1, name: 'Client 1' },
        { id: 2, name: 'Client 2' },
      ],
      parent: { id: 3, name: 'Parent 1' },
    };

    it('should dispatch the correct actions following an office POST success', async () => {
      // arrange
      fetchMock.post('*', { body: { status: 'success', data: response } });
      const expectedActions = [
        {
          type: 'ADMIN_CLIENT_OFFICE_CREATE_REQUEST',
          payload: clientOffice,
        },
        {
          type: 'LOADER_ADD',
          payload: 'createClientOffice',
        },
        {
          type: 'ADMIN_CLIENT_OFFICE_CREATE_SUCCESS',
          payload: response,
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: {
            ...notificationSuccess,
            message: 'notification.admin.officePostSuccess',
            data: { clientName: 'Parent 1', officeName: 'Office 1' },
          },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'createClientOffice',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(createClientOffice(clientOffice));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following a user POST failure', async () => {
      // arrange
      fetchMock.post('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'ADMIN_CLIENT_OFFICE_CREATE_REQUEST',
          payload: clientOffice,
        },
        {
          type: 'LOADER_ADD',
          payload: 'createClientOffice',
        },
        {
          type: 'ADMIN_CLIENT_OFFICE_CREATE_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/client/office`,
            },
          }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationError, message: 'notification.admin.officePostFail' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'createClientOffice',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];

      // act
      await store.dispatch(createClientOffice(clientOffice));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });

  describe('editClientOffice', () => {
    const clientOffice = {
      name: 'Office 1',
      clients: [
        { id: 1, name: 'Client 1' },
        { id: 2, name: 'Client 2' },
      ],
      parent: [{ id: 3, name: 'Parent 1' }],
    };

    const response = {
      name: 'Office 1',
      clients: [
        { id: 1, name: 'Client 1' },
        { id: 2, name: 'Client 2' },
      ],
      parent: { id: 3, name: 'Parent 1' },
    };

    it('should dispatch the correct actions following an office PATCH success', async () => {
      // arrange
      fetchMock.patch('*', { body: { status: 'success', data: response } });
      const expectedActions = [
        {
          type: 'ADMIN_CLIENT_OFFICE_EDIT_REQUEST',
          payload: clientOffice,
        },
        {
          type: 'LOADER_ADD',
          payload: 'editClientOffice',
        },
        {
          type: 'ADMIN_CLIENT_OFFICE_EDIT_SUCCESS',
          payload: response,
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: {
            ...notificationSuccess,
            message: 'notification.admin.officePatchSuccess',
            data: { clientName: 'Parent 1', officeName: 'Office 1' },
          },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'editClientOffice',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(editClientOffice(clientOffice, {}));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the correct actions following a user PATCH failure', async () => {
      // arrange
      fetchMock.patch('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));
      const expectedActions = [
        {
          type: 'ADMIN_CLIENT_OFFICE_EDIT_REQUEST',
          payload: clientOffice,
        },
        {
          type: 'LOADER_ADD',
          payload: 'editClientOffice',
        },
        {
          type: 'ADMIN_CLIENT_OFFICE_EDIT_FAILURE',
          payload: merge(errorNetwork, {
            response: {
              url: `${publicConfig.endpoint.edge}/api/client/office/undefined`,
            },
          }),
        },
        {
          type: 'NOTIFICATION_ADD',
          payload: { ...notificationError, message: 'notification.admin.officePatchFail' },
        },
        {
          type: 'LOADER_REMOVE',
          payload: 'editClientOffice',
        },
        {
          type: 'MODAL_HIDE',
        },
      ];

      // act
      await store.dispatch(editClientOffice(clientOffice, {}));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });
});
