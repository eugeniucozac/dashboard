import * as utils from 'utils';
import get from 'lodash/get';
import types from './types';

const initialState = {
  brand: '',
  nav: {
    expanded: false,
  },
  sidebar: {
    expanded: false,
  },
  modal: [],
  loader: {
    queue: [],
  },
  notification: {
    queue: [],
  },
  fullScreen: false,
  serviceWorkerUpdated: false,
  serviceWorkerRegistration: {},
  files: [],
  dmsContext: '',
};

const uiReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'NAV_EXPAND':
      localStorage.setItem('edge-nav-expanded', 'true');

      return {
        ...state,
        nav: {
          ...state.nav,
          expanded: true,
        },
      };

    case 'NAV_COLLAPSE':
      localStorage.setItem('edge-nav-expanded', 'false');

      return {
        ...state,
        nav: {
          ...state.nav,
          expanded: false,
        },
      };

    case 'SIDEBAR_EXPAND':
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          expanded: true,
        },
      };

    case 'SIDEBAR_COLLAPSE':
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          expanded: false,
        },
      };

    case 'LOADER_ADD':
      const obj =
        typeof action.payload === 'string' || typeof action.payload === 'number'
          ? { key: action.payload, message: utils.string.t('app.loading') }
          : action.payload;
      return {
        ...state,
        loader: {
          queue: [...get(state, 'loader.queue', []), obj],
        },
      };

    case 'LOADER_REMOVE':
      const indexToRemove = get(state, 'loader.queue', []).findIndex((item) => {
        return item.key === action.payload;
      });

      const loaderQueueRemove = get(state, 'loader.queue', []).filter((_, index) => {
        return index !== indexToRemove;
      });

      return {
        ...state,
        loader: {
          queue: loaderQueueRemove,
        },
      };

    case types.MODAL_SHOW:
      return {
        ...state,
        modal: get(state, 'modal', []).concat([
          {
            visible: true,
            type: action.payload.component,
            props: action.payload.props,
            actions: action.payload.actions,
          },
        ]),
      };

    case types.MODAL_HIDE:
      return {
        ...state,
        modal: action.payload ? get(state, 'modal', []).filter((m) => m.type !== action.payload) : [],
      };
    case 'MODAL_FULLSCREEN':
      return {
        ...state,
        fullScreen: !state.fullScreen,
      };
    case 'NOTIFICATION_ADD':
      return {
        ...state,
        notification: {
          queue: [...get(state, 'notification.queue', []), action.payload],
        },
      };

    case 'NOTIFICATION_HIDE':
      const queueHide = get(state, 'notification.queue', []).map((item) => {
        if (item.key === action.payload) {
          item.visible = false;
        }

        return item;
      });

      return {
        ...state,
        notification: {
          queue: queueHide,
        },
      };

    case 'NOTIFICATION_REMOVE':
      const queueRemove = get(state, 'notification.queue', []).filter((item) => {
        return item.key !== action.payload;
      });

      return {
        ...state,
        notification: {
          queue: queueRemove,
        },
      };
    case 'SW_UPDATE':
      return {
        ...state,
        serviceWorkerUpdated: !state.serviceWorkerUpdated,
        serviceWorkerRegistration: action.payload,
      };
    case 'BRAND_SET':
      return {
        ...state,
        brand: action.payload,
      };

    case types.DMS_FILE_UPLOAD:
      return {
        ...state,
        files: [...state.files, ...action.payload],
      };

    case types.REMOVE_DMS_FILE_UPLOAD:
      return {
        ...state,
        files: [...state.files?.filter((f) => f.name !== action.payload)],
      };

    case types.DMS_FILE_UPLOAD_RESET:
      return {
        ...state,
        files: [],
      };

    case types.SET_DMS_CONTEXT:
      return {
        ...state,
        dmsContext: action.payload,
      };

    case 'RESET_DMS_FILES_UPLOADED':
      return {
        ...state,
        files: [],
        dmsContext: initialState.dmsContext,
      };

    case types.UPDATE_FILE_NAME:
      return {
        ...state,
        files: [
          ...state.files?.map((f, i) => ({ ...f, ...(i === action.payload.fileIndex && { ...f.file, name: action.payload.fileName }) })),
        ],
      };
    default:
      return state;
  }
};

export default uiReducers;
