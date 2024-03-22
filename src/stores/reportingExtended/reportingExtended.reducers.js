import config from 'config';

const initialState = {
  reportGroupListExtended: {
    items: [],
    itemsTotal: 0,
    query: '',
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    sortBy: 'name',
    sortType: 'lexical',
    sortDirection: 'asc',
    loading: false,
  },
  reportListExtended: {
    items: [],
    itemsTotal: 0,
    query: '',
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    selectedReportGroup: {},
    sortBy: 'title',
    sortType: 'lexical',
    sortDirection: 'asc',
    loading: false,
  },
  reportDetails: {},
  reportDetailsLoading: false,
};

const reportingExtendedReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'REPORTING_EXTENDED_GET_REPORT_GROUP_LIST_REQUEST':
      return {
        ...state,
        reportGroupListExtended: {
          ...state.reportGroupListExtended,
          loading: true,
        },
      };

    case 'REPORTING_EXTENDED_GET_REPORT_GROUP_LIST_SUCCESS':
      return {
        ...state,
        reportGroupListExtended: {
          ...state.reportGroupListExtended,
          loading: false,
          items: action.payload.content,
          ...action.payload.pagination,
          ...action.payload.sort,
        },
      };

    case 'REPORTING_EXTENDED_GET_REPORT_GROUP_LIST_FAILURE':
      return {
        ...state,
        reportGroupListExtended: {
          ...state.reportGroupListExtended,
          loading: false,
          error: action.payload,
        },
      };

    case 'REPORTING_EXTENDED_RESET_REPORT_GROUP_LIST':
      return {
        ...state,
        reportGroupListExtended: {
          ...initialState.reportGroupListExtended,
        },
      };

    case 'REPORTING_EXTENDED_GET_REPORT_LIST_REQUEST':
      return {
        ...state,
        reportListExtended: {
          ...state.reportListExtended,
          loading: true,
        },
      };

    case 'REPORTING_EXTENDED_GET_REPORT_LIST_SUCCESS':
      return {
        ...state,
        reportListExtended: {
          ...state.reportListExtended,
          loading: false,
          items: action.payload.content,
          selectedReportGroup: action.payload.selectedReportGroup,
          ...action.payload.pagination,
          ...action.payload.sort,
        },
      };

    case 'REPORTING_EXTENDED_GET_REPORT_LIST_FAILURE':
      return {
        ...state,
        reportListExtended: {
          ...state.reportListExtended,
          loading: false,
          error: action.payload,
        },
      };

    case 'REPORTING_EXTENDED_GET_REPORT_DETAILS_REQUEST':
      return {
        ...state,
        reportDetails: initialState.reportDetails,
        reportDetailsLoading: true,
      };

    case 'REPORTING_EXTENDED_GET_REPORT_DETAILS_SUCCESS':
      return {
        ...state,
        reportDetails: action.payload,
        reportDetailsLoading: false,
      };

    case 'REPORTING_EXTENDED_GET_REPORT_DETAILS_FAILURE':
      return {
        ...state,
        reportDetails: initialState.reportDetails,
        reportDetailsLoading: false,
      };

    default:
      return state;
  }
};

export default reportingExtendedReducers;
