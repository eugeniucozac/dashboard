import get from 'lodash/get';

// app
import config from 'config';
import * as constants from 'consts';
import * as utils from 'utils';

const initialState = {
  gridData: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    filters: {},
    sort: {
      by: 'instructionId',
      type: 'lexical',
      direction: 'desc',
    },
  },
  isPiGridDataLoading: false,
  isPiHasNoGridData: false,
  departmentList: [],
  advancedSearchResults: [],
  addedRiskRefDetailsFromAdvSearch: [],
  producingBrokers: [],
  accountExecutives: [],
  piAccountExecutives: [],
  producingBrokerNames: [],
  workFlowFrontEndContacts: [],
  instructions: [],
  riskReferencesDocumentsCountList: [],
  isRiskReferenceDocumentCountLoading: true,
  financialCheckList: [],
  retainedBrokerageAmountList: [],
  isFinancialCheckListLoading: false,
  documents: {
    riskReferences: [],
    premiumTaxDocument: null,
    signedLinesDocument: null,
  },
  endorsementNonPremium: [],
  bordereauPolicyTypes: [],
  facilityTypes: [],
  statuses: [],
  retainedBrokerageAmountForPdf: {
    retBrokerageAmt: '',
    convertedBrokerageAmt: {},
  },
  totalAmountForPdf: '',
  isResetAllSelected: false,
  selectedRiskRef: {},
  givenRiskRefs: [],
  givenRiskRefsHeaders: [],
  autoMatch: false,
  headerMap: [
    { key: 'riskReference', value: '' },
    { key: 'grossPremiumAmount', value: '' },
    { key: 'slipOrder', value: '' },
    { key: 'totalBrokerage', value: '' },
    { key: 'clientDiscount', value: '' },
    { key: 'thirdPartyCommissionSharing', value: '' },
    { key: 'thirdPartyName', value: '' },
    { key: 'pfInternalCommissionSharing', value: '' },
    { key: 'pfInternalDepartment', value: '' },
    { key: 'retainedBrokerage', value: '' },
    { key: 'retainedBrokerageCurrencyCode', value: '' },
    { key: 'fees', value: '' },
    { key: 'otherDeductions', value: '' },
    { key: 'settlementCurrency', value: '' },
    { key: 'paymentBasis', value: '' },
    { key: 'ppwOrPpc', value: '' },
  ],
  riskRefsUploadedFromExcel: [],
  excelRiskRefs: [],
};

const processingInstructionsReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'PROCESSING_INSTRUCTIONS_GRID_DATA_GET_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'PROCESSING_INSTRUCTIONS_GRID_DATA_LOADING':
      return {
        ...state,
        isPiGridDataLoading: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_GRID_DATA_GET_SUCCESS':
      const processingInstructionsGridPagination = action.payload.pagination || {};
      return {
        ...state,
        gridData: {
          ...state.gridData,
          items: action.payload.items || [],
          itemsTotal: get(processingInstructionsGridPagination, 'totalElements', 0),
          page: get(processingInstructionsGridPagination, 'page', 1),
          pageSize: get(processingInstructionsGridPagination, 'size', initialState.gridData.pageSize),
          pageTotal: get(processingInstructionsGridPagination, 'totalPages', 0),
          query: get(processingInstructionsGridPagination, 'searchBy', ''),
          sort: {
            ...state.gridData.sort,
            ...(processingInstructionsGridPagination.direction && {
              direction: processingInstructionsGridPagination.direction.toLowerCase(),
            }),
            ...(processingInstructionsGridPagination.orderBy && { by: processingInstructionsGridPagination.orderBy }),
          },
          filters: action.payload.filters,
        },
        loading: false,
        isPiGridDataLoading: false,
        isPiHasNoGridData: utils.generic.isValidArray(action.payload?.items, true) ? false : true,
      };
    case 'PROCESSING_INSTRUCTIONS_GRID_DATA_GET_FAILURE':
      return {
        ...state,
        isPiHasNoGridData: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_GRID_DATA_RESET_SEARCH':
      return {
        ...state,
        gridData: {
          ...initialState.gridData,
        },
      };

    case 'PROCESSING_INSTRUCTIONS_GET_STATUSES_SUCCESS':
      return {
        ...state,
        statuses: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_SAVE_RISK_REFS_SUCCESS':
      return {
        ...state,
        piAccountExecutives: action.payload.accountExecutives,
        producingBrokerNames: action.payload.producingBrokers,
      };

    case 'PROCESSING_INSTRUCTIONS_GET_INSTRUCTION_SUCCESS':
      return {
        ...state,
        piAccountExecutives: action.payload.accountExecutives,
        producingBrokerNames: action.payload.producingBrokers,
        isFinancialCheckListLoading: false,
      };

    case 'PROCESSING_INSTRUCTIONS_GET_DEPARTMENTS_SUCCESS':
      return {
        ...state,
        departmentList: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_UPDATE_ADVANCED_SEARCH_SELECTED':
      return {
        ...state,
        addedRiskRefDetailsFromAdvSearch: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_GET_ADVANCED_SEARCH_RESULTS_SUCCESS':
      return {
        ...state,
        advancedSearchResults: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_GET_USERS_IN_ROLES_SUCCESS':
      const usersOptions = action.payload || [];

      return {
        ...state,
        producingBrokers: usersOptions
          .filter((user) => user.userRole === constants.PRODUCING_BROKER)
          .map((type) => {
            return {
              id: type?.userId,
              name: type?.fullName,
              emailId: type?.emailId,
            };
          }),
        accountExecutives: usersOptions
          .filter((user) => user.userRole === constants.ACCOUNT_EXECUTIVE)
          .map((type) => {
            return {
              id: type?.userId,
              name: type?.fullName,
              emailId: type?.emailId,
            };
          }),
      };

    case 'PROCESSING_INSTRUCTIONS_STORE_BY_ID':
      return {
        ...state,
        instructions: {
          ...state.instructions,
          [action.id]: action.payload,
        },
      };

    case 'PROCESSING_INSTRUCTIONS_UPDATE_FINANCIAL_CHECKLIST':
      return {
        ...state,
        financialCheckList: action.payload,
        isFinancialCheckListLoading: false,
      };

    case 'PROCESSING_INSTRUCTIONS_RETAINED_BROKERAGE_AMOUNT':
      return {
        ...state,
        retainedBrokerageAmountList: action.payload,
      };

    case 'RISK_REFERENCE_DOCUMENTS_COUNT_LOADING':
      return {
        ...state,
        isRiskReferenceDocumentCountLoading: action.payload,
      };
    case 'RISK_REFERENCE_DOCUMENTS_COUNT_SUCCESS':
      return {
        ...state,
        riskReferencesDocumentsCountList: action.payload,
        isRiskReferenceDocumentCountLoading: false,
      };
    case 'RISK_REFERENCE_DOCUMENTS_COUNT_FAILURE':
      return {
        ...state,
        riskReferencesDocumentsCountList: [],
        isRiskReferenceDocumentCountLoading: false,
      };

    case 'REFERENCE_DOCUMENT_COUNT_DETAILS_UPDATE':
      return {
        ...state,
        ...state.documents,
        riskReferences: state.documents?.riskReferences?.map(
          (element) => (element.documentsCount = action.payload?.find((data) => data.riskRefId === element.riskRefId)?.documentCount || 0)
        ),
      };

    case 'PROCESSING_INSTRUCTIONS_RESET':
      return {
        ...state,
        instructions: {},
      };

    case 'PROCESSING_INSTRUCTIONS_GET_USERS_FOR_ROLE_SUCCESS':
      return {
        ...state,
        usersInRoles: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_STORE_NON_PREMIUM_VALUE':
      return {
        ...state,
        nonPremiumValue: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_REF_DATA_ENDORSEMENT_SUCCESS':
      return {
        ...state,
        endorsementNonPremium: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_GET_BORDEREAU_POLICY_TYPES_SUCCESS':
      return {
        ...state,
        bordereauPolicyTypes: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_DOCUMENTS_STORE':
      return {
        ...state,
        documents: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_GET_FACILITY_TYPES_SUCCESS':
      return {
        ...state,
        facilityTypes: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_STORE_RETAINED_BROKERAGE_AMOUNT':
      return {
        ...state,
        retainedBrokerageAmountForPdf: {
          retBrokerageAmt: action.payload.retBrokerageAmt,
          convertedBrokerageAmt: action.payload.convertedBrokerageAmt,
        },
      };

    case 'PROCESSING_INSTRUCTIONS_STORE_TOTAL_AMOUNT':
      return {
        ...state,
        totalAmountForPdf: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_RESET_ALL':
      return {
        ...state,
        isResetAllSelected: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_SELECTED_RISKREF':
      return {
        ...state,
        selectedRiskRef: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_RESET_SELECTED_RISKREF':
      return {
        ...state,
        selectedRiskRef: initialState.selectedRiskRef,
      };

    case 'PROCESSING_INSTRUCTIONS_SET_UPLOAD_WIZARD_GIVEN_RISKREFS':
      return {
        ...state,
        givenRiskRefs: action.payload.givenRiskRefs || [],
        givenRiskRefsHeaders: action.payload.headers || [],
      };

    case 'PROCESSING_INSTRUCTIONS_SET_UPLOAD_WIZARD_HEADER_MAP':
      return {
        ...state,
        headerMap: action.payload,
        autoMatch: true,
      };

    case 'PROCESSING_INSTRUCTIONS_SET_UPLOAD_WIZARD_RISKREFS':
      return {
        ...state,
        riskRefsUploadedFromExcel: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_SUBMIT_UPLOAD_EXCEL_RISKREFS':
      return {
        ...state,
        excelRiskRefs: action.payload,
      };

    case 'PROCESSING_INSTRUCTIONS_SET_UPLOAD_WIZARD_HEADER_MAP_RESET': // reset on submit
      return {
        ...state,
        headerMap: initialState.headerMap,
        autoMatch: initialState.autoMatch,
      };

    case 'PROCESSING_INSTRUCTIONS_RESET_COPIED_EXCEL_DATA':
      return {
        ...state,
        givenRiskRefs: initialState.givenRiskRefs,
        givenRiskRefsHeaders: initialState.givenRiskRefsHeaders,
        riskRefsUploadedFromExcel: initialState.riskRefsUploadedFromExcel,
        excelRiskRefs: initialState.excelRiskRefs,
      };

    default:
      return state;
  }
};

export default processingInstructionsReducers;
