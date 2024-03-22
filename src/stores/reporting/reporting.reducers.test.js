import reducer from './reporting.reducers';
import config from 'config';
import merge from 'lodash/merge';

import * as constants from 'consts';
import * as utils from 'utils';

describe('STORES › REDUCER › reporting', () => {
  const initialState = {
    reportGroupList: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: config.ui.pagination.default,
      pageTotal: 0,
      sortBy: 'name',
      sortDirection: 'asc',
    },
    selected: null,
    reportList: {
      items: [],
      reportingGroupUser: [],
      selectedGroup: {},
    },
    report: {},
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle REPORTING_GROUP_LIST_GET_SUCCESS', () => {
    // arrange
    const action = {
      type: 'REPORTING_GROUP_LIST_GET_SUCCESS',
      payload: {
        content: [
          {
            id: 1,
            count: 4,
            description: 'The quick brown fox jumps over the lazy dog!!',
            lastUpdateDate: '2021-05-13',
            name: 'Hiscox',
          },
          {
            id: 2,
            count: 3,
            description: 'The quick brown fox jumps over the lazy dog!!!',
            lastUpdateDate: '2021-05-14',
            name: 'Price Forbes Brokers',
          },
          {
            id: 3,
            count: 5,
            description: 'The quick brown fox jumps over the lazy dog!!!!',
            lastUpdateDate: '2021-05-15',
            name: 'BAS',
          },
        ],
        pagination: {
          direction: 'desc',
          orderBy: 'lastUpdateDate',
          page: 1,
          query: '',
          size: 10,
          totalElements: 3,
          totalPages: 1,
        },
      },
    };

    const expectedState = {
      ...initialState,
      reportGroupList: {
        ...initialState.reportGroupList,
        items: action.payload.content,
        ...utils.api.pagination(action.payload),
      },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  describe('REPORTING_GROUP_POST_SUCCESS', () => {
    it('should handle REPORTING_GROUP_POST_SUCCESS', () => {
      // arrange
      const payloadItems = {
        id: 4,
        count: 5,
        description: 'The quick brown fox jumps over the lazy dog!!!!',
        lastUpdateDate: '2021-05-15',
        name: 'BAS',
      };
      const action = {
        type: 'REPORTING_GROUP_POST_SUCCESS',
        payload: payloadItems,
      };
      const prevState = {
        ...initialState,
      };
      const expectedState = {
        ...prevState,
        reportGroupList: {
          ...prevState.reportGroupList,
          items: [
            {
              id: 4,
              count: 5,
              description: 'The quick brown fox jumps over the lazy dog!!!!',
              lastUpdateDate: '2021-05-15',
              name: 'BAS',
            },
          ],
          itemsTotal: 1,
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });
  });
});
