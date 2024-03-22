const initialState = {
  selected: null,
};

const marketReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'MARKET_RESET':
      return {
        selected: null,
      };

    case 'MARKET_POLICY_SELECT':
      return {
        selected: {
          ...action.payload,
        },
      };

    case 'MARKET_LAYER_SELECT':
      return {
        selected: {
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default marketReducers;
