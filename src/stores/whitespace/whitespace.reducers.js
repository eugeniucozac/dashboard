const initialState = {
  templates: {
    items: [],
    loading: false,
  },
};

const whitespaceReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'TEMPLATES_GET_REQUEST':
      return {
        ...initialState,
        templates: {
          ...initialState.templates,
          loading: true,
        },
      };

    case 'TEMPLATES_GET_SUCCESS':
      return {
        ...initialState,
        templates: {
          ...initialState.templates,
          items: action.payload,
          loading: false,
        },
      };
    default:
      return state;
  }
};

export default whitespaceReducers;
