import config from 'config';
import * as utils from 'utils';

const initialState = {
  reportGroupList: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    sortBy: 'name',
    sortDirection: 'asc',
  },
  selected: null,
  reportList: {
    items: [],
    reportingGroupUser: [],
    selectedGroup: {},
  },
  report: {},
};

const reportingReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'REPORTING_GROUP_LIST_GET_SUCCESS':
      return {
        ...state,
        reportGroupList: {
          ...state.reportGroupList,
          items: action.payload.content,
          ...utils.api.pagination(action.payload),
        },
      };
    case 'REPORTING_GROUP_POST_SUCCESS':
      return {
        ...state,
        reportGroupList: {
          ...state.reportGroupList,
          items: [...state.reportGroupList.items, { ...action.payload }],
          itemsTotal: state.reportGroupList.itemsTotal + 1,
        },
      };
    case 'REPORTING_GROUP_PATCH_SUCCESS':
      return {
        ...state,
        reportGroupList: {
          ...state.reportGroupList,
          items: state.reportGroupList.items.map((group) => {
            if (group.id === action.payload.id) {
              return { ...action.payload };
            } else {
              return group;
            }
          }),
        },
      };
    case 'REPORT_GROUP_DELETE_SUCCESS':
      return {
        ...state,
        reportGroupList: {
          ...state.reportGroupList,
          items: [...state.reportGroupList.items.filter((group) => group.id !== action.payload)],
        },
      };
    case 'REPORTING_LIST_GET_SUCCESS':
      return {
        ...state,
        reportList: {
          ...state.reportList,
          items: action.payload.reports,
          reportingGroupUser: action.payload.users,
          selectedGroup: action.payload.selected,
        },
      };
    case 'REPORT_POST_SUCCESS':
      return {
        ...state,
        reportList: {
          ...state.reportList,
          items: [...state.reportList.items, { ...action.payload }],
        },
      };
    case 'REPORT_PATCH_SUCCESS':
      return {
        ...state,
        reportList: {
          ...state.reportList,
          items: state.reportList.items.map((report) => {
            if (report.id === action.payload.id) {
              return { ...action.payload, lastUpdateDate: report.lastUpdateDate };
            } else {
              return report;
            }
          }),
        },
      };
    case 'REPORT_DELETE_SUCCESS':
      return {
        ...state,
        reportList: {
          ...state.reportList,
          items: [...state.reportList.items.filter((report) => report.id !== action.payload)],
        },
      };
    case 'REPORT_USER_CREATE_SUCCESS':
      return {
        ...state,
        reportList: {
          ...state.reportList,
          reportingGroupUser: [...action.payload],
        },
      };
    case 'REPORT_USER_DELETE_SUCCESS':
      return {
        ...state,
        reportList: {
          ...state.reportList,
          reportingGroupUser: [...state.reportList.reportingGroupUser.filter((reportGrpUsr) => reportGrpUsr.id !== action.payload)],
        },
      };
    case 'REPORTING_DETAILS_GET_REQUEST':
      return {
        ...state,
        report: {},
      };
    case 'REPORTING_DETAILS_GET_SUCCESS':
      return {
        ...state,
        report: action.payload,
      };

    default:
      return state;
  }
};

export default reportingReducers;
