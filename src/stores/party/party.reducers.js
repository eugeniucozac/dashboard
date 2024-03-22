import config from 'config';
import * as utils from 'utils';

const initialState = {
  carriers: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sortBy: 'name',
    sortType: 'text',
    sortDirection: 'asc',
    loading: false,
  },
  clients: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sortBy: 'name',
    sortType: 'text',
    sortDirection: 'asc',
    loading: false,
  },
  insureds: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sortBy: 'name',
    sortType: 'text',
    sortDirection: 'asc',
    loading: false,
  },
  reinsureds: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sortBy: 'name',
    sortType: 'text',
    sortDirection: 'asc',
    loading: false,
  },
  pricerModule: {
    items: [],
  },
  notifiedUsers: {
    items: [],
    itemsTotal: 0,
    loading: false,
  },
};

const partyReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'CARRIERS_GET_REQUEST':
      return {
        ...state,
        carriers: {
          ...state.carriers,
          loading: true,
        },
      };
    case 'CARRIERS_GET_SUCCESS':
      return {
        ...state,
        carriers: {
          ...state.carriers,
          items: action.payload.content,
          loading: false,
          ...utils.api.pagination(action.payload),
        },
      };

    case 'CLIENTS_GET_REQUEST':
      return {
        ...state,
        clients: {
          ...state.clients,
          loading: true,
        },
      };

    case 'CLIENTS_GET_SUCCESS':
      return {
        ...state,
        clients: {
          ...state.clients,
          items: action.payload.content,
          loading: false,
          ...utils.api.pagination(action.payload),
        },
      };

    case 'CLIENT_POST_SUCCESS':
      return {
        ...state,
        clients: {
          ...state.clients,
          items: [{ ...action.payload, __new__: true }, ...state.clients.items],
          itemsTotal: state.clients.itemsTotal + 1,
        },
      };
    case 'CLIENT_POST_EDIT_SUCCESS':
      return {
        ...state,
        clients: {
          ...state.clients,
          items: state.clients.items.map((item) => (item.id === action.payload.id ? { ...action.payload, __new__: true } : item)),
        },
      };

    case 'CARRIER_POST_SUCCESS':
      return {
        ...state,
        carriers: {
          ...state.carriers,
          items: [{ ...action.payload, __new__: true }, ...state.carriers.items],
          itemsTotal: state.carriers.itemsTotal + 1,
        },
      };

    case 'CLIENTS_RESET':
      return {
        ...state,
        clients: {
          ...initialState.clients,
        },
      };

    case 'INSUREDS_GET_REQUEST':
      return {
        ...state,
        insureds: {
          ...state.insureds,
          loading: true,
        },
      };

    case 'INSUREDS_GET_SUCCESS':
      return {
        ...state,
        insureds: {
          ...state.insureds,
          items: action.payload.content,
          loading: false,
          ...utils.api.pagination(action.payload),
        },
      };

    case 'INSURED_POST_SUCCESS':
      return {
        ...state,
        insureds: {
          ...state.insureds,
          items: [{ ...action.payload, __new__: true }, ...state.insureds.items],
          itemsTotal: state.insureds.itemsTotal + 1,
        },
      };
    case 'INSURED_POST_EDIT_SUCCESS':
      return {
        ...state,
        insureds: {
          ...state.insureds,
          items: state.insureds.items.map((item) => (item.id === action.payload.id ? { ...action.payload, __new__: true } : item)),
        },
      };
    case 'REINSUREDS_GET_REQUEST':
      return {
        ...state,
        reinsureds: {
          ...state.reinsureds,
          loading: true,
        },
      };
    case 'REINSUREDS_GET_SUCCESS':
      return {
        ...state,
        reinsureds: {
          ...state.reinsureds,
          items: action.payload.content,
          loading: false,
          ...utils.api.pagination(action.payload),
        },
      };
    case 'REINSURED_POST_SUCCESS':
      return {
        ...state,
        reinsureds: {
          ...state.reinsureds,
          items: [{ ...action.payload, __new__: true }, ...state.reinsureds.items],
          itemsTotal: state.reinsureds.itemsTotal + 1,
        },
      };
    case 'REINSURED_POST_EDIT_SUCCESS':
      return {
        ...state,
        reinsureds: {
          ...state.reinsureds,
          items: state.reinsureds.items.map((item) => (item.id === action.payload.id ? { ...action.payload, __new__: true } : item)),
        },
      };
    case 'PRICER_MODULE_GET_SUCCESS':
      return {
        ...state,
        pricerModule: {
          ...state.pricerModule,
          items: action.payload,
        },
      };
    case 'PROGRAM_USERS_GET_REQUEST':
      return {
        ...state,
        notifiedUsers: {
          ...state.notifiedUsers,
          loading: true,
        },
      };

    case 'PROGRAM_USERS_GET_SUCCESS':
      return {
        ...state,
        notifiedUsers: {
          ...state.notifiedUsers,
          items: action.payload,
          loading: false,
        },
      };

    default:
      return state;
  }
};

export default partyReducers;
