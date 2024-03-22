const initialState = {
  markets: {
    items: [],
    loading: false,
  },
  market: {
    loading: false,
  },
};

const departmentReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'DEPARTMENT_MARKETS_LIST_GET_REQUEST':
      return {
        ...state,
        markets: {
          ...state.markets,
          loading: true,
        },
      };

    case 'DEPARTMENT_MARKETS_LIST_GET_SUCCESS':
      return {
        ...state,
        markets: {
          ...state.markets,
          items: action.payload,
          loading: false,
        },
      };

    case 'DEPARTMENT_MARKETS_LIST_GET_FAILURE':
      return {
        ...state,
        markets: {
          ...initialState.markets,
          loading: false,
        },
      };

    case 'DEPARTMENT_MARKET_POST_SUCCESS':
      return {
        ...state,
        markets: {
          ...state.markets,
          items: [
            { ...action.payload, __new__: true },
            ...state.markets.items.map((item) => {
              delete item.__new__;
              return item;
            }),
          ],
        },
      };

    case 'DEPARTMENT_MARKET_PUT_SUCCESS':
      return {
        ...state,
        markets: {
          ...state.markets,
          items: state.markets.items.map((market) => {
            delete market.__new__;

            if (market.id === action.payload.id) {
              return action.payload;
            }

            return market;
          }),
        },
      };

    case 'DEPARTMENT_MARKET_DELETE_SUCCESS':
      return {
        ...state,
        markets: {
          ...state.markets,
          items: state.markets.items
            .filter((market) => market.id !== action.payload)
            .map((item) => {
              delete item.__new__;
              return item;
            }),
        },
      };

    case 'DEPARTMENT_MARKET_GET_REQUEST':
      return {
        ...state,
        market: {
          loading: false,
        },
      };

    case 'DEPARTMENT_MARKET_GET_SUCCESS':
      return {
        ...state,
        market: action.payload,
      };

    default:
      return state;
  }
};

export default departmentReducers;
