import config from 'config';
import xorBy from 'lodash/xorBy';
import has from 'lodash/has';
import get from 'lodash/get';
import omit from 'lodash/omit';
import * as utils from 'utils';
import { firstBy } from 'thenby';

const initialState = {
  addresses: [],
  leads: [],
  leadsLoading: false,
  leadsEmpty: false,
  list: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
    sortBy: 'id',
    sortType: 'numeric',
    sortDirection: 'desc',
  },
  selected: {
    title: '',
    visits: [],
    addresses: [],
    loading: false,
    editing: false,
  },
  editingInProgress: {},
};

const parsedTrip = (trip) => {
  return {
    ...omit(trip, ['visit']),
    visits: sortedVisits(trip.visit).map((visit) => {
      // adding a "location" property to the visits by matching the client ID of addresses and visits
      const location = trip.addresses.find((address) => {
        const addressClientId = get(address, 'client.id');
        const visitClientId = get(visit, 'client.id');

        return addressClientId && visitClientId && addressClientId === visitClientId;
      });

      return {
        ...visit,
        location,
      };
    }),
  };
};

const sortedVisits = (visits) => {
  // abort
  if (!utils.generic.isValidArray(visits)) {
    return [];
  }

  return visits.sort(firstBy(utils.sort.array('date', 'visitingDate')).thenBy('id'));
};

const tripReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'TRIP_ADDRESSES_GET_SUCCESS':
      return {
        ...state,
        addresses: [action.payload],
      };

    case 'TRIP_ADDRESSES_GET_FAILURE':
      return {
        ...state,
        addresses: [],
      };

    case 'TRIP_LEADS_GET_REQUEST':
      return {
        ...state,
        leadsLoading: true,
        leadsEmpty: false,
      };

    case 'TRIP_LEADS_GET_SUCCESS':
      return {
        ...state,
        leads: action.payload,
        leadsLoading: false,
        leadsEmpty: action.payload ? action.payload.length <= 0 : false,
      };

    case 'TRIP_LEADS_GET_FAILURE':
    case 'TRIP_LEADS_RESET':
      return {
        ...state,
        leads: [],
        leadsLoading: false,
        leadsEmpty: false,
      };

    case 'TRIP_SELECTED_TOGGLE_EDITING':
      return {
        ...state,
        selected: {
          ...state.selected,
          editing: action.payload,
        },
        editingInProgress: {
          ...state.editingInProgress,
          title: action.payload ? state.selected.title : '',
          visits: action.payload ? state.selected.visits : [],
        },
      };

    case 'TRIP_SELECTED_TOGGLE_VISIT':
      const toggleVisitKey = state.selected.editing ? 'editingInProgress' : 'selected';
      const toggleVisitArray = state.selected.editing ? state.editingInProgress.visits : state.selected.visits;

      return {
        ...state,
        [toggleVisitKey]: {
          ...state[toggleVisitKey],
          visits: sortedVisits(xorBy(toggleVisitArray, [action.payload], 'id')),
        },
      };

    case 'TRIP_SELECTED_EDIT_VISIT':
      const editVisitKey = state.selected.editing ? 'editingInProgress' : 'selected';
      const editVisitArray = state.selected.editing ? state.editingInProgress.visits : state.selected.visits;

      return {
        ...state,
        [editVisitKey]: {
          ...state[editVisitKey],
          visits: sortedVisits(
            editVisitArray.map((visit) => {
              if (visit.id === action.payload.id) {
                visit = {
                  ...visit,
                  ...(has(action.payload, 'visitingDate') && { visitingDate: action.payload.visitingDate }),
                  ...(has(action.payload, 'users') && { users: action.payload.users }),
                };
              }

              return visit;
            })
          ),
        },
      };

    case 'TRIP_SELECTED_EDIT_DETAILS':
      const editDetailsKey = state.selected.editing ? 'editingInProgress' : 'selected';

      return {
        ...state,
        [editDetailsKey]: {
          ...state[editDetailsKey],
          ...action.payload,
          ...(action.payload.title && { title: action.payload.title.trim() }),
        },
      };

    case 'TRIP_SELECTED_RESET':
      return {
        ...state,
        selected: {
          ...initialState.selected,
        },
      };

    case 'TRIP_EDITING_IN_PROGRESS_RESET':
      return {
        ...state,
        editingInProgress: {},
      };

    case 'TRIP_BY_ID_GET_REQUEST':
      return {
        ...state,
        selected: {
          ...state.selected,
          loading: true,
        },
      };

    case 'TRIP_BY_ID_GET_SUCCESS':
      return {
        ...state,
        selected: {
          ...state.selected,
          ...parsedTrip(action.payload),
          loading: false,
        },
      };

    case 'TRIP_BY_ID_GET_FAILURE':
      return {
        ...state,
        selected: {
          ...state.selected,
          loading: false,
        },
      };

    case 'TRIP_PUT_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.map((item) => {
            return action.payload.id === item.id ? parsedTrip(action.payload) : item;
          }),
        },
        selected: {
          ...state.selected,
          ...parsedTrip(action.payload),
          loading: false,
        },
      };

    case 'TRIP_POST_SUCCESS':
      return {
        ...state,
        selected: {
          ...state.selected,
          ...parsedTrip(action.payload),
          loading: false,
        },
      };

    case 'TRIP_LIST_GET_SUCCESS':
      const listTrips = utils.generic.isValidArray(action.payload.items) ? action.payload.items : [];

      // below, we're renaming "trip.visit" to be "trip.visits"
      // the API returns the key as "visit" because the DB table is named that way
      // it is an array of multiple visits, so we're keeping the F/E pattern of naming arrays using plural
      return {
        ...state,
        list: {
          ...state.list,
          items: listTrips.map((trip) => parsedTrip(trip)),
          ...utils.api.pagination(action.payload),
        },
      };

    case 'TRIP_DELETE_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          itemsTotal: state.list.itemsTotal - 1,
          items: state.list.items.filter((item) => {
            return item.id !== action.payload;
          }),
        },
        selected: state.selected && state.selected.id === action.payload ? { ...initialState.selected } : state.selected,
      };

    default:
      return state;
  }
};

export default tripReducers;
