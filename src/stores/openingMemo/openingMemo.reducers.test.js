import reducer from './openingMemo.reducers';

describe('STORES › REDUCERS › openingMemo', () => {
  const initialState = {
    list: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      sortBy: 'id',
      sortType: 'text',
      sortDirection: 'desc',
      status: '',
    },
    selected: {},
    dirty: false,
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle OPENING_MEMO_GET_SUCCESS', () => {
    // arrange
    const expectedPayload = {
      foo: 1,
    };
    const action = {
      type: 'OPENING_MEMO_GET_SUCCESS',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      selected: expectedPayload,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle OPENING_MEMO_PUT_SUCCESS', () => {
    // arrange
    const payload = {
      foo: 1,
    };

    const action = {
      type: 'OPENING_MEMO_PUT_SUCCESS',
      payload,
    };

    const previousState = {
      ...initialState,
      selected: {
        foo: 'abc',
        bar: 'def',
      },
    };

    const expectedStateInitial = {
      ...initialState,
      selected: {
        ...payload,
      },
    };

    const expectedStatePrevious = {
      ...previousState,
      selected: {
        ...payload,
      },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedStateInitial);
    expect(reducer(previousState, action)).toEqual(expectedStatePrevious);
  });

  it('should handle OPENING_MEMO_PATCH_SUCCESS', () => {
    // arrange
    const payload = {
      foo: 1,
    };

    const action = {
      type: 'OPENING_MEMO_PATCH_SUCCESS',
      payload,
    };

    const previousState = {
      ...initialState,
      selected: {
        foo: 'abc',
        bar: 'def',
      },
    };

    const expectedStateInitial = {
      ...initialState,
      selected: {
        ...payload,
      },
    };

    const expectedStatePrevious = {
      ...previousState,
      selected: {
        ...payload,
      },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedStateInitial);
    expect(reducer(previousState, action)).toEqual(expectedStatePrevious);
  });

  it('should handle OPENING_MEMO_POST_SUCCESS', () => {
    // arrange
    const expectedPayload = {
      foo: 1,
    };
    const action = {
      type: 'OPENING_MEMO_POST_SUCCESS',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      selected: expectedPayload,
      postSuccess: true,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle OPENING_MEMO_PLACEMENT_LIST_GET_SUCCESS', () => {
    // arrange
    const action = {
      type: 'OPENING_MEMO_PLACEMENT_LIST_GET_SUCCESS',
      payload: {
        content: [{ foo: 'bar' }],
        pagination: { page: 1 },
      },
    };
    const expectedState = {
      ...initialState,
      list: {
        ...initialState.list,
        query: '',
        items: [{ foo: 'bar' }],
      },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle OPENING_MEMO_UPDATE_SUCCESS', () => {
    // arrange
    const expectedPayload = {
      prePlacing: {
        accountHandler: 'no',
      },
    };
    const action = {
      type: 'OPENING_MEMO_UPDATE_SUCCESS',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      selected: { ...initialState.selected, ...expectedPayload },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle RESET_OPENING_MEMO', () => {
    // arrange
    const action = { type: 'RESET_OPENING_MEMO' };
    const expectedState = {
      ...initialState,
      selected: {},
      dirty: false,
    };

    // assert
    expect(
      reducer(
        {
          ...initialState,
          selected: { foo: 1 },
          dirty: true,
        },
        action
      )
    ).toEqual(expectedState);
  });

  it('should handle RESET_OPENING_MEMO_LIST', () => {
    // arrange
    const action = { type: 'RESET_OPENING_MEMO_LIST' };

    // assert
    expect(
      reducer(
        {
          ...initialState,
          list: { items: [{ foo: 1 }] },
        },
        action
      )
    ).toEqual(initialState);
  });

  it('should handle RESET_OPENING_MEMO_POST_SUCCESS', () => {
    // arrange
    const action = { type: 'RESET_OPENING_MEMO_POST_SUCCESS' };
    const expectedState = {
      ...initialState,
      selected: {},
      postSuccess: false,
    };

    // assert
    expect(
      reducer(
        {
          ...initialState,
          selected: { foo: 1 },
          postSuccess: true,
        },
        action
      )
    ).toEqual(expectedState);
  });

  it('should handle UPDATE_DIRTY_OPENING_MEMO', () => {
    // arrange
    const action = { type: 'UPDATE_DIRTY_OPENING_MEMO', payload: true };
    const expectedState = {
      ...initialState,
      dirty: true,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
