import get from 'lodash/get';
import xor from 'lodash/xor';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import union from 'lodash/union';
import difference from 'lodash/difference';

// app
import config from 'config';
import * as utils from 'utils';
import * as constants from 'consts';

const initialState = {
  list: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    query: '',
  },
  sort: {
    by: 'inceptionDate',
    type: 'date',
    direction: 'asc',
  },
  selected: null,
  calendarViewEdit: null,
  selectedMarkets: [],
  bulk: {
    type: '',
    items: [],
  },
  bulkItems: {
    layers: [],
    layerMarkets: [],
  },
  bulkItemsMarketingMarkets: {
    marketingMarkets: [],
  },
  loadingSelected: false,
  showBulkSelect: false,
  showBulkSelectMarketingMarkets: false,
};

const placementReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'PLACEMENT_DESELECT':
      return {
        ...state,
        selected: null,
        selectedMarkets: [],
      };

    case 'PLACEMENT_NTU_SUCCESS': {
      const placementNtuIsSameId =
        get(state, 'selected.id') && utils.generic.isSameId(get(state, 'selected.id'), get(action.payload, 'id'));

      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.map((placement) => {
            if (placement.id === action.payload.id) {
              placement.statusId = action.payload.statusId;
            }

            return placement;
          }),
        },
        selected: placementNtuIsSameId
          ? {
              ...state.selected,
              statusId: action.payload.statusId,
            }
          : state.selected,
      };
    }
    case 'PLACEMENT_NTU_CALENDAR_SUCCESS': {
      const placementNtuIsSameId =
        get(state, 'selected.id') && utils.generic.isSameId(get(state, 'selected.id'), get(action.payload, 'id'));

      return {
        ...state,
        calendarViewEdit: utils.placement.parsePlacements([action.payload])[0],
        selected: placementNtuIsSameId
          ? {
              ...state.selected,
              statusId: action.payload.statusId,
            }
          : state.selected,
      };
    }
    case 'PLACEMENT_POST_SUCCESS':
      const isEditPlacementSelected = state.selected && state.selected.id === action.payload.id;
      const editPostSuccessPlacement = utils.placement.parsePlacements([action.payload])[0];

      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.map((item) => {
            if (action.payload.id === item.id) {
              return editPostSuccessPlacement;
            }

            return item;
          }),
        },
        ...(isEditPlacementSelected && { selected: editPostSuccessPlacement }),
      };

    case 'PLACEMENT_POST_CALENDAR_SUCCESS':
      return {
        ...state,
        calendarViewEdit: utils.placement.parsePlacements([action.payload])[0],
      };

    case 'PLACEMENT_REMOVE_PATCH_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.filter((item) => action.payload.id !== item.id),
        },
        selected: null,
      };
    case 'PLACEMENT_REMOVE_PATCH_CALENDAR_SUCCESS':
      return {
        ...state,
        calendarViewEdit: utils.placement.parsePlacements([action.payload])[0],
        selected: null,
      };

    case 'PLACEMENT_BULK_TOGGLE':
      const isBulkEmpty = !state.bulk.type;
      const isBulkSameType = isBulkEmpty || state.bulk.type === action.payload.type;
      const newBulkItems = isBulkSameType ? xor(state.bulk.items, [action.payload.id]) : state.bulk.items;

      return {
        ...state,
        bulk: {
          type: newBulkItems.length === 0 ? '' : state.bulk.type || action.payload.type,
          items: newBulkItems,
        },
      };
    case 'PLACEMENT_BULK_TOGGLE_LAYER':
      const newBulkLayers =
        (action.payload.selected === constants.SELECTALL && union(state.bulkItems.layers, [action.payload.layerId])) ||
        xor(state.bulkItems.layers, [action.payload.layerId]);
      const newBulkMarket =
        (action.payload.selected === constants.SELECTED && union([...state.bulkItems.layerMarkets, ...action.payload.marketIdList])) ||
        (action.payload.selected === constants.DESELECTED &&
          difference([...state.bulkItems.layerMarkets], [...action.payload.marketIdList])) ||
        (action.payload.selected === constants.SELECTALL && uniq([...state.bulkItems.layerMarkets, ...action.payload.marketIdList]));

      return {
        ...state,
        bulkItems: {
          layers: newBulkLayers,
          layerMarkets: newBulkMarket,
        },
      };
    case 'PLACEMENT_BULK_TOGGLE_MARKET':
      const newBulkLayer = state.bulkItems.layers.filter((layer) => layer !== action.payload.layerId);
      const newBulkMarkets = xor(state.bulkItems.layerMarkets, [action.payload.marketId]);

      return {
        ...state,
        bulkItems: {
          ...state.bulkItems,
          layers: newBulkLayer,
          layerMarkets: newBulkMarkets,
        },
      };
    case 'PLACEMENT_BULK_CLEAR_ALL':
      return {
        ...state,
        bulkItems: {
          layers: [],
          layerMarkets: [],
        },
      };

    case 'PLACEMENT_BULK_CLEAR':
      return {
        ...state,
        bulk: {
          type: '',
          items: [],
        },
      };

    case 'PLACEMENT_NEW_ENQUIRY_POST_SUCCESS':
      const newEnquiryItem = utils.placement.parsePlacements(action.payload)[0];
      const newEnquiryItemsList = [...state.list.items, { ...newEnquiryItem, __new__: true }];

      return {
        ...state,
        list: {
          ...state.list,
          items: newEnquiryItemsList,
          itemsTotal: get(state, 'list.itemsTotal', 0) + 1,
        },
        selected: { ...newEnquiryItem, __new__: true },
      };

    case 'LOCATION_SET_MAP_LOCATIONS':
      const isSelected = get(state, 'selected.id') === action.payload.id;
      const hasLocations = get(action, 'payload.locations', []).length > 0;

      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.map((placement) => {
            if (placement.id === action.payload.id) {
              placement.locations = [...action.payload.locations];
            }

            return placement;
          }),
        },
        selected: {
          ...state.selected,
          ...(isSelected && hasLocations && { locations: [...action.payload.locations] }),
        },
      };

    case 'PLACEMENT_LOCATIONS_RESET':
      return {
        ...state,
        selected: state.selected ? { ...omit(state.selected, ['locations']) } : null,
      };

    case 'PLACEMENT_EDIT_CONFIG_SUCCESS':
      let configEdited = null;

      if (action.payload.config) {
        try {
          configEdited = JSON.parse(action.payload.config);
        } catch {
          configEdited = null;
        }
      }

      return {
        ...state,
        selected: {
          ...state.selected,
          ...(state.selected.id === action.payload.id && {
            config: configEdited,
          }),
        },
      };

    case 'PLACEMENT_LIST_GET_SUCCESS':
      const listPagination = action.payload.pagination || {};

      return {
        ...state,
        list: {
          ...state.list,
          items: utils.placement.parsePlacements(action.payload.items || []),
          itemsTotal: get(listPagination, 'totalElements', 0),
          page: get(listPagination, 'page', 1),
          pageSize: get(listPagination, 'size', initialState.list.pageSize),
          pageTotal: get(listPagination, 'totalPages', 0),
          query: get(listPagination, 'query') || '',
        },
        sort: {
          ...(listPagination.direction && { direction: listPagination.direction.toLowerCase() }),
          ...(listPagination.orderBy && { by: listPagination.orderBy }),
        },
      };

    case 'PLACEMENT_DETAILS_GET_REQUEST':
      return {
        ...state,
        loadingSelected: true,
      };

    case 'PLACEMENT_DETAILS_GET_SUCCESS':
      return {
        ...state,
        selected: utils.placement.parsePlacements(action.payload ? [action.payload] : [])[0],
        loadingSelected: false,
      };

    case 'PLACEMENT_DETAILS_GET_FAILURE':
      return {
        ...state,
        selected: null,
        selectedMarkets: [],
        loadingSelected: false,
      };

    case 'PLACEMENT_POLICIES_SIGN_DOWN_POST_SUCCESS':
      return {
        ...state,
        selected: {
          ...state.selected,
          policies: state.selected.policies.map((statePolicy) => {
            action.payload.forEach((market) => {
              // check if policy matches one to be updated
              if (statePolicy.id === market.parentPolicyId) {
                let stateMarkets = get(statePolicy, 'markets', []) || [];

                statePolicy.markets = stateMarkets.map((stateMarketsObj) => {
                  // check if market matches one to be updated
                  if (stateMarketsObj.id === market.id) {
                    return market;
                  }

                  return stateMarketsObj;
                });
              }
            });

            return statePolicy;
          }),
        },
      };

    case 'PLACEMENT_POLICIES_DELETE':
      return {
        ...state,
        selected: state.selected
          ? {
              ...state.selected,
              policies: get(state, 'selected.policies', []).filter((policy) => {
                return !action.payload.includes(policy.id);
              }),
            }
          : state.selected,
      };

    case 'PLACEMENT_POLICY_POST_SUCCESS':
      return {
        ...state,
        selected: {
          ...state.selected,
          policies: [...get(state, 'selected.policies', []), action.payload],
        },
      };

    case 'PLACEMENT_POLICY_PUT_SUCCESS':
    case 'PLACEMENT_POLICY_PATCH_SUCCESS':
      const policiesEdited = get(state, 'selected.policies', []).map((policy) => {
        if (policy.id === action.payload.id) {
          return { ...action.payload };
        }

        return policy;
      });

      return {
        ...state,
        selected: {
          ...state.selected,
          policies: policiesEdited,
        },
      };

    case 'PLACEMENT_POLICY_MARKETS_DELETE':
      return {
        ...state,
        selected: {
          ...state.selected,
          policies: state.selected.policies.map((statePolicy) => {
            const stateMarkets = get(statePolicy, 'markets') || [];

            statePolicy.markets = stateMarkets.filter((stateMarketsObj) => {
              return !action.payload.includes(stateMarketsObj.id);
            });

            return statePolicy;
          }),
        },
      };

    case 'PLACEMENT_POLICY_MARKETS_UPDATE':
      return {
        ...state,
        selected: {
          ...state.selected,
          policies: state.selected.policies.map((statePolicy) => {
            action.payload.forEach((market) => {
              // check if policy matches one to be updated
              if (statePolicy.id === market.parentPolicyId) {
                let stateMarkets = get(statePolicy, 'markets', []) || [];

                statePolicy.markets = stateMarkets.map((stateMarketsObj) => {
                  // check if market matches one to be updated
                  if (stateMarketsObj.id === market.id) {
                    return market;
                  }

                  return stateMarketsObj;
                });
              }
            });

            return statePolicy;
          }),
        },
      };

    case 'PLACEMENT_POLICY_MARKET_ADD_POST_SUCCESS':
      const addMarketPolicyId = get(action, 'payload.parentPolicyId');

      return {
        ...state,
        selected: {
          ...state.selected,
          policies: get(state, 'selected.policies', []).map((policy) => {
            if (policy.id === addMarketPolicyId) {
              const newMarket = {
                ...action.payload,
              };

              if (Array.isArray(policy.markets)) {
                policy.markets.push(newMarket);
              } else {
                policy.markets = [newMarket];
              }
            }

            return policy;
          }),
        },
      };

    case 'PLACEMENT_POLICY_MARKET_EDIT_POST_SUCCESS':
      const editQuotePolicyMarket = get(action, 'payload', {});
      const editQuotePolicyId = get(action, 'payload.parentPolicyId');
      const editQuoteMarketId = get(action, 'payload.id');

      return {
        ...state,
        selected: {
          ...state.selected,
          policies: get(state, 'selected.policies', []).map((policy) => {
            if (policy.id === editQuotePolicyId) {
              if (policy.markets.length > 0) {
                policy.markets = policy.markets.map((marketObj) => {
                  if (marketObj.id === editQuoteMarketId) {
                    return editQuotePolicyMarket;
                  }

                  return marketObj;
                });
              }
            }

            return policy;
          }),
        },
      };

    case 'PLACEMENT_LAYERS_DELETE':
      return {
        ...state,
        selected: state.selected
          ? {
              ...state.selected,
              layers: get(state, 'selected.layers', []).filter((layer) => {
                return !action.payload.includes(layer.id);
              }),
            }
          : state.selected,
      };

    case 'PLACEMENT_LAYER_POST_SUCCESS':
      const addLayerIsSameId = utils.generic.isSameId(get(state, 'selected.id'), get(action.payload, 'placementId'));

      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.map((placement) => {
            if (utils.generic.isSameId(placement.id, get(action.payload, 'placementId'))) {
              placement.layers = [...placement.layers, action.payload];
            }

            return placement;
          }),
        },
        selected: addLayerIsSameId
          ? {
              ...state.selected,
              layers: [...get(state, 'selected.layers', []), action.payload],
            }
          : state.selected,
      };

    case 'PLACEMENT_LAYER_PATCH_SUCCESS':
      const editLayerIsSamePlacementId = utils.generic.isSameId(get(state, 'selected.id'), get(action.payload, 'placementId'));

      return {
        ...state,
        selected: editLayerIsSamePlacementId
          ? {
              ...state.selected,
              layers: get(state, 'selected.layers', []).map((layer) => {
                if (utils.generic.isSameId(layer.id, get(action.payload, 'id'))) {
                  return { ...action.payload };
                }

                return layer;
              }),
            }
          : state.selected,
      };

    case 'PLACEMENT_LAYER_MARKET_POST_SUCCESS':
      return {
        ...state,
        selected: {
          ...state.selected,
          layers: state.selected.layers.map((stateLayer) => {
            const isSameLayer = utils.generic.isSameId(stateLayer.id, action.payload.placementlayerId);
            const stateLayerMarkets = get(stateLayer, 'markets', []);

            if (isSameLayer) {
              stateLayer.markets = [...stateLayerMarkets, action.payload];
            }

            return stateLayer;
          }),
        },
      };

    case 'PLACEMENT_LAYER_MARKET_EDIT_SUCCESS':
      return {
        ...state,
        selected: {
          ...state.selected,
          layers: state.selected.layers.map((stateLayer) => {
            const isSameLayer = utils.generic.isSameId(stateLayer.id, action.payload.placementlayerId);
            const stateLayerMarkets = get(stateLayer, 'markets') || [];

            if (isSameLayer) {
              stateLayer.markets = stateLayerMarkets.map((mkt) => {
                const isSameLayerMarket = utils.generic.isSameId(mkt.id, action.payload.id);

                if (isSameLayerMarket) {
                  mkt = { ...action.payload };
                }

                return mkt;
              });
            }

            return stateLayer;
          }),
        },
      };

    case 'PLACEMENT_LAYER_MARKETS_DELETE':
      return {
        ...state,
        selected: {
          ...state.selected,
          layers: get(state, 'selected.layers', []).map((stateLayer) => {
            const stateLayerMarkets = get(stateLayer, 'markets', []);

            stateLayer.markets = stateLayerMarkets.filter((market) => {
              return !action.payload.includes(market.id);
            });

            return stateLayer;
          }),
        },
      };

    case 'PLACEMENT_LAYER_MARKETS_UPDATE':
      // in this particular case, the payload is the body that was sent to the endpoint
      // this is because the endpoint doesn't return the updated layers
      return {
        ...state,
        selected: {
          ...state.selected,
          layers: get(state, 'selected.layers', []).map((stateLayer) => {
            action.payload.forEach((market) => {
              // check if layer matches one to be updated
              if (utils.generic.isSameId(stateLayer.id, market.placementlayerId)) {
                let stateLayerMarkets = get(stateLayer, 'markets', []) || [];

                stateLayer.markets = stateLayerMarkets.map((stateMarketsObj) => {
                  // check if market matches one to be updated
                  if (utils.generic.isSameId(stateMarketsObj.id, market.id)) {
                    return market;
                  }

                  return stateMarketsObj;
                });
              }
            });

            return stateLayer;
          }),
        },
      };
    case 'PLACEMENT_LAYERS_UPDATE':
      return {
        ...state,
        selected: {
          ...state.selected,
          layers: get(state, 'selected.layers', []).map((stateLayer) => {
            const layer = action.payload.find((layer) => layer.id === stateLayer.id);
            if (layer) {
              return layer;
            } else {
              return stateLayer;
            }
          }),
        },
      };
    case 'PLACEMENT_MARKETS_LIST_GET_SUCCESS':
      return {
        ...state,
        selected: state.selected ? { ...state.selected } : null,
        selectedMarkets: utils.generic.isSameId(get(state, 'selected.id'), action.payload.placementId)
          ? action.payload.placementMarkets
          : [],
      };

    case 'PLACEMENT_MARKET_ADD_POST_SUCCESS':
      const addPostMarketAlreadyExists = utils.generic.isValidArray(
        state.selectedMarkets.find((m) => get(m, 'market.id')),
        true
      );

      const addPostMarkets = state.selectedMarkets.map((m) => {
        delete m.__new__;
        return m;
      });

      return {
        ...state,
        selectedMarkets: addPostMarketAlreadyExists ? addPostMarkets : [...addPostMarkets, { ...action.payload, __new__: true }],
      };

    case 'PLACEMENT_MARKET_EDIT_SUCCESS':
      return {
        ...state,
        selectedMarkets: utils.generic.isSameId(get(state, 'selected.id'), get(action.payload, 'placement.id'))
          ? state.selectedMarkets.map((market) => {
              delete market.__new__;

              if (utils.generic.isSameId(market.id, action.payload.id)) {
                return action.payload;
              }

              return market;
            })
          : state.selectedMarkets,
      };

    case 'PLACEMENT_MARKET_DELETE_SUCCESS':
      let layerMarketId;
      return {
        ...state,
        selectedMarkets: state.selectedMarkets.filter((market) => {
          if (action.payload === market.id) {
            layerMarketId = market?.market?.id;
          }
          return !utils.generic.isSameId(market.id, action.payload);
        }),
        selected: {
          ...state.selected,
          layers: get(state, 'selected.layers', []).map((stateLayer) => {
            const stateLayerMarkets = get(stateLayer, 'markets', []);
            stateLayer.markets = stateLayerMarkets.filter((market) => {
              return !utils.generic.isSameId(market?.market?.id, layerMarketId);
            });
            return stateLayer;
          }),
        },
      };
    case 'PLACEMENT_MARKET_CHANGE_PUT_SUCCESS':
      return {
        ...state,
        selected: utils.placement.parsePlacements(action.payload.placement ? [action.payload.placement] : [])[0],
        selectedMarkets: [
          action.payload,
          ...state.selectedMarkets.filter((market) => {
            return market.id !== action.payload.id;
          }),
        ],
      };

    case 'BULK_SELECT_TOGGLE':
      return {
        ...state,
        showBulkSelect: !state.showBulkSelect,
      };
    case 'BULK_SELECT_TOGGLE_DISABLE':
      return {
        ...state,
        showBulkSelect: false,
      };

    case 'BULK_SELECT_TOGGLE_MARKETING_MARKETS':
      return {
        ...state,
        showBulkSelectMarketingMarkets: !state.showBulkSelectMarketingMarkets,
      };
    case 'PLACEMENT_BULK_TOGGLE_MARKETING_MARKETS':
      const newBulkMarketingMarkets =
        (action.payload.selected === constants.SELECTALL &&
          uniq([...state.bulkItemsMarketingMarkets.marketingMarkets, ...action.payload.marketIdList])) ||
        (action.payload.selected === constants.SELECTED &&
          xor(state.bulkItemsMarketingMarkets.marketingMarkets, [action.payload.marketIdList]));

      return {
        ...state,
        bulkItemsMarketingMarkets: {
          ...state.bulkItemsMarketingMarkets,
          marketingMarkets: newBulkMarketingMarkets,
        },
      };
    case 'PLACEMENT_BULK_CLEAR_ALL_MARKETING_MARKETS':
      return {
        ...state,
        bulkItemsMarketingMarkets: {
          marketingMarkets: [],
        },
      };
    case 'BULK_SELECT_TOGGLE_DISABLE_MARKETING_MARKETS':
      return {
        ...state,
        showBulkSelectMarketingMarkets: false,
      };
    case 'PLACEMENT_MARKET_BULK_DELETE_SUCCESS':
      const layerMarketIds = [];
      return {
        ...state,
        selectedMarkets: state.selectedMarkets.filter((market) => {
          if (action.payload.includes(market.id)) {
            layerMarketIds.push(market?.market?.id);
          }
          return !action.payload.includes(market.id);
        }),
        selected: {
          ...state.selected,
          layers: get(state, 'selected.layers', []).map((stateLayer) => {
            const stateLayerMarkets = get(stateLayer, 'markets', []);
            stateLayer.markets = stateLayerMarkets.filter((market) => {
              return !layerMarketIds.includes(market?.market?.id);
            });
            return stateLayer;
          }),
        },
      };

    default:
      return state;
  }
};

export default placementReducers;
