import get from 'lodash/get';

// app
import config from 'config';
import * as constants from 'consts';
import * as utils from 'utils';

const initialState = {
  isMultiSelectEnabled: false,
  loading: false,
  error: [],
  selected: [],
  isCaseTableHidden: false,
  isCaseTeamLoading: false,
  caseDetails: {
    frontEndSendDocs: false,
    caseTeamData: {},
    caseStageDetails: [],
    caseNotes: {
      notesHistory: [],
    },
    caseIssueDocuments: {
      nonBureauList: {
        items: [],
      },
      caseClientList: {
        items: [],
      },
      bureauList: {
        items: [],
      },
    },
    openRfi: false,
    isCheckSigningCaseHistoryLoading: false,
    checkSigningCaseHistory: [],
    caseHistoryDetails: {
      error: false,
      isCaseHistoryDetailsLoading: true,
      rejectDetailsHistory: {},
      resubmitDetailsHistory: [],
      qualityControlHistory: [],
    },
    caseId: null,
    taskId: '',
    processId: '',
    instructionId: '',
    instructionStatusId: '',
    policyId: '',
    fecId: '',
    taskView: '',
    isCheckSigning: false,
    fecEmail: '',
  },
  caseRfiDetails: {},
  emailSentStatus: false,
  casesList: {
    isTaskGridLoading: true,
    isTaskGridDataFetchingError: false,
    selectedTaskType: '',
    type: constants.WORKLIST,
    items: [],
    isloadingFilters: false,
    appliedFilters: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    filters: {},
    query: '',
    searchBy: '',
    isCheckSigning: false,
    sort: {
      by: 'caseCreatedOn',
      type: 'lexical',
      direction: 'desc',
    },
  },
  caseTaskViewType: '',
  assignedTo: {
    assigning: false,
  },
  technicians: {
    items: [],
    loading: false,
  },
  issueDocuments: {
    documentFromLondonTeam: true,
    nonBureau: true,
    bureauInsurer: true,
  },
  rfi: {
    history: [],
    queryCodes: [],
    responseDate: '',
    saveDraft: [],
    newRFI: [],
  },
  caseTeamModule: {
    error: false,
    isCaseTeamModuleLoading: true,
  },
  isCaseRfiSubTabsLoading: false,
  caseRfiSubTabs: [],
  multiSelectedRows: [],
  assignedToUsers: [],
  postAssignToUser: {},
  bpmFlag: [],
  bordereauType: [],
  bpmStage: [],
  facilityType: [],
  departments: [],
  rejectCase: {},
  rejectCloseCase: {},
  checkSigningCase: {},
  checkSigningCompleteCase: {},
  checkSigningCancelCase: {},
  checkSigningRejectCase: {},
  rfiResolutionCodes: [],
  checkSigningRejectCreateCase: {},
  bureauRfiDetails: {},
};

const premiumProcessingReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'PREMIUM_PROCESSING_CASES_LIST_GET_REQUEST':
      return {
        ...state,
        casesList: {
          ...state.casesList,
        },
        loading: true,
      };
    case 'PREMIUM_PROCESSING_CHECKSIGNING_TOGGLE':
      return {
        ...state,
        casesList: {
          ...state.casesList,
          isCheckSigning: action.payload,
        },
      };

    case 'PREMIUM_PROCESSING_TASK_TYPE_SELECTED':
      return {
        ...state,
        casesList: {
          ...state.casesList,
          selectedTaskType: action.payload,
        },
      };
    case 'PREMIUM_PROCESSING_TASK_SEARCH_RESET':
      return {
        ...state,
        casesList: {
          ...state.casesList,
          query: initialState.casesList.query,
        },
      };

    case 'PREMIUM_PROCESSING_TASK_FILTERS_RESET':
      return {
        ...state,
        casesList: {
          ...state.casesList,
          appliedFilters: initialState.casesList.appliedFilters,
        },
      };
    case 'PREMIUM_PROCESSING_TASKS_GET_SUCCESS':
      const {
        items: { filterValue: tasksFiltersValues, searchValue: tasksSearchValues },
        pagination: tasksPagination,
        requestType,
        taskType,
        sortBy,
        dir,
        searchBy,
        query,
        appliedFilters: tasksAppliedFilters,
        navigation,
        isCheckSigning,
      } = action.payload;

      const initTaskProcessing = initialState.casesList;
      const initTaskProcessingSort = initTaskProcessing.sort;

      const stateTaskProcessing = state.casesList;
      const prevTaskProcessingSelected = initialState.multiSelectedRows;
      const isNonfilterTypeCall = requestType !== constants.CLAIM_PROCESSING_REQ_TYPES.filter;

      return {
        ...state,
        casesList: {
          ...state.casesList,
          ...(isNonfilterTypeCall
            ? {
                items: tasksSearchValues || [],
                itemsTotal: get(tasksPagination, 'totalElements', 0),
                page: get(tasksPagination, 'page', 0) + 1,
                pageSize: get(tasksPagination, 'size', initialState.casesList.pageSize),
                pageTotal: get(tasksPagination, 'totalPages', 0),
                query: query || '',
                searchBy: searchBy,
              }
            : {}),
          sort: {
            ...state.casesList.sort,
            by: sortBy || initTaskProcessingSort.by,
            direction: get(tasksPagination, 'direction', initTaskProcessingSort.direction)?.toLowerCase() || dir,
          },
          filters: isNonfilterTypeCall ? stateTaskProcessing.filters : tasksFiltersValues ? tasksFiltersValues : {},
          taskType: taskType || initTaskProcessing.taskType,
          appliedFilters: tasksAppliedFilters?.length ? tasksAppliedFilters : initTaskProcessing.appliedFilters,
          isCheckSigning: isCheckSigning,
          isTaskGridDataFetchingError: false,
        },
        selected: [],
        multiSelectedRows: navigation ? prevTaskProcessingSelected : [],
        isMultiSelectEnabled: false,
        loading: false,
      };

    case 'PREMIUM_PORCESSING_SET_TASK_GRID_LOADING':
      return {
        ...state,
        casesList: {
          ...state.casesList,
          items: action.payload?.flag ? [] : state.casesList.items,
          isTaskGridLoading: action.payload?.flag,
        },
      };
    case 'PREMIUM_PROCESSING_TASKS_GET_FAILURE':
      return {
        ...state,
        selected: [],
        multiSelectedRows: [],
        casesList: {
          ...state.casesList,
          items: action.payload?.type === 'filter' ? state.casesList.items : [],
          filters: action.payload?.type === 'filter' ? {} : state.casesList.filters,
          isTaskGridLoading: false,
          isTaskGridDataFetchingError: true,
        },
        loading: false,
      };

    case 'PREMIUM_PROCESSING_TASKS_GET_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'PREMIUM_PROCESSING_TASKS_RESET':
      return {
        ...state,
        casesList: {
          ...state.casesList,
          items: action.payload === 'filter' ? state.casesList.items : [],
          filters: action.payload === 'filter' ? {} : state.casesList.filters,
        },
      };
    case 'PREMIUM_PROCESSING_CASES_LIST_GET_SUCCESS':
      const caseListPagination = action.payload.pagination || {};
      return {
        ...state,
        casesList: {
          ...state.casesList,
          items: action.payload.items || [],
          itemsTotal: get(caseListPagination, 'totalElements', 0),
          page: get(caseListPagination, 'page', 1),
          pageSize: get(caseListPagination, 'size', initialState.casesList.pageSize),
          pageTotal: get(caseListPagination, 'totalPages', 0),
          type: action.payload.type,
          query: get(caseListPagination, 'query') || '',
          filters: action.payload.fitlers || initialState.casesList.filters,
          sort: {
            ...state.casesList.sort,
            ...(caseListPagination.direction && { direction: caseListPagination.direction.toLowerCase() }),
            ...(caseListPagination.orderBy && { by: caseListPagination.orderBy }),
          },
        },
        loading: false,
        selected: [],
        multiSelectedRows: [],
        isMultiSelectEnabled: false,
      };

    case 'PREMIUM_PROCESSING_CASES_LIST_GET_FAILURE':
      return {
        ...state,
        selected: [],
        multiSelectedRows: [],
        casesList: {
          ...state.casesList,
          items: [],
        },
        loading: false,
      };

    case 'PREMIUM_PROCESSING_CASES_SELECTED_DESELECT':
      const selectedRecords =
        action.payload?.checked &&
        state.casesList?.items.slice(0, 10).map((data) => {
          return data;
        });
      return {
        ...state,
        selected: [],
        multiSelectedRows: action.payload?.checked ? selectedRecords : [],
      };
    case 'PREMIUM_PROCESSING_SINGLE_CASES_SELECTED':
      return {
        ...state,
        selected: !state.isMultiSelectEnabled ? [action.payload.selectedCase] : [],
        multiSelectedRows: [],
      };

    case 'PREMIUM_PROCESSING_CASES_SELECTED_UPDATE':
      return {
        ...state,
        selected: action.payload || [],
      };
    case 'PREMIUM_PROCESSING_TASK_CASE_VIEW_TYPE_SUCCESS':
      return {
        ...state,
        caseTaskViewType: !action.payload.isCaseIdForLoggedInUser ? '' : action.payload.taskType,
      };

    case 'PREMIUM_PROCESSING_TASK_CASE_VIEW_TYPE_FAILURE':
      return {
        ...state,
        caseTaskViewType: initialState.caseTaskViewType,
        selected: [],
        multiSelectedRows: [],
        casesList: {
          ...state.casesList,
          items: action.payload?.type === 'filter' ? state.casesList.items : [],
          filters: action.payload?.type === 'filter' ? {} : state.casesList.filters,
        },
        loading: false,
      };

    case 'PREMIUM_PROCESSING_MULTI_SELECTED_CASES':
      return {
        ...state,
        multiSelectedRows: [...action.payload] || [],
      };
    case 'PREMIUM_PROCESSING_SINGLE_SELECTED_CASE':
      return {
        ...state,
        selected: [action.payload],
      };
    case 'PREMIUM_PROCESSING_CASES_SELECTED_RESET':
      return {
        ...state,
        selected: [],
        multiSelectedRows: [],
      };

    case 'PREMIUM_PROCESSING_CASE_TYPE_CHANGE':
      return {
        ...state,
        casesList: {
          ...state.casesList,
          type: action.payload,
        },
      };
    case 'PREMIUM_PROCESSING_SET_IS_TABLEHIDDEN':
      return {
        ...state,
        isCaseTableHidden: action.payload,
      };
    case 'PREMIUM_PROCESSING_CASES_MULTI_SELECT_TOGGLE':
      return {
        ...state,
        isMultiSelectEnabled: action.payload,
        selected: [],
        multiSelectedRows: [],
      };
    case 'PREMIUM_PROCESSING_CASES_CHOOSE_TOGGLE':
      return {
        ...state,
        selected: state.isMultiSelectEnabled
          ? state.selected.length >= 1
            ? state.selected[0]
              ? [state.selected[0]]
              : []
            : []
          : state.selected[0]
          ? [state.selected[0]]
          : [],
        isMultiSelectEnabled: !state.isMultiSelectEnabled,
      };
    case 'PREMIUM_PROCESSING_SET_MULTI_SELECT_FLAG':
      return {
        ...state,
        selected: action.payload.flag
          ? state.selected[0]
          : state.selected.length >= 1
          ? state.selected[0]
            ? [state.selected[0]]
            : []
          : [],
        isMultiSelectEnabled: action.payload.flag,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_HISTORY_REQUEST':
      return {
        ...state,
        loading: true,
        error: [],
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_HISTORY_SUCCESS':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          checkSigningCaseHistory: action.data,
        },
        loading: false,
        error: null,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_HISTORY_FAILURE':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          checkSigningCaseHistory: [],
        },
        loading: false,
        error: [action.error],
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_HISTORY_LOADING':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          isCheckSigningCaseHistoryLoading: action.payload,
        },
      };

    case 'TECHNICIANS_GET_REQUEST':
      return {
        ...state,
        technicians: {
          ...state.technicians,
          loading: true,
        },
      };

    case 'TECHNICIANS_GET_SUCCESS':
      return {
        ...state,
        technicians: {
          ...state.technicians,
          items: action.payload,
          loading: false,
        },
      };

    case 'CASE_STATUSES_BY_DAYS':
      return {
        ...state,
        caseProgressByType: {
          ...state.caseProgressByType,
          [action.days]: {
            items: action.payload,
          },
        },
      };

    case 'CASE_TEAM_DETAILS_FAILURE':
      return {
        ...state,
        caseDetails: {
          ...initialState.caseDetails,
        },
        caseRfiDetails: {
          ...initialState.caseRfiDetails,
        },
      };

    case 'CASE_TEAM_DETAILS_SUCCESS':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          policyRef: action.payload?.processRef,
          caseTeamData: action.payload.caseDetails,
          caseStageDetails: action.payload.caseStages,
          caseNotes: {
            notesHistory: action.payload.notes,
          },
          caseIssueDocuments: {
            nonBureauList: {
              items: state.caseDetails.caseIssueDocuments.nonBureauList.items,
            },
            caseClientList: {
              items: state.caseDetails.caseIssueDocuments.caseClientList.items,
            },
            bureauList: {
              items: state.caseDetails.caseIssueDocuments.bureauList.items,
            },
          },
          openRfi: action.payload.openRfi,
          caseId: action.payload.caseId,
          taskId: action.payload.bpmTaskId,
          processId: action.payload.bpmProcessId,
          instructionId: action.payload.instructionId,
          instructionStatusId: action.payload.instructionStatusId,
          rejectDetailsHistory: {},
          resubmissionDetailsHistory: [],
          policyId: action.payload.policyId,
          fecId: action.payload.fecId,
          frontEndSendDocs: action.payload.frontEndSendDocs,
          bpmFlag: action.payload.bpmFlag,
          taskView: action.payload.taskView,
          isCheckSigning: action.payload.isCheckSigning,
          fecEmail: action.payload.frontEndContactEmail,
        },
      };
    case 'PREMIUM_PROCESSING_CASE_TEAM_GET_LOADING':
      return {
        ...state,
        isCaseTeamLoading: action.payload,
      };

    case 'PREMIUM_PROCESSING_CASE_RFI_DETAILS_SUCCESS':
      return {
        ...state,
        caseRfiDetails: {
          ...action.payload,
        },
      };

    case 'PREMIUM_PROCESSING_CASE_RFI_DETAILS_ERROR':
      return {
        ...state,
        caseRfiDetails: {
          ...initialState.caseRfiDetails,
        },
      };

    case 'PREMIUM_PROCESSING_CASE_HISTORY_DETAILS_SUCCESS':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseHistoryDetails: {
            ...state.caseDetails.caseHistoryDetails,
            error: false,
            rejectDetailsHistory: action.payload.rejectHistory,
            resubmitDetailsHistory: action.payload.resubmitHistory,
            qualityControlHistory: action.payload.qualityControlHistory,
          },
        },
      };

    case 'PREMIUM_PROCESSING_CASE_HISTORY_DETAILS_GET_LOADING':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseHistoryDetails: {
            ...state.caseDetails.caseHistoryDetails,
            isCaseHistoryDetailsLoading: action.payload,
          },
        },
      };

    case 'PREMIUM_PROCESSING_CASE_HISTORY_DETAILS_FAILURE':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          ...state.caseDetails.caseHistoryDetails,
          caseHistoryDetails: {
            error: true,
            rejectDetailsHistory: {},
            resubmitDetailsHistory: [],
          },
        },
      };

    case 'ISSUE_DOCUMENTS_GET_SUCCESS':
      return {
        ...state,
        issueDocuments: {
          documentFromLondonTeam: false,
          nonBureau: false,
          bureauInsurer: true,
        },
      };

    case 'RFI_HISTORY_GET_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'RFI_HISTORY_GET_SUCCESS':
      return {
        ...state,
        rfi: {
          ...state.rfi,
          history: action.payload,
        },
        loading: false,
      };

    case 'PREMIUM_PROCESSING_NEW_RFI_DATA':
      return {
        ...state,
        rfi: {
          ...state.rfi,
          saveDraft: action.payload,
        },
      };

    case 'RFI_QUERY_CODES_GET_SUCCESS':
      return {
        ...state,
        rfi: {
          ...state.rfi,
          queryCodes: action.payload,
        },
      };

    case 'RFI_RESPONSE_DATE_SUCCESS':
      return {
        ...state,
        rfi: {
          ...state.rfi,
          responseDate: action.payload,
        },
      };

    case 'PREMIUM_PROCESSING_SUBMIT_NEW_RFI_POST_REQUEST':
      return {
        ...state,
        rfi: {
          ...state.rfi,
          newRFI: action.payload,
        },
      };

    case 'PREMIUM_PROCESSING_SUBMIT_NEW_RFI_POST_SUCCESS':
      return {
        ...state,
        rfi: {
          ...state.rfi,
          newRFI: action.payload.items,
        },
      };

    case 'PREMIUM_PROCESSING_SUBMIT_NEW_RFI_POST_FAILURE':
      return {
        ...state,
        rfi: {
          ...state.rfi,
          newRFI: [],
        },
      };

    case 'PREMIUM_PROCESSING_CASE_TEAM_GET_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_CASE_TEAM_GET_SUCCESS':
      return {
        ...state,
        caseTeamModule: {
          ...action.payload,
          error: false,
        },
        loading: false,
      };

    case 'PREMIUM_PROCESSING_CASE_TEAM_GET_ERROR':
      return {
        ...state,
        caseTeamModule: {
          ...state.caseTeamModule,
          error: true,
        },
      };

    case 'PREMIUM_PROCESSING_CASE_TEAM_MODULE_GET_LOADING':
      return {
        ...state,
        caseTeamModule: {
          ...state.caseTeamModule,
          isCaseTeamModuleLoading: action.payload,
        },
      };
    case 'PREMIUM_PROCESSING_CASE_RFI_GET_SUBTABS_SUCCESS':
      return {
        ...state,
        caseRfiSubTabs: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_CASE_RFI_GET_SUBTABS_ERROR':
      return {
        ...state,
        caseRfiSubTabs: initialState.caseRfiSubTabs,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_CASE_RFI_GET_SUBTABS_LOADING':
      return {
        ...state,
        isCaseRfiSubTabsLoading: action.payload,
      };

    case 'RFI_RESOLUTION_CODE_GET_SUCCESS':
      return {
        ...state,
        rfiResolutionCodes: action.payload,
      };

    case 'PREMIUM_PROCESSING_ASSIGNED_TO_USERS_GET_SUCCESS':
      return {
        ...state,
        assignedToUsers: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_ASSIGNED_TO_USERS_GET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_ASSIGNTO_USER_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_ASSIGNTO_USER_SUCCESS':
      return {
        ...state,
        postAssignToUser: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_ASSIGNTO_USER_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_CASE_FILTERS_SUCCESS':
      return {
        ...state,
        bordereauType: action.payload.bordereauType,
        bpmFlag: action.payload.bpmFlag,
        bpmStage: action.payload.bpmStage,
        facilityType: action.payload.facilityType,
        departments: action.payload.department,
      };
    case 'PREMIUM_PROCESSING_CASE_FILTERS_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_SAVE_NOTE_GET_SUCCESS':
      const notesData = [...state.caseDetails.caseNotes.notesHistory, action.payload.notesDetails];
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          ...state.caseDetails.caseNotes,
          caseNotes: {
            notesHistory: notesData,
          },
        },
      };

    case 'PREMIUM_PROCESSING_SAVE_NOTE_GET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_NON_BUREAU_LIST_GET_REQUEST':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            nonBureauList: {
              ...initialState.caseDetails.caseIssueDocuments.nonBureauList,
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_NON_BUREAU_LIST_GET_SUCCESS':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            nonBureauList: {
              ...state.caseDetails.caseIssueDocuments.nonBureauList,
              items: action.payload.items,
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_NON_BUREAU_LIST_GET_FAILURE':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            nonBureauList: {
              ...initialState.caseDetails.caseIssueDocuments.nonBureauList,
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_BUREAU_LIST_GET_REQUEST':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            bureauList: {
              ...initialState.caseDetails.caseIssueDocuments.bureauList,
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_BUREAU_LIST_GET_SUCCESS':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            bureauList: {
              items: (utils.generic.isValidArray(action.payload.items, true) && [...action.payload.items]) || [],
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_BUREAU_LIST_GET_FAILURE':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            bureauList: {
              ...state.caseDetails.caseIssueDocuments.bureauList,
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_CASE_CLIENT_LIST_GET_REQUEST':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            caseClientList: {
              ...state.caseDetails.caseIssueDocuments.caseClientList,
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_CASE_CLIENT_LIST_GET_SUCCESS':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            caseClientList: {
              ...state.caseDetails.caseIssueDocuments.caseClientList,
              items: action.payload.items,
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_CASE_CLIENT_LIST_GET_FAILURE':
      return {
        ...state,
        caseDeatils: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            caseClientList: {
              ...state.caseDetails.caseIssueDocuments.caseClientList,
              items: [],
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_EMAIL_SENT_STATUS_GET_SUCCESS':
      return {
        ...state,
        emailSentStatus: action.payload.emailSentStatus,
      };

    case 'PREMIUM_PROCESSING_EMAIL_SENT_STATUS_GET_FAILURE':
      return {
        ...state,
        emailSentStatus: initialState.emailSentStatus,
      };

    case 'PREMIUM_PROCESSING_REJECT_CASE_INITIATION_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_REJECT_CASE_INITIATION_SUCCESS':
      return {
        ...state,
        rejectCase: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_REJECT_CASE_INITIATION_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_REJECT_CLOSE_CASE_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_REJECT_CLOSE_CASE_SUCCESS':
      return {
        ...state,
        rejectCloseCase: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_REJECT_CLOSE_CASE_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_BUREAU_DETAILS_POST_REQUEST':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            bureauList: {
              ...state.caseDetails.caseIssueDocuments.bureauList,
            },
          },
        },
      };
    case 'PREMIUM_PROCESSING_BUREAU_DETAILS_POST_SUCCESS': {
      const bureauListItems = (utils.generic.isValidArray(state.caseDetails.caseIssueDocuments.bureauList.items, true) && [
        ...state.caseDetails.caseIssueDocuments.bureauList.items,
      ]) || [...initialState.caseDetails.caseIssueDocuments.bureauList.items];
      action.payload.items.forEach((item) => {
        if (item.issueDocsType === constants.BUREAU_RFITYPE) {
          bureauListItems.push(item);
        }
      });

      return {
        ...state,
        loading: false,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            bureauList: {
              items: [...bureauListItems],
            },
          },
        },
      };
    }
    case 'PREMIUM_PROCESSING_BUREAU_DETAILS_POST_FAILURE':
      return {
        ...state,
        error: action.payload,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            bureauList: {
              ...state.caseDetails.caseIssueDocuments.bureauList,
            },
          },
        },
      };

    case 'PREMIUM_PROCESSING_BUREAU_INSURER_DETAILS_DELETE_REQUEST':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            bureauList: {
              ...state.caseDetails.caseIssueDocuments.bureauList,
            },
          },
        },
      };
    case 'PREMIUM_PROCESSING_BUREAU_INSURER_DETAILS_DELETE_SUCCESS':
      const stateData =
        (utils.generic.isValidArray(state.caseDetails.caseIssueDocuments.bureauList.item, true) && [
          ...state.caseDetails.caseIssueDocuments.bureauList.items,
        ]) ||
        [];
      const data = stateData?.filter((item) => item.caseIncidentIssueDocsId !== action.payload);
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            bureauList: {
              items: [...data],
            },
          },
        },
      };
    case 'PREMIUM_PROCESSING_BUREAU_INSURER_DETAILS_DELETE_FAILURE':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          caseIssueDocuments: {
            ...state.caseDetails.caseIssueDocuments,
            bureauList: {
              ...state.caseDetails.caseIssueDocuments.bureauList,
            },
          },
        },
      };
    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_SUCCESS':
      return {
        ...state,
        checkSigningCase: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'PREMIUM_PROCESSING_CHECK_SIGNING_COMPLETE_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_COMPLETE_SUCCESS':
      return {
        ...state,
        checkSigningCompleteCase: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_COMPLETE_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CANCEL_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CANCEL_SUCCESS':
      return {
        ...state,
        checkSigningCancelCase: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_CANCEL_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_SUCCESS':
      return {
        ...state,
        checkSigningRejectCase: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_RESPOND_RFI_GET_SUCCESS':
      const respondRFIData = [...state.rfi.history, action.payload];
      return {
        ...state,
        rfi: {
          ...state.rfi,
          history: respondRFIData,
        },
      };

    case 'PREMIUM_PROCESSING_RESPOND_RFI_GET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_RESOLVE_RFI_GET_SUCCESS':
      const resolveRFIData = [...state.rfi.history, action.payload];
      return {
        ...state,
        rfi: {
          ...state.rfi,
          history: resolveRFIData,
        },
      };

    case 'PREMIUM_PROCESSING_RESOLVE_RFI_GET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_CREATE_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_CREATE_SUCCESS':
      return {
        ...state,
        checkSigningRejectCreateCase: action.payload,
        loading: false,
      };

    case 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_CREATE_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'PREMIUM_PROCESSING_BUREAU_RFI_DETAILS_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'PREMIUM_PROCESSING_BUREAU_RFI_DETAILS_SUCCESS':
      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          bureauRfiDetails: action.payload,
        },
        loading: false,
      };

    case 'PREMIUM_PROCESSING_BUREAU_RFI_DETAILS_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default premiumProcessingReducers;
