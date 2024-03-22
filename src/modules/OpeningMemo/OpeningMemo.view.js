import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';

// app
import { SectionHeader, PopoverMenu } from 'components';
import * as utils from 'utils';
import { OpeningMemoContent, OpeningMemoList, OpeningMemoSearch } from 'modules';

// mui
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

OpeningMemoView.propTypes = {
  origin: PropTypes.shape({
    path: PropTypes.string.isRequired,
    id: PropTypes.number,
  }),
  route: PropTypes.string.isRequired,
  routeWithId: PropTypes.bool.isRequired,
  popoverItems: PropTypes.array.isRequired,
};

export function OpeningMemoView({ origin, route, routeWithId, popoverItems }) {
  const path = routeWithId ? `${route}/:id` : route;

  return (
    <Fragment>
      <SectionHeader title={utils.string.t('openingMemo.title')} icon={PlaylistAddCheckIcon} testid="opening-memo">
        {/* Placement Opening Memo */}
        <Route exact path={path}>
          <OpeningMemoSearch routeWithId={routeWithId} origin={origin} route={route} />
        </Route>

        {/* Opening Memo Details Page */}
        <Route exact path={`${path}/:openingMemoId`}>
          <PopoverMenu
            variant="outlined"
            id="opening-memo"
            size="medium"
            color="primary"
            text={utils.string.t('app.actions')}
            isButton
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            items={popoverItems}
          />
        </Route>
      </SectionHeader>

      <Route exact path={path}>
        <OpeningMemoList routeWithId={routeWithId} route={route} origin={origin} />
      </Route>

      {/* Opening Memo Details Page */}
      <Route path={`${path}/:openingMemoId`}>
        <OpeningMemoContent />
      </Route>
    </Fragment>
  );
}
