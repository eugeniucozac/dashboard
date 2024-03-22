import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './ChartTable.styles';
import { Overflow, Pagination, TableCell, TableHead, Tooltip } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Table, TableRow, TableBody } from '@material-ui/core';

ChartTableView.propTypes = {
  id: PropTypes.string,
  items: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  stacked: PropTypes.bool,
  hover: PropTypes.bool,
  tooltip: PropTypes.func,
  onClick: PropTypes.func,
  getRowValue: PropTypes.func.isRequired,
  getRowPercentage: PropTypes.func.isRequired,
};

export function ChartTableView({
  id,
  items,
  cols,
  sort,
  pagination,
  stacked,
  maxValue,
  maxCount,
  getRowValue,
  getRowPercentage,
  hover,
  tooltip,
  onClick,
}) {
  const classes = makeStyles(styles, { name: 'ChartTable' })();

  const page = get(pagination, 'obj.page');
  const count = get(pagination, 'obj.rowsTotal');
  const rowsPerPage = get(pagination, 'obj.rowsPerPage');

  // colors
  const colorsCount = stacked ? maxCount : count;
  const colors = utils.color.scale(colorsCount);
  const colorsByDirection = stacked ? colors : sort.direction === 'desc' ? colors.reverse() : colors;

  return (
    <Box width="100%">
      <Overflow>
        <Table size="small" className={classes.table} data-testid={`chart-table${id ? `-${id}` : ''}`}>
          <TableHead columns={cols} sorting={{ by: sort.by, direction: sort.direction }} nestedClasses={{ tableHead: classes.tableHead }} />

          <TableBody data-testid="chart-table-list">
            {items.map((row, index) => {
              const datasets = (row && row.datasets) || [];
              const rowValueTotal = getRowValue(row);
              const rowPercentage = getRowPercentage(maxValue, rowValueTotal);
              const rowLabel = row.label || row.value;

              return (
                <TableRow key={`${index}-${row.id}`} hover={hover} selected={false} data-testid={`chart-table-row-${row.id}`}>
                  <TableCell compact ellipsis title={row.name} nestedClasses={{ root: classes.cellName }}>
                    {row.name}
                  </TableCell>

                  {cols.find((col) => col.id === 'department') && (
                    <TableCell compact ellipsis title={row.department} nestedClasses={{ root: classes.cellDept }}>
                      {row.department}
                    </TableCell>
                  )}

                  {cols.find((col) => col.id === 'offices') && (
                    <TableCell compact ellipsis title={row.offices} nestedClasses={{ root: classes.cellOffice }}>
                      {row.offices}
                    </TableCell>
                  )}

                  <TableCell nowrap nestedClasses={{ root: classes.cellValue }}>
                    <div className={classes.bar}>
                      <div className={classes.barBg}>{rowLabel}</div>

                      <div className={classnames([classes.barBg, classes.barValueContainer])} style={{ width: rowPercentage + '%' }}>
                        <div className={classes.barLabel}>{rowLabel}</div>

                        {datasets.map((dataset, datasetIndex) => {
                          const tooltipText = utils.generic.isFunction(tooltip) && tooltip(row, dataset);
                          const colorIndex = stacked ? datasetIndex : index + rowsPerPage * page;

                          const stylesBarInner = {
                            width: getRowPercentage(rowValueTotal, dataset.value) + '%',
                            backgroundColor: colorsByDirection[colorIndex],
                          };

                          return (
                            <Tooltip
                              block
                              title={tooltipText}
                              style={stylesBarInner}
                              className={classes.barTooltip}
                              key={`${datasetIndex}-${dataset.id}`}
                            >
                              <div
                                className={classnames([classes.barBg, classes.barValue])}
                                style={{ ...stylesBarInner, width: '100%' }}
                                onClick={utils.generic.isFunction(onClick) && onClick(row, dataset)}
                              />
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Overflow>

      <Pagination
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
        onChangePage={get(pagination, 'handlers.handleChangePage')}
        onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
      />
    </Box>
  );
}
