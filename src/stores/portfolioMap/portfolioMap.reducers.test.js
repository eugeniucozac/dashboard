import reducer from './portfolioMap.reducers';

describe('STORES › REDUCERS › portfolioMap', () => {
  const initialState = {
    tiv: {
      filteredDepartments: [],
      placementIds: null,
      level: 'state',
      levelOverride: null,
      levels: {
        country: [],
        state: [],
        county: [],
        zip: [],
        address: [],
      },
      loading: false,
    },
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle PORTFOLIO_MAP_RESET', () => {
    // arrange
    const action = {
      type: 'PORTFOLIO_MAP_RESET',
    };
    const previousState = {
      tiv: {
        ...initialState.tiv,
        level: 'state',
      },
    };

    // assert
    expect(reducer(previousState, action)).toEqual(initialState);
  });

  it('should handle PORTFOLIO_MAP_UPDATE_LEVEL', () => {
    // arrange
    const action = {
      type: 'PORTFOLIO_MAP_UPDATE_LEVEL',
      payload: {
        level: 'zip',
      },
    };
    const expectedState = {
      tiv: {
        ...initialState.tiv,
        level: action.payload.level,
      },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle PORTFOLIO_MAP_UPDATE_LEVEL_OVERRIDE', () => {
    // arrange
    const action = {
      type: 'PORTFOLIO_MAP_UPDATE_LEVEL_OVERRIDE',
      payload: {
        levelOverride: 'zip',
      },
    };
    const expectedState = {
      tiv: {
        ...initialState.tiv,
        levelOverride: action.payload.levelOverride,
      },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle PORTFOLIO_MAP_RESET_LOCATIONS', () => {
    // arrange
    const action = {
      type: 'PORTFOLIO_MAP_RESET_LOCATIONS',
    };
    const prevState = {
      tiv: {
        ...initialState.tiv,
        level: 'zip',
        levels: {
          country: [{ id: 1 }],
          state: [{ id: 2 }],
          county: [{ id: 3 }],
          zip: [{ id: 4 }],
          address: [{ id: 5 }],
        },
        placementIds: [2],
      },
    };
    const expectedState = {
      tiv: {
        ...initialState.tiv,
        level: 'zip',
      },
    };

    // assert
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

  it('should handle PORTFOLIO_MAP_RESET_LEVEL_OVERRIDE', () => {
    // arrange
    const action = {
      type: 'PORTFOLIO_MAP_RESET_LEVEL_OVERRIDE',
    };
    const prevState = {
      tiv: {
        ...initialState.tiv,
        level: 'zip',
        levelOverride: 'zip',
        levels: {
          country: [{ id: 1 }],
          state: [{ id: 2 }],
          county: [{ id: 3 }],
          zip: [{ id: 4 }],
          address: [{ id: 5 }],
        },
        placementIds: [2],
      },
    };
    const expectedState = {
      tiv: {
        ...initialState.tiv,
        level: 'zip',
        levelOverride: null,
        levels: {
          country: [{ id: 1 }],
          state: [{ id: 2 }],
          county: [{ id: 3 }],
          zip: [{ id: 4 }],
          address: [{ id: 5 }],
        },
        placementIds: [2],
      },
    };

    // assert
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

  it('should handle PORTFOLIO_MAP_RESET_LEVEL', () => {
    // arrange
    const action = {
      type: 'PORTFOLIO_MAP_RESET_LEVEL',
    };
    const prevState = {
      tiv: {
        ...initialState.tiv,
        level: 'zip',
        levels: {
          country: [{ id: 1 }],
          state: [{ id: 2 }],
          county: [{ id: 3 }],
          zip: [{ id: 4 }],
          address: [{ id: 5 }],
        },
        placementIds: [2],
      },
    };
    const expectedState = {
      tiv: {
        ...initialState.tiv,
        levels: {
          country: [{ id: 1 }],
          state: [{ id: 2 }],
          county: [{ id: 3 }],
          zip: [{ id: 4 }],
          address: [{ id: 5 }],
        },
        placementIds: [2],
        level: 'state',
      },
    };

    // assert
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

  describe('get', () => {
    it('should handle REQUEST', () => {
      // arrange
      const action = {
        type: 'PORTFOLIO_MAP_GET_REQUEST',
      };
      const expectedState = {
        ...initialState,
        tiv: {
          ...initialState.tiv,
          loading: true,
        },
      };

      // assert
      expect(reducer(undefined, action)).toEqual(expectedState);
    });

    it('should handle SUCCESS', () => {
      // arrange
      const action = {
        type: 'PORTFOLIO_MAP_GET_SUCCESS',
        payload: {
          placementIds: ['1', '2', '3'],
          level: 'state',
          data: [{ foo: 1 }],
        },
      };
      const expectedState = {
        ...initialState,
        tiv: {
          ...initialState.tiv,
          placementIds: ['1', '2', '3'],
          level: 'state',
          levels: {
            ...initialState.tiv.levels,
            state: [{ foo: 1 }],
          },
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      // arrange
      const action = {
        type: 'PORTFOLIO_MAP_GET_FAILURE',
        payload: 'error fetching location summary',
      };
      const prevState = {
        ...initialState,
        tiv: {
          ...initialState.tiv,
          loading: true,
        },
      };
      const expectedState = {
        ...prevState,
        tiv: {
          ...initialState.tiv,
          loading: false,
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });
  });
});
