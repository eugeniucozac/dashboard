import isEqual from 'lodash/isEqual';

const initialState = {
  tiv: {
    placementIds: null,
    filteredDepartments: [],
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

const portfolioMapReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'PORTFOLIO_MAP_RESET':
      return {
        ...initialState,
      };
    case 'PORTFOLIO_MAP_GET_REQUEST':
      return {
        ...state,
        tiv: {
          ...state.tiv,
          loading: true,
        },
      };
    case 'PORTFOLIO_MAP_GET_FAILURE':
      return {
        ...state,
        tiv: {
          ...state.tiv,
          loading: false,
        },
      };
    case 'PORTFOLIO_MAP_GET_SUCCESS':
      return {
        ...state,
        tiv: {
          ...state.tiv,
          placementIds: action.payload.placementIds,
          ...(action.payload.level && { level: action.payload.level }),
          ...(action.payload.levelOverride && { levelOverride: action.payload.levelOverride }),
          levels: {
            ...(isEqual(action.payload.placementIds, state.tiv.placementIds) ? { ...state.tiv.levels } : { ...initialState.tiv.levels }),
            [action.payload.levelOverride || action.payload.level]: action.payload.data,
          },
          loading: false,
        },
      };
    case 'PORTFOLIO_MAP_RESET_LOCATIONS':
      return {
        ...state,
        tiv: {
          ...state.tiv,
          placementIds: initialState.tiv.placementIds,
          levels: { ...initialState.tiv.levels },
        },
      };
    case 'PORTFOLIO_MAP_RESET_LEVEL':
      return {
        ...state,
        tiv: {
          ...state.tiv,
          level: initialState.tiv.level,
        },
      };
    case 'PORTFOLIO_MAP_UPDATE_DEPARTMENTS':
      return {
        ...state,
        tiv: {
          ...state.tiv,
          filteredDepartments: action.payload,
        },
      };
    case 'PORTFOLIO_MAP_RESET_LEVEL_OVERRIDE':
      return {
        ...state,
        tiv: {
          ...state.tiv,
          levelOverride: initialState.tiv.levelOverride,
        },
      };
    case 'PORTFOLIO_MAP_UPDATE_LEVEL':
      return {
        ...state,
        tiv: {
          ...state.tiv,
          level: action.payload.level,
        },
      };
    case 'PORTFOLIO_MAP_UPDATE_LEVEL_OVERRIDE':
      return {
        ...state,
        tiv: {
          ...state.tiv,
          levelOverride: action.payload.levelOverride,
        },
      };
    default:
      return state;
  }
};

export default portfolioMapReducers;
