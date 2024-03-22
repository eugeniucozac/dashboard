import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { Skeleton } from 'components';
import styles from './DepartmentAccountsCalendarList.styles';
import { DepartmentAccountsCalendarListView } from './DepartmentAccountsCalendarList.view';
import { selectPlacementId, selectRefDataStatusesPlacement, selectUser } from 'stores';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

DepartmentAccountsCalendarList.propTypes = {
  rows: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

export default function DepartmentAccountsCalendarList({ cols, handlers, deptId, monthDetails }) {
  const [items, setItems] = useState([]);
  const [firstItem, setFirstItem] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const placementSelectedId = useSelector(selectPlacementId);
  const refDataStatusesPlacement = useSelector(selectRefDataStatusesPlacement);
  const today = utils.date.today();

  const classes = makeStyles(styles, { name: 'DepartmentAccountsCalendarTable' })({ wide: false });

  const user = useSelector(selectUser);
  const endpoint = useSelector((state) => get(state, 'config.vars.endpoint'));
  const { auth } = user;

  useEffect(() => {
    let isSubscribed = true;

    const fetchTable = async () => {
      try {
        const endpointParams = {
          month: monthDetails.month,
          year: monthDetails.year,
        };

        const response = await utils.api.get({
          token: auth.accessToken,
          endpoint: endpoint.edge,
          path: `api/placement/department/${deptId}/calendar`,
          params: endpointParams,
        });
        const json = await utils.api.handleResponse(response);
        const data = await utils.api.handleData(json);

        if (isSubscribed) {
          setItems(utils.placement.parsePlacements(data));
          setIsLoading(false);
        }
      } catch (err) {}
    };

    fetchTable();

    return () => (isSubscribed = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (today === monthDetails.date && items.length) {
      const firstItemToday = items.findIndex((item) => item.inceptionDate >= today);

      firstItemToday > 0 && setFirstItem(firstItemToday);
    }
  }, [today, monthDetails, items]);

  return isLoading ? (
    <div className={classes.monthBox} data-testid="department-accounts-list-loading">
      <Skeleton height={40} animation="wave" displayNumber={5} />
    </div>
  ) : (
    <DepartmentAccountsCalendarListView
      isLoading={isLoading}
      items={items}
      firstItem={firstItem}
      cols={cols}
      placementId={placementSelectedId}
      placementStatuses={refDataStatusesPlacement}
      handleClickRow={handlers.handleClickRow}
      handleDoubleClickRow={handlers.handleDoubleClickRow}
    />
  );
}
