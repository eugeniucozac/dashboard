import reducer from './admin.reducers';

describe('STORES › REDUCERS › admin', () => {
  const initialState = {
    userList: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      sortBy: 'fullName',
      sortDirection: 'asc',
    },
    parentOfficeList: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      sortBy: 'name',
      sortDirection: 'asc',
    },
    parentOfficeListAll: {
      items: [],
      loading: false,
    },
    programmesCarriersList: {
      items: [],
      loading: false,
    },
    programmesClientList: {
      items: [],
      loading: false,
    },
    programmesProductsList: {
      items: [],
      loading: false,
    },
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('get', () => {
    it('should handle ADMIN_USER_LIST_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'ADMIN_USER_LIST_GET_SUCCESS',
        payload: {
          content: [{ foo: 'bar' }],
          pagination: { page: 2 },
        },
      };
      const expectedState = {
        ...initialState,
        userList: {
          ...initialState.userList,
          query: '',
          page: 2,
          items: [{ foo: 'bar' }],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle ADMIN_PARENT_OFFICE_LIST_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'ADMIN_PARENT_OFFICE_LIST_GET_SUCCESS',
        payload: {
          content: [{ foo: 'bar' }],
          pagination: { page: 2 },
        },
      };
      const expectedState = {
        ...initialState,
        parentOfficeList: {
          ...initialState.parentOfficeList,
          query: '',
          page: 2,
          items: [{ foo: 'bar' }],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle ADMIN_PARENT_OFFICE_LIST_ALL_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'ADMIN_PARENT_OFFICE_LIST_ALL_GET_SUCCESS',
        payload: [{ foo: 'bar' }],
      };
      const expectedState = {
        ...initialState,
        parentOfficeListAll: {
          items: [{ foo: 'bar' }],
          loading: false,
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('post', () => {
    it('should handle ADMIN_USER_CREATE_SUCCESS', () => {
      // arrange
      const expectedPayload = {
        role: 'COBROKER',
      };
      const action = {
        type: 'ADMIN_USER_CREATE_SUCCESS',
        payload: expectedPayload,
      };
      const expectedState = {
        ...initialState,
        userList: {
          ...initialState.userList,
          items: [{ role: 'COBROKER', __new__: true }, ...initialState.userList.items],
          itemsTotal: 1,
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle ADMIN_CLIENT_OFFICE_CREATE_SUCCESS', () => {
      // arrange
      const expectedPayload = {
        id: 3,
        name: 'Office 2',
        parent: {
          id: 1,
        },
      };
      const action = {
        type: 'ADMIN_CLIENT_OFFICE_CREATE_SUCCESS',
        payload: expectedPayload,
      };
      const previousState = {
        ...initialState,
        parentOfficeList: {
          ...initialState.parentOfficeList,
          items: [
            { id: 1, name: 'Parent 1', offices: [] },
            { id: 2, name: 'Parent 2', offices: [] },
          ],
        },
      };
      const expectedState = {
        ...initialState,
        parentOfficeList: {
          ...initialState.parentOfficeList,
          items: [
            { id: 1, name: 'Parent 1', offices: [{ id: 3, name: 'Office 2', __new__: true, parent: { id: 1 } }] },
            { id: 2, name: 'Parent 2', offices: [] },
          ],
        },
      };

      // assert
      expect(reducer(previousState, action)).toEqual(expectedState);
    });
  });

  describe('patch', () => {
    it('should handle ADMIN_USER_EDIT_SUCCESS', () => {
      // arrange
      const expectedPayload = {
        id: 2,
        role: 'COBROKER',
      };
      const action = {
        type: 'ADMIN_USER_EDIT_SUCCESS',
        payload: expectedPayload,
      };
      const previousState = {
        ...initialState,
        userList: {
          ...initialState.userList,
          items: [
            { id: 1, role: 'BROKER' },
            { id: 2, role: 'BROKER' },
          ],
        },
      };
      const expectedState = {
        ...initialState,
        userList: {
          ...initialState.userList,
          items: [
            { id: 1, role: 'BROKER' },
            { id: 2, role: 'COBROKER' },
          ],
        },
      };

      // assert
      expect(reducer(previousState, action)).toEqual(expectedState);
    });
    it('should handle ADMIN_CLIENT_OFFICE_EDIT_SUCCESS', () => {
      // arrange
      const expectedPayload = {
        id: 3,
        name: 'Office 1 - changed',
        parent: {
          id: 1,
        },
      };
      const action = {
        type: 'ADMIN_CLIENT_OFFICE_EDIT_SUCCESS',
        payload: expectedPayload,
      };
      const previousState = {
        ...initialState,
        parentOfficeList: {
          ...initialState.parentOfficeList,
          items: [
            { id: 1, name: 'Parent 1', offices: [{ id: 3, name: 'Office 1' }] },
            { id: 2, name: 'Parent 2', offices: [{ id: 4, name: 'Office 2' }] },
          ],
        },
      };
      const expectedState = {
        ...initialState,
        parentOfficeList: {
          ...initialState.parentOfficeList,
          items: [
            { id: 1, name: 'Parent 1', offices: [{ id: 3, name: 'Office 1 - changed', parent: { id: 1 } }] },
            { id: 2, name: 'Parent 2', offices: [{ id: 4, name: 'Office 2' }] },
          ],
        },
      };

      // assert
      expect(reducer(previousState, action)).toEqual(expectedState);
    });
  });
});
