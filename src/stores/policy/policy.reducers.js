import * as utils from 'utils';

const initialState = {
  selected: null,
  placement: null,
  loading: {
    selected: false,
    placement: false,
  },
};

const policyReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'POLICY_GET_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          selected: true,
        },
      };

    case 'POLICY_GET_SUCCESS':
      const hasPolicy = utils.generic.isValidArray(action.payload, true);

      return {
        ...state,
        selected: hasPolicy ? action.payload[0] : initialState.selected,
        placement: initialState.placement,
        loading: {
          ...state.loading,
          selected: false,
        },
      };

    case 'POLICY_GET_FAILURE':
      return {
        ...state,
        selected: initialState.selected,
        placement: initialState.placement,
        loading: {
          ...state.loading,
          selected: false,
        },
      };

    case 'POLICY_RESET':
      return {
        ...state,
        selected: initialState.selected,
        placement: initialState.placement,
        loading: {
          ...initialState.loading,
        },
      };

    case 'POLICY_PLACEMENT_GET_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          placement: true,
        },
      };

    case 'POLICY_PLACEMENT_GET_SUCCESS':
      return {
        ...state,
        placement: action.payload,
        loading: {
          ...state.loading,
          placement: false,
        },
      };

    case 'POLICY_PLACEMENT_GET_FAILURE':
      return {
        ...state,
        placement: initialState.placement,
        loading: {
          ...state.loading,
          placement: false,
        },
      };

    default:
      return state;
  }
};

export default policyReducers;
