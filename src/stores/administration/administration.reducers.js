import config from 'config';

const initialState = {
  emailIsAvailable: false,
  userList: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    sortBy: 'fullName',
    sortType: 'lexical',
    sortDirection: 'asc',
    query: '',
    filters: {},
  },
  refData: {
    departments: [],
    groups: [],
    roles: [],
    xbInstances: [],
    organisations: [],
  },
};

const administrationReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'ADMINISTRATION_USERS_GET_SUCCESS':
      return {
        ...state,
        userList: {
          ...state.userList,
          items: action.payload.content,
          ...action.payload.pagination,
          ...action.payload.sort,
          filters: action.payload.filters,
        },
      };

    case 'ADMINISTRATION_USERS_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    case 'ADMINISTRATION_REF_DATA_GROUPS':
      return {
        ...state,
        refData: {
          ...state.refData,
          groups: action.payload,
        },
      };

    case 'ADMINISTRATION_REF_DATA_ROLES':
      return {
        ...state,
        refData: {
          ...state.refData,
          roles: action.payload,
        },
      };

    case 'ADMINISTRATION_REF_DATA_DEPARTMENTS':
      return {
        ...state,
        refData: {
          ...state.refData,
          departments: action.payload,
        },
      };

    case 'ADMINISTRATION_EMAIL_AVAILABLE_SUCCESS':
      return {
        ...state,
        emailIsAvailable: action.payload,
      };

    case 'ADMINISTRATION_USER_CREATE_SUCCESS':
      return {
        ...state,
        userList: {
          ...state.userList,
          items: [{ ...action.payload, __new__: true }, ...state.userList.items],
          itemsTotal: state.userList.itemsTotal + 1,
        },
      };

    case 'ADMINISTRATION_USER_EDIT_SUCCESS':
      return {
        ...state,
        userList: {
          ...state.userList,
          items: state.userList.items.map((user) => (user.id === action.payload.id ? { ...user, ...action.payload } : user)),
        },
      };

    case 'ADMINISTRATION_USER_DELETE_SUCCESS':
      return {
        ...state,
        userList: {
          ...state.userList,
          items: state.userList.items.filter((user) => user.id.toString() !== action.payload.toString()),
          itemsTotal: state.userList.itemsTotal - 1,
        },
      };

    case 'ADMINISTRATION_RESET_USERS':
      return {
        ...state,
        userList: {
          ...state.userList,
          filters: {},
          sortBy: 'fullName',
          sortDirection: 'asc',
          query: '',
        },
      };

    case 'ADMINISTRATION_TEAMS_DATA_SUCCESS':
      return {
        ...state,
        refData: {
          ...state.refData,
          organisations: action.payload.map((org) => ({
            id: org.organisationID,
            name: org.organisationName,
            ...org,
          })),
        },
      };

    case 'ADMINISTRATION_TEAMS_DATA_FAILURE':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default administrationReducers;
