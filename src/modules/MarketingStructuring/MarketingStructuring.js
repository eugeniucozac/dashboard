import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { firstBy } from 'thenby';
import toNumber from 'lodash/toNumber';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';

import * as constants from 'consts';
// app
import { MarketingStructuringView } from './MarketingStructuring.view';
import {
  bulkPlacementClear,
  getPlacementMarkets,
  getComments,
  selectPlacementLayers,
  selectPlacementDepartmentId,
  selectPlacementBulkType,
  selectBulkToggleSelect,
  selectPlacementBulkItemsLayers,
  selectPlacementBulkItemsMarkets,
  selectRefDataDepartmentById,
  showModal,
  bulkToggleSelect,
  bulkPlacementLayerToggle,
  bulkPlacementClearAll,
  disableBulkToggleSelect,
} from 'stores';
import * as utils from 'utils';

MarketingStructuring.propTypes = {
  placementId: PropTypes.string.isRequired,
};

export default function MarketingStructuring({ placementId }) {
  const dispatch = useDispatch();

  const placementLayers = useSelector(selectPlacementLayers);
  const placementDepartmentId = useSelector(selectPlacementDepartmentId);
  const placementBulkType = useSelector(selectPlacementBulkType);
  const placementBulkItemsLayers = useSelector(selectPlacementBulkItemsLayers);
  const placementBulkItemsLayerMarkets = useSelector(selectPlacementBulkItemsMarkets);
  const department = useSelector(selectRefDataDepartmentById(placementDepartmentId));
  const showBulkSelect = useSelector(selectBulkToggleSelect);

  const [tab, setTab] = useState();
  const [commentIDs, setCommentIDs] = useState([]);
  const placementIdNumber = toNumber(placementId);

  useEffect(
    () => {
      if (placementIdNumber) {
        dispatch(getPlacementMarkets(placementIdNumber));
        dispatch(bulkPlacementClear());
      }
    },
    [placementIdNumber] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      dispatch(disableBulkToggleSelect());
      dispatch(bulkPlacementClearAll());
    },
    [tab] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (placementIdNumber) {
        const fetchComments = async (placementId) => {
          const commentsID = `placement/${placementId}/layerMarket`;
          const allComments = await dispatch(getComments(commentsID));

          setCommentIDs(
            allComments?.map((comment) => ({
              id: toNumber(comment.typeId),
              nrDays: utils.date.diffDays(utils.date.today(), comment.date),
            }))
          );
        };
        fetchComments(placementIdNumber);
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const groups = groupBy(placementLayers, (layer) => layer.businessTypeId);
  const tabs = Object.keys(groups)
    .map((group) => {
      const businessTypeId = toNumber(group);
      const businessTypeName = utils.referenceData.businessTypes.getNameById(department.businessTypes, businessTypeId);
      return {
        value: businessTypeId,
        label: businessTypeName,
      };
    })
    .sort(firstBy('value'));
  const selectedTab = tab && tabs.map((tab) => tab.value).includes(tab) ? tab : tabs && tabs.length && get(tabs, '[0].value');

  const handleBulkUpdate = (event, updateMarket) => {
    dispatch(
      showModal({
        component: 'BULK_UPDATE_LAYER',
        props: {
          title: updateMarket ? 'placement.marketing.bulkEditLayer' : 'placement.marketing.bulkEditLines',
          fullWidth: true,
          maxWidth: updateMarket ? 'xs' : 'sm',
          componentProps: {
            isLayerBulkEdit: updateMarket,
          },
        },
      })
    );
  };

  const getUpdateString = () => {
    if (placementBulkType === 'layer') {
      return 'placement.marketing.editNumLayers';
    } else if (placementBulkType === 'layerMarket') {
      return 'placement.marketing.editNumMarkets';
    } else {
      return 'placement.marketing.editItems';
    }
  };
  const handleBulkSelectAll = () => {
    groups[selectedTab].forEach((layer) => {
      const markets = layer.markets ? layer.markets : [];
      dispatch(bulkPlacementLayerToggle(constants.SELECTALL, layer.id, markets));
    });
  };

  const handleBulkClearAll = () => {
    dispatch(bulkPlacementClearAll());
  };

  const handleToggleBulkSelect = () => {
    dispatch(bulkToggleSelect());
    dispatch(bulkPlacementClearAll());
  };
  // abort
  if (!placementId) return null;

  return (
    <MarketingStructuringView
      layers={groups[selectedTab] || []}
      commentIDs={commentIDs}
      tabs={tabs}
      showBulkSelect={showBulkSelect}
      bulk={{
        type: placementBulkType,
        items: placementBulkItemsLayers,
        itemsMarkets: placementBulkItemsLayerMarkets,
      }}
      handlers={{
        getUpdateString,
        bulkUpdate: handleBulkUpdate,
        toggleTab: (tabSelected) => setTab(tabSelected),
        toggleBulkSelect: handleToggleBulkSelect,
        selectBulkAll: handleBulkSelectAll,
        clearAllPlacement: handleBulkClearAll,
      }}
    />
  );
}
