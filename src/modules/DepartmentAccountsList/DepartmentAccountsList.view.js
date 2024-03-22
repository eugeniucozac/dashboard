import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DepartmentAccountsList.styles';
import { Pagination } from 'components';
import { PlacementSummary } from 'modules';

// mui
import { makeStyles, Divider } from '@material-ui/core';
import get from 'lodash/get';

DepartmentAccountsListView.propTypes = {
  items: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  handleClickRow: PropTypes.func.isRequired,
};

export function DepartmentAccountsListView({ items, pagination, handleClickRow }) {
  const classes = makeStyles(styles, { name: 'DepartmentAccountsList' })();

  return (
    <div data-testid="department-accounts-list">
      <Divider className={classes.divider} />

      {items.map((item) => {
        return (
          <Fragment key={item.id}>
            <PlacementSummary
              placement={item}
              users={item.users || []}
              expanded={false}
              showActions={true}
              showToggle={false}
              expandToggle="card"
              collapseTitle={false}
              collapseSubtitle={false}
              handleClickExpand={handleClickRow(item.id)}
              testid={`placement-${item.id}`}
            />
            <Divider className={classes.divider} />
          </Fragment>
        );
      })}

      <Pagination
        page={get(pagination, 'obj.page')}
        count={get(pagination, 'obj.rowsTotal')}
        rowsPerPage={get(pagination, 'obj.rowsPerPage')}
        onChangePage={get(pagination, 'handlers.handleChangePage')}
        onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
      />
    </div>
  );
}
