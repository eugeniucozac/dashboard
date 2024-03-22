import get from 'lodash/get';
import xorBy from 'lodash/xorBy';

// app
import config from 'config';
import * as constants from 'consts';
import * as utils from 'utils';

const initialState = {
  isChoosing: false,
  isLossSubmitted: false,
  sectionEnabledUG: false,
  claimsStepper: 0,
  catCodes: [],
  claimsAssociateWithLoss: [],
  claimantNames: [],
  lossQualifiers: [],
  lossInformation: {},
  selectedLossInformation: {},
  claimsInformation: {},
  selectedClaimsDetails: {},
  isClaimsInfoLoading: false,
  isLossInfoLoading: false,
  isPolicyInfoLoading: false,
  isPolicySectionsLoading: false,
  isClaimsAssociateWithLossLoading: false,
  isSanctionCheckStatusLoading: false,
  settlementCurrencies: [],
  queryCode: [],
  sendToList: [],
  policyData: {
    policyID: null,
  },
  policyInformation: {},
  claims: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'lossRef',
      direction: 'desc',
    },
    searchBy: 'claimantName',
    filters: {},
  },
  processing: {
    selected: [],
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'createdDate',
      direction: 'desc',
    },
    searchBy: constants.CLAIMS_SEARCH_OPTION_CLAIM_REF,
    filters: {},
    isloadingFilters: false,
    isUserClaim: false,
    isClosedClaim: false,
    isTeamClaim: false,
  },
  tasksProcessing: {
    selectedTaskType: '',
    selected: [],
    items: [],
    rfiCount: '',
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    searchBy: 'taskRef',
    isloadingFilters: false,
    filters: {},
    appliedFilters: [],
    sort: {
      by: 'targetDueDate, priority',
      type: 'lexical',
      direction: 'asc',
    },
    associatedTaskDetails: {},
  },
  policies: {
    items: [],
    itemsTotal: 0,
    page: 0,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'policyRef',
      direction: 'desc',
    },
    searchBy: constants.CLAIMS_POLICY_SEARCH_OPTION.policyRef,
    filters: {},
    isloadingFilters: false,
    isloadingTable: false,
  },
  claimPoliciesSearchFilters: {
    search: '',
    filters: {
      policyType: [],
      insured: [],
      reinsured: [],
      client: [],
      riskDetails: [],
      inceptionDate: null,
      expiryDate: null,
      division: [],
      policyStatus: [],
      sanctionsCheck: [],
    },
  },
  policySections: [],
  interest: {
    items: [],
    selectedInterest: '',
    isLoading: false,
  },
  insured: {
    items: [],
    itemsTotal: 0,
    page: 0,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'sourceID',
      direction: 'desc',
    },
  },
  notes: {
    items: [],
    itemsTotal: 0,
    page: 0,
    pageSize: config.ui.pagination.options[0],
    pageTotal: 0,
    query: '',
    sort: {
      by: 'updatedDate',
      direction: 'desc',
      type: 'date',
    },
    filters: [],
  },
  rfis: {
    items: [],
    itemsTotal: 0,
    page: 0,
    pageSize: config.ui.pagination.options[1],
    pageTotal: 0,
    query: '',
    sort: {
      by: 'targetDueDate, priority',
      direction: 'asc',
      type: 'date',
    },
    filters: [],
  },
  audits: {
    items: [],
    itemsTotal: 0,
    page: 0,
    pageSize: config.ui.pagination.options[0],
    pageTotal: 0,
    query: '',
    sort: {
      by: 'createdBy',
      direction: 'desc',
    },
    filters: [],
  },
  taskNotes: {
    items: [],
    itemsTotal: 0,
    page: 0,
    pageSize: config.ui.pagination.options[0],
    pageTotal: 0,
    query: '',
    sort: {
      by: 'updatedDate',
      direction: 'desc',
      type: 'date',
    },
    filters: [],
  },
  rfiHistory: {
    data: [],
    isLoading: false,
  },
  rfiInfo: {
    data: {},
    documents: [],
  },
  underWritingGroups: {
    items: [],
    percentageOfSelected: 0,
    sort: {
      by: 'groupRef',
      direction: 'asc',
    },
    isLoading: false,
  },
  allClaimDetails: {},
  claimBordereauPeriods: [],
  claimPolicyInsures: [],
  isClaimPolicyInsuresLoading: false,
  claimPolicyClients: [],
  isPolicyClientsLoading: false,
  claimDetailInformation: {},
  claimDetailInformationSuccess: null,
  beAdjuster: {
    items: [],
    selectedbeAdjuster: null,
  },
  priorities: [],
  isPrioritiesLoading: false,
  prioritiesLoaded: false,
  reopenTaskList: [],
  claimsProcessingData: {
    search: '',
    filters: {
      dateAndTimeCreated: '',
      targetDueDate: '',
      team: [],
      assignedToDropdownList: [],
      priority: [],
      status: [],
    },
  },
  claimsRefData: {
    claimStatus: [],
    claimant: [],
    lossDateFrom: [],
    lossDateTo: [],
    lossName: [],
    insured: [],
    priority: [],
  },
  claimLossSearchFilters: {
    search: '',
    filters: {
      claimStatus: [],
      claimant: [],
      lossDateFrom: null,
      lossDateTo: null,
      lossName: [],
      insured: [],
      priority: [],
    },
  },
  claimsProcessingSearchFilters: {
    search: '',
    filters: {
      dateAndTimeCreated: [],
      targetDueDate: [],
      team: [],
      assignedToDropdownList: [],
      priority: [],
      status: [],
    },
  },
  statuses: [],
  complexityPolicies: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'policyRef',
      direction: 'asc',
    },
    selectedComplexityPolicies: [],
    savedComplexPolicies: [],
    checkedComplexity: false,
  },
  complexityPoliciesFlagged: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: null,
    sort: {
      by: 'policyRef',
      direction: 'asc',
    },
  },
  complexityBasisValues: {
    type: '',
    items: null,
    itemsTotal: 0,
    page: 1,
    pageSize: 5,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'createdDate',
      direction: 'desc',
    },
    loaded: false,
  },
  complexityReferralValues: {
    items: null,
    itemsTotal: 0,
    page: 1,
    pageSize: 5,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'createdDate',
      direction: 'desc',
    },
  },
  checkedComplexAddPolicies: [],
  claimData: {},
  complexityManagement: {
    activeTab: '',
    division: [],
    divisionChanges: {},
    complexityBasisValueId: {},
    complexityBasisDivisionMatrix: [],
    complexityBasisDivisionMatrixChanges: {},
    complexityReferralValueId: {},
    complexityReferralDivisionMatrix: [],
    complexityReferralDivisionMatrixChanges: {},
  },
  complexInsured: {
    items: null,
    itemsTotal: 0,
    page: 0,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'insured',
      direction: 'asc',
    },
    selectedComplexityInsured: [],
    savedComplexInsured: [],
    checkedComplexity: false,
  },
  checkedComplexAddInsured: [],
  complexityValues: [],
  complexityValuesLoaded: false,
  complexityTypes: [],
  complexityTypesLoaded: false,
  referralValues: [],
  referralResponse: [],
  refTabTasks: {
    selected: [],
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.options[0],
    pageTotal: 0,
    query: '',
    filters: [],
    appliedFilters: [],
    sort: {
      by: 'taskRef',
      type: 'lexical',
      direction: 'desc',
    },
  },
  isClaimsAssignedToUsersLoading: false,
  claimsAssignedToUsers: {
    type: '',
    orgName: '',
    items: [],
    loaded: false,
  },
  setPriority: {
    claimPriority: {},
  },
  adhocTask: {
    status: false,
    data: {},
    documents: [],
  },
  tasksClaimsReporting: {
    data: {},
    isDataLoading: false,
  },
  processingNavigation: {
    navigationItem: constants.CLAIMS_PROCESSING_TAB_SELECTION,
    selectedView: constants.CLAIM_TEAM_TYPE.myClaims,
  },
  lossDocDetails: [],
  dmsDocDetails: {
    lossDocDetails: [],
    linkPolicyDocDetails: [],
    claimsDocDetails: [],
    manageDocument: {
      lossDocumentDetails: [],
      claimDocumentDetails: [],
    },
  },
  linkPolicies: {
    searchBy: 'clientName',
    searchTerm: '',
    data: {},
    loader: false,
    fieldLoader: false,
  },
  lossActions: {
    items: [],
    itemsTotal: 0,
    page: 0,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'targetDueDate,priority',
      direction: 'asc',
      type: 'date',
    },
    filters: [],
    fieldLoader: false,
  },
  lossesTab: {
    isLoading: false,
    searchText: '',
    items: [],
    itemsTotal: 0,
    page: 0,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'createdDate,lossRef',
      direction: 'desc',
    },
    searchBy: '',
    filters: {},
    filterValues: {},
    refreshLossesTab: false,
  },
  advanceTab: {
    searchText: '',
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sort: {
      by: 'lossRef,claimRef',
      direction: 'desc',
    },
    searchBy: '',
    filters: {},
    filterValues: {},
    refreshAdvanceTab: false,
    pullClosedRecords: false,
    isloadingFilters: false,
    isloadingTable: false,
  },
  claimsTab: {
    isClaimsTabLoaded: false,
    searchBy: '',
    searchText: '',
    view: '',
    tableDetails: {
      selected: [],
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: config.ui.pagination.default,
      pageTotal: 0,
      query: '',
      sort: {
        by: 'processRef',
        direction: 'desc',
      },
      searchBy: constants.CLAIMS_SEARCH_OPTION_INSURED,
      filters: {
        claimLossFromDate: '',
        insured: [],
        division: [],
        claimStatus: [],
        claimStage: [],
        assignedTo: [],
        team: [],
        priority: [],
      },
      isloadingFilters: false,
      isloadingTable: false,
      selectedFilters: [],
    },
  },
  tasksTab: {
    selectedTaskType: '',
    selected: [],
    items: [],
    rfiCount: '',
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    searchBy: 'taskRef',
    isloadingFilters: false,
    isTableLoading: false,
    filters: {},
    appliedFilters: {},
    previousTaskType: '',
    sort: {
      by: 'targetDueDate',
      type: 'lexical',
      direction: 'asc',
    },
  },
  taskDashboard: {
    taskDetails: {
      items: {},
      query: '',
      isLoading: false,
    },
    checkList: [],
    nextActions: [],
    checkListChanges: [],
    checkListChangesPushed: [],
    nextActionChangesPushed: [],
    purchasedCurrencyRequired: '',
  },
  rfiDashboard: {
    rfiDetails: {
      items: {},
      query: '',
      isLoading: false,
    },
  },
  pushBackRoute: '',
  fnolSelectedTab: '',
  caseIncidentDetails: {},
  sanctionCheckStatus: {},
  bpmClaimInformation: {
    data: {},
    isLoading: false,
  },
  rfiHistoryDocuments: {
    documentList: [],
    isLoading: false,
  },
};

const claimsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CLAIMS_ASSOCIATE_WITH_LOSS_GET_REQUEST':
      return {
        ...state,
        isClaimsAssociateWithLossLoading: true,
      };
    case 'CLAIMS_ASSOCIATE_WITH_LOSS_GET_SUCCESS':
      return {
        ...state,
        claimsAssociateWithLoss: action.payload,
        isClaimsAssociateWithLossLoading: false,
      };
    case 'CLAIMREF_EDIT_NOTES_SUCCESS':
      // eslint-disable-next-line array-callback-return
      const getNotesItems = state.notes.items.filter((item, idx) =>
        item.caseIncidentNotesID !== action.payload.caseIncidentNotesID ? item : null
      );
      return {
        ...state,
        notes: {
          ...state.notes,
          items: [action.payload, ...getNotesItems],
        },
      };
    case 'CLAIMS_SAVE_NOTES_POST_SUCCESS':
      const isArrayLargerThanPageSize = state.notes.items.length + 1 > state.notes.pageSize;
      return {
        ...state,
        notes: {
          ...state.notes,
          items: isArrayLargerThanPageSize ? [action.payload, ...state.notes.items.slice(0, -1)] : [action.payload, ...state.notes.items],
          itemsTotal: state.notes.itemsTotal + 1,
        },
      };

    case 'CLAIMS_ADHOC_TASK_RESET_STATUS':
    case 'CLAIMS_SAVE_ADHOC_TASK_POST_REQUEST':
    case 'CLAIMS_EDIT_ADHOC_TASK_POST_REQUEST':
      return {
        ...state,
        adhocTask: { ...initialState.adhocTask },
      };
    case 'CLAIMS_SAVE_ADHOC_TASK_POST_SUCCESS':
      const createAdHocResp = action?.payload;
      return {
        ...state,
        adhocTask: {
          status: createAdHocResp?.status === 'OK' || initialState.adhocTask.status,
          data: createAdHocResp?.data,
          documents: initialState.adhocTask.documents,
        },
      };
    case 'CLAIMS_SAVE_ADHOC_TASK_POST_FAILURE':
    case 'CLAIMS_EDIT_ADHOC_TASK_POST_FAILURE':
      return {
        ...state,
        error: action.payload,
        adhocTask: { ...initialState.rfiInfo },
      };

    case 'CLAIMS_EDIT_ADHOC_TASK_POST_SUCCESS':
      const editAdHocResp = action?.payload;
      const taskDetails = { ...action?.payload?.taskDetails };
      const editAdHocDetails = { ...editAdHocResp?.data };
      const formattedResp = { ...taskDetails, name: editAdHocDetails?.taskName, dueDate: editAdHocDetails?.targetDueDate };
      return {
        ...state,
        adhocTask: {
          status: editAdHocResp?.status === 'OK' || initialState.adhocTask.status,
          data: { ...formattedResp, ...editAdHocDetails },
          ...state.adhocTask,
        },
      };
    case 'SET_ADHOC_TASK_DOCUMENTS':
      return {
        ...state,
        adhocTask: {
          ...state.adhocTask,
          documents: action?.payload,
        },
      };
    case 'CLAIMS_SAVE_RFI_POST_REQUEST':
      return {
        ...state,
        rfiInfo: initialState.rfiInfo,
      };
    case 'CLAIMS_SAVE_RFI_POST_RESET':
      return {
        ...state,
        rfiInfo: { ...initialState.rfiInfo },
      };
    case 'CLAIMS_SAVE_RFI_POST_SUCCESS':
      return {
        ...state,
        rfiInfo: {
          data: action.payload,
          documents: initialState.rfiInfo.documents,
        },
      };
    case 'CLAIMS_SAVE_RFI_POST_FAILURE':
      return {
        ...state,
        error: action.payload,
        rfiInfo: initialState.rfiInfo,
      };
    case 'CLAIMS_UPDATE_RFI_POST_SUCCESS':
      return {
        ...state,
        rfiInfo: {
          data: action.payload,
          documents: initialState.rfiInfo.documents,
        },
      };
    case 'CLAIMS_UPDATE_RFI_POST_FAILURE':
      return {
        ...state,
        error: action.payload,
        rfiInfo: initialState.rfiInfo,
      };
    case 'SET_RFI_DOCUMENTS':
      return {
        ...state,
        rfiInfo: {
          data: state.rfiInfo.data,
          documents: action.payload,
        },
      };
    case 'CLOSE_SANCTIONS_CHECK_SUCCESS':
    case 'CLOSE_CLAIMS_POST_SUCCESS':
      return {
        ...state,
      };
    case 'CLAIMS_CAT_CODES_GET_SUCCESS':
      return {
        ...state,
        catCodes: action.payload,
      };
    case 'CLAIMS_CASE_INCIDENT_DETAILS_GET_SUCCESS':
      return {
        ...state,
        caseIncidentDetails: action.payload,
      };
    case 'CLAIMS_CASE_INCIDENT_DETAILS_GET_REQUEST':
      return {
        ...state,
        caseIncidentDetails: initialState.caseIncidentDetails,
      };
    case 'RESET_CASE_INCIDENT_DETAILS':
      return {
        ...state,
        caseIncidentDetails: initialState.caseIncidentDetails,
      };
    case 'CLAIMS_STATUSES_GET_SUCCESS':
      return {
        ...state,
        statuses: action.payload,
        claimsStatusObj: action.payload?.reduce((acc, status) => {
          const { name, id } = status;
          return { ...acc, [name]: id?.toString() };
        }, {}),
      };
    case 'CLAIMS_CLAIMANT_NAMES_GET_SUCCESS':
      return {
        ...state,
        claimantNames: action.payload,
      };
    case 'CLAIMS_CLAIMANT_NAMES_UPDATE_SUCCESS':
      return {
        ...state,
        claimantNames: [...state.claimantNames, { id: action.payload.id + 1, name: action.payload.name }],
      };
    case 'CLAIMS_LOSS_QUALIFIERS_GET_SUCCESS':
      return {
        ...state,
        lossQualifiers: action.payload,
      };
    case 'CLAIMS_POLICY_INFORMATION_GET_REQUEST':
      return {
        ...state,
        isPolicyInfoLoading: true,
      };
    case 'CLAIMS_POLICY_INFORMATION_GET_SUCCESS':
      const selectPolicyType = action.payload.policyType;
      return {
        ...state,
        policyInformation: action.payload,
        sectionEnabledUG: constants.CLAIM_SECTION_ENABLED_UG.indexOf(selectPolicyType) > -1 || false,
        isPolicyInfoLoading: false,
      };
    case 'CLAIMS_POLICY_INFORMATION_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
        isPolicyInfoLoading: false,
      };
    case 'GET_LOSS_INFORMATION_REQUEST':
      return {
        ...state,
        lossInformation: action.payload,
        isLossInfoLoading: true,
      };
    case 'LOSS_SELECT':
      return {
        ...state,
        selectedLossInformation: action.payload.lossObj,
      };
    case 'RESET_SELECTED_LOSS_ITEM':
      return {
        ...state,
        selectedLossInformation: initialState.selectedLossInformation,
      };
    case 'GET_LOSS_INFORMATION_FAILURE':
      return {
        ...state,
        error: action.payload,
        isLossInfoLoading: false,
      };

    case 'CLAIMS_UNDERWRITING_GROUPS_GET_SUCCESS':
      return {
        ...state,
        underWritingGroups: {
          ...state.underWritingGroups,
          items: action.payload.map((item) => ({ ...item, selected: false })),
          percentageOfSelected: 0,
        },
      };
    case 'RESET_CLAIMS_UNDERWRITING_GROUPS':
      return {
        ...state,
        underWritingGroups: {
          ...state.underWritingGroups,
          items: [],
          percentageOfSelected: 0,
        },
        claimsInformation: {
          ...state.claimsInformation,
          policyUnderWritingGroupDtoList: [],
        },
      };
    case 'CLAIMS_UNDERWRITING_GROUPS_SORTING':
      const selected = state.underWritingGroups.items
        .filter((item) => action.payload.includes(item.groupRef))
        .map((item) => ({ ...item, selected: true }));
      const remained = state.underWritingGroups.items
        .filter((item) => !action.payload.includes(item.groupRef))
        .map((item) => ({ ...item, selected: false }));
      const initial = state.underWritingGroups.items
        .sort((a, b) => a.groupRef.localeCompare(b.groupRef))
        .map((item) => ({ ...item, selected: false }));

      let selectedPercentage = selected?.reduce((acc, current) => acc + current.percentage, 0);
      if (Math.floor(selectedPercentage) !== selectedPercentage && selectedPercentage?.toString()?.split('.')[1]?.length > 5) {
        selectedPercentage = selectedPercentage.toFixed(5);
      }

      return {
        ...state,
        underWritingGroups: {
          ...state.underWritingGroups,
          items: action.payload.length > 0 ? [...selected, ...remained] : initial,
          percentageOfSelected: action.payload.length > 0 ? selectedPercentage : 0,
        },
      };

    case 'CLAIMS_UNDERWRITING_GROUPS_BY_SECTION_GET_REQUEST':
      return {
        ...state,
        underWritingGroups: {
          ...initialState.underWritingGroups,
          isLoading: true,
        },
      };
    case 'CLAIMS_UNDERWRITING_GROUPS_BY_SECTION_GET_SUCCESS':
      const { sortedUnderwritingGroups } = action.payload;
      return {
        ...state,
        underWritingGroups: {
          ...state.underWritingGroups,
          items: utils.generic.isValidArray(sortedUnderwritingGroups)
            ? sortedUnderwritingGroups?.filter((item) => Number(item?.isDisabled) === 0)?.map((item) => ({ ...item, selected: false }))
            : [],
          percentageOfSelected: 0,
          isLoading: false,
        },
      };
    case 'CLAIMS_UNDERWRITING_GROUPS_BY_SECTION_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
        underWritingGroups: {
          ...initialState.underWritingGroups,
        },
      };

    case 'CLAIM_STATUS_EDIT_SUCCESS':
      const { data, id } = action.payload;
      const updatedStatus = state.claims.items.map((item) => {
        if (item.claimID === id) {
          return {
            ...item,
            claimStatusID: data.claimStatusId,
          };
        } else {
          return item;
        }
      });

      return {
        ...state,
        claims: {
          ...state.claims,
          items: updatedStatus,
        },
      };
    case 'LOSS_INFORMATION_EDIT_SUCCESS':
      const updatedLoss = {
        ...state.lossInformation,
        catCodesID: action.payload.catCodesID,
        isActive: action.payload.isActive,
        lossDescription: action.payload.lossDescription,
        lossName: action.payload.lossName,
        fromDate: action.payload.fromDate,
        toDate: action.payload.toDate,
        firstContactDate: action.payload.firstContactDate,
      };

      return {
        ...state,
        lossInformation: updatedLoss,
      };

    case 'CLAIMS_PROCESSING_GET_REQUEST':
      const { newRequestType } = action.payload.appliedParams;
      return {
        ...state,
        processing: {
          ...state.processing,
          ...(newRequestType === constants.CLAIM_PROCESSING_REQ_TYPES.filter ? { isloadingFilters: true } : {}),
        },
      };
    case 'CLAIMS_PROCESSING_GET_SUCCESS':
      const { filterValue, searchValue } = action.payload.items;
      const pageSize = get(action.payload.pagination, 'size', initialState.processing.pageSize);

      const claimRequestType = action.payload.requestType;
      const isNonfilterTypCall = claimRequestType !== constants.CLAIM_PROCESSING_REQ_TYPES.filter;

      return {
        ...state,
        processing: {
          ...state.processing,
          ...(isNonfilterTypCall
            ? {
                items: [...(utils.generic.isValidArray(searchValue) ? searchValue : [])],
                itemsTotal: get(action.payload.pagination, 'totalElements', 0),
                page: get(action.payload.pagination, 'page', 0) + 1,
                pageSize: pageSize !== 0 ? pageSize : initialState.processing.pageSize,
                pageTotal: get(action.payload.pagination, 'totalPages', 0),
                query: get(action.payload.pagination, 'search') || '',
                searchBy: get(action.payload.pagination, 'searchBy') || '',
              }
            : {}),
          sort: {
            by: get(action.payload.pagination, 'orderBy') || '',
            direction: (get(action.payload.pagination, 'direction') || '').toLowerCase(),
          },
          filters: !isNonfilterTypCall ? (filterValue ? filterValue : { ...state.processing.filters }) : { ...state.processing.filters },
          isloadingFilters: isNonfilterTypCall ? state.processing.isloadingFilters : false,
          selected: [],
        },
      };
    case 'CLAIMS_PROCESSING_GET_FAILURE':
      return {
        ...state,
        error: action.payload?.error,
        processing: {
          ...state.processing,
          isloadingFilters: action.payload?.isNonFilterTypeCall ? state.processing.isloadingFilters : false,
        },
      };

    case 'CLAIMS_PROCESSING_UPDATE_CLAIM_SUCCESS':
      const updateClaimsIds = action.payload.claims?.map((claim) => claim.claimId);
      const updateClaimsValues = action.payload.values;
      const updateClaimsName = updateClaimsValues?.assignTo?.fullName || '';
      const updateClaimsEmail = updateClaimsValues?.assignTo?.email || '';
      const updateClaimsComplexity = updateClaimsValues?.complexity;
      const updateClaimsComplexityBasis = updateClaimsValues?.complexityBasis?.complexityRulesValue;
      const updateClaimsPriority = updateClaimsValues?.priority;
      const updateClaimsPriorityId = updateClaimsValues?.priorityId;
      const updateClaimsTeam = updateClaimsValues?.team;

      return {
        ...state,
        // this updates the claim data for the dashboard page
        claimsInformation: {
          ...state.claimsInformation,
          complexity: updateClaimsComplexity || state.claimsInformation.complexity,
          complexityBasis: updateClaimsComplexityBasis || state.claimsInformation.complexityBasis,
          priorityID: updateClaimsPriorityId || state.claimsInformation.priorityID,
          priorityDescription: updateClaimsPriority || state.claimsInformation.priorityDescription,
        },
        // this updates the claims data on the claims table tab
        claimsTab: {
          ...state.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            items: state.claimsTab.tableDetails.items?.map((claim) => {
              if (updateClaimsIds.includes(claim.claimId)) {
                return {
                  ...claim,
                  assignedTo: updateClaimsName,
                  assignedToEmail: updateClaimsEmail,
                  complexity: updateClaimsComplexity || claim.complexity,
                  complexityBasis: updateClaimsComplexityBasis || claim.complexityBasis,
                  priority: updateClaimsPriority || claim.priority,
                  priorityId: updateClaimsPriorityId || claim.priorityId,
                  team: updateClaimsTeam || claim.team,
                };
              } else {
                return claim;
              }
            }),
            selected: state.claimsTab.tableDetails.selected?.map((claim) => {
              if (updateClaimsIds.includes(claim.claimId)) {
                return {
                  ...claim,
                  assignedTo: updateClaimsName,
                  assignedToEmail: updateClaimsEmail,
                  complexity: updateClaimsComplexity || claim.complexity,
                  complexityBasis: updateClaimsComplexityBasis || claim.complexityBasis,
                  priority: updateClaimsPriority || claim.priority,
                  priorityId: updateClaimsPriorityId || claim.priorityId,
                  team: updateClaimsTeam || claim.team,
                };
              } else {
                return claim;
              }
            }),
          },
        },
      };

    case 'CLAIMS_PROCESSING_FILTERS_RESET':
      return {
        ...state,
        processing: {
          ...state.processing,
          filters: initialState.processing.filters,
        },
      };

    case 'CLAIMS_PROCESSING_SEARCH_RESET':
      return {
        ...state,
        processing: {
          ...state.processing,
          query: initialState.processing.query,
        },
      };

    case 'CLAIMS_PROCESSING_ITEMS_RESET':
      return {
        ...state,
        processing: {
          ...state.processing,
          items: initialState.processing.items,
        },
      };

    case 'CLAIMS_PROCESSING_SELECT':
      return {
        ...state,
        processing: {
          ...state.processing,
          selected: action.payload.forceSingleItem
            ? [action.payload.claimObj]
            : xorBy(state.processing.selected || [], [action.payload.claimObj], 'processID'),
        },
      };

    case 'CLAIMS_PROCESSING_SELECTED_RESET':
      return {
        ...state,
        processing: {
          ...state.processing,
          selected: [],
        },
      };

    case 'CLAIM_NOTES_GET_SUCCESS':
      return {
        ...state,
        notes: {
          items: action.payload.items || [],
          itemsTotal: get(action.payload.pagination, 'totalElements', 0),
          page: get(action.payload.pagination, 'page', 0),
          pageSize: get(action.payload.pagination, 'size', initialState.notes.pageSize),
          pageTotal: get(action.payload.pagination, 'totalPages', 0),
          query: get(action.payload.pagination, 'search') || '',
          sort: {
            ...state.notes.sort,
          },
          filters: action.payload.filters !== null ? action.payload.filters : state.notes.filters,
        },
      };

    case 'CLAIM_RFIS_GET_SUCCESS':
      return {
        ...state,
        rfis: {
          items: action.payload.items || [],
          itemsTotal: get(action.payload.pagination, 'totalElements', 0),
          page: get(action.payload.pagination, 'page', 0),
          pageSize: get(action.payload.pagination, 'size', initialState.rfis.pageSize),
          pageTotal: get(action.payload.pagination, 'totalPages', 0),
          query: get(action.payload.pagination, 'search') || '',
          sort: {
            ...state.rfis.sort,
          },
          filters: action.payload.filters !== null ? action.payload.filters : state.rfis.filters,
        },
      };

    case 'CLAIM_AUDIT_TRAIL_GET_SUCCESS':
      return {
        ...state,
        audits: {
          items: action.payload.items || [],
          itemsTotal: get(action.payload.pagination, 'totalElements', 0),
          page: get(action.payload.pagination, 'page', 0),
          pageSize: get(action.payload.pagination, 'size', initialState.audits.pageSize),
          pageTotal: get(action.payload.pagination, 'totalPages', 0),
          query: get(action.payload.pagination, 'search') || '',
          sort: {
            ...state.audits.sort,
          },
        },
      };
    case 'CLAIMS_LOSS_ACTIONS_GET_SUCCESS':
      return {
        ...state,
        lossActions: {
          items: action.payload.data || [],
          itemsTotal: get(action.payload.pagination, 'totalElements', 0),
          page: get(action.payload.pagination, 'page', 0),
          pageSize: get(action.payload.pagination, 'size', initialState.lossActions.pageSize),
          pageTotal: get(action.payload.pagination, 'totalPages', 0),
          query: get(action.payload.pagination, 'search') || '',
          sort: {
            ...state.lossActions.sort,
          },
          filters: action.payload.filters !== null ? action.payload.filters : state.lossActions.filters,
        },
      };
    case 'CLAIM_AUDIT_TRAIL_FILTERS_RESET':
      return {
        ...state,
        audits: {
          ...state.audits,
          filters: initialState.audits.filters,
        },
      };

    case 'CLAIM_AUDIT_TRAIL_ITEMS_RESET':
      return {
        ...state,
        audits: {
          ...state.audits,
          items: initialState.audits.items,
        },
      };

    case 'CLAIM_AUDIT_TRAIL_SEARCH_RESET':
      return {
        ...state,
        audits: {
          ...state.audits,
          query: initialState.audits.query,
        },
      };

    case 'CLAIM_NOTES_RESET':
      return {
        ...state,
        notes: initialState.notes,
      };

    case 'CLAIM_RFIS_RESET':
      return {
        ...state,
        rfis: initialState.rfis,
      };

    case 'CLAIM_TASK_NOTES_GET_SUCCESS':
      return {
        ...state,
        taskNotes: {
          items: action.payload.items || [],
          itemsTotal: get(action.payload.pagination, 'totalElements', 0),
          page: get(action.payload.pagination, 'page', 0),
          pageSize: get(action.payload.pagination, 'size', initialState.taskNotes.pageSize),
          pageTotal: get(action.payload.pagination, 'totalPages', 0),
          query: get(action.payload.pagination, 'search') || '',
          sort: {
            ...state.taskNotes.sort,
          },
          filters: action.payload.filters ?? state.taskNotes.filters,
        },
      };

    case 'CLAIMS_TASK_ADD_NOTE_SUCCESS':
      const isTaskNotesArrayLargerThanPageSize = state.taskNotes.items.length + 1 > state.taskNotes.pageSize;
      return {
        ...state,
        taskNotes: {
          items: isTaskNotesArrayLargerThanPageSize
            ? [action.payload, ...state.taskNotes.items.slice(0, -1)]
            : [action.payload, ...state.taskNotes.items],
          itemsTotal: state.taskNotes.itemsTotal + 1,
          page: get(action.payload.pagination, 'page', 0),
          pageSize: get(action.payload.pagination, 'size', initialState.taskNotes.pageSize),
          pageTotal: get(action.payload.pagination, 'totalPages', 0),
          query: get(action.payload.pagination, 'search') || '',
          sort: {
            ...state.taskNotes.sort,
          },
        },
      };

    case 'CLAIMS_TASK_EDIT_NOTE_SUCCESS':
      return {
        ...state,
        taskNotes: {
          items: state.taskNotes.items.map((item) => {
            if (item.caseIncidentNotesID === action.payload.caseIncidentNotesID) {
              return {
                ...action.payload,
              };
            }

            return item;
          }),
          sort: {
            ...state.taskNotes.sort,
          },
        },
      };

    case 'SET_CLAIMS_NOTES_TAB_FILTER_VALUES':
      return {
        ...state,
        notes: {
          ...state.notes,
          filters: action.payload,
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_GET_REQUEST':
      const { newRequestType: taskReqType } = action.payload.appliedParams;
      return {
        ...state,
        tasksProcessing: {
          ...state.tasksProcessing,
          ...(taskReqType === constants.CLAIM_PROCESSING_REQ_TYPES.filter ? { isloadingFilters: true } : {}),
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_GET_SUCCESS':
      const {
        requestType,
        taskType,
        sortBy: taskSortBy,
        dir: taskDir,
        query,
        navigation,
        items: { filterValue: tasksFiltersValues, searchValue: tasksSearchValues, rfiTasksCount: taskRfiCount },
        pagination: tasksPagination,
        appliedFilters: tasksAppliedFilters,
      } = action.payload;

      const initTaskProcessing = initialState.tasksProcessing;
      const initTaskProcessingSort = initTaskProcessing.sort;
      const stateTaskProcessing = state.tasksProcessing;
      const prevTaskProcessingSelected = stateTaskProcessing.selected;
      const isNonfilterTypeCall = requestType !== constants.CLAIM_PROCESSING_REQ_TYPES.filter;

      return {
        ...state,
        tasksProcessing: {
          ...stateTaskProcessing,
          ...(isNonfilterTypeCall
            ? {
                itemsTotal: get(tasksPagination, 'totalElements', 0),
                page: get(tasksPagination, 'page', 0) + 1,
                pageSize: get(tasksPagination, 'size', initialState.tasksProcessing.pageSize),
                pageTotal: get(tasksPagination, 'totalPages', 0),
                query: get(tasksPagination, 'searchBy') || query || '',
                items: tasksSearchValues || [],
                rfiCount: taskRfiCount || 0,
              }
            : {}),
          sort: {
            by: taskSortBy || initTaskProcessingSort.by,
            direction: taskDir || initTaskProcessingSort.direction,
          },
          filters: isNonfilterTypeCall ? stateTaskProcessing.filters : tasksFiltersValues ? tasksFiltersValues : {},
          appliedFilters: tasksAppliedFilters?.length ? tasksAppliedFilters : initTaskProcessing.appliedFilters,
          selected: navigation ? prevTaskProcessingSelected : [],
          taskType: taskType || initTaskProcessing.taskType,
          isloadingFilters: isNonfilterTypeCall ? stateTaskProcessing.isloadingFilters : false,
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_GET_FAILURE':
      const { error: taskProcessingError, isNonFilterTypeCall } = action.payload;
      return {
        ...state,
        error: taskProcessingError,
        tasksProcessing: {
          ...state.tasksProcessing,
          items: isNonFilterTypeCall ? initialState.tasksProcessing.items : state.tasksProcessing.items,
          isloadingFilters: isNonFilterTypeCall ? state.processing.isloadingFilters : false,
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_FILTERS_RESET':
      return {
        ...state,
        tasksProcessing: {
          ...state.tasksProcessing,
          appliedFilters: initialState.tasksProcessing.appliedFilters,
        },
      };
    case 'CLAIMS_TASKS_PROCESSING_LIST_FILTERS_RESET':
      return {
        ...state,
        tasksTab: {
          ...state.tasksTab,
          appliedFilters: initialState.tasksTab.appliedFilters,
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_SEARCH_RESET':
      return {
        ...state,
        tasksProcessing: {
          ...state.tasksProcessing,
          query: initialState.tasksProcessing.query,
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_LIST_SEARCH_RESET':
      return {
        ...state,
        tasksTab: {
          ...state.tasksTab,
          query: initialState.tasksTab.query,
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_SELECT':
      const { taskObj: taskSelectObj, keepPreviousTasks } = action.payload;
      const newTasksSelectedArray = keepPreviousTasks
        ? xorBy(state.tasksProcessing.selected || [], [taskSelectObj], 'taskRef')
        : [taskSelectObj];

      return {
        ...state,
        tasksProcessing: {
          ...state.tasksProcessing,
          selected: newTasksSelectedArray,
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_LIST_SELECT':
      const newTasksSelectedList = action.payload?.keepPreviousTasks
        ? xorBy(state.tasksTab.selected || [], [action.payload?.taskObj], 'taskRef')
        : [action.payload?.taskObj];

      return {
        ...state,
        tasksTab: {
          ...state.tasksTab,
          selected: newTasksSelectedList,
        },
      };
    case 'CLAIMS_TASKS_PROCESSING_LIST_GET_REQUEST':
      const isNonfilterCalls = action.payload?.requestType !== constants.CLAIM_PROCESSING_REQ_TYPES.filter;
      return {
        ...state,
        tasksTab: {
          ...state.tasksTab,
          isTableLoading: isNonfilterCalls,
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_LIST_GET_SUCCESS':
      const initTaskProcessingList = initialState.tasksTab;
      const initTaskProcessingListSort = initTaskProcessingList.sort;
      const stateTaskProcessingList = state.tasksTab;
      const prevTaskProcessingListSelected = stateTaskProcessingList.selected;
      const isNonfilterTypeCalls = action.payload?.requestTypes !== constants.CLAIM_PROCESSING_REQ_TYPES.filter;
      return {
        ...state,
        tasksTab: {
          ...stateTaskProcessingList,
          ...(isNonfilterTypeCalls
            ? {
                itemsTotal: get(action.payload?.pagination, 'totalElements', 0),
                page: get(action.payload?.pagination, 'page', 0) + 1,
                pageSize: get(action.payload?.pagination, 'size', initialState.tasksTab.pageSize),
                pageTotal: get(action.payload?.pagination, 'totalPages', 0),
                query: get(action.payload?.pagination, 'searchBy') || action.payload?.query || '',
                items: action.payload?.items?.searchValue || [],
                rfiCount: action.payload?.items?.rfiTasksCount || 0,
                isTableLoading: false,
              }
            : {}),
          sort: {
            by: action.payload?.sortBy || initTaskProcessingListSort.by,
            direction: action.payload?.dir || initTaskProcessingListSort.direction,
          },
          filters: isNonfilterTypeCalls
            ? stateTaskProcessingList.filters
            : action.payload?.items?.filterValue
            ? action.payload?.items?.filterValue
            : {},
          appliedFilters: utils.generic.isValidObject(action.payload?.appliedFilters)
            ? action.payload?.appliedFilters
            : initTaskProcessingList.appliedFilters,
          selected: action.payload?.navigation ? prevTaskProcessingListSelected : [],
          taskType: action.payload?.taskType || initTaskProcessingList.taskType,
          isloadingFilters: isNonfilterTypeCalls ? stateTaskProcessingList.isloadingFilters : false,
        },
      };

    case 'CLAIMS_TASKS_PROCESSING_LIST_GET_FAILURE':
      return {
        ...state,
        error: action.payload?.error,
        tasksTab: {
          ...state.tasksTab,
          items: action.payload?.isNonFilterTypeCall ? initialState.tasksTab.items : state.tasksTab.items,
          isloadingFilters: action.payload?.isNonFilterTypeCall ? state.processing.isloadingFilters : false,
          isTableLoading: false,
        },
      };

    case 'CLAIMS_TASK_DASHBOARD_DETAIL_GET_REQUEST':
      const isRfi = action.payload.isRfiTask;
      return {
        ...state,
        ...(!isRfi
          ? {
              taskDashboard: {
                ...state.taskDashboard,
                taskDetails: {
                  ...initialState.taskDashboard.taskDetails,
                  isLoading: !action.payload.isRfiTask,
                },
              },
            }
          : {
              rfiDashboard: {
                rfiDetails: {
                  ...initialState.rfiDashboard.rfiDetails,
                  isLoading: action.payload.isRfiTask,
                },
              },
            }),
      };
    case 'CLAIMS_TASK_DASHBOARD_DETAIL_GET_SUCCESS':
      const isRfiTaskType = action.payload.isRfiTask;
      return {
        ...state,
        tasksProcessing: {
          ...state.tasksProcessing,
          selected: action.payload.items || [],
        },
        ...(!isRfiTaskType
          ? {
              taskDashboard: {
                ...state.taskDashboard,
                taskDetails: {
                  items: action.payload.items,
                  query: action.payload.query,
                  isLoading: false,
                },
              },
            }
          : {
              rfiDashboard: {
                rfiDetails: {
                  items: action.payload.items,
                  query: action.payload.query,
                  isLoading: false,
                },
              },
            }),
      };
    case 'CLAIMS_TASK_DASHBOARD_DETAIL_GET_FAILURE':
      const isRfiType = action.payload.isRfiTask;
      return {
        ...state,
        error: action.payload.error,
        ...(!isRfiType
          ? {
              taskDashboard: {
                ...state.taskDashboard,
                taskDetails: { ...initialState.taskDashboard.taskDetails },
              },
            }
          : {
              rfiDashboard: {
                rfiDetails: { ...initialState.rfiDashboard.rfiDetails },
              },
            }),
      };

    case 'CLAIMS_TASK_DASHBOARD_DETAIL_RESET':
      return {
        ...state,
        taskDashboard: {
          ...state.taskDashboard,
          taskDetails: initialState.taskDashboard.taskDetails,
        },
      };
    case 'CLAIMS_RFI_DASHBOARD_DETAIL_RESET':
      return {
        ...state,
        rfiDashboard: {
          ...state.rfiDashboard,
          rfiDetails: initialState.rfiDashboard.rfiDetails,
        },
      };

    case 'CURRENCY_PURCHASED_VALUE_GET_SUCCESS':
      const selectedOption = action.payload?.data;
      return {
        ...state,
        taskDashboard: {
          ...state.taskDashboard,
          purchasedCurrencyRequired: selectedOption,
        },
      };

    case 'CLAIMS_TASK_PRIORITY_POST_SUCCESS':
      return {
        ...state,
        claimsRefData: action.payload,
      };

    case 'CLAIMS_TASKS_PROCESSING_RESET':
      return {
        ...state,
        tasksProcessing: {
          ...state.tasksProcessing,
          items: initialState.tasksProcessing.items,
        },
      };
    case 'CLAIMS_GET_RFI_HISTORY_REQUEST':
      return {
        ...state,
        rfiHistory: { data: [], isLoading: true },
      };
    case 'CLAIMS_GET_RFI_HISTORY_SUCCESS':
      return {
        ...state,
        rfiHistory: { data: action.payload, isLoading: false },
      };
    case 'CLAIMS_GET_RFI_HISTORY_FAILURE':
      return {
        ...state,
        rfiHistory: initialState.rfiHistory,
        error: action.payload,
      };
    case 'CLAIMS_TASK_SANCTIONS_CHECK_POST_SUCCESS':
      return {
        ...state,
        sanctionsCheck: action.payload,
        loading: false,
      };
    case 'CLAIM_PROCESSING_TASK_TYPE_SELECTED':
      const claimProcessingTaskTypeSelected = action.payload;
      return {
        ...state,
        tasksProcessing: {
          ...state.tasksProcessing,
          selectedTaskType: claimProcessingTaskTypeSelected,
        },
      };

    case 'CLAIM_PROCESSING_PREVIOUS_TASK_TYPE_SELECTED':
      const claimProcessingPreviousTaskTypeSelected = action.payload;
      return {
        ...state,
        tasksTab: {
          ...state.tasksTab,
          previousTaskType: claimProcessingPreviousTaskTypeSelected,
        },
      };

    case 'CLAIMS_TASK_PROCESSING_GET_CHECKLIST_SUCCESS':
      return {
        ...state,
        taskDashboard: {
          ...state.taskDashboard,
          checkList: action.payload,
        },
      };
    case 'CLAIMS_TASK_PROCESSING_GET_NEXT_TASKLIST_SUCCESS':
      return {
        ...state,
        taskDashboard: {
          ...state.taskDashboard,
          nextActions: action.payload,
        },
      };
    case 'CLAIMS_TASK_PROCESSING_SET_CHECKLIST_CHANGES':
      return {
        ...state,
        taskDashboard: {
          ...state.taskDashboard,
          checkListChanges: action.payload,
        },
      };
    case 'CLAIMS_TASK_PROCESSING_SAVE_CHECKLIST_ACTIONS_SUCCESS':
      return {
        ...state,
        taskDashboard: {
          ...state.taskDashboard,
          checkListChangesPushed: action.payload,
        },
      };
    case 'CLAIMS_TASK_PROCESSING_SAVE_NEXT_ACTION_SUCCESS':
      return {
        ...state,
        taskDashboard: {
          ...state.taskDashboard,
          nextActionChangesPushed: action.payload,
        },
      };
    case 'CLAIMS_TASK_PROCESSING_RESET_CHECKLIST_DATA':
      return {
        ...state,
        taskDashboard: {
          ...initialState.taskDashboard,
        },
      };

    case 'CLAIMREF_TASKS_REQUEST':
      const { newRequestType: refTaskReqType } = action.payload.appliedParams;
      return {
        ...state,
        refTabTasks: {
          ...state.refTabTasks,
          ...(refTaskReqType === constants.CLAIM_PROCESSING_REQ_TYPES.filter ? { isloadingFilters: true } : {}),
        },
      };

    case 'CLAIMREF_TASKS_SUCCESS':
      const {
        requestType: refTaskReqstType,
        sortBy: claimRefSortBy,
        dir: claimRefDir,
        query: claimRefQuery,
        items: { filterValue: refTasksFiltersValues, searchValue: refTasksSearchValues },
        pagination: refTasksPagination,
        appliedFilters: refTasksAppliedFilters,
      } = action.payload;

      const initRefTabTasks = initialState.refTabTasks;
      const initRefTabTasksSort = initRefTabTasks.sort;
      const stateRefTabTasks = state.refTabTasks;
      const isNonfilterTypeReq = refTaskReqstType !== constants.CLAIM_PROCESSING_REQ_TYPES.filter;

      return {
        ...state,
        refTabTasks: {
          ...stateRefTabTasks,
          ...(isNonfilterTypeReq
            ? {
                itemsTotal: get(refTasksPagination, 'totalElements', 0),
                page: get(refTasksPagination, 'page', 0) + 1,
                pageSize: get(refTasksPagination, 'size', initRefTabTasks.pageSize),
                pageTotal: get(refTasksPagination, 'totalPages', 0),
                query: get(refTasksPagination, 'searchBy') || claimRefQuery || '',
                items: refTasksSearchValues || [],
              }
            : {}),
          sort: {
            by: claimRefSortBy || initRefTabTasksSort.by,
            direction: claimRefDir || initRefTabTasksSort.direction,
          },
          filters: isNonfilterTypeReq ? stateRefTabTasks.filters : refTasksFiltersValues ? refTasksFiltersValues : {},
          appliedFilters: refTasksAppliedFilters?.length ? refTasksAppliedFilters : initRefTabTasks.appliedFilters,
        },
        loading: false,
      };

    case 'CLAIMREF_TASKS_FAILURE':
      return {
        ...state,
        error: action.payload,
        refTabTasks: {
          ...state.refTabTasks,
          isloadingFilters: false,
        },
      };

    case 'CLAIMS_GET_SUCCESS':
      const claimsPagination = action.payload.pagination || {};

      return {
        ...state,
        claims: {
          ...state.claims,
          itemsTotal: get(claimsPagination, 'totalElements', 0),
          page: get(claimsPagination, 'page', 0),
          pageSize: get(claimsPagination, 'size', initialState.claims.pageSize),
          pageTotal: get(claimsPagination, 'totalPages', 0),
          query: get(claimsPagination, 'query') || '',
          items: action.payload.items || [],
          searchBy: get(claimsPagination, 'searchBy') || initialState.claims.searchBy,
          sort: {
            ...state.claims.sort,
          },
        },
      };

    case 'CLAIMS_RESET':
      return {
        ...state,
        claims: initialState.claims,
      };
    case 'CLAIMS_POLICIES_GET_REQUEST':
      const { newRequestType: newPolicyRequestType } = action.payload.appliedParams;
      return {
        ...state,
        policies: {
          ...state.policies,
          ...(newPolicyRequestType === constants.CLAIM_POLICY_SEARCH_REQ_TYPES.filter
            ? { isloadingFilters: true }
            : { isloadingTable: true }),
        },
      };
    case 'CLAIMS_POLICIES_GET_SUCCESS':
      const {
        items: { filterValue: policiesFiltersValues, searchValue: policiesSearchValues },
        pagination: policiesPagination,
      } = action.payload;
      const policyRequestType = action.payload.requestType;
      const isPolicyNonfilterTypCall = policyRequestType !== constants.CLAIM_POLICY_SEARCH_REQ_TYPES.filter;

      return {
        ...state,
        policies: {
          ...state.policies,
          ...(isPolicyNonfilterTypCall
            ? {
                items: [...(utils.generic.isValidArray(policiesSearchValues) ? policiesSearchValues : [])],
                itemsTotal: get(action.payload.pagination, 'totalElements', 0),
                page: get(policiesPagination, 'page', 0),
                pageSize: policiesPagination !== 0 ? policiesPagination.size : initialState.policies.pageSize,
                pageTotal: get(policiesPagination, 'totalPages', 0),
                query: get(policiesPagination, 'searchBy') || '',
                searchBy: get(action.payload.pagination, 'searchBy') || '',
                isloadingTable: false,
              }
            : {}),
          sort: {
            ...state.policies.sort,
          },
          filters: !isPolicyNonfilterTypCall
            ? policiesFiltersValues
              ? policiesFiltersValues
              : { ...state.policies.filters }
            : { ...state.policies.filters },
          isloadingFilters: isPolicyNonfilterTypCall ? state.policies.isloadingFilters : false,
        },
      };
    case 'CLAIMS_POLICIES_GET_FAILURE':
      return {
        ...state,
        error: action.payload.error,
        policies: {
          ...state.policies,
          isloadingTable: false,
          isloadingFilters: action.payload.isNonFilterTypeCall ? state.policies.isloadingFilters : false,
        },
      };
    case 'CLAIMS_POLICIES_RESET':
      return {
        ...state,
        policies: initialState.policies,
      };
    case 'CLAIMS_COMPLEXITY_INSURED_GET_SUCCESS':
      const claimsInsuredPagination = action.payload.pagination || {};

      return {
        ...state,
        insured: {
          ...state.insured,
          items: action.payload.items || [],
          itemsTotal: get(claimsInsuredPagination, 'totalElements', 0),
          page: get(claimsInsuredPagination, 'page', 0),
          pageSize: get(claimsInsuredPagination, 'size', initialState.insured.pageSize),
          pageTotal: get(claimsInsuredPagination, 'totalPages', 0),
          query: get(claimsInsuredPagination, 'query') || '',
        },
      };
    case 'CLAIMS_POLICIES_RESET_TEMP':
      return {
        ...state,
        policyData: initialState.policyData,
        policyInformation: initialState.policyInformation,
      };
    case 'CLAIMS_POLICIES_REFERENCE':
      const policyTypeCheck = action.payload.policyType;
      return {
        ...state,
        policyData: action.payload,
        sectionEnabledUG: constants.CLAIM_SECTION_ENABLED_UG.indexOf(policyTypeCheck) > -1 || false,
        claimDetailInformationSuccess: initialState.claimDetailInformationSuccess,
      };
    case 'CLAIMS_POLICY_SECTIONS_GET_REQUEST':
      return {
        ...state,
        isPolicySectionsLoading: true,
      };
    case 'CLAIMS_POLICY_SECTIONS_GET_SUCCESS':
      return {
        ...state,
        policySections: action.payload,
        isPolicySectionsLoading: false,
      };
    case 'CLAIMS_POLICY_SECTIONS_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
        isPolicySectionsLoading: false,
      };
    case 'CLAIMS_SETTLEMENT_CURRENCY_GET_SUCCESS':
      return {
        ...state,
        settlementCurrencies: action.payload,
      };
    case 'LOSS_INFORMATION_POST_SUCCESS':
      return {
        ...state,
        lossInformation: action.payload,
        isLossSubmitted: true,
        isLossInfoLoading: false,
      };
    case 'RESET_LOSS_SUBMISSION':
      return {
        ...state,
        isLossSubmitted: false,
      };
    case 'GET_LOSS_INFORMATION_SUCCESS':
      return {
        ...state,
        lossInformation: action.payload,
        isLossInfoLoading: false,
      };
    case 'CLAIMS_POST_SUCCESS':
      return {
        ...state,
        claimsInformation: action.payload,
      };
    case 'CLAIMS_INSURED_REMOVE_SUCCESS':
      const checkedInsured = Object.keys(Object.fromEntries(Object.entries(action.payload).filter(([key, value]) => value)));

      return {
        ...state,
        insured: {
          ...state.insured,
          items: state.insured.items.filter((item) => item.title !== checkedInsured[0]),
        },
      };
    case 'CLAIMS_SELECT_INTEREST_GET_REQUEST':
      return {
        ...state,
        interest: {
          ...state.interest,
          isLoading: true,
        },
      };
    case 'CLAIMS_SELECT_INTEREST_GET_SUCCESS':
      const { payload } = action;
      const defaultValue = payload.length === 1 ? payload[0].code : '';

      return {
        ...state,
        interest: {
          ...state.interest,
          items: payload,
          selectedInterest: defaultValue,
          isLoading: false,
        },
      };
    case 'CLAIMS_SELECT_INTEREST_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
        interest: {
          ...state.interest,
          isLoading: false,
        },
      };

    case 'CLAIMS_SELECT_INTEREST_VALUE':
      return {
        ...state,
        interest: {
          ...state.interest,
          selectedInterest: action.payload,
        },
      };
    case 'CLAIMS_DETAILS_SUCCESS':
      return {
        ...state,
        allClaimDetails: action.payload,
      };
    case 'UPDATE_CLAIMS_DETAILS_INFORMATION':
      return {
        ...state,
        claimDetailInformation: action.payload,
      };
    case 'CLAIMS_DETAILS_INFORMATION_POST_SUCCESS':
      return {
        ...state,
        claimDetailInformationSuccess: action.payload,
        claimsInformation: action.payload,
      };
    case 'CLAIMS_DETAILS_INFORMATION_UPDATE_SUCCESS':
      return {
        ...state,
        claimDetailInformationSuccess: action.payload,
        claimsInformation: {
          ...state.claimsInformation,
          ...action.payload,
        },
      };
    case 'CLAIMS_PRIORITY_LEVELS_GET_REQUEST':
      return {
        ...state,
        prioritiesLoaded: false,
        isPrioritiesLoading: true,
      };
    case 'CLAIMS_PRIORITY_LEVELS_GET_SUCCESS':
      return {
        ...state,
        priorities: action.payload,
        prioritiesLoaded: true,
        isPrioritiesLoading: false,
      };
    case 'CLAIMS_PRIORITY_LEVELS_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
        isPrioritiesLoading: false,
        prioritiesLoaded: true,
      };
    case 'CLAIMS_REOPEN_TASK_LIST_GET_SUCCESS':
      return {
        ...state,
        reopenTaskList: action.payload,
      };
    case 'CLAIMS_BE_ADJUSTER_GET_SUCCESS':
      return {
        ...state,
        beAdjuster: { ...state.beAdjuster, items: action.payload },
      };
    case 'SET_CLAIMS_BE_ADJUSTER_VALUE':
      return {
        ...state,
        beAdjuster: { ...state.beAdjuster, selectedbeAdjuster: action.payload },
      };
    case 'CLAIMS_PREVIEW_INFORMATION_GET_REQUEST':
      return {
        ...state,
        isClaimsInfoLoading: true,
      };
    case 'CLAIMS_BASIC_INFORMATION_GET_REQUEST':
      return {
        ...state,
        isClaimsInfoLoading: true,
      };
    case 'CLAIMS_PREVIEW_INFORMATION_GET_SUCCESS':
      return {
        ...state,
        claimsInformation: action.payload,
        isClaimsInfoLoading: false,
      };
    case 'CLAIMS_SELECTED_INFORMATION_GET_SUCCESS':
      return {
        ...state,
        selectedClaimsDetails: action.payload,
      };
    case 'CLAIMS_BASIC_INFORMATION_GET_SUCCESS':
      return {
        ...state,
        claimsInformation: action.payload,
        isClaimsInfoLoading: false,
      };
    case 'CLAIMS_PREVIEW_INFORMATION_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
        isClaimsInfoLoading: false,
      };
    case 'CLAIMS_BASIC_INFORMATION_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
        isClaimsInfoLoading: false,
      };
    case 'SELECT_CLAIMS_COMPLEXITY':
      return {
        ...state,
        complexityPolicies: {
          ...state.complexityPolicies,
          selectedComplexityPolicies: action.payload || [],
        },
      };
    case 'CLAIMS_COMPLEXITY_GET_SUCCESS':
      const complexityPoliciesPagination = action.payload.pagination || {};

      return {
        ...state,
        complexityPolicies: {
          ...state.complexityPolicies,
          items: action.payload.data || [],
          itemsTotal: get(complexityPoliciesPagination, 'totalElements', 0),
          page: get(complexityPoliciesPagination, 'page', 1),
          pageSize: get(complexityPoliciesPagination, 'size', initialState.complexityPolicies.pageSize),
          pageTotal: get(complexityPoliciesPagination, 'totalPages', 0),
          query: get(complexityPoliciesPagination, 'query') || '',
        },
      };
    case 'CLAIMS_COMPLEXITY_FLAGGED_GET_SUCCESS':
      const complexityPoliciesFlaggedPagination = action.payload.pagination || {};

      return {
        ...state,
        complexityPoliciesFlagged: {
          ...state.complexityPoliciesFlagged,
          items: action.payload.items || [],
          itemsTotal: get(complexityPoliciesFlaggedPagination, 'totalElements', 0),
          page: get(complexityPoliciesFlaggedPagination, 'page', 1),
          pageSize: get(complexityPoliciesFlaggedPagination, 'size', initialState.complexityPoliciesFlagged.pageSize),
          pageTotal: get(complexityPoliciesFlaggedPagination, 'totalPages', 0),
          query: get(complexityPoliciesFlaggedPagination, 'query') || '',
        },
      };
    case 'CLAIMS_DETAILS_INFORMATION_SUBMIT_SUCCESS':
      return {
        ...state,
        claimsInformation: {
          ...state.claimsInformation,
          claimStatus: action.payload.claimStatus,
          submitStatus: action.payload.responseData,
        },
      };
    case 'ADD_NEW_CLAIM_FOR_LOSS':
      return {
        ...state,
        claimantNames: initialState.claimantNames,
        claimsInformation: initialState.claimsInformation,
        policyData: initialState.policyData,
        policyInformation: initialState.policyInformation,
        interest: initialState.interest,
        policySections: initialState.underWritingGroups,
        underWritingGroups: initialState.underWritingGroups,
        allClaimDetails: initialState.allClaimDetails,
        beAdjuster: initialState.beAdjuster,
        claimDetailInformationSuccess: initialState.claimDetailInformationSuccess,
        claimData: initialState.claimData,
      };
    case 'RESET_LOSS_DATA':
      return {
        ...state,
        lossInformation: initialState.lossInformation,
      };
    case 'RESET_CLAIMS_INFORMATION':
      return {
        ...state,
        claimsInformation: initialState.claimsInformation,
      };
    case 'RESET_LOSS_POLICY_CLAIM_DATA':
      return {
        ...state,
        claimantNames: initialState.claimantNames,
        claimsInformation: initialState.claimsInformation,
        policyData: initialState.policyData,
        policyInformation: initialState.policyInformation,
        interest: initialState.interest,
        policySections: initialState.underWritingGroups,
        underWritingGroups: initialState.underWritingGroups,
        allClaimDetails: initialState.allClaimDetails,
        beAdjuster: initialState.beAdjuster,
        claimDetailInformationSuccess: initialState.claimDetailInformationSuccess,
        claimData: initialState.claimData,
        lossInformation: initialState.lossInformation,
        linkPolicies: initialState.linkPolicies,
        policies: initialState.policies,
      };
    case 'UPDATE_CLAIMS_LOSS_FILTERS':
      return {
        ...state,
        claimLossSearchFilters: action.payload,
      };
    case 'CLAIMS_INSURED_RESET':
      return {
        ...state,
        insured: initialState.insured,
      };
    case 'RESET_CLAIMS_LOSS_FILTERS':
      return {
        ...state,
        claimLossSearchFilters: initialState.claimLossSearchFilters,
      };
    case 'CLAIMS_LOSS_FILTERS_POST_SUCCESS':
      return {
        ...state,
        claims: {
          ...state.claims,
          filters: action.payload,
        },
      };
    case 'CLAIMS_COMPLEXITY_RESET':
      return {
        ...state,
        complexityPolicies: initialState.complexityPolicies,
      };
    case 'CHECKED_COMPLEX_ADD_POLICY':
      let boolCheck = false;
      const complexPoliciesData = state.complexityPolicies.selectedComplexityPolicies.map((item, idx) => {
        if (item.id === action.payload.id) {
          item.checkedType = !item.checkedType;
          boolCheck = true;
        }
        return item;
      });

      return {
        ...state,
        complexityPolicies: {
          ...state.complexityPolicies,
          selectedComplexityPolicies: boolCheck
            ? complexPoliciesData
            : complexPoliciesData.length > 0
            ? [...complexPoliciesData, action.payload]
            : [action.payload],
        },
      };
    case 'CHECKED_COMPLEX_ADD_INSURED':
      let insuredBoolCheck = false;
      const complexInsuredData = state.complexInsured.selectedComplexityInsured.map((item, idx) => {
        if (item.id === action.payload.id) {
          item.checkedType = !item.checkedType;
          insuredBoolCheck = true;
        }
        return item;
      });

      return {
        ...state,
        complexInsured: {
          ...state.complexInsured,
          selectedComplexityInsured: insuredBoolCheck
            ? complexInsuredData
            : complexInsuredData.length > 0
            ? [...complexInsuredData, action.payload]
            : [action.payload],
        },
      };
    case 'CLAIMS_SAVE_COMPLEXITY_POLICY_POST_SUCCESS':
      return {
        ...state,
        complexityPolicies: {
          ...state.complexityPolicies,
          savedComplexPolicies: action.payload,
          checkedComplexity: true,
        },
      };
    case 'CLAIMS_SAVE_COMPLEXITY_INSURED_POST_SUCCESS':
      return {
        ...state,
        complexInsured: {
          ...state.complexInsured,
          savedComplexInsured: action.payload,
          checkedComplexity: true,
        },
      };
    case 'SAVED_POLICIES_DATA':
      return {
        ...state,
        checkedComplexAddPolicies: [...state.checkedComplexAddPolicies, ...action.payload],
      };
    case 'CLAIM_SET_DATA':
      return {
        ...state,
        claimData: action.payload,
      };
    case 'CLAIM_RESET_DATA':
      return {
        ...initialState,
      };
    case 'CLAIMS_SET_STEPPER_CONTROL':
      return {
        ...state,
        claimsStepper: action.payload,
      };
    case 'CLAIMS_COMPLEXITY_TAB_SET':
      return {
        ...state,
        complexityManagement: {
          ...initialState.complexityManagement,
          activeTab: action.payload,
        },
        complexityBasisValues: {
          ...initialState.complexityBasisValues,
        },
        complexityReferralValues: {
          ...initialState.complexityReferralValues,
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_GET_SUCCESS':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          division: action.payload,
          divisionChanges: initialState.complexityManagement.divisionChanges,
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_SET_CHANGE':
      const incomingFieldName = Object.keys(action.payload)[0];
      const falseStateChange = Object.keys(state.complexityManagement.divisionChanges).indexOf(incomingFieldName) > -1;
      const applicablePayload = falseStateChange ? {} : action.payload;
      const applicableDivisionChanges = { ...state.complexityManagement.divisionChanges };
      if (falseStateChange) {
        delete applicableDivisionChanges[incomingFieldName];
      }

      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          divisionChanges: { ...applicableDivisionChanges, ...applicablePayload },
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_RESET':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          divisionChanges: initialState.complexityManagement.divisionChanges,
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_SAVE_SUCCESS':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          divisionChanges: initialState.complexityManagement.divisionChanges,
        },
      };
    case 'CLAIMS_COMPLEXITY_SET_COMPLEX_VALUE_ID':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityBasisValueId: action.payload,
        },
      };
    case 'CLAIMS_COMPLEXITY_BASIS_VALUE_GET_SUCCESS':
      const complexityBasisValuePagination = action.payload.pagination || {};
      const initialComplexityBasisSort = initialState.complexityBasisValues.sort;

      return {
        ...state,
        complexityBasisValues: {
          type: action.payload.type || '',
          items: action.payload.data || [],
          itemsTotal: get(complexityBasisValuePagination, 'totalElements', 0),
          page: get(complexityBasisValuePagination, 'page', 1),
          pageSize: get(complexityBasisValuePagination, 'size', initialState.complexityBasisValues.pageSize),
          pageTotal: get(complexityBasisValuePagination, 'totalPages', 0),
          query: get(complexityBasisValuePagination, 'query') || '',
          sort: {
            by: get(complexityBasisValuePagination, 'orderBy', initialComplexityBasisSort.by),
            direction: get(complexityBasisValuePagination, 'direction', initialComplexityBasisSort.direction),
          },
          loaded: true,
        },
        complexityManagement: {
          ...initialState.complexityManagement,
          activeTab: state.complexityManagement.activeTab,
          complexityBasisValueId: state.complexityManagement.complexityBasisValueId,
        },
      };
    case 'CLAIMS_COMPLEXITY_BASIS_VALUE_GET_RESET':
      return {
        ...state,
        complexityBasisValues: {
          ...initialState.complexityBasisValues,
        },
      };
    case 'CLAIMS_ADD_COMPLEXITY_VALUES_SUCCESS':
      return {
        ...state,
        complexityManagement: {
          ...initialState.complexityManagement,
          activeTab: state.complexityManagement.activeTab,
          complexityBasisValueId: state.complexityManagement.complexityBasisValueId,
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_GET_REQUEST':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityBasisDivisionMatrix: initialState.complexityManagement.complexityBasisDivisionMatrix,
          complexityBasisDivisionMatrixChanges: initialState.complexityManagement.complexityBasisDivisionMatrixChanges,
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_GET_SUCCESS':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityBasisDivisionMatrix: action.payload,
          complexityBasisDivisionMatrixChanges: initialState.complexityManagement.complexityBasisDivisionMatrixChanges,
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_SET_CHANGE':
      const newComplexityDivisionFieldName = Object.keys(action.payload)[0];
      const falseComplexityDivisionMatrixFieldChange =
        Object.keys(state.complexityManagement.complexityBasisDivisionMatrixChanges).indexOf(newComplexityDivisionFieldName) > -1;
      const newComplexityDivisionPayload = falseComplexityDivisionMatrixFieldChange ? {} : action.payload;
      const newComplexityDivisionChanges = {
        ...state.complexityManagement.complexityBasisDivisionMatrixChanges,
      };
      if (falseComplexityDivisionMatrixFieldChange) {
        delete newComplexityDivisionChanges[newComplexityDivisionFieldName];
      }

      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityBasisDivisionMatrixChanges: {
            ...newComplexityDivisionChanges,
            ...newComplexityDivisionPayload,
          },
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_RESET':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityBasisDivisionMatrixChanges: initialState.complexityManagement.complexityBasisDivisionMatrixChanges,
        },
      };
    case 'CLAIMS_REMOVE_COMPLEXITY_VALUES_SUCCESS':
      return {
        ...state,
        complexityManagement: {
          ...initialState.complexityManagement,
          activeTab: state.complexityManagement.activeTab,
        },
      };
    case 'CLAIMS_COMPLEXITY_SET_REFERRAL_VALUE_ID':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityReferralValueId: action.payload,
        },
      };
    case 'CLAIMS_COMPLEXITY_REFERRAL_VALUES_GET_SUCCESS':
      const complexityReferralValuesPagination = action.payload.pagination || {};
      const initialComplexityReferralSort = initialState.complexityReferralValues.sort;

      return {
        ...state,
        complexityReferralValues: {
          items: action.payload.data || [],
          itemsTotal: get(complexityReferralValuesPagination, 'totalElements', 0),
          page: get(complexityReferralValuesPagination, 'page', 1),
          pageSize: get(complexityReferralValuesPagination, 'size', initialState.complexityReferralValues.pageSize),
          pageTotal: get(complexityReferralValuesPagination, 'totalPages', 0),
          query: get(complexityReferralValuesPagination, 'query') || '',
          sort: {
            by: get(complexityReferralValuesPagination, 'orderBy', initialComplexityReferralSort.by),
            direction: get(complexityReferralValuesPagination, 'direction', initialComplexityReferralSort.direction),
          },
        },
        complexityManagement: {
          ...initialState.complexityManagement,
          activeTab: state.complexityManagement.activeTab,
          complexityReferralValueId: state.complexityManagement.complexityReferralValueId,
        },
      };
    case 'CLAIMS_COMPLEXITY_ADD_REFERRAL_SUCCESS':
      return {
        ...state,
        complexityManagement: {
          ...initialState.complexityManagement,
          activeTab: state.complexityManagement.activeTab,
          complexityReferralValueId: state.complexityManagement.complexityReferralValueId,
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_GET_REQUEST':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityReferralDivisionMatrix: initialState.complexityManagement.complexityReferralDivisionMatrix,
          complexityReferralDivisionMatrixChanges: initialState.complexityManagement.complexityReferralDivisionMatrixChanges,
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_GET_SUCCESS':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityReferralDivisionMatrix: action.payload,
          complexityReferralDivisionMatrixChanges: initialState.complexityManagement.complexityReferralDivisionMatrixChanges,
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_SET_CHANGE':
      const newReferralDivisionFieldName = Object.keys(action.payload)[0];
      const falseReferralDivisionMatrixFieldChange =
        Object.keys(state.complexityManagement.complexityReferralDivisionMatrixChanges).indexOf(newReferralDivisionFieldName) > -1;
      const newReferralDivisionPayload = falseReferralDivisionMatrixFieldChange ? {} : action.payload;
      const newReferralDivisionChanges = {
        ...state.complexityManagement.complexityReferralDivisionMatrixChanges,
      };
      if (falseReferralDivisionMatrixFieldChange) {
        delete newReferralDivisionChanges[newReferralDivisionFieldName];
      }

      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityReferralDivisionMatrixChanges: {
            ...newReferralDivisionChanges,
            ...newReferralDivisionPayload,
          },
        },
      };
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_RESET':
      return {
        ...state,
        complexityManagement: {
          ...state.complexityManagement,
          complexityReferralDivisionMatrixChanges: initialState.complexityManagement.complexityReferralDivisionMatrixChanges,
        },
      };
    case 'CLAIMS_REMOVE_REFERRAL_VALUES_SUCCESS':
      return {
        ...state,
        complexityManagement: {
          ...initialState.complexityManagement,
          activeTab: state.complexityManagement.activeTab,
        },
      };
    case 'UPDATE_CLAIMS_PROCESSING_FILTERS':
      return {
        ...state,
        claimsProcessingData: action.payload,
      };
    case 'USER_GET_USERS_BY_ORG_REQUEST':
      return {
        ...state,
        isClaimsAssignedToUsersLoading: true,
      };
    case 'USER_GET_USERS_BY_ORG_FAILURE':
      return {
        ...state,
        isClaimsAssignedToUsersLoading: false,
        error: action.payload,
      };
    case 'USER_GET_USERS_BY_ORG_SUCCESS':
      return {
        ...state,
        claimsAssignedToUsers: {
          ...action.payload,
          loaded: true,
        },
        isClaimsAssignedToUsersLoading: false,
      };
    case 'CLAIMS_ASSIGNED_TO_USERS_RESET':
      return {
        ...state,
        claimsAssignedToUsers: {
          ...initialState.claimsAssignedToUsers,
        },
      };
    case 'RESET_CLAIMS_PROCESSING_FILTERS':
      return {
        ...state,
        claimsProcessingData: initialState.claimsProcessingData,
      };
    case 'CLAIM_UPDATE_COMPLEX_STATUS':
      return {
        ...state,
        complexityPolicies: {
          ...state.complexityPolicies,
          ...action.payload,
        },
      };
    case 'CLAIMS_COMPLEXITY_SEARCH_POST_SUCCESS':
      const complexityInsuredPagination = action.payload.pagination || {};
      return {
        ...state,
        complexInsured: {
          ...state.complexInsured,
          items: action.payload.data || [],
          itemsTotal: get(complexityInsuredPagination, 'totalElements', 0),
          page: get(complexityInsuredPagination, 'page', 1),
          pageSize: get(complexityInsuredPagination, 'size', initialState.complexInsured.pageSize),
          pageTotal: get(complexityInsuredPagination, 'totalPages', 0),
          query: get(complexityInsuredPagination, 'query') || '',
        },
      };
    case 'CLAIMS_POPUP_INSURED_RESET':
      return {
        ...state,
        complexInsured: initialState.complexInsured,
      };
    case 'SAVED_INSURED_DATA':
      return {
        ...state,
        checkedComplexAddInsured: [...state.checkedComplexAddInsured, ...action.payload],
      };
    case 'CLAIMS_COMPLEXITY_VALUES_GET_SUCCESS':
      return {
        ...state,
        complexityValues: action.payload,
        complexityValuesLoaded: true,
      };
    case 'CLAIM_COMPLEXITY_TYPES_GET_SUCCESS':
      return {
        ...state,
        complexityTypes: action.payload,
        complexityTypesLoaded: true,
      };
    case 'CLAIMS_REFERRAL_VALUES_GET_SUCCESS':
      return {
        ...state,
        referralValues: action.payload,
      };
    case 'CLAIMS_REFERRAL_RESPONSE_GET_SUCCESS':
      return {
        ...state,
        referralResponse: action.payload,
      };
    case 'CLAIMS_QUERY_CODE_LIST_GET_SUCCESS':
      return {
        ...state,
        queryCode: action.payload,
      };
    case 'CLAIMS_SET_PRIORITY_SUCCESS':
      return {
        ...state,
        processing: {
          ...state.processing,
          items: state.processing.items.map((claim) => {
            const newPriorityName = action.payload.priorityName;
            const isSameClaimId = claim.claimID?.toString() === action.payload.claimID?.toString();

            if (newPriorityName && isSameClaimId) {
              return {
                ...claim,
                priority: newPriorityName,
              };
            }

            return claim;
          }),
        },
      };
    case 'GET_ASSOCIATED_TASK_SUCCESS':
      return {
        ...state,
        tasksProcessing: {
          ...state.tasksProcessing,
          associatedTaskDetails: action.payload,
        },
      };
    case 'TASKS_CLAIMS_REPORTING_GET_REQUEST':
      return {
        ...state,
        tasksClaimsReporting: {
          data: initialState.tasksClaimsReporting.data,
          isDataLoading: true,
        },
      };
    case 'TASKS_CLAIMS_REPORTING_GET_SUCCESS':
      return {
        ...state,
        tasksClaimsReporting: { data: action.payload, isDataLoading: false },
      };
    case 'TASKS_CLAIMS_REPORTING_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
        tasksClaimsReporting: {
          data: initialState.tasksClaimsReporting.data,
          isDataLoading: false,
        },
      };
    case 'PROCESSING_NAVIGATION':
      return {
        ...state,
        processingNavigation: {
          ...state.processingNavigation,
          navigationItem: action.payload,
        },
      };
    case 'PROCESSING_CLAIM_VIEW_NAVIGATION':
      return {
        ...state,
        processingNavigation: {
          ...state.processingNavigation,
          selectedView: action.payload,
        },
      };
    case 'CLAIMS_BORDEREAU_REQUEST':
      return {
        ...state,
        isBordereauPeriodsLoading: true,
      };
    case 'CLAIMS_BORDEREAU_SUCCESS':
      return {
        ...state,
        claimBordereauPeriods: action.payload,
        isBordereauPeriodsLoading: false,
      };
    case 'CLAIMS_BORDEREAU_ERROR':
      return {
        ...state,
        error: action.payload,
        isBordereauPeriodsLoading: false,
      };
    case 'CLAIMS_POLICY_INSURED_REQUEST':
      return {
        ...state,
        isClaimPolicyInsuresLoading: true,
      };
    case 'CLAIMS_POLICY_INSURED_SUCCESS':
      return {
        ...state,
        claimPolicyInsures: action.payload,
        isClaimPolicyInsuresLoading: false,
      };
    case 'CLAIMS_POLICY_INSURED_ERROR':
      return {
        ...state,
        error: action.payload,
        isClaimPolicyInsuresLoading: false,
      };
    case 'CLAIMS_POLICY_CLIENTS_REQUEST':
      return {
        ...state,
        isPolicyClientsLoading: true,
      };
    case 'CLAIMS_POLICY_CLIENTS_SUCCESS':
      return {
        ...state,
        claimPolicyClients: action.payload,
        isPolicyClientsLoading: false,
      };
    case 'CLAIMS_POLICY_CLIENTS_ERROR':
      return {
        ...state,
        isPolicyClientsLoading: false,
        error: action.payload,
      };
    case 'CHECK_IS_USER_CLAIM':
      return {
        ...state,
        processing: {
          ...state.processing,
          isUserClaim: action.payload,
        },
      };
    case 'CHECK_IS_CLOSED_CLAIM':
      return {
        ...state,
        processing: {
          ...state.processing,
          isClosedClaim: action.payload,
        },
      };
    case 'CHECK_IS_TEAM_CLAIM':
      return {
        ...state,
        processing: {
          ...state.processing,
          isTeamClaim: action.payload,
        },
      };
    case 'RESET_POLICY_INFORMATION':
      return {
        ...state,
        policyInformation: initialState.policyInformation,
      };
    case 'RESET_LINK_POLICY_DATA':
      return {
        ...state,
        linkPolicies: initialState.linkPolicies,
      };
    case 'GET_LOSS_DOCUMENT_DETAILS':
      return {
        ...state,
        dmsDocDetails: {
          ...state.dmsDocDetails,
          lossDocDetails: action.payload,
        },
      };
    case 'GET_LINK_POLICY_DOCUEMENT_DETAILS':
      return {
        ...state,
        dmsDocDetails: {
          ...state.dmsDocDetails,
          linkPolicyDocDetails: action.payload,
        },
      };
    case 'GET_CLAIMS_DOCUEMENT_DETAILS':
      return {
        ...state,
        dmsDocDetails: {
          ...state.dmsDocDetails,
          claimsDocDetails: action.payload,
        },
      };

    case 'GET_MANAGE_DOC_LOSS_DOCUMENT_DETAILS':
      return {
        ...state,
        dmsDocDetails: {
          ...state.dmsDocDetails,
          manageDocument: {
            ...state.dmsDocDetails.manageDocument,
            lossDocumentDetails: action.payload,
          },
        },
      };
    case 'GET_MANAGE_DOC_CLAIM_DOCUMENT_DETAILS':
      return {
        ...state,
        dmsDocDetails: {
          ...state.dmsDocDetails,
          manageDocument: {
            ...state.dmsDocDetails.manageDocument,
            claimDocumentDetails: action.payload,
          },
        },
      };
    case 'GET_LINK_POLICIES_DATA':
      return {
        ...state,
        linkPolicies: {
          ...state.linkPolicies,
          ...action.payload,
        },
      };
    case 'RESET_LINK_POLICY_DOCUMENT_DETAILS':
      return {
        ...state,
        dmsDocDetails: {
          ...state.dmsDocDetails,
          linkPolicyDocDetails: initialState.dmsDocDetails.linkPolicyDocDetails,
        },
      };
    case 'RESET_ClAIM_DOCUMENT_DETAILS':
      return {
        ...state,
        dmsDocDetails: {
          ...state.dmsDocDetails,
          claimsDocDetails: initialState.dmsDocDetails.claimsDocDetails,
        },
      };

    case 'GET_LOSSES_TAB_DATA':
      return {
        ...state,
        lossesTab: {
          ...state.lossesTab,
          ...action.payload,
        },
      };
    case 'GET_LOSSES_TABLE_FILTER_VALUES':
      return {
        ...state,
        lossesTab: {
          ...state.lossesTab,
          filterValues: action.payload,
        },
      };
    case 'RESET_LOSSES_TAB_DATA':
      return {
        ...state,
        lossesTab: initialState.lossesTab,
      };
    case 'LOSSES_TAB_POST_SUCCESS':
      const lossesTabPagination = action.payload.pagination || {};
      let payloadData;
      if (action.payload.requestType === 'search') payloadData = { items: action.payload.items };
      else if (action.payload.requestType === 'filter') payloadData = { filters: action.payload.items };
      return {
        ...state,
        lossesTab: {
          ...state.lossesTab,
          ...payloadData,
          ...(action.payload.requestType === 'search'
            ? {
                itemsTotal: get(lossesTabPagination, 'totalElements', 0),
                page: get(lossesTabPagination, 'page', 1),
                pageSize: get(lossesTabPagination, 'size', initialState.lossesTab.pageSize),
                pageTotal: get(lossesTabPagination, 'totalPages', 0),
                query: get(lossesTabPagination, 'searchBy') || '',
              }
            : null),
        },
      };
    case 'GET_CLAIMS_TAB_DATA':
      return {
        ...state,
        claimsTab: {
          ...state.claimsTab,
          isClaimsTabLoaded: action.payload.isClaimsTabLoaded,
          searchBy: action.payload.searchBy,
          searchText: action.payload.searchText,
          view: action.payload.view,
        },
      };
    case 'CLAIMS_TAB_DETAILS_GET_REQUEST':
      const { newClaimsTabReqType } = action.payload.appliedParams;
      return {
        ...state,
        claimsTab: {
          ...state.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            ...(newClaimsTabReqType === constants.CLAIM_PROCESSING_REQ_TYPES.filter
              ? { isloadingFilters: true }
              : { isloadingTable: true }),
          },
        },
      };
    case 'CLAIMS_TAB_DETAILS_GET_SUCCESS':
      const claimsFilterValue = action.payload?.items?.filterValue;
      const claimsSearchValue = action.payload?.items?.searchValue;
      const claimsPageSize = get(action.payload.pagination, 'size', initialState?.claimsTab?.tableDetails?.pageSize);

      const claimReqType = action.payload.requestType;
      const isClaimNonFilterTypeCall = claimReqType !== constants.CLAIM_PROCESSING_REQ_TYPES.filter;

      return {
        ...state,
        claimsTab: {
          ...state.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            ...(isClaimNonFilterTypeCall
              ? {
                  items: [...(utils.generic.isValidArray(claimsSearchValue) ? claimsSearchValue : [])],
                  itemsTotal: get(action.payload.pagination, 'totalElements', 0),
                  page: get(action.payload.pagination, 'page', 0) + 1,
                  pageSize: claimsPageSize !== 0 ? claimsPageSize : initialState?.claimsTab?.tableDetails?.pageSize,
                  pageTotal: get(action.payload.pagination, 'totalPages', 0),
                  query: get(action.payload.pagination, 'search') || '',
                  searchBy: get(action.payload.pagination, 'searchBy') || '',
                  isloadingTable: false,
                }
              : {}),
            sort: {
              by: get(action.payload.pagination, 'orderBy') || '',
              direction: (get(action.payload.pagination, 'direction') || '').toLowerCase(),
            },
            filters: !isClaimNonFilterTypeCall
              ? claimsFilterValue
                ? claimsFilterValue
                : { ...state.claimsTab.tableDetails.filters }
              : { ...state.claimsTab.tableDetails.filters },
            isloadingFilters: !isClaimNonFilterTypeCall ? false : state.claimsTab.tableDetails.isloadingFilters,
            selected: [],
          },
        },
      };
    case 'CLAIMS_TAB_TABLE_DETAILS_FAILURE':
      return {
        ...state,
        error: action.payload,
        claimsTab: {
          ...state.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            items: initialState.claimsTab.tableDetails.items,
            isloadingTable: false,
          },
        },
      };
    case 'CLAIMS_TAB_FILTER_DETAILS_FAILURE':
      return {
        ...state,
        error: action.payload,
        claimsTab: {
          ...state.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            isloadingFilters: false,
          },
        },
      };
    case 'CLAIMS_TAB_TABLE_SELECT':
      return {
        ...state,
        claimsTab: {
          ...state?.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            selected: action.payload.forceSingleItem
              ? [action.payload.claimObj]
              : xorBy(state?.claimsTab?.tableDetails?.selected || [], [action.payload?.claimObj], 'processID'),
          },
        },
      };
    case 'CLAIMS_ASSOCIATE_WITH_LOSS_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
        isClaimsAssociateWithLossLoading: false,
      };
    case 'CLAIMS_FNOL_PUSH_BACK_ROUTES':
      return {
        ...state,
        pushBackRoute: action.payload,
      };

    case 'CLAIMS_FNOL_SELECT_TAB':
      return {
        ...state,
        fnolSelectedTab: action.payload,
      };

    case 'GET_SANCTIONS_CHECK_STATUS_SUCCESS':
      return {
        ...state,
        sanctionCheckStatus: action.payload,
      };
    case 'GET_SANCTIONS_CHECK_STATUS_FAILURE':
      return {
        ...state,
        sanctionCheckStatus: initialState.sanctionCheckStatus,
        error: action.payload,
      };

    case 'CLAIMS_TAB_SEARCH_RESET':
      return {
        ...state,
        claimsTab: {
          ...state.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            query: initialState.claimsTab.tableDetails.query,
          },
        },
      };
    case 'RESET_CLAIMS_TAB_TABLE_ITEMS':
      return {
        ...state,
        claimsTab: {
          ...state.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            items: initialState.claimsTab.tableDetails.items,
          },
        },
      };
    case 'RESET_CLAIMS_TAB_FILTERS':
      return {
        ...state,
        claimsTab: {
          ...state.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            filters: initialState.claimsTab.tableDetails.filters,
          },
        },
      };
    case 'RESET_CLAIMS_TAB_SEARCH':
      return {
        ...state,
        claimsTab: {
          ...state.claimsTab,
          tableDetails: {
            ...state.claimsTab.tableDetails,
            query: initialState.claimsTab.tableDetails.query,
          },
        },
      };
    case 'RESET_CLAIMS_DMS_DOCUMENT_DETAILS':
      return {
        ...state,
        dmsDocDetails: initialState.dmsDocDetails,
      };
    case 'ADVANCE_SEARCH_DETAILS_REQUEST':
      const advanceSearchRequestType = action?.payload?.params?.requestType;
      return {
        ...state,
        advanceTab: {
          ...state.advanceTab,
          ...(advanceSearchRequestType === constants.REQ_TYPES.filter ? { isloadingFilters: true } : { isloadingTable: true }),
        },
      };
    case 'ADVANCE_SEARCH_DETAILS_SUCCESS':
      const advanceTabPagination = action.payload.pagination || {};
      let advancePayloadData;
      if (action.payload.requestType === constants.REQ_TYPES.search)
        advancePayloadData = { items: action.payload.items, isloadingTable: false };
      else if (action.payload.requestType === constants.REQ_TYPES.filter)
        advancePayloadData = { filters: action.payload.items, isloadingFilters: false };
      return {
        ...state,
        advanceTab: {
          ...state.advanceTab,
          ...advancePayloadData,
          ...(action.payload.requestType === constants.REQ_TYPES.search
            ? {
                itemsTotal: get(advanceTabPagination, 'totalElements', 0),
                page: get(advanceTabPagination, 'page', 1),
                pageSize: get(advanceTabPagination, 'size', initialState.advanceTab.pageSize),
                pageTotal: get(advanceTabPagination, 'totalPages', 0),
                query: get(advanceTabPagination, 'query') || '',
                sort: {
                  by: get(action.payload.pagination, 'orderBy') || initialState.advanceTab.sort.by,
                  direction: (get(action.payload.pagination, 'direction') || initialState.advanceTab.sort.direction).toLowerCase(),
                },
              }
            : null),
        },
      };
    case 'ADVANCE_SEARCH_DETAILS_TABLE_FAILURE':
      return {
        ...state,
        error: action.payload,
        advanceTab: {
          ...state.advanceTab,
          items: initialState.advanceTab.items,
          isloadingTable: initialState.advanceTab.isloadingTable,
        },
      };

    case 'ADVANCE_SEARCH_DETAILS_FILTER_FAILURE':
      return {
        ...state,
        error: action.payload,
        advanceTab: {
          ...state.advanceTab,
          filters: initialState.advanceTab.filters,
          isloadingFilters: initialState.advanceTab.isloadingFilters,
        },
      };

    case 'SET_ADVANCE_SEARCH_TAB_SEARCH_DETAILS':
      return {
        ...state,
        advanceTab: {
          ...state.advanceTab,
          ...action.payload,
        },
      };
    case 'SET_ADVANCE_SEARCH_TABLE_FILTER_VALUES':
      return {
        ...state,
        advanceTab: {
          ...state.advanceTab,
          filterValues: action.payload,
        },
      };
    case 'RESET_ADVANCE_SEARCH_TAB_DETAILS':
      return {
        ...state,
        advanceTab: initialState.advanceTab,
      };
    case 'SET_PULL_CLOSED_RECORDS':
      return {
        ...state,
        advanceTab: {
          ...state.advanceTab,
          pullClosedRecords: action.payload,
        },
      };

    case 'CLAIMS_GET_RFI_HISTORY_DOCUMENTS_REQUEST':
      return {
        ...state,
        rfiHistoryDocuments: {
          documentList: [],
          isLoading: true,
        },
      };
    case 'CLAIMS_GET_RFI_HISTORY_DOCUMENTS_SUCCESS':
      return {
        ...state,
        rfiHistoryDocuments: {
          documentList: action.payload?.documentList,
          isLoading: false,
        },
      };
    case 'CLAIMS_GET_RFI_HISTORY_DOCUMENTS_FAILURE':
      return {
        ...state,
        rfiHistoryDocuments: {
          documentList: initialState.rfiHistoryDocuments.documentList,
          isLoading: false,
        },
      };

    case 'GET_BPM_CLAIM_DETAILS_REQUEST':
      return {
        ...state,
        bpmClaimInformation: {
          ...state?.bpmClaimInformation,
          data: {},
          isLoading: true,
        },
      };
    case 'GET_BPM_CLAIM_DETAILS_SUCCESS':
      return {
        ...state,
        bpmClaimInformation: {
          data: action?.payload,
          isLoading: false,
        },
      };
    case 'GET_BPM_CLAIM_DETAILS_FAILURE':
      return {
        ...state,
        bpmClaimInformation: {
          ...state?.bpmClaimInformation,
          data: {},
          isLoading: false,
        },
        error: action.payload,
      };
    case 'CLAIMS_EDIT_RE_OPENED_TASK_SUCCESS':
    case 'CLAIMS_COMPLEXITY_VALUES_GET_FAILURE':
    case 'CLAIMS_SAVE_COMPLEXITY_INSURED_POST_ERROR':
    case 'CLAIMS_COMPLEXITY_SEARCH_POST_FAILURE':
    case 'CLAIMS_PROCESSING_FILTER_POST_ERROR':
    case 'CLAIMS_LOSS_FILTER_POST_ERROR':
    case 'CLAIMS_LOSS_FILTER_GET_ERROR':
    case 'CLAIMS_DETAILS_INFORMATION_POST_FAILURE':
    case 'CLAIMS_GET_FAILURE':
    case 'CLAIMS_DETAILS_ERROR':
    case 'CLAIMS_SETTLEMENT_CURRENCY_GET_FAILURE':
    case 'CLAIMS_LOSS_QUALIFIERS_GET_FAILURE':
    case 'CLAIMS_COMPLEXITY_INSURED_GET_FAILURE':
    case 'CLAIMS_BE_ADJUSTER_GET_FAILURE':
    case 'CLAIMS_UNDERWRITING_GROUPS_GET_FAILURE':
    case 'CLAIMS_STATUSES_GET_FAILURE':
    case 'CLAIMS_COMPLEXITY_GET_FAILURE':
    case 'CLAIMS_DETAILS_INFORMATION_SUBMIT_FAILURE':
    case 'CLAIMS_COMPLEXITY_DIVISION_GET_FAILURE':
    case 'CLAIMS_COMPLEXITY_DIVISION_SAVE_FAILURE':
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_GET_FAILURE':
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_SAVE_FAILURE':
    case 'CLAIMS_ADD_COMPLEXITY_VALUES_FAILURE':
    case 'CLAIMS_REMOVE_COMPLEXITY_VALUES_FAILURE':
    case 'CLAIMS_COMPLEXITY_ADD_REFERRAL_FAILURE':
    case 'CLAIMS_COMPLEXITY_FLAGGED_GET_FAILURE':
    case 'CLAIMS_REMOVE_REFERRAL_VALUES_FAILURE':
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_GET_FAILURE':
    case 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_SAVE_FAILURE':
    case 'CLAIMS_COMPLEXITY_REFERRAL_VALUES_GET_FAILURE':
    case 'CLAIMS_SAVE_COMPLEXITY_POLICY_POST_ERROR':
    case 'CLAIMS_REFERRAL_VALUES_GET_FAILURE':
    case 'CLAIMS_COMPLEXITY_BASIS_VALUE_GET_FAILURE':
    case 'CLAIMS_REFERRAL_RESPONSE_GET_FAILURE':
    case 'CLAIMS_COMPLEXITY_POLICY_REMOVE_FAILURE':
    case 'CLAIMS_COMPLEXITY_INSURED_REMOVE_FAILURE':
    case 'CLAIMS_SAVE_NOTES_POST_ERROR':
    case 'CLAIM_NOTES_POST_FAILURE':
    case 'CLAIM_TASK_NOTES_GET_FAILURE':
    case 'CLAIMS_TASK_PRIORITY_POST_FAILURE':
    case 'CLAIMS_TASK_SANCTIONS_CHECK_POST_FAILURE':
    case 'CLAIMS_TASK_PROCESSING_SAVE_ASSIGNEES_ERROR':
    case 'CLAIMS_TASK_PROCESSING_GET_CHECKLIST_FAILURE':
    case 'CLAIMS_TASK_PROCESSING_GET_NEXT_TASKLIST_FAILURE':
    case 'CLAIMS_TASK_PROCESSING_SAVE_CHECKLIST_ACTIONS_ERROR':
    case 'CLAIMS_TASK_PROCESSING_SAVE_NEXT_ACTION_ERROR':
    case 'CLAIMS_SET_PRIORITY_FAILURE':
    case 'GET_ASSOCIATED_TASK_FAILURE':
    case 'CLAIMREF_EDIT_NOTES_FAILURE':
    case 'CURRENCY_PURCHASED_VALUE_GET_FAILURE':
    case 'CLOSE_SANCTIONS_CHECK_FAILURE':
    case 'CLAIM_RETURN_TO_TEAM_QUEUE_ERROR':
    case 'CLAIMS_SEND_RFI_POST_FAILURE':
    case 'CLAIMS_CLOSE_RFI_POST_FAILURE':
    case 'CLOSE_CLAIMS_POST_ERROR':
    case 'CLAIM_COMPLEXITY_TYPES_GET_FAILURE':
    case 'CLAIMS_PROCESSING_SINGLE_ASSIGN_ERROR':
    case 'CLAIMS_LOSS_ACTIONS_GET_FAILURE':
    case 'LOSSES_TAB_POST_FAILURE':
    case 'CLAIMS_CASE_INCIDENT_DETAILS_GET_FAILURE':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default claimsReducer;
