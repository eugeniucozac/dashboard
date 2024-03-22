import config from 'config';
import * as utils from 'utils';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

const list = {
  items: [],
  itemsTotal: 0,
  loading: false,
  page: 1,
  pageSize: config.ui.pagination.default,
  pageTotal: 0,
  query: '',
  sortBy: 'id',
  sortType: 'numeric',
  sortDirection: 'desc',
};

const draftList = {
  items: [],
  itemsTotal: 0,
  loading: false,
  page: 1,
  pageSize: config.ui.pagination.default,
  pageTotal: 0,
  query: '',
  sortBy: 'id',
  sortType: 'numeric',
  sortDirection: 'desc',
};

const initialState = {
  list: { ...list },
  draftList: { ...draftList },
  products: {
    items: [],
    selected: '',
    loading: false,
  },
  productsWithReports: {
    items: [],
    loading: false,
  },
  definitions: {
    loading: false,
  },
  preBindDefinitions: {
    fields: {},
    loading: false,
  },
  coverages: {
    loading: false,
  },
  coverageDefinitions: {
    loading: false,
  },
  facilities: {
    list: {
      ...list,
      sortBy: 'name',
      sortType: 'lexical',
      sortDirection: 'asc',
    },
    selected: {},
    loading: false,
    ratesLoaded: {},
    limitsLoaded: {},
  },
  limits: {
    items: [],
    aggregateLimits: [],
    loading: false,
  },
  countries: {
    items: [],
    loading: false,
  },
  quotes: {
    items: [],
    loading: false,
  },
  selected: {
    loading: false,
  },
  download: {
    started: false,
    finished: true,
    status: null,
  },
};

const updateFacilityRates = (items, payload) => {
  return items.map((item) => {
    if (item.id === payload.facilityId) {
      return {
        ...item,
        rates: payload,
      };
    }

    return item;
  });
};

const updateFacilityLimits = (items, payload) => {
  return items.map((item) => {
    if (item.id === payload.facilityId) {
      return {
        ...item,
        limits: payload,
      };
    }

    return item;
  });
};

const updateFacilityDetails = (items, payload) => {
  return items.map((item) => {
    if (item.id === payload.id) {
      return {
        ...item,
        permissionToBindGroups: payload.permissionToBindGroups,
        notifiedUsers: payload.notifiedUsers,
        preBind: payload.preBind,
        permissionToDismissIssuesGroups: payload.permissionToDismissIssuesGroups,
      };
    }

    return item;
  });
};

const riskReducers = (state = initialState, action) => {
  switch (action.type) {
    // risk
    case 'RISK_POST_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          items: [{ ...action.payload }, ...state.list.items],
          itemsTotal: state.list.itemsTotal + 1,
        },
        selected: {
          ...action.payload,
          loading: false,
        },
      };
    case 'RISK_PATCH_SUCCESS':
      return {
        ...state,
        selected: {
          ...state.selected,
          augmentVersion: action.payload?.augmentVersion,
          loading: false,
          risk: {
            ...action.payload,
          },
        },
      };
    case 'RISK_SELECTED_SET':
      return {
        ...state,
        selected: {
          ...action.payload,
          loading: false,
        },
      };

    case 'RISK_SELECTED_RESET':
      return {
        ...state,
        selected: {},
      };

    // list

    case 'RISK_LIST_GET_REQUEST':
      return {
        ...state,
        list: {
          ...state.list,
          loading: true,
        },
      };
    case 'RISK_LIST_GET_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          items: action.payload.content,
          ...utils.api.pagination(action.payload),
        },
      };

    case 'RISK_LIST_GET_FAILURE':
      return {
        ...state,
        list: {
          ...initialState.list,
          loading: false,
        },
      };

    case 'RISK_LIST_UPDATE_ITEM_RISK_STATUS':
      return {
        ...state,
        list: {
          ...state.list,
          items: [
            ...state.list.items.map((item) => {
              if (item.id === action.payload.riskId) {
                item.riskStatus = action.payload.riskStatus;
              }
              return item;
            }),
          ],
        },
      };

    // drafts

    case 'DRAFT_LIST_GET_REQUEST':
      return {
        ...state,
        draftList: {
          ...state.draftList,
          loading: true,
        },
      };
    case 'DRAFT_LIST_GET_SUCCESS':
      return {
        ...state,
        draftList: {
          ...state.draftList,
          loading: false,
          items: action.payload.content,
          ...utils.api.pagination(action.payload),
        },
      };

    case 'DRAFT_LIST_GET_FAILURE':
      return {
        ...state,
        draftList: {
          ...state.draftList,
          loading: false,
        },
      };

    case 'DRAFT_RISK_UPDATE_SUCCESS':
      return {
        ...state,
        draftList: {
          ...state.draftList,
          items: state.draftList.items.map((draft) => {
            if (draft.id === action.payload.id) {
              return { ...action.payload };
            }

            return draft;
          }),
        },
      };
    case 'DRAFT_DELETE_SUCCESS':
      return {
        ...state,
        draftList: {
          ...state.draftList,
          items: state.draftList.items.filter((draft) => {
            return !utils.generic.isSameId(draft.id, action.payload);
          }),
        },
      };

    case 'DRAFT_RISK_POST_SUCCESS':
      return {
        ...state,
        draftList: {
          ...state.draftList,
          items: [{ ...action.payload, __new__: true }, ...state.draftList.items],
          itemsTotal: state.draftList.itemsTotal + 1,
        },
      };

    // details
    case 'RISK_DETAILS_GET_REQUEST':
      return {
        ...state,
        selected: {
          ...state.selected,
          loading: true,
        },
      };

    case 'RISK_DETAILS_GET_SUCCESS':
      return {
        ...state,
        selected: {
          ...action.payload,
          loading: false,
        },
      };
    case 'RISK_DETAILS_REFRESH_GET_SUCCESS':
      return {
        ...state,
        selected: {
          ...action.payload,
          loading: false,
          risk: {
            ...state.selected.risk,
          },
        },
      };
    case 'RISK_DETAILS_GET_FAILURE':
      return {
        ...state,
        selected: {
          loading: false,
        },
      };

    // products

    case 'RISK_PRODUCTS_REPORTS_GET_REQUEST':
      return {
        ...state,
        productsWithReports: {
          ...state.productsWithReports,
          loading: true,
        },
      };

    case 'RISK_PRODUCTS_REPORTS_GET_SUCCESS':
      return {
        ...state,
        productsWithReports: {
          items: utils.generic.isValidArray(action.payload) ? action.payload.sort() : action.payload,
          loading: false,
        },
      };

    case 'RISK_PRODUCTS_GET_REQUEST':
      return {
        ...state,
        products: {
          ...state.products,
          loading: true,
        },
      };

    case 'RISK_PRODUCTS_GET_SUCCESS':
      return {
        ...state,
        products: {
          ...state.products,
          items: utils.generic.isValidArray(action.payload) ? action.payload.sort() : action.payload,
          loading: false,
        },
      };

    case 'RISK_PRODUCTS_GET_FAILURE':
      return {
        ...state,
        products: initialState.products,
      };

    case 'RISK_PRODUCTS_SELECT':
      return {
        ...state,
        products: {
          ...state.products,
          selected: action.payload,
        },
      };

    case 'RISK_PRODUCTS_RESET':
      return {
        ...state,
        products: {
          ...state.products,
          selected: initialState.products.selected,
        },
      };

    // definitions
    case 'RISK_DEFINITIONS_GET_REQUEST':
      return {
        ...state,
        definitions: {
          ...state.definitions,
          loading: true,
        },
      };

    case 'RISK_DEFINITIONS_GET_SUCCESS':
      return {
        ...state,
        definitions: {
          ...state.definitions,
          [action.payload.type]: {
            fields: get(action.payload, 'data.product', []),
            fieldOptions: get(action.payload, 'data.fieldOptions') || [],
          },
          loading: false,
        },
      };

    case 'RISK_DEFINITIONS_GET_FAILURE':
      return {
        ...state,
        definitions: initialState.definitions,
      };

    // facilities
    case 'RISK_FACILITIES_GET_REQUEST':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          loading: true,
          ratesLoaded: {},
        },
      };

    case 'RISK_FACILITIES_GET_SUCCESS':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: action.payload.content,
            ...utils.api.pagination(action.payload),
          },
          loading: false,
          ratesLoaded: {},
        },
      };

    case 'RISK_FACILITIES_GET_FAILURE':
      return {
        ...state,
        facilities: initialState.facilities,
      };

    case 'RISK_FACILITIES_RESET':
      return {
        ...state,
        facilities: initialState.facilities,
      };

    case 'RISK_FACILITIES_POST_SUCCESS':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: [{ ...action.payload, __new__: true }, ...state.facilities.list.items],
            itemsTotal: state.facilities.list.itemsTotal + 1,
          },
        },
      };
    // all facilities
    case 'RISK_ALL_FACILITIES_GET_REQUEST':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          loading: true,
        },
      };

    case 'RISK_ALL_FACILITIES_GET_SUCCESS':
      const sortedContent = sortBy(action.payload.content, 'name');
      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: sortedContent,
          },
          loading: false,
        },
      };

    // facility rates
    case 'RISK_FACILITY_RATES_GET_REQUEST':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          ratesLoaded: action.payload ? { [action.payload]: false } : {},
        },
      };

    case 'RISK_FACILITY_RATES_GET_SUCCESS':
      const isFacilityLoaded = action.payload.facilityId && state.facilities.list.items.find((i) => i.id === action.payload.facilityId);

      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: isFacilityLoaded ? updateFacilityRates(state.facilities.list.items, action.payload) : state.facilities.list.items,
          },
          ratesLoaded: action.payload.facilityId ? { [action.payload.facilityId]: true } : {},
        },
      };

    case 'RISK_FACILITY_RATES_GET_FAILURE':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: state.facilities.list.items.map((item) => {
              delete item.rates;
              return item;
            }),
          },
          ratesLoaded: action.payload.facilityId ? { [action.payload.facilityId]: true } : {},
        },
      };

    // countries
    case 'RISK_COUNTRIES_GET_REQUEST':
      return {
        ...state,
        countries: {
          ...state.countries,
          loading: true,
        },
      };

    case 'RISK_COUNTRIES_GET_SUCCESS':
      return {
        ...state,
        countries: {
          ...state.countries,
          items: action.payload,
          loading: false,
        },
      };

    case 'RISK_COUNTRIES_GET_FAILURE':
      return {
        ...state,
        countries: {
          ...state.countries,
          items: [],
          loading: false,
        },
      };

    case 'RISK_FACILITY_RATES_POST_SUCCESS':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: updateFacilityRates(state.facilities.list.items, action.payload),
          },
          ratesLoaded: action.payload.facilityId ? { [action.payload.facilityId]: true } : {},
        },
      };
    case 'RISK_FACILITY_DETAILS_PUT_SUCCESS':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: updateFacilityDetails(state.facilities.list.items, action.payload),
          },
        },
      };

    // quotes
    case 'RISK_QUOTES_GET_REQUEST':
      return {
        ...state,
        quotes: {
          ...state.quotes,
          loading: true,
        },
      };

    case 'RISK_QUOTES_GET_SUCCESS':
      return {
        ...state,
        quotes: {
          ...state.quotes,
          items: action.payload.items,
          loading: false,
        },
      };

    case 'RISK_QUOTES_GET_FAILURE':
      return {
        ...state,
        quotes: initialState.quotes,
      };

    case 'RISK_POST_QUOTE_SUCCESS':
      const postQuoteItems = [
        { ...action.payload, __new__: true },
        ...state.quotes.items.map((i) => {
          delete i.__new__;
          return i;
        }),
      ];

      return {
        ...state,
        quotes: {
          ...state.quotes,
          items: postQuoteItems,
        },
      };

    // quote response
    case 'RISK_POST_QUOTE_RESPONSE_SUCCESS':
      // temporarily commenting until B/E also updates the risk dates after a bind
      // const postResponseEffectiveFrom = get(action.payload, 'response.effectiveFrom');
      // const postResponseEffectiveTo = get(action.payload, 'response.effectiveTo');
      const postQuoteResponseQuotes = state.quotes.items.map((quote) => {
        if (quote.id === action.payload.id) {
          return action.payload;
        }

        return quote;
      });

      return {
        ...state,
        quotes: {
          ...state.quotes,
          items: postQuoteResponseQuotes,
        },
        // selected: {
        //   ...updateRiskSelectedStatus(state, action, postQuoteResponseQuotes),
        // temporarily commenting until B/E also updates the risk dates after a bind
        // inceptionDate: postResponseEffectiveFrom,
        // expiryDate: postResponseEffectiveTo,
        // },
        // list: {
        //   ...state.list,
        // items: updateRiskListItemsStatus(state, action, postQuoteResponseQuotes).map((item) => {
        // temporarily commenting until B/E also updates the risk dates after a bind
        // if (item.id === action.payload.riskId) {
        //   item.inceptionDate = postResponseEffectiveFrom;
        //   item.expiryDate = postResponseEffectiveTo;
        // }
        // return item;
        // }),
        // },
      };

    case 'DOWNLOAD_RISK_BORDEREAUX_REQUEST': {
      return {
        ...state,
        download: {
          ...state.download,
          started: true,
        },
      };
    }
    case 'DOWNLOAD_RISK_BORDEREAUX_SUCCESS': {
      return {
        ...state,
        download: {
          started: false,
          status: 'success',
        },
      };
    }

    case 'DOWNLOAD_RISK_BORDEREAUX_FAILURE': {
      return {
        ...state,
        download: {
          started: false,
          status: 'error',
        },
      };
    }
    case 'PRE_BIND_DEFINITIONS_GET_REQUEST':
      return {
        ...state,
        preBindDefinitions: {
          ...state.preBindDefinitions,
          loading: true,
        },
      };
    case 'PRE_BIND_DEFINITIONS_GET_SUCCESS': {
      return {
        ...state,
        preBindDefinitions: {
          fields: action.payload || [],
          loading: false,
        },
      };
    }

    case 'PRE_BIND_DEFINITIONS_GET_FAILURE':
      return {
        ...state,
        preBindDefinitions: initialState.preBindDefinitions,
      };

    case 'RISK_PREBIND_POST_SUCCESS': {
      return {
        ...state,
        selected: {
          ...state.selected,
          risk: { ...state.selected.risk, ...action.payload.risk },
        },
      };
    }

    // Coverage Comparison
    case 'COVERAGE_DEFINITIONS_GET_REQUEST': {
      return {
        ...state,
        coverageDefinitions: {
          ...state.coverageDefinitions,
          loading: true,
        },
      };
    }

    case 'COVERAGE_DEFINITIONS_GET_SUCCESS': {
      return {
        ...state,
        coverageDefinitions: {
          ...state.coverageDefinitions,
          [action.payload.product]: action.payload.definition,
          loading: false,
        },
      };
    }

    case 'COVERAGE_DEFINITIONS_GET_FAILURE': {
      return {
        ...state,
        coverageDefinitions: initialState.coverageDefinitions,
      };
    }

    case 'RISK_COVERAGE_GET_SUCCESS': {
      return {
        ...state,
        coverages: {
          ...state.coverages,
          selected: action.payload,
          loading: false,
        },
      };
    }

    case 'RISK_COVERAGE_POST_SUCCESS': {
      const isCoveragePresent = state.coverages.selected.find((coverage) => coverage.id === action.payload.id);
      return {
        ...state,
        coverages: {
          ...state.coverages,
          selected: isCoveragePresent ? [...state.coverages.selected] : [...state.coverages.selected, action.payload],
          loading: false,
        },
      };
    }

    case 'RISK_COVERAGE_POST_EDIT_SUCCESS': {
      return {
        ...state,
        coverages: {
          ...state.coverages,
          selected: [
            ...state.coverages.selected.map((coverage) => {
              if (coverage.id === action.payload.coverageId) {
                return action.payload.responseData;
              }
              return coverage;
            }),
          ],
          loading: false,
        },
      };
    }

    case 'RISK_COVERAGE_DELETE_SUCCESS': {
      return {
        ...state,
        coverages: {
          ...state.coverages,
          selected: [...state.coverages.selected.filter((c) => c.id !== action.payload)],
          loading: false,
        },
      };
    }

    case 'RISK_COVERAGE_PUT_ACTIVATE_SUCCESS': {
      return {
        ...state,
        selected: {
          ...action.payload,
          loading: false,
        },
      };
    }

    // Facility Limits Definition GET request
    case 'RISK_FACILITY_LIMITS_DEF_GET_REQUEST':
      return {
        ...state,
        limits: {
          ...state.limits,
          loading: true,
        },
      };

    case 'RISK_FACILITY_LIMITS_DEF_GET_SUCCESS':
      return {
        ...state,
        limits: {
          ...state.limits,
          items: action.payload,
          loading: false,
        },
      };

    case 'RISK_FACILITY_LIMITS_DEF_GET_FAILURE':
      return {
        ...state,
        limits: {
          ...state.limits,
          items: [],
          loading: false,
        },
      };

    // Facility Limits
    case 'RISK_FACILITY_LIMIT_GET_REQUEST':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          limitsLoaded: action.payload ? { [action.payload]: false } : {},
          loading: true,
        },
      };

    case 'RISK_FACILITY_LIMIT_GET_SUCCESS':
      const isFacLoaded = action.payload.facilityId && state.facilities.list.items.find((i) => i.id === action.payload.facilityId);
      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: isFacLoaded ? updateFacilityLimits(state.facilities.list.items, action.payload) : state.facilities.list.items,
          },
          limitsLoaded: action.payload.facilityId ? { [action.payload.facilityId]: true } : {},
          loading: false,
        },
      };

    case 'RISK_FACILITY_LIMIT_GET_FAILURE':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: state.facilities.list.items.map((item) => {
              delete item.limits;
              return item;
            }),
          },
          limitsLoaded: action.payload.facilityId ? { [action.payload.facilityId]: true } : {},
          loading: false,
        },
      };

    case 'RISK_FACILITY_LIMITS_POST_SUCCESS':
      return {
        ...state,
        facilities: {
          ...state.facilities,
          list: {
            ...state.facilities.list,
            items: updateFacilityLimits(state.facilities.list.items, action.payload),
          },
          ratesLoaded: action.payload.facilityId ? { [action.payload.facilityId]: true } : {},
        },
      };
    // Facility Limits Definition GET request
    case 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_REQUEST':
      return {
        ...state,
        limits: {
          ...state.limits,
          loading: true,
        },
      };

    case 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_SUCCESS':
      return {
        ...state,
        limits: {
          ...state.limits,
          aggregateLimits: action.payload,
          loading: false,
        },
      };

    case 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_FAILURE':
      return {
        ...state,
        limits: {
          ...state.limits,
          aggregateLimits: [],
          loading: false,
        },
      };
    case 'UPDATE_ISSUE_SUCCESS':
      return {
        ...state,
        quotes: {
          ...state.quotes,
          items: state.quotes.items.map((quote) => {
            if (quote.id === action.quoteId) {
              return {
                ...quote,
                issues: quote.issues.map((issue) => {
                  if (issue.id === action.payload.id) {
                    return action.payload;
                  }
                  return issue;
                }),
              };
            }
            return quote;
          }),
        },
      };
    default:
      return state;
  }
};

export default riskReducers;
