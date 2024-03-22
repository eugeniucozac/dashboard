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

const locationReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'LOCATION_RESET':
      return {
        ...initialState,
      };

    case 'LOCATION_SET_UPLOAD_WIZARD_GIVEN_LOCATIONS':
      return {
        ...state,
        givenLocations: action.payload.locations || [],
        givenLocationsHeaders: action.payload.headers || [],
      };

    case 'LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP':
      return {
        ...state,
        headerMap: action.payload,
        autoMatch: true,
      };

    case 'LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP_RESET':
      return {
        ...state,
        headerMap: initialState.headerMap,
        autoMatch: initialState.autoMatch,
      };

    case 'LOCATION_SET_UPLOAD_WIZARD_LOCATIONS':
      return {
        ...state,
        locationsUploaded: action.payload,
      };

    case 'LOCATION_SET_UPLOAD_WIZARD_INVALID_LOCATIONS':
      return {
        ...state,
        invalidLocationsUploaded: action.payload,
      };

    case 'LOCATION_SET_GROUPS':
      return {
        ...state,
        locationGroups: action.payload.groups,
      };

    case 'LOCATION_GET_PLACEMENT_GROUPS_FAILURE':
      return {
        ...state,
        geocoding: {
          ...state.geocoding,
          status: initialState.geocoding.status,
          result: initialState.geocoding.result,
          attempts: initialState.geocoding.attempts,
          completed: initialState.geocoding.completed,
          total: initialState.geocoding.total,
        },
      };

    case 'LOCATION_POST_NEW_GROUP':
      return {
        ...state,
        uploading: true,
      };

    case 'LOCATION_POST_NEW_GROUP_SUCCESS':
    case 'LOCATION_POST_NEW_GROUP_FAILURE':
      return {
        ...state,
        uploading: false,
      };

    case 'LOCATION_GEOCODING_UPDATE':
      return {
        ...state,
        geocoding: {
          ...state.geocoding,
          status: action.payload.status,
          result: action.payload.result,
          attempts: action.payload.attempts,
          completed: action.payload.completed,
          total: action.payload.total,
        },
      };

    default:
      return state;
  }
};

export default locationReducers;
