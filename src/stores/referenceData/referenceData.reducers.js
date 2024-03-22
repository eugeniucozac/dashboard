import get from 'lodash/get';
import * as utils from 'utils';
import { firstBy } from 'thenby';

const initialState = {
  businessTypes: [],
  capacityTypes: [],
  clients: [],
  countries: [],
  currencies: [],
  departments: [],
  insureds: [],
  markets: [],
  offices: [],
  statuses: {
    account: [],
    placement: [],
    policy: [],
    policyMarketQuote: [],
  },
  underwriters: [],
  loaded: false,

  // new reference data properties - extended edge
  documentTypes: [],
  documentTypeLookUp: [],
  businessProcesses: [],
  processTypes: [],
  rfiTypes: [],
  currencyCodes: [],
  xbInstances: [],
  bpmFlags: [],
  bpmStages: [],
  marketTypes: [],
  queryCodes: [],
  resolutionCode: [],
  countriesList: [],
  catCodes: [],
  warrantyTypes: [],
  thirdParty: [],
  settlementCurrency: [],
  baseCurrency: [],
};

const referenceDataReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'REFERENCE_DATA_GET_SUCCESS':
      return {
        ...state,
        businessTypes: [],
        capacityTypes: action.payload.capacityTypes || [],
        currencies: action.payload.currencies,
        countries: utils.generic.isValidArray(action.payload.countries)
          ? action.payload.countries.filter((c) => c.codeAlpha2 && c.codeAlpha3 && c.name)
          : [],
        departments: action.payload.departments,
        statuses: {
          placement: action.payload.placementStatuses,
          policy: action.payload.policyStatuses,
          policyMarketQuote: action.payload.policyMarketQuoteStatuses,
          account: action.payload.accountStatuses,
        },
        newRenewalBusinesses: action.payload.newRenewalBusinesses,
        rationales: action.payload.placementMarketRationales,
        declinatures: action.payload.placementMarketDeclinatures,
        loaded: true,
      };

    case 'REFERENCE_DATA_FILTER_BUSINESSTYPES_BY_DEPTID':
      let parsedBusinessTypes = [];
      const departments = get(state, `departments`, {});

      const currentDepartment = departments.find((dept) => {
        return dept.id === action.payload;
      });

      if (currentDepartment && get(currentDepartment, 'businessTypes', []).length > 0) {
        parsedBusinessTypes = currentDepartment.businessTypes.sort(
          firstBy(utils.sort.array('numeric', 'sequenceNumber')).thenBy(utils.sort.array('lexical', 'description'))
        );
      }

      return {
        ...state,
        businessTypes: parsedBusinessTypes,
      };

    case 'REFERENCE_DATA_GET_BY_TYPE_MARKETS_SUCCESS':
      return {
        ...state,
        markets: action.payload,
        underwriters: [],
      };

    case 'REFERENCE_DATA_GET_BY_TYPE_OFFICES_SUCCESS':
      return {
        ...state,
        offices: utils.office.withFullName(action.payload),
      };

    case 'REFERENCE_DATA_GET_BY_TYPE_CLIENTS_SUCCESS':
      return {
        ...state,
        clients: action.payload,
      };

    case 'REFERENCE_DATA_GET_BY_TYPE_INSUREDS_SUCCESS':
      return {
        ...state,
        insureds: action.payload,
      };

    case 'REFERENCE_DATA_FILTER_UNDERWRITERS_BY_MARKET':
      return {
        ...state,
        underwriters: [...get(action, 'payload.underwriters', [])],
      };

    case 'REFERENCE_DATA_RESET_BUSINESS_TYPES':
      return {
        ...state,
        businessTypes: [],
      };

    case 'REFERENCE_DATA_RESET_MARKETS':
      return {
        ...state,
        markets: [],
      };

    case 'REFERENCE_DATA_RESET_UNDERWRITERS':
      return {
        ...state,
        underwriters: [],
      };

    case 'REFERENCE_DATA_RESET_INSUREDS':
      return {
        ...state,
        insureds: [],
      };

    case 'REFERENCE_DATA_GET_XB_INSTANCES_SUCCESS':
      return {
        ...state,
        xbInstances: action.payload,
      };

    case 'REFERENCE_DATA_GET_XB_INSTANCES_DEPARTMENTS_SUCCESS':
      return {
        ...state,
        xbInstances: state.xbInstances.map((xbi) => {
          if (action.payload.id === xbi.id) {
            return { ...xbi, departments: action.payload.departments };
          } else {
            return xbi;
          }
        }),
      };

    case 'REFERENCE_DATA_GET_NEW_SUCCESS':
      return {
        ...state,
        documentTypes: action.payload.documentType,
        documentTypeLookUp: action.payload?.documentTypeLookUp || [],
        businessProcesses: action.payload.businessProcess,
        processTypes: action.payload.processType,
        rfiTypes: action.payload.rfiType,
        currencyCodes: action.payload.currencyCode,
        xbInstances: action.payload.source,
        marketTypes: action.payload.marketTypes,
        bordereauType: action.payload.bordereauType,
        facilityType: action.payload.facilityType,
        bordereauPolicyType: action.payload.bordereauPolicyType,
        queryCodes: action.payload.queryCodes,
        countriesList: action.payload.countries,
        catCodes: action.payload.catCodes,
        warrantyTypes: action.payload.warrantyType,
        thirdParty: action.payload.thirdParty,
        settlementCurrency: action.payload.settlementCurrency,
        baseCurrency: action.payload.baseCurrency,
      };
    case 'REFERENCE_DATA_GET_NEW_BPM_SUCCESS':
      return {
        ...state,
        bpmFlags: action.payload.bpmFlag,
        bpmStages: action.payload.bpmStage,
      };

    case 'REFERENCE_DATA_TYPE_NEW_ODS_SUCCESS':
      return {
        ...state,
        querycode: action.payload.querycode,
        resolutionCode: action.payload.resolutionCode,
      };

    default:
      return state;
  }
};

export default referenceDataReducers;
