import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';

// app
import { MarketingMarketsView } from './MarketingMarkets.view';
import {
  bulkPlacementClear,
  bulkPlacementMarketingMarketSelect,
  getDepartmentMarkets,
  getPlacementMarkets,
  deletePlacementMarket,
  showModal,
  selectPlacementMarkets,
  selectPlacementLayers,
  selectFormattedAccountStatusList,
  selectRefDataDepartments,
  selectRefDataCapacityTypes,
  selectRefDataStatusesMarketQuote,
  selectRefDataStatusKeyByCode,
  selectRefDataStatusIdByCode,
  selectBulkToggleSelectMarketingMarkets,
  selectPlacementBulkItemsMarketingMarkets,
  selectDepartmentMarketsItems,
  selectPlacementDepartmentId,
} from 'stores';
import { Translate } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';

MarketingMarkets.propTypes = {
  placementId: PropTypes.string.isRequired,
};

export default function MarketingMarkets({ placementId }) {
  const dispatch = useDispatch();

  const placementLayers = useSelector(selectPlacementLayers) || [];
  const placementMarkets = useSelector(selectPlacementMarkets) || [];
  const refDataDepartments = useSelector(selectRefDataDepartments);
  const refDataCapacityTypes = useSelector(selectRefDataCapacityTypes);
  const refDataAccountStatuses = useSelector(selectFormattedAccountStatusList);
  const refDataStatusesMarketQuote = useSelector(selectRefDataStatusesMarketQuote);

  const statusPendingId = useSelector(selectRefDataStatusIdByCode('market', constants.STATUS_MARKET_PENDING));
  const statusPendingKey = useSelector(selectRefDataStatusKeyByCode('market', constants.STATUS_MARKET_PENDING));

  const statusQuotedId = useSelector(selectRefDataStatusIdByCode('market', constants.STATUS_MARKET_QUOTED));
  const statusQuotedKey = useSelector(selectRefDataStatusKeyByCode('market', constants.STATUS_MARKET_QUOTED));

  const statusDeclinedId = useSelector(selectRefDataStatusIdByCode('market', constants.STATUS_MARKET_DECLINED));
  const statusDeclinedKey = useSelector(selectRefDataStatusKeyByCode('market', constants.STATUS_MARKET_DECLINED));

  const showBulkSelect = useSelector(selectBulkToggleSelectMarketingMarkets);
  const marketingMakets = useSelector(selectPlacementBulkItemsMarketingMarkets);
  const placementIdNumber = toNumber(placementId);

  const departmentMarketsItems = useSelector(selectDepartmentMarketsItems);
  const placementSelectedDepartmentId = useSelector(selectPlacementDepartmentId);

  const marketGroups = [...refDataCapacityTypes, { name: utils.string.t('market.noCapacityMarkets') }]
    .map((type) => {
      type.markets = placementMarkets.filter((market) => {
        return type.id ? get(market, 'market.capacityTypeId') === type.id : !Boolean(get(market, 'market.capacityTypeId'));
      });

      return type;
    })
    .filter((type) => utils.generic.isValidArray(type.markets, true));

  useEffect(
    () => {
      if (placementIdNumber) {
        dispatch(getDepartmentMarkets(placementIdNumber));
        dispatch(getPlacementMarkets(placementIdNumber));
        dispatch(bulkPlacementClear());
      }
    },
    [placementIdNumber] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleEditPlacementMarketsLayers = (popoverData) => {
    dispatch(
      showModal({
        component: 'EDIT_PLACEMENT_MARKETS_LAYERS',
        props: {
          fullWidth: false,
          maxWidth: 'lg',
          title: 'placement.marketing.manageMarket',
          componentProps: {
            ...popoverData,
            placementMarket: popoverData.placementMarket,
          },
        },
      })
    );
  };

  const handleDeletePlacementMarket = (popoverData) => {
    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          fullWidth: true,
          title: 'placement.marketing.deleteMarket',
          maxWidth: 'xs',
          componentProps: {
            submitHandler: () => {
              dispatch(deletePlacementMarket(get(popoverData, 'placementMarket.id')));
            },
          },
        },
      })
    );
  };

  const handleChangeMarket = (popoverData) => {
    dispatch(
      showModal({
        component: 'ADD_PLACEMENT_MARKET',
        props: {
          title: 'market.actions.changeMarket',
          subtitle: popoverData?.placementMarket?.market?.edgeName || '',
          fullWidth: true,
          maxWidth: 'sm',
          componentProps: {
            isChangeMarket: true,
            placementId,
            placementMarkets: [],
            placementMarket: popoverData.placementMarket,
            departmentId: placementSelectedDepartmentId,
            departmentMarkets: departmentMarketsItems.map((item) => item.market),
          },
        },
      })
    );
  };

  const cols = [
    { id: 'name', title: true },
    { id: 'status', label: <Translate label="market.cols.status" />, style: { width: '15%' }, nowrap: true },
    { id: 'underwriter', label: <Translate label="market.cols.underwriterName" />, style: { width: '20%' } },
    { id: 'actions', empty: true },
  ];

  const popoverActions = [
    {
      id: 'edit-placement-market',
      label: 'market.actions.edit',
      callback: (popoverData) => handleEditPlacementMarketsLayers(popoverData),
    },
    {
      id: 'delete-placement-market',
      label: 'market.actions.delete',
      callback: (popoverData) => handleDeletePlacementMarket(popoverData),
    },
    {
      id: 'change-placement-market',
      label: 'market.actions.changeMarket',
      callback: (popoverData) => handleChangeMarket(popoverData),
    },
  ];

  const marketsFiltered = placementMarkets.map((market) => {
    const placementMarketId = get(market, 'market.id');

    const marketQuotes = placementLayers.reduce((acc, layer) => {
      const layerDepartment = utils.referenceData.departments.getById(refDataDepartments, layer.departmentId);
      const layerBusinessTypes = utils.referenceData.businessTypes.getNameById(layerDepartment?.businessTypes, layer.businessTypeId);

      return [
        ...acc,
        ...get(layer, 'markets', [])
          .filter((m) => get(m, 'market.id') === placementMarketId)
          .map((m) => ({
            ...m,
            placementlayerName: utils.layer.getName(layer),
            placementlayerBusinessTypeId: layer.businessTypeId,
            placementlayerBusinessType: layerBusinessTypes,
          })),
      ];
    }, []);

    const marketQuotesGroups = groupBy(marketQuotes, 'statusId');

    market.quotes = {
      [statusPendingKey]: {
        length: marketQuotesGroups[statusPendingId]?.length || 0,
        items: marketQuotesGroups[statusPendingId] || [],
      },
      [statusQuotedKey]: {
        length: marketQuotesGroups[statusQuotedId]?.length || 0,
        items: marketQuotesGroups[statusQuotedId] || [],
      },
      [statusDeclinedKey]: {
        length: marketQuotesGroups[statusDeclinedId]?.length || 0,
        items: marketQuotesGroups[statusDeclinedId] || [],
      },
    };

    market.statusLabel = utils.referenceData.status.getLabelById(refDataStatusesMarketQuote, market.statusId);

    return market;
  });

  const handleBulkSelectMarketingMarkets = (marketId) => (event) => {
    event.stopPropagation();
    dispatch(bulkPlacementMarketingMarketSelect(constants.SELECTED, marketId));
  };
  // abort
  if (!placementId) return null;
  return (
    <MarketingMarketsView
      items={marketsFiltered}
      groups={marketGroups}
      cols={cols}
      placementId={placementIdNumber}
      marketAccountStatuses={refDataAccountStatuses}
      popoverActions={popoverActions}
      handleEditMarket={handleEditPlacementMarketsLayers}
      showBulkSelect={showBulkSelect}
      bulk={{
        marketingMarkets: marketingMakets,
      }}
      handlers={{
        bulkSelectMarketingMarket: handleBulkSelectMarketingMarkets,
        changeMarket: handleChangeMarket,
      }}
    />
  );
}
