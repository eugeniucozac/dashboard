import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { firstBy } from 'thenby';

// app
import { LocationsTableView } from './LocationsTable.view';
import { usePagination, useSort } from 'hooks';
import * as utils from 'utils';

LocationsTable.propTypes = {
  rows: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  handleClickRow: PropTypes.func.isRequired,
};

export default function LocationsTable({ rows = [], cols: colsArr, sort: sortObj, pagination: paginationObj, handleClickRow }) {
  const [selected, setSelected] = useState(null);

  const clickRow = (location) => (event) => {
    handleClickRow(location);
    setSelected(location.id);
  };

  const { cols, sort } = useSort(colsArr, sortObj);

  const pagination = usePagination(rows, paginationObj);

  const rowsSorted = rows.sort(firstBy(utils.sort.array(sort.type, sort.by, sort.direction)));

  const rowsPaginated = rowsSorted.slice(
    pagination.obj.page * pagination.obj.rowsPerPage,
    pagination.obj.page * pagination.obj.rowsPerPage + pagination.obj.rowsPerPage
  );

  return (
    <LocationsTableView
      items={rowsPaginated}
      cols={cols}
      sort={sort}
      pagination={pagination}
      selected={selected}
      handleClickRow={clickRow}
    />
  );
}
