import * as constants from 'consts';
import types from './types';

export const expandNav = () => {
  return {
    type: 'NAV_EXPAND',
  };
};

export const collapseNav = () => {
  return {
    type: 'NAV_COLLAPSE',
  };
};

export const expandSidebar = () => {
  return {
    type: 'SIDEBAR_EXPAND',
  };
};

export const collapseSidebar = () => {
  return {
    type: 'SIDEBAR_COLLAPSE',
  };
};

export const addLoader = (payload) => {
  return {
    type: 'LOADER_ADD',
    payload,
  };
};

export const removeLoader = (payload) => {
  return {
    type: 'LOADER_REMOVE',
    payload,
  };
};

export const showModal = (payload) => {
  return {
    type: types.MODAL_SHOW,
    payload,
  };
};

export const hideModal = (type) => {
  return {
    type: types.MODAL_HIDE,
    payload: type,
  };
};

export const fullScreenModal = (payload) => {
  return {
    type: 'MODAL_FULLSCREEN',
    payload,
  };
};

export const enqueueNotification =
  (str, type, { data, delay, keepAfterUrlChange } = {}) =>
  (dispatch, getState) => {
    const defaultNotification = {
      key: new Date().getTime(),
      visible: true,
      type,
      data,
      delay,
      message: str,
      keepAfterUrlChange,
    };

    const currentNotification = getState().ui.notification.queue[0];

    // if it's the 1st notification, we add it (visible by default)
    // if not, we add it to the list (hidden) then process the queue
    if (!currentNotification) {
      dispatch(addNotification(defaultNotification));
    } else {
      dispatch(hideNotification(currentNotification.key));
      dispatch(addNotification({ ...defaultNotification }));
    }
  };

export const addNotification = (payload) => {
  return {
    type: 'NOTIFICATION_ADD',
    payload,
  };
};

export const hideNotification = (payload) => {
  return {
    type: 'NOTIFICATION_HIDE',
    payload,
  };
};

export const removeNotification = (payload) => {
  return {
    type: 'NOTIFICATION_REMOVE',
    payload,
  };
};

export const updateApp = (payload) => {
  return {
    type: 'SW_UPDATE',
    payload,
  };
};

export const setBrand = (hostname) => {
  // set brand based on domain name (default to priceforbes)
  let brand = constants.BRAND_PRICEFORBES;
  if (hostname.includes(constants.BRAND_BISHOPSGATE)) brand = constants.BRAND_BISHOPSGATE;

  return {
    type: 'BRAND_SET',
    payload: brand,
  };
};

export const uploadFiles = (payload) => {
  return {
    type: types.DMS_FILE_UPLOAD,
    payload,
  };
};

export const removeFileUpload = (payload) => {
  return {
    type: types.REMOVE_DMS_FILE_UPLOAD,
    payload,
  };
};
export const resetFileUpload = (payload) => {
  return {
    type: types.DMS_FILE_UPLOAD_RESET,
    payload,
  };
};

export const setDmsContext = (payload) => {
  return {
    type: types.SET_DMS_CONTEXT,
    payload,
  };
};

export const resetFilesUploaded = () => {
  return {
    type: 'RESET_DMS_FILES_UPLOADED',
  };
};

export const updateFileName = (payload) => {
  return {
    type: types.UPDATE_FILE_NAME,
    payload,
  };
};
