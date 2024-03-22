import reducer from './fileUpload.reducers';

describe('STORES › REDUCERS › fileUpload', () => {
  const initialState = {
    data: {},
    loading: false,
    loaded: false,
  };

  const previousState = {
    data: { foo: 1, bar: 2 },
    loading: true,
    loaded: true,
  };

  it('should return the initial state', () => {
    // assert
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should update the state for request', () => {
    // arrange
    const action = {
      type: 'FILE_UPLOAD_GET_GUI_DATA_REQUEST',
      payload: ['abc', 'xyz'],
    };

    // assert
    expect(reducer(initialState, action)).toEqual({
      data: {},
      loading: true,
      loaded: false,
    });

    expect(reducer(previousState, action)).toEqual({
      data: { foo: 1, bar: 2 },
      loading: true,
      loaded: false,
    });
  });

  it('should update the state for success', () => {
    // arrange
    const action = {
      type: 'FILE_UPLOAD_GET_GUI_DATA_SUCCESS',
      payload: { abc: 1, xyz: 2 },
    };

    // assert
    expect(reducer(initialState, action)).toEqual({
      data: { abc: 1, xyz: 2 },
      loading: false,
      loaded: true,
    });

    expect(reducer(previousState, action)).toEqual({
      data: { abc: 1, xyz: 2 },
      loading: false,
      loaded: true,
    });
  });

  it('should update the state for failure', () => {
    // arrange
    const action = {
      type: 'FILE_UPLOAD_GET_GUI_DATA_FAILURE',
      payload: { message: 'error during fetch' },
    };

    // assert
    expect(reducer(initialState, action)).toEqual({
      data: {},
      loading: false,
      loaded: true,
    });

    expect(reducer(previousState, action)).toEqual({
      data: {},
      loading: false,
      loaded: true,
    });
  });
});
