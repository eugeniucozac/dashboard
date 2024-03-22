import config from 'config';

const initialState = {
  vars: {},
  locale: config.locale,
};

const configReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'CONFIG_VARS_SET':
      return {
        ...state,
        vars: action.payload,
      };

    case 'CONFIG_LOCALE_SET':
      return {
        ...state,
        locale: action.payload,
      };

    default:
      return state;
  }
};

export default configReducers;
