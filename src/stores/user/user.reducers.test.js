import reducer from './user.reducers';

describe('STORES › REDUCERS › user', () => {
  const initialState = {
    id: null,
    firstName: '',
    lastName: '',
    fullName: '',
    emailId: '',
    departmentIds: [],
    departmentSelected: null,
    offices: [],
    role: '',
    auth: {},
    isAdmin: false,
    isReportAdmin: false,
    hasTokenExpired: true,
    error: '',

    // New user info properties
    landingPage: '',
    userDetails: {},
    userRole: {},
    group: [],
    businessProcess: [],
    xbInstance: [],
    privilege: {},
    routes: [],
    organisation: {},
  };

  const prevState = {
    id: 123,
    firstName: 'Joe',
    lastName: 'Johnson',
    fullName: 'Joe Johnson Jr.',
    emailId: 'joejohnson@domain.com',
    departmentIds: [1, 2, 3],
    departmentSelected: 1,
    offices: [4, 5, 6],
    role: 'BROKER',
    auth: {
      accessToken: 'abcdefghijklmnopqrstuvwxyz',
      idToken: '0123456789',
      expiresAt: 123456789,
    },
    isAdmin: true,
    isReportAdmin: false,
    hasTokenExpired: false,
    error: 'previous error',
    // New user info properties
    landingPage: 'claims',
    userDetails: {
      id: 123,
      firstName: 'Joe',
      lastName: 'Johnson',
      name: 'Joe Johnson Jr.',
      email: 'joejohnson@domain.com',
    },
    userRole: { id: 1, name: 'Technician' },
    group: [1, 2, 3],
    businessProcess: [4, 5, 6],
    xbInstance: [
      {
        id: 3,
        name: 'Bermuda',
        department: [{ id: 30, name: 'Property' }],
      },
    ],
    routes: ['one', 'two'],
    privilege: { foo: 1 },
    organisation: {
      id: 1,
      name: 'xyz',
    },
  };

  const now = Date.now();
  Date.now = jest.fn().mockReturnValue(now);

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('auth', () => {
    it('should handle AUTH_LOGIN', () => {
      // assert
      expect(reducer(initialState, { type: 'AUTH_LOGIN' })).toEqual({
        ...initialState,
        auth: {},
      });
      expect(reducer(prevState, { type: 'AUTH_LOGIN' })).toEqual({
        ...prevState,
        auth: {},
      });
    });

    it('should handle AUTH_LOGOUT', () => {
      // assert
      expect(reducer(initialState, { type: 'AUTH_LOGOUT' })).toEqual({
        ...initialState,
        auth: {},
      });
      expect(reducer(prevState, { type: 'AUTH_LOGOUT' })).toEqual({
        ...prevState,
        auth: {},
      });
    });

    it('should handle AUTH_IN_PROGRESS', () => {
      // assert
      expect(reducer(initialState, { type: 'AUTH_IN_PROGRESS' })).toEqual({
        ...initialState,
        auth: {
          inProgress: true,
        },
      });
      expect(reducer(prevState, { type: 'AUTH_IN_PROGRESS' })).toEqual({
        ...prevState,
        auth: {
          inProgress: true,
        },
      });
    });

    it('should handle AUTH_SUCCESS', () => {
      // arrange
      const action = {
        type: 'AUTH_SUCCESS',
        payload: {
          accessToken: 'abc123',
          idToken: 'xyz789',
          expiresAt: 123456789,
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        auth: {
          ...action.payload,
          inProgress: false,
        },
        hasTokenExpired: false,
      });
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        auth: {
          ...action.payload,
          inProgress: false,
        },
      });
    });

    it('should handle AUTH_FAILURE', () => {
      // arrange
      const action = {
        type: 'AUTH_FAILURE',
        payload: 'error during authentication',
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        auth: {},
      });
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        auth: {},
      });
    });

    it('should handle USER_TOKEN_EXPIRED', () => {
      // arrange
      const action = {
        type: 'USER_TOKEN_EXPIRED',
        payload: true,
      };

      // assert
      expect(reducer(initialState, action).hasTokenExpired).toEqual(true);
      expect(reducer(prevState, action).hasTokenExpired).toEqual(true);
    });
  });

  describe('user', () => {
    it('should handle USER_GET_SUCCESS', () => {
      // arrange
      const payload = {
        id: 123,
        firstName: 'Joe',
        lastName: 'Johnson',
        fullName: 'Joe Johnson Jr.',
        emailId: 'joejohnson@domain.com',
        departmentIds: [1, 2, 3],
        departmentSelected: 1,
        offices: [7, 8, 9],
        role: 'BROKER',
        isAdmin: false,
        isReportAdmin: false,
      };
      const action = {
        type: 'USER_GET_SUCCESS',
        payload,
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, ...payload });
      expect(reducer(prevState, action)).toEqual({ ...prevState, ...payload });
    });

    it('should handle USER_GET_FAILURE', () => {
      // arrange
      const action = {
        type: 'USER_GET_FAILURE',
        payload: {
          text: 'login failed...',
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, error: 'login failed...' });
      // expect(reducer(prevState, action)).toEqual({ ...initialState, error: 'login failed...' });
    });

    it('should handle USER_DATA_GET_SUCCESS', () => {
      // arrange
      const payload = {
        userDetails: {
          id: 456,
          firstName: 'Steve',
          lastName: 'Stevenson',
          name: 'Steve Stevenson Jr.',
          email: 'steve@domain.com',
        },
        role: { id: 1, name: 'Technician' },
        landingPage: 'foo',
        xbInstance: [
          {
            id: 1,
            name: 'London',
            department: [
              { id: 10, name: 'Property' },
              { id: 11, name: 'Cyber' },
              { id: 12, name: 'Healthcare' },
            ],
          },
          {
            id: 2,
            name: 'Europe',
            department: [{ id: 23, name: 'Aviation' }],
          },
        ],
        group: [10, 11],
        businessProcess: [20, 21, 22, 23],
        routes: ['three', 'four', 'five'],
        privilege: { bar: 2 },
        organisation: {
          id: 2,
          name: 'abc',
        },
      };
      const action = {
        type: 'USER_DATA_GET_SUCCESS',
        payload,
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        id: 456,
        firstName: 'Steve',
        lastName: 'Stevenson',
        fullName: 'Steve Stevenson Jr.',
        emailId: 'steve@domain.com',
        landingPage: 'foo',
        userDetails: payload.userDetails,
        userRole: { id: 1, name: 'Technician' },
        xbInstance: payload.xbInstance,
        departmentSelected: '10',
        group: [10, 11],
        businessProcess: [20, 21, 22, 23],
        routes: ['three', 'four', 'five'],
        privilege: { bar: 2 },
        organisation: {
          id: 2,
          name: 'abc',
        },
      });
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        id: 456,
        firstName: 'Steve',
        lastName: 'Stevenson',
        fullName: 'Steve Stevenson Jr.',
        emailId: 'steve@domain.com',
        landingPage: 'foo',
        userDetails: payload.userDetails,
        userRole: { id: 1, name: 'Technician' },
        xbInstance: payload.xbInstance,
        departmentSelected: '10',
        group: [10, 11],
        businessProcess: [20, 21, 22, 23],
        routes: ['three', 'four', 'five'],
        privilege: { bar: 2 },
        organisation: {
          id: 2,
          name: 'abc',
        },
      });
    });

    it('should handle USER_DATA_GET_FAILURE', () => {
      // arrange
      const action = {
        type: 'USER_DATA_GET_FAILURE',
        payload: {
          text: 'login failed...',
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, auth: {}, error: '' });
      // expect(reducer(prevState, action)).toEqual({
      //   ...initialState,
      //   auth: {
      //     accessToken: 'abcdefghijklmnopqrstuvwxyz',
      //     idToken: '0123456789',
      //     expiresAt: 123456789,
      //   },
      //   error: 'previous error',
      // });
    });

    it('should handle USER_SET_DEPARTMENT_SELECTED', () => {
      // arrange
      const action = {
        type: 'USER_SET_DEPARTMENT_SELECTED',
        payload: 1000,
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, departmentSelected: 1000 });
      expect(reducer(prevState, action)).toEqual({ ...prevState, departmentSelected: 1000 });
    });
  });
});
