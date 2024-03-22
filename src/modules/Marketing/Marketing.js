import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import get from 'lodash/get';

// app
import { MarketingView } from './Marketing.view';
import {
  showModal,
  selectPlacementDepartmentId,
  selectDepartmentMarketsItems,
  selectPlacementMarkets,
  filterReferenceDataBusinessTypes,
  resetMarket,
} from 'stores';
import * as utils from 'utils';
import config from 'config';

export default function Marketing() {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  const placementMarkets = useSelector(selectPlacementMarkets);
  const placementSelectedDepartmentId = useSelector(selectPlacementDepartmentId);
  const departmentMarketsItems = useSelector(selectDepartmentMarketsItems);
  const { pathname } = history.location;

  const isUrlMarkets = pathname.includes(config.routes.placement.marketing.markets);
  const isUrlStructuring = pathname.includes(config.routes.placement.marketing.structuring);
  const isUrlMudmap = pathname.includes(config.routes.placement.marketing.mudmap);

  const [sections, setSections] = useState([
    { value: 'markets', label: utils.string.t('placement.marketing.sections.markets'), ...(isUrlMarkets && { active: true }) },
    { value: 'structuring', label: utils.string.t('placement.marketing.sections.structuring'), ...(isUrlStructuring && { active: true }) },
    { value: 'mudmap', label: utils.string.t('placement.marketing.sections.mudmap'), ...(isUrlMudmap && { active: true }) },
  ]);

  const configVars = useSelector((state) => get(state, 'config.vars'));
  const placementId = (get(params, 'id') || '').toString();

  useEffect(
    () => {
      dispatch(resetMarket());

      // cleanup
      return () => {
        dispatch(resetMarket());
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleAddLayer =
    (popoverData = {}) =>
    () => {
      dispatch(filterReferenceDataBusinessTypes());
      dispatch(
        showModal({
          component: 'ADD_PLACEMENT_LAYER',
          props: {
            title: 'placement.marketing.addLayer',
            fullWidth: true,
            maxWidth: 'sm',
            componentProps: {
              businessTypeId: popoverData.id,
            },
          },
        })
      );
    };

  const handleAddMarket = () => () => {
    dispatch(
      showModal({
        component: 'ADD_PLACEMENT_MARKET',
        props: {
          title: 'placement.marketing.addMarket',
          fullWidth: true,
          maxWidth: 'md',
          componentProps: {
            placementId,
            placementMarkets,
            departmentId: placementSelectedDepartmentId,
            departmentMarkets: departmentMarketsItems.map((item) => item.market),
          },
        },
      })
    );
  };

  const handleSelectSection = (event, value) => {
    if (value) {
      history.push(`${config.routes.placement.marketing[value]}/${placementId}`);

      setSections(
        sections.map((s) => {
          s.active = s.value === value;
          return s;
        })
      );
    }
  };
  // abort
  if (!placementId) return null;

  return (
    <MarketingView
      placementId={placementId}
      isDev={utils.app.isDevelopment(configVars)}
      sections={sections}
      handlers={{
        addLayer: handleAddLayer,
        addMarket: handleAddMarket,
        selectSection: handleSelectSection,
      }}
    />
  );
}
