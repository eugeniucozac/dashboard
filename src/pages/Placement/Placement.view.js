import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

// app
import styles from './Placement.styles';

import { useMedia } from 'hooks';
import { Breadcrumb, Layout } from 'components';
import {
  Bound,
  Marketing,
  MarketSheet,
  Documents,
  OpeningMemo,
  OpeningMemoSummary,
  ModellingList,
  PlacementOverview,
  PlacementSummaryTop,
  PlacementSummary,
} from 'modules';
import config from 'config';

// mui
import { makeStyles, Box, Divider, Hidden } from '@material-ui/core';

PlacementView.propTypes = {
  isDev: PropTypes.bool,
  isReady: PropTypes.bool,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      breadcrumbs: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          route: PropTypes.string.isRequired,
          showForIsBroker: PropTypes.bool,
          showForPhysicalLoss: PropTypes.bool,
        })
      ),
      placement: PropTypes.object,
      isBroker: PropTypes.bool,
      statusBoundId: PropTypes.number,
    })
  ),
  isBroker: PropTypes.bool,
  placementSelected: PropTypes.object,
  placementExpanded: PropTypes.bool,
  openingMemo: PropTypes.object,
  market: PropTypes.object,
  handlers: PropTypes.shape({
    expandPlacement: PropTypes.func,
  }),
};

export function PlacementView({
  isDev,
  isReady,
  breadcrumbs,
  isBroker,
  placementSelected,
  placementExpanded,
  openingMemo,
  market,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'Placement' })();
  const media = useMedia();
  // abort
  if (!isReady) return null;

  return (
    <>
      <Box className={classes.placementContainer}>
        <Hidden smDown>
          <Box>
            <PlacementSummaryTop
              placement={placementSelected}
              showToggle={true}
              expanded={placementExpanded}
              expandToggle="btn"
              handleExpand={handlers.expandPlacement}
            />
          </Box>
          <Box className={classes.breadcrumbBox}>
            <Breadcrumb links={breadcrumbs} />
            <Divider />
          </Box>
        </Hidden>

        <Layout testid="placement" isCentered>
          <Layout main padding={false}>
            <Hidden mdUp>
              <Box mb={5} className={classes.breadcrumb}>
                <Breadcrumb links={breadcrumbs} />
                <Divider />
              </Box>
            </Hidden>
            <Box data-testid="placement-content" className={classes.placementContent}>
              <Switch>
                <Route path={`${config.routes.placement.overview}/:id`} component={PlacementOverview} />
                <Route path={`${config.routes.placement.marketSheet}/:id`} component={MarketSheet} />
                <Route
                  path={[
                    `${config.routes.placement.marketing.markets}/:id`,
                    `${config.routes.placement.marketing.structuring}/:id`,
                    `${config.routes.placement.marketing.mudmap}/:id`,
                  ]}
                  component={Marketing}
                />
                {isBroker && <Route path={`${config.routes.placement.modelling}/:id`} component={ModellingList} />}
                {isBroker && (
                  <Route path={`${config.routes.placement.checklist}/:id`}>
                    <OpeningMemo
                      origin={{ path: 'placement', id: placementSelected.id }}
                      route={config.routes.placement.checklist}
                      routeWithId
                    />
                  </Route>
                )}
                <Route path={`${config.routes.placement.bound}/:id`} component={Bound} />
                <Route path={`${config.routes.placement.documents}/:id`} component={Documents} />
              </Switch>
            </Box>
          </Layout>

          <Layout sidebar={media.tablet} padding={false}>
            {openingMemo && (
              <Route path={`${config.routes.placement.checklist}/:id/:policyId`}>
                <OpeningMemoSummary />
                <Divider />
              </Route>
            )}

            {media.tablet ? (
              <PlacementSummary
                placement={placementSelected}
                showToggle={true}
                expanded={placementExpanded}
                expandToggle="btn"
                handleExpand={handlers.expandPlacement}
              />
            ) : null}
          </Layout>
        </Layout>
      </Box>
    </>
  );
}
