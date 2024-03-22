import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';

// app
import { PlacementView } from './Placement.view';
import {
  getPlacementDetails,
  resetPlacementLocations,
  resetMarket,
  bulkPlacementClear,
  enqueueNotification,
  selectIsBroker,
  selectMarketSelectedId,
  selectPlacement,
  selectPlacementId,
  selectRefDataLoaded,
  selectRefDataStatusIdByCode,
} from 'stores';
import { STATUS_PLACEMENT_BOUND } from 'consts';
import * as utils from 'utils';
import config from 'config';

export default function Placement() {
  const [breadcrumbs] = useState([
    {
      name: 'overview',
      label: utils.string.t('placement.overview.title'),
      route: config.routes.placement.overview,
      showForPhysicalLoss: true,
    },
    {
      name: 'marketing',
      label: utils.string.t('placement.marketing.title'),
      route: `${config.routes.placement.marketing.markets}`,
    },
    {
      name: 'modelling',
      label: utils.string.t('placement.modelling.title'),
      route: config.routes.placement.modelling,
      showForIsBroker: true,
    },
    {
      name: 'checklist',
      label: utils.string.t('placement.openingMemo.title'),
      route: config.routes.placement.checklist,
      showForIsBroker: true,
    },
    {
      name: 'bound',
      label: utils.string.t('placement.bound.title'),
      route: config.routes.placement.bound,
    },
    {
      name: 'documents',
      label: utils.string.t('placement.document.title'),
      route: config.routes.placement.documents,
    },
  ]);
  const [placementExpanded, setPlacementExpanded] = useState(true);

  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const uiBrand = useSelector((state) => state.ui.brand);
  const market = useSelector((state) => state.market);
  const openingMemo = useSelector((state) => state.openingMemo);
  const userIsBroker = useSelector(selectIsBroker);
  const marketSelectedId = useSelector(selectMarketSelectedId);
  const placementSelected = useSelector(selectPlacement);
  const placementSelectedId = useSelector(selectPlacementId);
  const refDataLoaded = useSelector(selectRefDataLoaded);
  const refDataStatusIdPlacementBound = useSelector(selectRefDataStatusIdByCode('placement', STATUS_PLACEMENT_BOUND));
  const configVars = useSelector((state) => get(state, 'config.vars'));

  const isDev = utils.app.isDevelopment(configVars);

  useEffect(() => {
    const prevId = placementSelectedId && placementSelectedId.toString();
    const currentId = params && get(params, 'id', '').toString();

    // reset locations if the placement has changed
    if (prevId !== currentId) {
      dispatch(resetPlacementLocations());
    }

    // reset bulk selections
    dispatch(bulkPlacementClear());

    // fetch placement details
    if (currentId && isNumber(toNumber(currentId))) {
      dispatch(getPlacementDetails(parseInt(currentId), !placementSelected, true)).then((res) => {
        if (!res || !res.id || res.status === 'error') {
          history.replace(config.routes.home.root);
          dispatch(enqueueNotification('notification.getPlacement.fail', 'warning', { data: { id: currentId } }));
        }
      });
    }

    // cleanup
    return () => {
      dispatch(resetPlacementLocations());
      dispatch(resetMarket());
      dispatch(bulkPlacementClear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // collapse placement summary if a new market is selected
    if (marketSelectedId) {
      setPlacementExpanded(false);
    }
  }, [marketSelectedId]);

  const isPlacementReady = () => {
    const paramsId = get(params, 'id');
    const selectedId = get(placementSelected, 'id');

    return !!paramsId && !!selectedId && paramsId.toString() === selectedId.toString();
  };

  const setActiveStep = (breadcrumbs) => {
    return breadcrumbs.map((item) => {
      if (item.name === 'marketing' && history.location.pathname.includes('/placement/marketing/')) {
        item.active = true;
      } else {
        item.active = history.location.pathname === item.link;
      }

      return item;
    });
  };

  const handleExpand = () => {
    setPlacementExpanded(!placementExpanded);
  };

  const breadcrumbsLinks = utils.placement.getFilteredBreadcrumbs({
    breadcrumbs,
    placement: placementSelected,
    isBroker: userIsBroker,
    isDev,
    statusBoundId: refDataStatusIdPlacementBound,
  });

  const placementName = utils.placement.getInsureds(placementSelected);

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('app.placement')}${placementName ? ` - ${placementName}` : ''} - ${utils.app.getAppName(
          uiBrand
        )}`}</title>
      </Helmet>

      <PlacementView
        isDev={isDev}
        isReady={isPlacementReady() && refDataLoaded}
        breadcrumbs={setActiveStep(breadcrumbsLinks)}
        isBroker={userIsBroker}
        placementExpanded={placementExpanded}
        placementSelected={placementSelected}
        openingMemo={openingMemo}
        market={market}
        handlers={{
          expandPlacement: handleExpand,
        }}
      />
    </>
  );
}
