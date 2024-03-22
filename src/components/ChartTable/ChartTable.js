import React from 'react';
import PropTypes from 'prop-types';
import { firstBy } from 'thenby';
import get from 'lodash/get';

// app
import { ChartTableView } from './ChartTable.view';
import { usePagination, useSort } from 'hooks';
import * as utils from 'utils';

ChartTable.propTypes = {
  id: PropTypes.string,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      datasets: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
          value: PropTypes.number.isRequired,
          name: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  cols: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  hover: PropTypes.bool,
  tooltip: PropTypes.func,
  onClick: PropTypes.func,
};

export default function ChartTable({ id, rows = [], cols: colsArr, sort: sortObj, pagination: paginationObj, hover, tooltip, onClick }) {
  const getMaxValue = (items) => {
    return items.reduce((acc, row) => {
      const datasets = (row && row.datasets) || [];
      const rowTotal = datasets.reduce((acc, obj) => {
        return acc + get(obj, 'value', 0);
      }, 0);

      return Math.max(acc, rowTotal);
    }, 0);
  };

  const getRowMaxCount = (items) => {
    return items.reduce((acc, row) => {
      return Math.max(acc, get(row, 'datasets.length', 0));
    }, 0);
  };

  const getRowValue = (row) => {
    const datasets = (row && row.datasets) || [];
    return datasets.reduce((acc, obj) => {
      return acc + get(obj, 'value', 0);
    }, 0);
  };

  const getRowPercentage = (max, value) => {
    return max && value ? (value / max) * 100 : 0;
  };

  const { cols, sort } = useSort(colsArr, sortObj);
  const pagination = usePagination(rows, paginationObj);

  const rowsParsed = rows.map((row) => ({ ...row, value: getRowValue(row) }));
  const rowsSorted = rowsParsed.sort(firstBy(utils.sort.array(sort.type, sort.by, sort.direction)));
  const rowsPaginated = rowsSorted.slice(
    pagination.obj.page * pagination.obj.rowsPerPage,
    pagination.obj.page * pagination.obj.rowsPerPage + pagination.obj.rowsPerPage
  );
  const maxValue = getMaxValue(rows);
  const maxCount = getRowMaxCount(rows);

  return (
    <ChartTableView
      id={id}
      items={rowsPaginated}
      cols={cols}
      sort={sort}
      pagination={pagination}
      stacked={maxValue > 1}
      maxValue={maxValue}
      maxCount={maxCount}
      getRowValue={getRowValue}
      getRowPercentage={getRowPercentage}
      hover={hover}
      tooltip={tooltip}
      onClick={onClick}
    />
  );
}
