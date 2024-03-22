import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { firstBy } from 'thenby';
import get from 'lodash/get';

// app
import { AddPlacementMarketView } from './AddPlacementMarket.view';
import { StatusIcon, Restricted, OptionDetail } from 'components';
import {
  showModal,
  postAddPlacementMarket,
  resetReferenceDataMarkets,
  getReferenceDataByType,
  selectPlacementDepartmentName,
  selectFormattedAccountStatusList,
  changePlacementMarket,
} from 'stores';
import { ROLE_BROKER } from 'consts';
import * as utils from 'utils';

AddPlacementMarket.propTypes = {
  isChangeMarket: PropTypes.bool,
  placementId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  placementMarkets: PropTypes.array.isRequired,
  placementMarket: PropTypes.object,
  departmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  departmentMarkets: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function AddPlacementMarket({
  placementId,
  placementMarkets = [],
  placementMarket = {},
  departmentId,
  departmentMarkets = [],
  handleClose,
  isChangeMarket,
}) {
  const dispatch = useDispatch();

  const formattedAccountStatusList = useSelector(selectFormattedAccountStatusList);
  const departmentName = useSelector(selectPlacementDepartmentName);

  const [underwritersVisible, setUnderwritersVisible] = useState(false);

  const marketsInUse = isChangeMarket
    ? departmentMarkets.map((market) => get(market, 'market.id')).filter(Boolean)
    : placementMarkets.map((market) => get(market, 'market.id')).filter(Boolean);

  const placementMarketId = placementMarket?.id;

  useEffect(
    () => {
      dispatch(resetReferenceDataMarkets());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filterMarketsInUse = (marketsInUse, departmentId) => (list) => {
    const listFiltered = list.filter((item) => {
      return !marketsInUse.includes(item.id);
    });

    return sortGroupMarkets(listFiltered);
  };

  const sortGroupMarkets = (markets) => {
    const departmentOrder = [departmentName, utils.string.t('placement.marketing.others')];
    const statusOrder = formattedAccountStatusList.map((status) => status.id);

    const departmentSort = (a, b) => departmentOrder.indexOf(a.groupBy) - departmentOrder.indexOf(b.groupBy);
    const statusSort = (a, b) => statusOrder.indexOf(a.statusId) - statusOrder.indexOf(b.statusId);

    const marketsGrouped = markets.map((market) => {
      return {
        ...market,
        groupBy: market.departmentIds?.includes(departmentId) ? departmentOrder[0] : departmentOrder[1],
      };
    });

    return marketsGrouped.sort(firstBy(departmentSort).thenBy(statusSort));
  };

  const getMarketDetail = ({ gxbBeReference, address }) => {
    const addressStr = utils.market.getAddress(address);
    if (!gxbBeReference && !addressStr) return;

    return (
      <>
        {gxbBeReference && (
          <span>
            {utils.string.t('placement.generic.gxbBeReference')}: {gxbBeReference}
            <br />
          </span>
        )}
        {addressStr && (
          <span>
            {utils.string.t('app.address')}: {addressStr}
          </span>
        )}
      </>
    );
  };

  const renderOption = (market) => {
    const marketDetail = getMarketDetail(market);

    return (
      <OptionDetail label={market.edgeName} detail={marketDetail}>
        <Restricted include={[ROLE_BROKER]}>
          <StatusIcon translationPath="statusMarket" list={formattedAccountStatusList} id={market.statusId} />
        </Restricted>
      </OptionDetail>
    );
  };

  const handleEditPlacementMarketsLayers = (placementMarket) => {
    dispatch(
      showModal({
        component: 'EDIT_PLACEMENT_MARKETS_LAYERS',
        props: {
          fullWidth: false,
          maxWidth: 'lg',
          title: 'placement.marketing.manageMarket',
          componentProps: {
            placementMarket,
          },
        },
      })
    );
  };

  const fields = [
    {
      name: 'placementId',
      type: 'hidden',
      value: placementId,
    },
    [
      {
        name: 'markets',
        gridSize: { xs: 12 },
        type: 'autocompletemui',
        label: utils.string.t('placement.marketing.fields.markets.label'),
        hint: utils.string.t('placement.marketing.fields.markets.hint'),
        options: [],
        optionKey: 'id',
        optionLabel: 'edgeName',
        optionsFetch: {
          type: 'market',
          handler: (type, searchTerm) => dispatch(getReferenceDataByType(type, searchTerm)),
          filter: filterMarketsInUse(marketsInUse, departmentId),
        },
        validation: Yup.object().nullable().required(utils.string.t('validation.required')),
        muiComponentProps: {
          renderOption,
          groupBy: (option) => option.groupBy,
          'data-testid': 'market',
        },
      },
    ],
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleClose,
    },
    {
      name: 'secondary',
      label: utils.string.t('app.saveEdit'),
      handler: (...args) => {
        if (isChangeMarket) {
          return dispatch(changePlacementMarket(placementMarketId, ...args)).then((res) => {
            if (res?.id) {
              handleEditPlacementMarketsLayers(res);
            }
          });
        }
        return dispatch(postAddPlacementMarket(...args)).then((res) => {
          handleEditPlacementMarketsLayers(res);
        });
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.saveClose'),
      handler: (...args) => {
        if (isChangeMarket) {
          return dispatch(changePlacementMarket(placementMarketId, ...args));
        }
        return dispatch(postAddPlacementMarket(...args));
      },
    },
  ];

  return (
    <AddPlacementMarketView
      fields={fields}
      actions={actions}
      isUnderwritersVisible={underwritersVisible}
      handlers={{
        showUnderwriters: setUnderwritersVisible,
      }}
    />
  );
}
