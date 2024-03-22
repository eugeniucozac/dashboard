import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { getInitialState } from 'tests';
import * as actionsAuth from './user.actions.auth';
import { getUserData, getUserDataRequest, getUserDataSuccess, getUserDataFailure } from './user.actions.getData';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const getUserDataPayload = {
  landingPage: 'home',
  userDetails: {
    id: 10000000,
    email: 'john.smith@mphasis.com',
    name: 'John Smith',
    firstName: 'John',
    lastName: 'Smith',
  },
  role: { id: 1, name: 'Junior Technician' },
  group: [{ id: 2, name: 'Back Office' }],
  businessProcess: [{ id: 1, name: 'Claims' }],
  xbInstance: [
    {
      id: 100,
      name: 'XB_Bermuda',
      department: [{ id: 1000, name: 'Property & Casualty' }],
    },
    {
      id: 200,
      name: 'XB_London',
      department: [{ id: 2000, name: 'Cyber' }],
    },
  ],
  privilege: {
    routes: ['admin', 'premiumProcessing', 'processingInstruction'],
    processingInstruction: {},
    admin: {},
    premiumProcessing: {},
  },
};

describe('STORES › ACTIONS › user', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('edge-department', '');
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('auth', () => {
    it('should create an action for login', () => {
      // arrange
      const auth0 = {
        authorize: jest.fn(() => 'authorize'),
      };
      const expectedAction = {
        type: 'AUTH_LOGIN',
      };

      // assert
      expect(actionsAuth.authLogin(auth0)).toEqual(expectedAction);
      expect(auth0.authorize).toHaveBeenCalledTimes(1);
    });

    it('should create an action for logout', () => {
      // arrange
      const expectedAction = {
        type: 'AUTH_LOGOUT',
      };

      // assert
      expect(actionsAuth.authLogout()).toEqual(expectedAction);
    });

    it('should create an action for success', () => {
      // arrange
      const payload = {
        accessToken: 1,
        idToken: 2,
        expiresAt: 3,
      };
      const expectedAction = {
        type: 'AUTH_SUCCESS',
        payload,
      };

      // assert
      expect(actionsAuth.authSuccess(payload)).toEqual(expectedAction);
    });

    it('should create an action for failure', () => {
      // arrange
      const payload = 'error message';
      const expectedAction = {
        type: 'AUTH_FAILURE',
        payload,
      };

      // assert
      expect(actionsAuth.authFailure(payload)).toEqual(expectedAction);
    });
  });

  describe('getUserData', () => {
    it('should create an action for user data request', () => {
      // assert
      expect(getUserDataRequest()).toEqual({ type: 'USER_DATA_GET_REQUEST' });
    });

    it('should create an action for user data fetch success', () => {
      // assert
      expect(getUserDataSuccess({ id: 1 })).toEqual({
        type: 'USER_DATA_GET_SUCCESS',
        payload: { id: 1 },
      });
    });

    it('should create an action for user data fetch failure', () => {
      // assert
      expect(getUserDataFailure({ error: 500 })).toEqual({ type: 'USER_DATA_GET_FAILURE', payload: { error: 500 } });
    });

    it('should dispatch the actions for fetch success', async () => {
      // arrange
      fetchMock.get('glob:*/authservice/user/role/info', {
        body: {
          status: 'OK',
          data: getUserDataPayload,
        },
      });
      const store = mockStore(getInitialState({}));

      // act
      await store.dispatch(getUserData());

      // assert
      expect(fetchMock.calls()).toHaveLength(1);
      expect(store.getActions()).toEqual([
        { type: 'USER_DATA_GET_REQUEST' },
        {
          type: 'USER_DATA_GET_SUCCESS',
          payload: getUserDataPayload,
        },
        {
          type: 'USER_SET_DEPARTMENT_SELECTED',
          payload: '1000',
        },
      ]);
    });
  });
});
