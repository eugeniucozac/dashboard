import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './ProductsAdminCarriers.styles';
import { Button, Loader, Overflow, Pagination, TableCell, TableHead, Translate } from 'components';
import * as utils from 'utils';

// mui
import { Grid, makeStyles, Box, Table, TableBody, TableRow, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

ProductsAdminCarriersView.propTypes = {
  schema: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    addCarrier: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changeRowsPerPage: PropTypes.func.isRequired,
  }).isRequired,
};

export function ProductsAdminCarriersView({ schema, loading, pagination, handlers }) {
  const classes = makeStyles(styles, { name: 'ProductsAdminCarriers' })();

  const hasRows = utils.generic.isValidArray(schema.items, true);

  return (
    <Box position="relative" data-testid="products-admin-carriers">
      {loading && <Loader absolute />}

      <Overflow>
        <Table size="small">
          <TableHead columns={schema.fields} />
          <TableBody style={{ minHeight: 300 }}>
            {hasRows &&
              schema.items.map((item) => {
                const classesRow = { [classes.rowNew]: item.__new__ };
                return (
                  <TableRow key={`${item.id}`} className={classnames(classesRow)}>
                    {schema.fields &&
                      schema.fields.map((field) => (
                        <TableCell key={`${item.id}-${field.id}`} {...field.cellProps}>
                          <Typography variant="body2" className={classes.layers}>
                            {item[field.id]}
                          </Typography>
                        </TableCell>
                      ))}
                  </TableRow>
                );
              })}
            {!hasRows && (
              <TableRow>
                <TableCell colSpan={schema.items.length}>
                  <Box height={350 - 16} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Overflow>

      <Grid container>
        <Grid item xs={12} sm={4}>
          <Box mt={2}>
            <Button
              icon={AddIcon}
              color="primary"
              size="small"
              text={<Translate label={'products.admin.carriers.add'} />}
              data-testid={'carriers-create-button'}
              onClick={handlers.addCarrier(schema.fields)}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          {schema.pagination && pagination.page !== undefined && (
            <Pagination
              page={pagination.page}
              count={pagination.rowsTotal}
              rowsPerPage={pagination.rowsPerPage}
              onChangePage={handlers.changePage}
              onChangeRowsPerPage={handlers.changeRowsPerPage}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
