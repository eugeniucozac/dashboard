import config from 'config';
import * as utils from 'utils';

const initialState = {
  userList: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    sortBy: 'fullName',
    sortDirection: 'asc',
  },
  parentOfficeListAll: {
    items: [],
    loading: false,
  },
  parentOfficeList: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    sortBy: 'name',
    sortDirection: 'asc',
  },
  programmesCarriersList: {
    items: [],
    loading: false,
  },
  programmesClientList: {
    items: [],
    loading: false,
  },
  programmesProductsList: {
    items: [],
    loading: false,
  },
};

const updateOffices = (parent, action) => {
  const found = parent.offices.find((office) => office.id === action.payload.id);
  if (found) {
    return parent.offices.map((office) => {
      if (office.id !== action.payload.id) return office;
      return action.payload;
    });
  } else {
    return [action.payload, ...parent.offices];
  }
};

const adminReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'ADMIN_PARENT_OFFICE_LIST_GET_SUCCESS':
      return {
        ...state,
        parentOfficeList: {
          ...state.parentOfficeList,
          items: action.payload.content,
          ...utils.api.pagination(action.payload),
        },
      };
    case 'ADMIN_PARENT_OFFICE_LIST_ALL_GET_SUCCESS':
      return {
        ...state,
        parentOfficeListAll: {
          ...state.parentOfficeListAll,
          items: action.payload,
          loading: false,
        },
      };
    case 'ADMIN_PARENT_OFFICE_LIST_ALL_GET_REQUEST':
      return {
        ...state,
        parentOfficeListAll: {
          ...state.parentOfficeListAll,
          loading: true,
        },
      };
    case 'ADMIN_CLIENT_OFFICE_CREATE_SUCCESS':
      return {
        ...state,
        parentOfficeList: {
          ...state.parentOfficeList,
          items: state.parentOfficeList.items.map((parent) => {
            if (parent.id !== action.payload.parent.id) return parent;
            return {
              ...parent,
              offices: [{ ...action.payload, __new__: true }, ...parent.offices],
            };
          }),
        },
      };
    case 'ADMIN_CLIENT_OFFICE_EDIT_SUCCESS':
      return {
        ...state,
        parentOfficeList: {
          ...state.parentOfficeList,
          items: state.parentOfficeList.items.map((parent) => {
            if (parent.id !== action.payload.parent.id) {
              return {
                ...parent,
                offices: parent.offices.filter((office) => office.id !== action.payload.id),
              };
            }
            return {
              ...parent,
              offices: updateOffices(parent, action),
            };
          }),
        },
      };
    case 'ADMIN_USER_LIST_GET_SUCCESS':
      return {
        ...state,
        userList: {
          ...state.userList,
          items: action.payload.content,
          ...utils.api.pagination(action.payload),
        },
      };
    case 'ADMIN_USER_CREATE_SUCCESS':
      return {
        ...state,
        userList: {
          ...state.userList,
          items: [{ ...action.payload, __new__: true }, ...state.userList.items],
          itemsTotal: state.userList.itemsTotal + 1,
        },
      };
    case 'ADMIN_USER_EDIT_SUCCESS':
      return {
        ...state,
        userList: {
          ...state.userList,
          items: state.userList.items.map((user) => (user.id === action.payload.id ? { ...user, ...action.payload } : user)),
        },
      };

    case 'ADMIN_USER_PROGRAMMES_CREATE_SUCCESS':
      return {
        ...state,
        userList: {
          ...state.userList,
          items: state.userList.items.map((user) => (user.id === action.payload.id ? { ...user, ...action.payload } : user)),
        },
      };
    case 'CLIENTS_PROGRAMMES_GET_REQUEST':
      return {
        ...state,
        programmesClientList: {
          ...state.programmesClientList,
          loading: true,
        },
      };
    case 'CLIENTS_PROGRAMMES_GET_SUCCESS':
      return {
        ...state,
        programmesClientList: {
          ...state.programmesClientList,
          items: action.payload,
          loading: false,
        },
      };
    case 'CARRIERS_PROGRAMMES_GET_REQUEST':
      return {
        ...state,
        programmesCarriersList: {
          ...state.programmesCarriersList,
          loading: true,
        },
      };
    case 'CARRIERS_PROGRAMMES_GET_SUCCESS':
      return {
        ...state,
        programmesCarriersList: {
          ...state.programmesCarriersList,
          items: action.payload,
          loading: false,
        },
      };
    case 'PRODUCTS_PROGRAMMES_GET_REQUEST':
      return {
        ...state,
        programmesProductsList: {
          ...state.programmesProductsList,
          loading: true,
        },
      };
    case 'PRODUCTS_PROGRAMMES_GET_SUCCESS':
      return {
        ...state,
        programmesProductsList: {
          ...state.programmesProductsList,
          items: action.payload,
          loading: false,
        },
      };

    default:
      return state;
  }
};

export default adminReducers;
