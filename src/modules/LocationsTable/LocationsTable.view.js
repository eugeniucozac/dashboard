import React from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import get from 'lodash/get';
import classnames from 'classnames';

// app
import styles from './LocationsTable.styles';
import { Overflow, Pagination, TableCell, TableHead, Translate } from 'components';

// mui
import { makeStyles, Table, TableRow, TableBody } from '@material-ui/core';

LocationsTableView.propTypes = {
  items: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleClickRow: PropTypes.func.isRequired,
};

LocationsTableView.defaultProps = {
  pagination: {
    obj: {},
    handlers: {},
  },
};

export function LocationsTableView({ items, cols, sort, pagination, selected, handleClickRow }) {
  const classes = makeStyles(styles, { name: 'LocationsTable' })();

  return (
    <>
      <Overflow>
        <Table size="small" className={classes.table}>
          <TableHead columns={cols} sorting={{ by: sort.by, direction: sort.direction }} />

          <TableBody data-testid="locations-list">
            {items.map((location) => {
              return (
                <TableRow
                  key={location.id}
                  hover
                  onClick={handleClickRow(location)}
                  className={classnames(classes.row, { [classes.rowSelected]: location.id === selected })}
                  data-testid={`overview-table-${location.id}`}
                >
                  <TableCell data-testid={`overview-table-location-${location.id}`}>{location.streetAddress}</TableCell>

                  <TableCell data-testid={`overview-table-city-${location.id}`}>{location.city}</TableCell>

                  <TableCell data-testid={`overview-table-state-${location.id}`}>{location.state}</TableCell>

                  <TableCell data-testid={`overview-table-tiv-${location.id}`}>
                    <Translate label="format.currency" options={{ value: { number: numbro.unformat(location.totalInsurableValues) } }} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Overflow>

      <Pagination
        page={get(pagination, 'obj.page')}
        count={get(pagination, 'obj.rowsTotal')}
        rowsPerPage={get(pagination, 'obj.rowsPerPage')}
        onChangePage={get(pagination, 'handlers.handleChangePage')}
        onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
      />
    </>
  );
}
