import * as utils from 'utils';

const initialState = {
  id: null,
  firstName: '',
  lastName: '',
  fullName: '',
  emailId: '',
  departmentIds: [],
  departmentSelected: null,
  offices: [],
  role: '',
  auth: {},
  isAdmin: false,
  isReportAdmin: false,
  hasTokenExpired: true,
  error: '',

  // New user info properties
  landingPage: '',
  userDetails: {},
  userRole: {},
  group: [],
  businessProcess: [],
  xbInstance: [],
  privilege: {},
  routes: [],
  organisation: {},
};

const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_LOGIN':
      return {
        ...state,
        auth: {},
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        auth: {},
      };

    case 'AUTH_IN_PROGRESS':
      return {
        ...state,
        auth: {
          inProgress: true,
        },
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        auth: {
          ...action.payload,
          inProgress: false,
        },
        hasTokenExpired: false,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        auth: {},
      };

    case 'USER_GET_SUCCESS':
      return {
        ...state,
        id: action.payload.id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        fullName: action.payload.fullName,
        emailId: action.payload.emailId,
        departmentIds: action.payload.departmentIds,
        departmentSelected: utils.user.department.getDefault(action.payload),
        offices: action.payload.offices,
        role: action.payload.role,
        isAdmin: action.payload.isAdmin,
        isReportAdmin: action.payload.isReportAdmin,
      };

    case 'USER_GET_FAILURE':
      return {
        ...state,
        auth: state.auth,
        error: action.payload.text || '',
      };

    case 'USER_DATA_GET_SUCCESS':
      const { role: userRole, ...rest } = action.payload;

      return {
        ...state,
        id: action.payload?.userDetails?.id,
        firstName: action.payload?.userDetails?.firstName || '',
        lastName: action.payload?.userDetails?.lastName || '',
        fullName: action.payload?.userDetails?.name || '',
        emailId: action.payload?.userDetails?.email || '',
        userRole,
        landingPage: rest.landingPage || initialState.landingPage,
        userDetails: rest.userDetails || initialState.userDetails,
        group: rest.group || initialState.group,
        businessProcess: rest.businessProcess || initialState.businessProcess,
        xbInstance: rest.xbInstance || initialState.xbInstance,
        privilege: rest.privilege || initialState.privilege,
        routes: rest.routes || initialState.routes,
        organisation: rest.organisation || initialState.organisation,
        departmentSelected: utils.user.department.getDefault({
          ...action.payload,
          userRole: action.payload.role,
          departmentIds: action.payload.xbInstance
            ?.reduce((acc, cur) => {
              return [...acc, ...(cur.department || [])];
            }, [])
            .map((d) => d.id),
        }),
      };

    case 'USER_DATA_GET_FAILURE':
      return {
        ...state,
        auth: state.auth,
        error: state.error,
      };

    case 'USER_SET_DEPARTMENT_SELECTED':
      return {
        ...state,
        departmentSelected: action.payload,
      };

    case 'USER_TOKEN_EXPIRED':
      return {
        ...state,
        hasTokenExpired: action.payload,
      };

    default:
      return state;
  }
};

export default userReducers;
