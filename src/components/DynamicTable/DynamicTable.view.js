import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DynamicTable.styles';
import { DynamicTableRow, TableHead } from 'components';

// mui
import { makeStyles, Table, TableBody } from '@material-ui/core';

DynamicTableView.propTypes = {
  rows: PropTypes.array.isRequired,
  formProps: PropTypes.object.isRequired,
  columnHeaders: PropTypes.array.isRequired,
};

DynamicTableView.defaultProps = {
  columnHeaders: [],
  rows: [],
};

export function DynamicTableView({ rows, columnHeaders, formProps }) {
  const classes = makeStyles(styles, { name: 'DynamicTable' })();
  return (
    <Table className={classes.root}>
      <TableHead nestedClasses={{ tableHead: classes.tableHead }} columns={columnHeaders} />
      <TableBody>
        {rows.map((row, index) => (
          <DynamicTableRow formProps={formProps} data-testId="dynamic-table-row" key={index} row={row} />
        ))}
      </TableBody>
    </Table>
  );
}
