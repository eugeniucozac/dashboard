import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import get from 'lodash/get';

// app
import { AddPlacementLayerMarketView } from './AddPlacementLayerMarket.view';
import { StatusIcon, Restricted, OptionDetail } from 'components';
import { postPlacementAddLayerMarket, selectFormattedAccountStatusList, showModal, duplicateLine } from 'stores';
import { ROLE_BROKER } from 'consts';
import * as utils from 'utils';

AddPlacementLayerMarket.propTypes = {
  layer: PropTypes.object.isRequired,
  placementMarkets: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  isDuplicateMarket: PropTypes.bool,
  line: PropTypes.object,
};

export default function AddPlacementLayerMarket({ layer, placementMarkets = [], handleClose, isDuplicateMarket = false, line = {} }) {
  const dispatch = useDispatch();

  const formattedAccountStatusList = useSelector(selectFormattedAccountStatusList);

  const filterMarketsInUse = (markets) => {
    const marketsAlreadyUsed = get(layer, 'markets', []).map((m) => get(m, 'market.id'));

    const filteredMarkets = markets.filter((item) => {
      return !marketsAlreadyUsed.includes(get(item, 'market.id'));
    });

    return utils.sort.arrayNestedPropertyValue(filteredMarkets, 'market.edgeName', 'asc');
  };
  const lineId = line?.id;

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

  const getOptionLabel = (option) => {
    return utils.market.getName(option);
  };

  const renderOption = ({ market }) => {
    const marketDetail = getMarketDetail(market);

    return (
      <OptionDetail label={market.edgeName} detail={marketDetail}>
        <Restricted include={[ROLE_BROKER]}>
          <StatusIcon translationPath="statusMarket" list={formattedAccountStatusList} id={market.statusId} />
        </Restricted>
      </OptionDetail>
    );
  };

  const sortOptions = (options) => {
    const orderBy = formattedAccountStatusList.map((status) => status.id);

    return options.sort((a, b) => orderBy.indexOf(a.statusId) - orderBy.indexOf(b.statusId));
  };

  const handleEditPlacementMarketsLayers = (props) => {
    dispatch(
      showModal({
        component: 'EDIT_PLACEMENT_MARKETS_LAYERS',
        props: {
          fullWidth: false,
          maxWidth: 'lg',
          title: 'placement.marketing.manageMarket',
          componentProps: {
            placementLayer: props.placementLayer,
            placementMarket: props.placementMarket,
          },
        },
      })
    );
  };

  const findPlacementMarket = (marketId) =>
    placementMarkets.find((m) => {
      return m.market?.id === marketId;
    });

  const fields = [
    {
      name: 'placementlayerId',
      type: 'hidden',
      value: layer.id,
    },
    {
      name: 'market',
      type: 'autocompletemui',
      label: utils.string.t('market.fields.market') || '',
      hint: isDuplicateMarket ? utils.string.t('placement.marketing.fields.markets.hint') : null,
      value: null,
      options: sortOptions(filterMarketsInUse(placementMarkets)),
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
      muiComponentProps: {
        autoFocus: true,
        getOptionLabel,
        renderOption,
      },
    },
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
      handler: (...args) =>
        isDuplicateMarket
          ? dispatch(duplicateLine(lineId, ...args)).then((res) => {
              const marketId = res?.market?.id;
              const placementMarket = findPlacementMarket(marketId);
              if (marketId) {
                handleEditPlacementMarketsLayers({
                  placementLayer: layer,
                  placementMarket,
                });
              }
            })
          : dispatch(postPlacementAddLayerMarket(...args)).then((res) => {
              const marketId = res?.market?.id;
              const placementMarket = findPlacementMarket(marketId);

              handleEditPlacementMarketsLayers({
                placementLayer: layer,
                placementMarket,
              });
            }),
    },
    {
      name: 'submit',
      label: utils.string.t('app.saveClose'),
      handler: (...args) => {
        if (isDuplicateMarket) {
          return dispatch(duplicateLine(lineId, ...args));
        }
        return dispatch(postPlacementAddLayerMarket(...args));
      },
    },
  ];

  return <AddPlacementLayerMarketView fields={fields} actions={actions} />;
}
