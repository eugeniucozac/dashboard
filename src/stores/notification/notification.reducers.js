const initialState = {
  notificationList: [],
  error: '',
  isNotificationsLoading: false,
};

const notificationReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'NOTIFICATION_GET_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        notificationList: action.payload,
        error: '',
      };
    case 'NOTIFICATION_GET_NOTIFICATIONS_FAILURE':
      return {
        ...state,
        notificationList: [],
        error: action.payload,
      };
    case 'NOTIFICATION_GET_NOTIFICATIONS_LOADING':
      return {
        ...state,
        isNotificationsLoading: action.payload,
      };
    default:
      return state;
  }
};

export default notificationReducers;
