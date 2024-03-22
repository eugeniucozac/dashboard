const initialState = {
  data: {},
  loading: false,
  loaded: false,
};

const fileUploadReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'FILE_UPLOAD_GET_GUI_DATA_REQUEST':
      return {
        ...state,
        loading: true,
        loaded: false,
      };

    case 'FILE_UPLOAD_GET_GUI_DATA_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        loaded: true,
      };

    case 'FILE_UPLOAD_GET_GUI_DATA_FAILURE':
      return {
        ...state,
        data: {},
        loading: false,
        loaded: true,
      };

    default:
      return state;
  }
};

export default fileUploadReducers;
