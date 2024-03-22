import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DepartmentAccountsCalendarList.styles';
import { PlacementSummary } from 'modules';
import config from 'config';

// mui
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles, Divider } from '@material-ui/core';

DepartmentAccountsCalendarListView.propTypes = {
  items: PropTypes.array.isRequired,
  handleClickRow: PropTypes.func.isRequired,
};

export function DepartmentAccountsCalendarListView({ items, firstItem, handleClickRow }) {
  const classes = makeStyles(styles, { name: 'DepartmentAccountsCalendarList' })();
  const { pagination } = config?.ui;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pagination.defaultMobile);

  useEffect(() => {
    if (firstItem > 0) {
      const currentPage = Math.ceil(firstItem / rowsPerPage) - 1;
      setPage(currentPage);
    }
  }, [firstItem, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div data-testid="department-accounts-list" className={classes.monthListBox}>
      <Divider className={classes.divider} />

      {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
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
      <div style={{ padding: '0 00px' }}>
        <TablePagination
          rowsPerPageOptions={pagination.options}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <Divider className={classes.divider} />
    </div>
  );
}
