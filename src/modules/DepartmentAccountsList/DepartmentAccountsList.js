import React from 'react';
import PropTypes from 'prop-types';
import { firstBy } from 'thenby';

// app
import { DepartmentAccountsListView } from './DepartmentAccountsList.view';
import { usePagination } from 'hooks';
import * as utils from 'utils';

DepartmentAccountsList.propTypes = {
  rows: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

export default function DepartmentAccountsList({ rows = [], sort = {}, pagination: paginationObj, handlers = {} }) {
  const itemsOrdered = rows.sort(firstBy(utils.sort.array(sort.type, sort.by, sort.direction)));

  return (
    <DepartmentAccountsListView
      items={itemsOrdered}
      pagination={usePagination(itemsOrdered, paginationObj, handlers.handleChangePage, handlers.handleChangeRowsPerPage)}
      handleClickRow={handlers.handleClickRow}
    />
  );
}
