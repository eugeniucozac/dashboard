import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import * as constants from 'consts';
// app
import { MarketingMarketsBulkView } from './MarketingMarketsBulk.view';
import {
  bulkToggleSelectMarketingMarket,
  bulkMarketingMarketsClearAll,
  bulkPlacementMarketingMarketSelect,
  disableBulkToggleSelectMarketingMarket,
  selectBulkToggleSelectMarketingMarkets,
  selectPlacementBulkItemsMarketingMarkets,
  showModal,
  bulkeletePlacementMarket,
} from 'stores';

MarketingMarketsBulk.propTypes = {
  markets: PropTypes.array,
};

export default function MarketingMarketsBulk({ markets }) {
  const dispatch = useDispatch();
  const showBulkSelect = useSelector(selectBulkToggleSelectMarketingMarkets);
  const bulkMarketingMarkets = useSelector(selectPlacementBulkItemsMarketingMarkets);

  useEffect(
    () => {
      dispatch(disableBulkToggleSelectMarketingMarket());
      dispatch(bulkMarketingMarketsClearAll());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleToggleBulkSelect = () => {
    dispatch(bulkToggleSelectMarketingMarket());
    dispatch(bulkMarketingMarketsClearAll());
  };
  const handleBulkSelectAll = () => {
    markets.forEach((market) => {
      const marketIdList = market.map((m) => m.id);
      dispatch(bulkPlacementMarketingMarketSelect(constants.SELECTALL, marketIdList));
    });
  };

  const handleBulkClearAll = () => {
    dispatch(bulkMarketingMarketsClearAll());
  };

  const handleBulkDelete = () => {
    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: 'placement.marketing.bulkDeleteMarket',
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            submitHandler: () => {
              if (bulkMarketingMarkets.length > 0) {
                dispatch(bulkeletePlacementMarket(bulkMarketingMarkets));
              }
            },
          },
        },
      })
    );
  };

  return (
    <MarketingMarketsBulkView
      showBulkSelect={showBulkSelect}
      bulk={{
        itemsMarkets: bulkMarketingMarkets,
      }}
      handlers={{
        toggleBulkSelect: handleToggleBulkSelect,
        selectBulkAll: handleBulkSelectAll,
        clearAllPlacement: handleBulkClearAll,
        bulkDelete: handleBulkDelete,
      }}
    />
  );
}
