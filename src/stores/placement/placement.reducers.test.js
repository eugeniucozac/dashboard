import reducer from './placement.reducers';
import config from 'config';
import merge from 'lodash/merge';

import * as constants from 'consts';

describe('STORES › REDUCER › placement', () => {
  const initialState = {
    list: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: config.ui.pagination.default,
      pageTotal: 0,
      query: '',
    },
    sort: {
      by: 'inceptionDate',
      type: 'date',
      direction: 'asc',
    },
    selected: null,
    calendarViewEdit: null,
    selectedMarkets: [],
    bulk: {
      type: '',
      items: [],
    },
    bulkItemsMarketingMarkets: {
      marketingMarkets: [],
    },
    loadingSelected: false,
    bulkItems: {
      layers: [],
      layerMarkets: [],
    },
    showBulkSelect: false,
    showBulkSelectMarketingMarkets: false,
  };

  const prevState = {
    ...initialState,
    list: {
      items: [
        { id: 1, statusId: 100, layers: [{ id: 1000 }] },
        { id: 2, statusId: 200 },
        { id: 3, statusId: 300 },
      ],
    },
    selected: {
      id: 1,
      statusId: 100,
      layers: [{ id: 1000 }, { id: 2000 }, { id: 3000 }, { id: 4000 }],
      policies: [{ id: 6000 }, { id: 7000 }, { id: 8000 }, { id: 9000 }],
    },
    selectedMarkets: [{ id: 10, __new__: true }],
    bulkItems: {
      layers: [19825],
      layerMarkets: [102528],
    },
    bulkItemsMarketingMarkets: {
      marketingMarkets: [34],
    },
    showBulkSelect: true,
    showBulkSelectMarketingMarkets: true,
  };

  const expectedPayloadPagination = {
    totalElements: 25,
    page: 2,
    size: 10,
    totalPages: 3,
    query: 'foobar',
    direction: 'DESC',
    orderBy: 'id',
  };

  const expectedPayloadUsers = [
    { id: 1, firstName: 'lorem', lastName: 'ipsum', emailId: 'a' },
    { id: 2, firstName: 'lorem', emailId: 'b' },
    { id: 3, firstName: 'lorem', lastName: 'ipsum', emailId: 'c' },
    { id: 4, lastName: 'ipsum' },
  ];

  const expectedPayloadSuccess = {
    id: 123,
    foo: 'bar',
    inceptionDate: '2019-12-31',
    clients: [
      { id: 1, name: 'lorem', type: 'client' },
      { id: 2, name: 'office name', parent: 'parent name', logoFileName: '', type: 'office' },
    ],
    insureds: [{ id: 1, name: 'lorem' }, { id: 2, name: 'ipsum' }, { id: 3 }, { id: 4 }],
    policies: [
      { id: 1, businessType: 'lorem' },
      { id: 13, businessType: 'lorem' },
      { id: 2, businessType: 'ipsum' },
      { id: 3, businessType: 'sit' },
      { id: 4, businessType: 'dolor' },
      { id: 45, businessType: 'dolor' },
      { id: 47, businessType: 'dolor' },
    ],
    users: expectedPayloadUsers,
  };

  const prevFailureState = {
    selected: {
      id: 123,
      policies: [{ id: 0, businessType: 'foo' }],
      comments: [
        { id: 1, msg: 'qwerty' },
        { id: 2, msg: 'azerty' },
      ],
    },
    selectedMarkets: [],
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('PLACEMENT_DESELECT', () => {
    it('should handle PLACEMENT_DESELECT', () => {
      // arrange
      const action = { type: 'PLACEMENT_DESELECT' };

      // assert
      expect(reducer(initialState, action)).toEqual(initialState);
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        selected: null,
        selectedMarkets: [],
      });
    });
  });

  describe('PLACEMENT_NTU_SUCCESS', () => {
    it('should handle PLACEMENT_NTU_SUCCESS', () => {
      // arrange
      const thisInitialState = merge({}, initialState);
      const thisPrevState = merge({}, prevState);

      const action = {
        type: 'PLACEMENT_NTU_SUCCESS',
        payload: {
          id: 1,
          statusId: 666,
        },
      };

      // assert
      expect(reducer(thisInitialState, action)).toEqual(thisInitialState);
      expect(reducer(thisPrevState, action)).toEqual({
        ...thisPrevState,
        list: {
          items: [
            { id: 1, statusId: 666, layers: [{ id: 1000 }] },
            { id: 2, statusId: 200 },
            { id: 3, statusId: 300 },
          ],
        },
        selected: {
          ...thisPrevState.selected,
          statusId: 666,
        },
      });
    });
  });

  describe('PLACEMENT_REMOVE_PATCH', () => {
    it('should handle REQUEST', () => {
      // arrange
      const action = { type: 'PLACEMENT_REMOVE_PATCH_REQUEST' };

      // assert
      expect(reducer(undefined, action)).toEqual(initialState);
    });

    it('should handle SUCCESS', () => {
      // arrange
      const payloadItems = [{ id: 'foo' }, { id: 'bar' }];
      const action = {
        type: 'PLACEMENT_REMOVE_PATCH_SUCCESS',
        payload: { id: 'bar' },
      };
      const prevState = {
        ...initialState,
        list: {
          ...initialState.list,
          items: payloadItems,
        },
      };
      const expectedState = {
        ...prevState,
        list: {
          ...prevState.list,
          items: [{ id: 'foo' }],
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      // arrange
      const payloadItems = [{ id: 'foo' }, { id: 'bar' }];
      const action = {
        type: 'PLACEMENT_REMOVE_PATCH_FAILURE',
        payload: 'error fetching enquiry',
      };
      const prevState = {
        ...initialState,
        list: {
          ...initialState.list,
          items: payloadItems,
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(prevState);
    });
  });

  describe('PLACEMENT_NEW_ENQUIRY_POST', () => {
    it('should handle SUCCESS', () => {
      // arrange
      const payloadItems = [{ id: 'foo' }, { id: 'bar' }];
      const action = {
        type: 'PLACEMENT_NEW_ENQUIRY_POST_SUCCESS',
        payload: [...payloadItems],
      };
      const prevState = {
        ...initialState,
      };
      const expectedState = {
        ...prevState,
        list: {
          ...prevState.list,
          items: [{ id: 'foo', clients: [], __new__: true }],
          itemsTotal: 1,
        },
        selected: { id: 'foo', clients: [], __new__: true },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });
  });

  describe('PLACEMENT_EDIT_CONFIG', () => {
    it('should handle REQUEST', () => {
      // arrange
      const action = { type: 'PLACEMENT_EDIT_CONFIG_REQUEST' };

      // assert
      expect(reducer(undefined, action)).toEqual(initialState);
    });

    it('should handle SUCCESS', () => {
      // arrange
      const payload = { id: 123, config: '{"order":100}' };
      const action = { type: 'PLACEMENT_EDIT_CONFIG_SUCCESS', payload: payload };
      const prevState = {
        ...initialState,
        selected: {
          id: 123,
          foo: 'bar',
          inceptionDate: '2019-12-31',
          clients: [
            { id: 1, name: 'lorem' },
            { id: 2, name: 'ipsum', offices: [{ id: 666, name: 'office name', parent: { name: 'parent name' } }] },
            { id: 1 },
            { id: 4 },
          ],
          insureds: [{ id: 1, name: 'lorem' }, { id: 2, name: 'ipsum' }, { id: 3 }, { id: 4 }],
          policies: [
            { id: 1, businessType: 'lorem' },
            { id: 13, businessType: 'lorem' },
            { id: 2, businessType: 'ipsum' },
            { id: 3, businessType: 'sit' },
            { id: 4, businessType: 'dolor' },
            { id: 45, businessType: 'dolor' },
            { id: 47, businessType: 'dolor' },
          ],
          users: [
            { id: 1, firstName: 'lorem', lastName: 'ipsum', emailId: 'a' },
            { id: 2, firstName: 'lorem', emailId: 'b' },
            { id: 3, firstName: 'lorem', lastName: 'ipsum', emailId: 'c' },
            { id: 4, lastName: 'ipsum' },
          ],
        },
      };
      const expectedState = {
        ...prevState,
        selected: {
          ...prevState.selected,
          config: {
            order: 100,
          },
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      // arrange
      const action = { type: 'PLACEMENT_EDIT_CONFIG_FAILURE', payload: 'error fetching enquiry' };
      const prevState = {
        ...initialState,
        selected: {
          id: 123,
          foo: 'bar',
          inceptionDate: '2019-12-31',
          clients: [
            { id: 1, name: 'lorem' },
            { id: 2, name: 'ipsum', offices: [{ id: 666, name: 'office name', parent: { name: 'parent name' } }] },
            { id: 1 },
            { id: 4 },
          ],
          insureds: [{ id: 1, name: 'lorem' }, { id: 2, name: 'ipsum' }, { id: 3 }, { id: 4 }],
          policies: [
            { id: 1, businessType: 'lorem' },
            { id: 13, businessType: 'lorem' },
            { id: 2, businessType: 'ipsum' },
            { id: 3, businessType: 'sit' },
            { id: 4, businessType: 'dolor' },
            { id: 45, businessType: 'dolor' },
            { id: 47, businessType: 'dolor' },
          ],
          users: [
            { id: 1, firstName: 'lorem', lastName: 'ipsum', emailId: 'a' },
            { id: 2, firstName: 'lorem', emailId: 'b' },
            { id: 3, firstName: 'lorem', lastName: 'ipsum', emailId: 'c' },
            { id: 4, lastName: 'ipsum' },
          ],
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(prevState);
    });
  });

  describe('PLACEMENT_LIST_GET', () => {
    it('should handle SUCCESS', () => {
      // arrange
      const action = {
        type: 'PLACEMENT_LIST_GET_SUCCESS',
        payload: {
          items: [
            {
              id: 123,
              foo: 'bar',
              inceptionDate: '2019-12-31',
              clients: [
                { id: 1, name: 'lorem' },
                { id: 2, name: 'ipsum', offices: [{ id: 666, name: 'office name', parent: { name: 'parent name' } }] },
                { id: 1 },
                { id: 4 },
              ],
              insureds: [{ id: 1, name: 'lorem' }, { id: 2, name: 'ipsum' }, { id: 3 }, { id: 4 }],
              policies: [
                { id: 1, businessType: 'lorem' },
                { id: 13, businessType: 'lorem' },
                { id: 2, businessType: 'ipsum' },
                { id: 3, businessType: 'sit' },
                { id: 4, businessType: 'dolor' },
                { id: 45, businessType: 'dolor' },
                { id: 47, businessType: 'dolor' },
              ],
              users: [
                { id: 1, firstName: 'lorem', lastName: 'ipsum', emailId: 'a' },
                { id: 2, firstName: 'lorem', emailId: 'b' },
                { id: 3, firstName: 'lorem', lastName: 'ipsum', emailId: 'c' },
                { id: 4, lastName: 'ipsum' },
              ],
            },
          ],
          pagination: expectedPayloadPagination,
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        list: {
          ...initialState.list,
          items: [expectedPayloadSuccess],
          itemsTotal: expectedPayloadPagination.totalElements,
          page: expectedPayloadPagination.page,
          pageSize: expectedPayloadPagination.size,
          pageTotal: expectedPayloadPagination.totalPages,
          query: expectedPayloadPagination.query,
        },
        sort: {
          direction: 'desc',
          by: expectedPayloadPagination.orderBy,
        },
      });
    });

    it('should handle FAILURE', () => {
      // arrange
      const action = { type: 'PLACEMENT_LIST_GET_FAILURE', payload: 'error fetching placement' };

      // assert
      expect(reducer(prevFailureState, action)).toEqual({
        ...prevFailureState,
        selected: prevFailureState.selected,
      });
    });
  });

  describe('PLACEMENT_DETAILS_GET', () => {
    it('should handle REQUEST', () => {
      // arrange
      const action = { type: 'PLACEMENT_DETAILS_GET_REQUEST' };

      // assert
      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        loadingSelected: true,
      });
    });

    it('should handle SUCCESS', () => {
      // arrange
      const action = {
        type: 'PLACEMENT_DETAILS_GET_SUCCESS',
        payload: {
          id: 123,
          foo: 'bar',
          inceptionDate: '2019-12-31',
          clients: [
            { id: 1, name: 'lorem' },
            { id: 2, name: 'ipsum', offices: [{ id: 666, name: 'office name', parent: { name: 'parent name' } }] },
            { id: 1 },
            { id: 4 },
          ],
          insureds: [{ id: 1, name: 'lorem' }, { id: 2, name: 'ipsum' }, { id: 3 }, { id: 4 }],
          policies: [
            { id: 1, businessType: 'lorem' },
            { id: 13, businessType: 'lorem' },
            { id: 2, businessType: 'ipsum' },
            { id: 3, businessType: 'sit' },
            { id: 4, businessType: 'dolor' },
            { id: 45, businessType: 'dolor' },
            { id: 47, businessType: 'dolor' },
          ],
          users: [
            { id: 1, firstName: 'lorem', lastName: 'ipsum', emailId: 'a' },
            { id: 2, firstName: 'lorem', emailId: 'b' },
            { id: 3, firstName: 'lorem', lastName: 'ipsum', emailId: 'c' },
            { id: 4, lastName: 'ipsum' },
          ],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        selected: expectedPayloadSuccess,
        loadingSelected: false,
      });
    });

    it('should handle FAILURE', () => {
      // arrange
      const action = { type: 'PLACEMENT_DETAILS_GET_FAILURE', payload: 'error fetching placement' };

      // assert
      expect(reducer(prevFailureState, action)).toEqual({
        ...prevFailureState,
        selected: null,
        loadingSelected: false,
      });
    });
  });

  describe('PLACEMENT_POLICIES_DELETE', () => {
    it('should handle PLACEMENT_POLICIES_DELETE', () => {
      // arrange
      const thisInitialState = merge({}, initialState);
      const thisPrevState = merge({}, prevState);

      const action = {
        type: 'PLACEMENT_POLICIES_DELETE',
        payload: [7000, 8000, 111],
      };

      // assert
      expect(reducer(thisInitialState, action)).toEqual(thisInitialState);
      expect(reducer(thisPrevState, action)).toEqual({
        ...thisPrevState,
        selected: {
          ...thisPrevState.selected,
          policies: [{ id: 6000 }, { id: 9000 }],
        },
      });
    });
  });

  describe('PLACEMENT_LAYERS_DELETE', () => {
    it('should handle PLACEMENT_LAYERS_DELETE', () => {
      // arrange
      const thisInitialState = merge({}, initialState);
      const thisPrevState = merge({}, prevState);

      const action = {
        type: 'PLACEMENT_LAYERS_DELETE',
        payload: [2000, 3000, 999],
      };

      // assert
      expect(reducer(thisInitialState, action)).toEqual(thisInitialState);
      expect(reducer(thisPrevState, action)).toEqual({
        ...thisPrevState,
        selected: {
          ...thisPrevState.selected,
          layers: [{ id: 1000 }, { id: 4000 }],
        },
      });
    });
  });

  describe('PLACEMENT_LAYER_POST_SUCCESS', () => {
    it('should handle SUCCESS', () => {
      // arrange
      const thisInitialState = { ...initialState, selected: { id: 1 } };
      const thisPrevState = { ...prevState };

      const payload = {
        placementId: 1,
        departmentId: 20,
        businessTypeId: 350,
        isoCurrencyCode: 'USD',
        notes: '',
        amount: null,
        excess: null,
      };

      const action = { type: 'PLACEMENT_LAYER_POST_SUCCESS', payload };

      // assert
      expect(reducer(thisInitialState, action)).toEqual({
        ...thisInitialState,
        selected: {
          ...thisInitialState.selected,
          layers: [payload],
        },
      });

      expect(reducer(thisPrevState, action)).toEqual({
        ...thisPrevState,
        list: {
          ...thisPrevState.list,
          items: [
            { id: 1, statusId: 100, layers: [{ id: 1000 }, payload] },
            { id: 2, statusId: 200 },
            { id: 3, statusId: 300 },
          ],
        },
        selected: {
          ...thisPrevState.selected,
          layers: [{ id: 1000 }, { id: 2000 }, { id: 3000 }, { id: 4000 }, payload],
        },
      });
    });
  });

  describe('PLACEMENT_MARKETS_LIST_GET', () => {
    it("should handle SUCCESS but placement ID doesn't match", () => {
      // arrange
      const action = {
        type: 'PLACEMENT_MARKETS_LIST_GET_SUCCESS',
        payload: {
          placementId: 2,
          placementMarkets: [{ id: 30 }, { id: 40 }],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual(initialState);
      expect(reducer(prevState, action)).toEqual({ ...prevState, selectedMarkets: [] });
    });

    it('should handle SUCCESS with placement ID match', () => {
      // arrange
      const marketInitialState = {
        ...initialState,
        selected: {
          id: 1,
        },
      };

      const action = {
        type: 'PLACEMENT_MARKETS_LIST_GET_SUCCESS',
        payload: {
          placementId: 1,
          placementMarkets: [{ id: 30 }, { id: 40 }],
        },
      };

      // assert
      expect(reducer(marketInitialState, action)).toEqual({
        ...marketInitialState,
        selectedMarkets: [{ id: 30 }, { id: 40 }],
      });

      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        selectedMarkets: [{ id: 30 }, { id: 40 }],
      });
    });
  });

  describe('PLACEMENT_MARKET_ADD_POST', () => {
    it('should handle SUCCESS', () => {
      // arrange
      const marketInitialState = {
        ...initialState,
        selected: { id: 1 },
      };

      const action = { type: 'PLACEMENT_MARKET_ADD_POST_SUCCESS', payload: { id: 20 } };

      // assert
      expect(reducer(marketInitialState, action)).toEqual({
        ...marketInitialState,
        selectedMarkets: [{ id: 20, __new__: true }],
      });

      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        selectedMarkets: [{ id: 10 }, { id: 20, __new__: true }],
      });

      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        selectedMarkets: [{ id: 10 }, { id: 20, __new__: true }],
      });
    });
  });

  describe('PLACEMENT_MARKET_EDIT', () => {
    it("should handle SUCCESS but placement ID doesn't match", () => {
      // arrange
      const action = { type: 'PLACEMENT_MARKET_EDIT_SUCCESS', payload: { id: 10, placement: { id: 2 }, notes: 'foo' } };

      // assert
      expect(reducer(initialState, action)).toEqual(initialState);
      expect(reducer(prevState, action)).toEqual(prevState);
    });

    it('should handle SUCCESS with placement ID match', () => {
      // arrange
      const marketInitialState = {
        ...initialState,
        selected: { id: 1 },
      };

      const action = { type: 'PLACEMENT_MARKET_EDIT_SUCCESS', payload: { id: 10, placement: { id: 1 }, notes: 'foo' } };

      // assert
      // doesn't find a market match to update
      expect(reducer(marketInitialState, action)).toEqual(marketInitialState);

      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        selectedMarkets: [{ id: 10, placement: { id: 1 }, notes: 'foo' }],
      });
    });
  });

  describe('PLACEMENT_MARKET_DELETE', () => {
    it('should handle SUCCESS', () => {
      // arrange
      const marketInitialState = {
        ...initialState,
        selected: {
          layers: [],
        },
      };
      const prevInitialState = {
        ...prevState,
        selectedMarkets: [{ id: 10 }, { id: 20 }, { id: 30 }],
        selected: {
          layers: [
            {
              markets: [
                {
                  id: 10,
                },
              ],
            },
          ],
        },
      };

      const action = { type: 'PLACEMENT_MARKET_DELETE_SUCCESS', payload: 20 };

      // assert
      expect(reducer(initialState, action)).toEqual(marketInitialState);

      expect(reducer(prevInitialState, action)).toEqual({
        ...prevInitialState,
        selectedMarkets: [{ id: 10 }, { id: 30 }],
      });
    });
  });

  describe('PLACEMENT_BULK_CLEAR_ALL', () => {
    it('should handle PLACEMENT_BULK_CLEAR_ALL', () => {
      // arrange
      const action = { type: 'PLACEMENT_BULK_CLEAR_ALL' };

      // assert
      expect(reducer(initialState, action)).toEqual(initialState);
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        bulkItems: {
          layers: [],
          layerMarkets: [],
        },
      });
    });
  });

  describe('PLACEMENT_BULK_TOGGLE_LAYER', () => {
    it('should handle PLACEMENT_BULK_TOGGLE_LAYER when user selecting a layer', () => {
      // arrange
      const action = {
        type: 'PLACEMENT_BULK_TOGGLE_LAYER',
        payload: { selected: constants.SELECTED, layerId: 41, marketIdList: [80, 69] },
      };

      const prevInitialState = {
        ...prevState,
      };
      // assert
      expect(reducer(prevInitialState, action)).toEqual({
        ...prevInitialState,
        bulkItems: {
          layers: [19825, 41],
          layerMarkets: [102528, 80, 69],
        },
      });
    });
    it('should handle PLACEMENT_BULK_TOGGLE_LAYER when user deselecting a layer', () => {
      // arrange
      const action = {
        type: 'PLACEMENT_BULK_TOGGLE_LAYER',
        payload: { selected: constants.DESELECTED, layerId: 41, marketIdList: [80, 69] },
      };

      const prevInitialState = {
        ...initialState,
        list: {
          items: [
            { id: 1, statusId: 100, layers: [{ id: 1000 }] },
            { id: 2, statusId: 200 },
            { id: 3, statusId: 300 },
          ],
        },
        selected: {
          id: 1,
          statusId: 100,
          layers: [{ id: 1000 }, { id: 2000 }, { id: 3000 }, { id: 4000 }],
          policies: [{ id: 6000 }, { id: 7000 }, { id: 8000 }, { id: 9000 }],
        },
        selectedMarkets: [{ id: 10, __new__: true }],
        bulkItems: {
          layers: [41, 19825],
          layerMarkets: [80, 69, 102528],
        },
      };
      // assert
      expect(reducer(prevInitialState, action)).toEqual({
        ...prevInitialState,
        bulkItems: {
          layers: [19825],
          layerMarkets: [102528],
        },
      });
    });
  });

  describe('PLACEMENT_BULK_TOGGLE_MARKET', () => {
    it('should handle PLACEMENT_BULK_TOGGLE_MARKET select', () => {
      // arrange
      const action = {
        type: 'PLACEMENT_BULK_TOGGLE_MARKET',
        payload: { layerId: 41, marketId: 80 },
      };

      const prevInitialState = {
        ...prevState,
      };
      // assert
      expect(reducer(prevInitialState, action)).toEqual({
        ...prevInitialState,
        bulkItems: {
          layers: [19825],
          layerMarkets: [102528, 80],
        },
      });
    });
    it('should handle PLACEMENT_BULK_TOGGLE_MARKET deselect', () => {
      // arrange
      const action = {
        type: 'PLACEMENT_BULK_TOGGLE_MARKET',
        payload: { layerId: 19825, marketId: 102528 },
      };

      const prevInitialState = {
        ...prevState,
      };
      // assert
      expect(reducer(prevInitialState, action)).toEqual({
        ...prevInitialState,
        bulkItems: {
          layers: [],
          layerMarkets: [],
        },
      });
    });
  });

  describe('BULK_SELECT_TOGGLE', () => {
    it('should handle BULK_SELECT_TOGGLE', () => {
      // arrange
      const action = {
        type: 'BULK_SELECT_TOGGLE',
      };

      // assert
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        showBulkSelect: false,
      });
    });
  });
  describe('BULK_SELECT_TOGGLE_MARKETING_MARKETS', () => {
    it('should handle BULK_SELECT_TOGGLE_MARKETING_MARKETS', () => {
      // arrange
      const action = {
        type: 'BULK_SELECT_TOGGLE_MARKETING_MARKETS',
      };

      // assert
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        showBulkSelectMarketingMarkets: false,
      });
    });
  });
  describe('PLACEMENT_BULK_TOGGLE_MARKETING_MARKETS', () => {
    it('should handle PLACEMENT_BULK_TOGGLE_MARKETING_MARKETS', () => {
      // arrange
      const action = {
        type: 'PLACEMENT_BULK_TOGGLE_MARKETING_MARKETS',
        payload: { selected: constants.SELECTED, marketIdList: 80 },
      };

      const prevInitialState = {
        ...prevState,
      };
      // assert
      expect(reducer(prevInitialState, action)).toEqual({
        ...prevInitialState,
        bulkItemsMarketingMarkets: {
          marketingMarkets: [34, 80],
        },
      });
    });
  });
  it('should handle PLACEMENT_BULK_CLEAR_ALL_MARKETING_MARKETS deselect', () => {
    // arrange
    const action = {
      type: 'PLACEMENT_BULK_CLEAR_ALL_MARKETING_MARKETS',
    };

    const prevInitialState = {
      ...prevState,
    };
    // assert
    expect(reducer(prevInitialState, action)).toEqual({
      ...prevInitialState,
      bulkItemsMarketingMarkets: {
        marketingMarkets: [],
      },
    });
  });
});
