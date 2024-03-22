import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState } from 'tests';

import { postNewLocationGroup } from './location.actions';
import { getLocationGroupsForPlacement } from './location.actions';

import MockDate from 'mockdate';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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

describe('STORES › ACTIONS › location', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
    MockDate.set('2019');
  });

  afterEach(() => {
    MockDate.reset();
  });

  const defaultState = {
    user: {
      departmentSelected: 21,
      emailId: 'user@test.com',
      auth: {
        accessToken: 1,
      },
    },
    placement: {
      selected: { id: 123, name: 'placement 1' },
    },
    location: {
      geocoding: {
        status: null,
        result: null,
        attempts: 0,
        completed: 0,
        total: 0,
      },
      locationsUploaded: [
        { id: 1, foo: '1' },
        { id: 2, foo: '2' },
      ],
    },
    ui: {
      notification: {
        queue: [],
      },
    },
  };

  describe('postNewLocationGroup', () => {
    const defaultError = {
      file: 'stores/location.actions',
    };

    describe('POST', () => {
      it('dispatch actions for success', async () => {
        // arrange
        const store = mockStore(getInitialState(defaultState));
        fetchMock.post('glob:*/api/locations', { body: { status: 'success', data: { message: 'post success' } } });
        fetchMock.get('glob:*/api/locations/123', { body: { status: 'success', data: [{ foo: 1 }, { foo: 2 }] } });

        // act
        await store.dispatch(postNewLocationGroup());

        // assert
        expect(store.getActions()).toEqual([
          {
            type: 'LOCATION_POST_NEW_GROUP',
            payload: [
              { id: 1, foo: '1' },
              { id: 2, foo: '2' },
            ],
          },
          { type: 'LOADER_ADD', payload: 'postNewLocationGroup' },
          { type: 'LOCATION_POST_NEW_GROUP_SUCCESS', payload: { message: 'post success' } },
          { type: 'MODAL_HIDE', payload: undefined },
          { type: 'LOCATION_GET_PLACEMENT_GROUPS', payload: 123 },
          { type: 'LOADER_REMOVE', payload: 'postNewLocationGroup' },
          { type: 'NOTIFICATION_ADD', payload: { ...notificationSuccess, data: undefined, message: 'notification.location.success' } },
          { type: 'LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP_RESET' },
        ]);
        expect(fetchMock.calls()).toHaveLength(2);
        expect(fetchMock.calls()[0][0]).toContain('/api/locations');
        expect(fetchMock.calls()[1][0]).toContain('/api/locations/123');
      });

      it('dispatch actions for failure - missing placementId', async () => {
        // arrange
        const storeData = {
          ...defaultState,
          placement: {},
        };

        const store = mockStore(getInitialState(storeData));

        // act
        await store.dispatch(postNewLocationGroup());

        // assert
        expect(store.getActions()).toEqual([
          {
            type: 'LOCATION_POST_NEW_GROUP',
            payload: [
              { id: 1, foo: '1' },
              { id: 2, foo: '2' },
            ],
          },
          { type: 'LOADER_ADD', payload: 'postNewLocationGroup' },
          { type: 'LOCATION_POST_NEW_GROUP_FAILURE', payload: { ...defaultError, title: 'Missing placement selected ID' } },
          { type: 'LOADER_REMOVE', payload: 'postNewLocationGroup' },
        ]);
        expect(fetchMock.calls()).toHaveLength(0);
      });

      it('dispatch actions for failure - missing user emailId', async () => {
        // arrange
        const storeData = {
          ...defaultState,
          user: {
            accessToken: 1,
            departmentSelected: 21,
          },
        };

        const store = mockStore(getInitialState(storeData));

        // act
        await store.dispatch(postNewLocationGroup());

        // assert
        expect(store.getActions()).toEqual([
          {
            type: 'LOCATION_POST_NEW_GROUP',
            payload: [
              { id: 1, foo: '1' },
              { id: 2, foo: '2' },
            ],
          },
          { type: 'LOADER_ADD', payload: 'postNewLocationGroup' },
          { type: 'LOCATION_POST_NEW_GROUP_FAILURE', payload: { ...defaultError, title: 'Missing user email ID' } },
          { type: 'LOADER_REMOVE', payload: 'postNewLocationGroup' },
        ]);
        expect(fetchMock.calls()).toHaveLength(0);
      });

      it('dispatch actions for failure - missing user authToken', async () => {
        // arrange
        const storeData = {
          ...defaultState,
          user: {
            ...defaultState.user,
            auth: {
              accessToken: null,
            },
          },
        };

        const expectedActions = [
          {
            type: 'LOCATION_POST_NEW_GROUP',
            payload: [
              { id: 1, foo: '1' },
              { id: 2, foo: '2' },
            ],
          },
          { type: 'LOADER_ADD', payload: 'postNewLocationGroup' },
          { type: 'LOCATION_POST_NEW_GROUP_FAILURE', payload: { ...defaultError, title: 'Missing user access token' } },
          { type: 'LOADER_REMOVE', payload: 'postNewLocationGroup' },
        ];

        const store = mockStore(getInitialState(storeData));

        // act
        await store.dispatch(postNewLocationGroup());

        // assert
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.calls()).toHaveLength(0);
      });

      it('dispatch actions for failure - response error', async () => {
        fetchMock.post('glob:*/api/locations', { body: { status: 'error', data: { message: 'post failure' } } });

        // arrange
        const expectedActions = [
          {
            type: 'LOCATION_POST_NEW_GROUP',
            payload: [
              { id: 1, foo: '1' },
              { id: 2, foo: '2' },
            ],
          },
          { type: 'LOADER_ADD', payload: 'postNewLocationGroup' },
          {
            type: 'LOCATION_POST_NEW_GROUP_FAILURE',
            payload: { status: 'error', data: { message: 'post failure' }, message: 'API data format error (error)' },
          },
          { type: 'MODAL_HIDE', payload: undefined },
          { type: 'LOADER_REMOVE', payload: 'postNewLocationGroup' },
          {
            type: 'NOTIFICATION_ADD',
            payload: { ...notificationError, data: undefined, type: 'error', message: 'notification.location.fail' },
          },
          { type: 'LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP_RESET' },
        ];
        const store = mockStore(getInitialState(defaultState));

        // act
        await store.dispatch(postNewLocationGroup());

        // assert
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.calls()).toHaveLength(1);
        expect(fetchMock.calls()[0][0]).toContain('/api/locations');
      });
    });
  });

  describe('getLocationGroupsForPlacement', () => {
    const defaultError = {
      file: 'stores/location.actions',
    };

    describe('GET', () => {
      it('should dispatch for success - without loader', async () => {
        // arrange
        const store = mockStore(getInitialState(defaultState));
        const fetchData = [{ id: 11, locations: [{ bar: 1 }, { bar: 2 }] }];

        fetchMock.get('glob:*/api/locations/123', { body: { status: 'success', data: fetchData } });

        // act
        await store.dispatch(getLocationGroupsForPlacement(123));

        // assert
        expect(store.getActions()).toEqual([
          { type: 'LOCATION_GET_PLACEMENT_GROUPS', payload: 123 },
          { type: 'LOCATION_GET_PLACEMENT_GROUPS_SUCCESS', payload: fetchData },
          { type: 'LOCATION_SET_GROUPS', payload: { id: 123, groups: fetchData } },
          {
            type: 'LOCATION_GEOCODING_UPDATE',
            payload: {
              status: true,
              result: 'inprogress',
              attempts: 1,
              completed: 0,
              total: 2,
            },
          },
          { type: 'LOCATION_SET_MAP_LOCATIONS', payload: { id: 123, locations: [{ bar: 1 }, { bar: 2 }] } },
        ]);
        expect(fetchMock.calls()).toHaveLength(1);
        expect(fetchMock.calls()[0][0]).toContain('/api/locations/123');
      });

      it('should dispatch for success - with loader', async () => {
        // arrange
        const store = mockStore(getInitialState(defaultState));
        const fetchData = [{ id: 11, locations: [{ bar: 1 }, { bar: 2 }] }];

        fetchMock.get('glob:*/api/locations/123', { body: { status: 'success', data: fetchData } });

        // act
        await store.dispatch(getLocationGroupsForPlacement(123, true));

        // assert
        expect(store.getActions()).toEqual([
          { type: 'LOCATION_GET_PLACEMENT_GROUPS', payload: 123 },
          { type: 'LOADER_ADD', payload: 'getLocationGroupsForPlacement' },
          { type: 'LOCATION_GET_PLACEMENT_GROUPS_SUCCESS', payload: fetchData },
          { type: 'LOADER_REMOVE', payload: 'getLocationGroupsForPlacement' },
          { type: 'LOCATION_SET_GROUPS', payload: { id: 123, groups: fetchData } },
          {
            type: 'LOCATION_GEOCODING_UPDATE',
            payload: {
              status: true,
              result: 'inprogress',
              attempts: 1,
              completed: 0,
              total: 2,
            },
          },
          { type: 'LOCATION_SET_MAP_LOCATIONS', payload: { id: 123, locations: [{ bar: 1 }, { bar: 2 }] } },
        ]);
        expect(fetchMock.calls()).toHaveLength(1);
        expect(fetchMock.calls()[0][0]).toContain('/api/locations/123');
      });

      it('should dispatch for failure - missing placementId', async () => {
        // arrange
        const storeData = {
          ...defaultState,
          placement: {},
        };

        const store = mockStore(getInitialState(storeData));

        // act
        await store.dispatch(getLocationGroupsForPlacement());

        // assert
        expect(store.getActions()).toEqual([
          { type: 'LOCATION_GET_PLACEMENT_GROUPS', payload: undefined },
          { type: 'LOCATION_GET_PLACEMENT_GROUPS_FAILURE', payload: { ...defaultError, title: 'Missing placement selected ID' } },
        ]);
        expect(fetchMock.calls()).toHaveLength(0);
      });

      it('should dispatch for failure - missing user emailId', async () => {
        // arrange
        const storeData = {
          ...defaultState,
          user: {
            ...defaultState.user,
            auth: {
              accessToken: null,
            },
          },
        };

        const store = mockStore(getInitialState(storeData));

        fetchMock.get('glob:*/api/locations/123', { body: { status: 'success', data: { message: 'response error' } } });

        // act
        await store.dispatch(getLocationGroupsForPlacement());

        // assert
        expect(store.getActions()).toEqual([
          { type: 'LOCATION_GET_PLACEMENT_GROUPS', payload: undefined },
          { type: 'LOCATION_GET_PLACEMENT_GROUPS_FAILURE', payload: { ...defaultError, title: 'Missing user access token' } },
        ]);
        expect(fetchMock.calls()).toHaveLength(0);
      });

      it('should dispatch for failure - response error', async () => {
        // arrange
        const store = mockStore(getInitialState(defaultState));

        fetchMock.get('glob:*/api/locations/123', { body: { status: 'error', data: { message: 'response error' } } });

        // act
        await store.dispatch(getLocationGroupsForPlacement(123));

        // assert
        expect(store.getActions()).toEqual([
          { type: 'LOCATION_GET_PLACEMENT_GROUPS', payload: 123 },
          {
            type: 'LOCATION_GET_PLACEMENT_GROUPS_FAILURE',
            payload: { status: 'error', data: { message: 'response error' }, message: 'API data format error (error)' },
          },
        ]);
        expect(fetchMock.calls()).toHaveLength(1);
        expect(fetchMock.calls()[0][0]).toContain('/api/locations/123');
      });
    });
  });

  describe('setLocationGroups', () => {
    // TODO added on 10/11/2020: add tests
  });

  describe('setMapLocations', () => {
    // TODO added on 10/11/2020: add tests
  });

  describe('retryGeocoding', () => {
    // TODO added on 10/11/2020: add tests
  });

  describe('resetLocations', () => {
    // TODO added on 10/11/2020: add tests
  });
});
