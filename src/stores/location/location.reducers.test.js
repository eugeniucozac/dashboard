import reducer from './location.reducers';

describe('STORES › REDUCERS › location', () => {
  const initialState = {
    uploading: false,
    geocoding: {
      status: null,
      result: null,
      attempts: 0,
      completed: 0,
      total: 0,
    },
    givenLocations: [],
    givenLocationsHeaders: [],
    autoMatch: false,
    headerMap: [
      { key: 'location', value: '' },
      { key: 'streetAddress', value: '' },
      { key: 'city', value: '' },
      { key: 'zip', value: '' },
      { key: 'county', value: '' },
      { key: 'state', value: '' },
      { key: 'country', value: '' },
      { key: 'occupancy', value: '' },
      { key: 'hasSprinklers', value: '' },
      { key: 'hasAlarm', value: '' },
      { key: 'hasBackupPower', value: '' },
      { key: 'contents', value: '' },
      { key: 'businessInterruption', value: '' },
      { key: 'propertyValues', value: '' },
      { key: 'totalInsurableValues', value: '' },
      { key: 'latitude', value: '' },
      { key: 'longitude', value: '' },
    ],
    dollarValues: ['contents', 'businessInterruption', 'propertyValues', 'totalInsurableValues'],
    locationsUploaded: [],
    locationGroups: [],
  };

  const previousState = {
    uploading: false,
    geocoding: {
      status: true,
      result: 'success',
      attempts: 5,
      completed: 1,
      total: 2,
    },
    givenLocations: [1, 2, 3, 4],
    givenLocationsHeaders: [{ a: 1 }, { b: 2 }],
    autoMatch: true,
    headerMap: [{ foo: 'bar' }, { bar: 'foo' }],
    locationsUploaded: ['a', 'b', 'c'],
    locationGroups: ['aaa', 'bbb', 'ccc'],
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle LOCATION_RESET', () => {
    // arrange
    const action = {
      type: 'LOCATION_RESET',
    };

    // assert
    expect(reducer(initialState, action)).toEqual(initialState);
    expect(reducer(previousState, action)).toEqual(initialState);
  });

  it('should handle LOCATION_SET_UPLOAD_WIZARD_GIVEN_LOCATIONS', () => {
    // arrange
    const action = {
      type: 'LOCATION_SET_UPLOAD_WIZARD_GIVEN_LOCATIONS',
      payload: {
        locations: [1, 2, 3],
        headers: ['a', 'b', 'c'],
      },
    };

    const expectedInitialState = {
      ...initialState,
      givenLocations: [1, 2, 3],
      givenLocationsHeaders: ['a', 'b', 'c'],
    };

    const expectedPreviousState = {
      ...previousState,
      givenLocations: [1, 2, 3],
      givenLocationsHeaders: ['a', 'b', 'c'],
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedInitialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });

  it('should handle LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP', () => {
    // arrange
    const action = {
      type: 'LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP',
      payload: [{ foo: 'bar' }],
    };

    const expectedInitialState = {
      ...initialState,
      headerMap: [{ foo: 'bar' }],
      autoMatch: true,
    };

    const expectedPreviousState = {
      ...previousState,
      headerMap: [{ foo: 'bar' }],
      autoMatch: true,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedInitialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });

  it('should handle LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP_RESET', () => {
    // arrange
    const action = {
      type: 'LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP_RESET',
    };

    const expectedPreviousState = {
      ...previousState,
      headerMap: initialState.headerMap,
      autoMatch: initialState.autoMatch,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(initialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });

  it('should handle LOCATION_SET_UPLOAD_WIZARD_LOCATIONS', () => {
    // arrange
    const action = {
      type: 'LOCATION_SET_UPLOAD_WIZARD_LOCATIONS',
      payload: [1, 2, 3, 4, 5, 6],
    };

    const expectedInitialState = {
      ...initialState,
      locationsUploaded: [1, 2, 3, 4, 5, 6],
    };

    const expectedPreviousState = {
      ...previousState,
      locationsUploaded: [1, 2, 3, 4, 5, 6],
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedInitialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });

  it('should handle LOCATION_SET_GROUPS', () => {
    // arrange
    const action = {
      type: 'LOCATION_SET_GROUPS',
      payload: {
        groups: [1, 2, 3, 4, 5, 6],
      },
    };

    const expectedInitialState = {
      ...initialState,
      locationGroups: [1, 2, 3, 4, 5, 6],
    };

    const expectedPreviousState = {
      ...previousState,
      locationGroups: [1, 2, 3, 4, 5, 6],
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedInitialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });

  it('should handle LOCATION_GET_PLACEMENT_GROUPS_FAILURE', () => {
    // arrange
    const action = {
      type: 'LOCATION_GET_PLACEMENT_GROUPS_FAILURE',
      payload: 'error',
    };

    const expectedPreviousState = {
      ...previousState,
      geocoding: {
        ...previousState.geocoding,
        status: initialState.geocoding.status,
        result: initialState.geocoding.result,
        attempts: initialState.geocoding.attempts,
        completed: initialState.geocoding.completed,
        total: initialState.geocoding.total,
      },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(initialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });

  it('should handle LOCATION_POST_NEW_GROUP', () => {
    // arrange
    const action = {
      type: 'LOCATION_POST_NEW_GROUP',
    };

    const expectedInitialState = {
      ...initialState,
      uploading: true,
    };

    const expectedPreviousState = {
      ...previousState,
      uploading: true,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedInitialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });

  it('should handle LOCATION_POST_NEW_GROUP_SUCCESS', () => {
    // arrange
    const action = {
      type: 'LOCATION_POST_NEW_GROUP_SUCCESS',
    };

    const expectedInitialState = {
      ...initialState,
      uploading: false,
    };

    const expectedPreviousState = {
      ...previousState,
      uploading: false,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedInitialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });

  it('should handle LOCATION_POST_NEW_GROUP_FAILURE', () => {
    // arrange
    const action = {
      type: 'LOCATION_POST_NEW_GROUP_FAILURE',
    };

    const expectedInitialState = {
      ...initialState,
      uploading: false,
    };

    const expectedPreviousState = {
      ...previousState,
      uploading: false,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedInitialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });

  it('should handle LOCATION_GEOCODING_UPDATE', () => {
    // arrange
    const action = {
      type: 'LOCATION_GEOCODING_UPDATE',
      payload: {
        status: 1,
        result: 'yay',
        attempts: 1000,
        completed: 100,
        total: 300,
      },
    };

    const expectedInitialState = {
      ...initialState,
      geocoding: {
        ...previousState.geocoding,
        status: 1,
        result: 'yay',
        attempts: 1000,
        completed: 100,
        total: 300,
      },
    };

    const expectedPreviousState = {
      ...previousState,
      geocoding: {
        ...previousState.geocoding,
        status: 1,
        result: 'yay',
        attempts: 1000,
        completed: 100,
        total: 300,
      },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedInitialState);
    expect(reducer(previousState, action)).toEqual(expectedPreviousState);
  });
});
