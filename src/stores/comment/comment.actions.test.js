import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { getInitialState, publicConfig } from 'tests';
import { postComment } from './comment.actions.post';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('STORES › ACTIONS › comments', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('post', () => {
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
    };

    const postPayload = {
      id: 1,
      formData: {
        message: 'lorem ipsum',
      },
    };

    const postData = {
      id: 123456,
      date: '2000-01-31',
      message: postPayload.formData.message,
      user: {
        id: 1,
      },
    };

    const notificationError = {
      key: 1546300800000,
      visible: true,
      type: 'error',
      message: 'notification.comment.fail',
    };

    const notificationSuccess = {
      key: 1546300800000,
      visible: true,
      type: 'success',
      message: 'notification.comment.success',
    };

    it('should dispatch the actions for success', async () => {
      // arrange
      fetchMock.post('*', {
        body: {
          status: 'success',
          data: postData,
        },
      });
      const expectedActions = [
        { type: 'COMMENTS_POST_REQUEST', payload: postPayload },
        { type: 'COMMENTS_POST_SUCCESS', payload: { id: 1, comments: postData } },
        { type: 'NOTIFICATION_ADD', payload: notificationSuccess },
      ];
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postComment(postPayload.id, postPayload.formData));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for network failure', async () => {
      // arrange
      const errorNetwork = {
        json: {},
        response: {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          url: `${publicConfig.endpoint.edge}/api/comment/1`,
        },
      };
      const expectedActions = [
        { type: 'COMMENTS_POST_REQUEST', payload: postPayload },
        { type: 'COMMENTS_POST_FAILURE', payload: errorNetwork },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
      ];
      fetchMock.post('*', { status: errorNetwork.response.status, body: {} });
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postComment(postPayload.id, postPayload.formData));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });

    it('should dispatch the actions for backend failure', async () => {
      // arrange
      const errorData = {
        status: 500,
        message: 'API data format error (500)',
      };
      const expectedActions = [
        { type: 'COMMENTS_POST_REQUEST', payload: postPayload },
        { type: 'COMMENTS_POST_FAILURE', payload: errorData },
        { type: 'NOTIFICATION_ADD', payload: notificationError },
      ];
      fetchMock.post('*', { body: { status: errorData.status, message: errorData.message } });
      const store = mockStore(getInitialState(storeData));

      // act
      await store.dispatch(postComment(postPayload.id, postPayload.formData));

      // assert
      expect(store.getActions()).toEqual(expectedActions);
      expect(fetchMock.calls()).toHaveLength(1);
    });
  });
});
