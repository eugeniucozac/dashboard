import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './ProductsAdminClients.styles';
import { Button, Loader, Overflow, Pagination, PopoverMenu, TableCell, TableHead, Translate } from 'components';
import * as utils from 'utils';

// mui
import { Grid, makeStyles, Box, Table, TableBody, TableRow, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

ProductsAdminClientsView.propTypes = {
  schema: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.object.isRequired,
  popoverActions: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    addClient: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changeRowsPerPage: PropTypes.func.isRequired,
  }).isRequired,
};

export function ProductsAdminClientsView({ schema, countries, loading, pagination, popoverActions, handlers }) {
  const classes = makeStyles(styles, { name: 'ProductsAdminClients' })();

  const hasRows = utils.generic.isValidArray(schema.items, true);

  return (
    <Box position="relative" data-testid="products-admin-clients">
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
                      schema.fields.map((field) => {
                        const addressFields = ['street', 'city', 'zipCode', 'county', 'state', 'country'];
                        const isAddressField = addressFields.includes(field.id);

                        const parseField = () => {
                          if (isAddressField) {
                            if (field.id === 'country') {
                              return utils.risk.getInsuredCountry(item.address, countries);
                            }

                            return get(item, `[address.${field.id}]`);
                          }

                          return get(item, `[${field.id}]`);
                        };
                        return (
                          <TableCell key={`${item.id}-${field.id}`} {...field.cellProps}>
                            <Typography variant="body2" className={classes.layers}>
                              {parseField()}
                            </Typography>
                          </TableCell>
                        );
                      })}
                    <TableCell menu data-testid={`edit-menu`}>
                      <PopoverMenu id="products-admin-edit-table-popover" data={{ id: item.id }} items={popoverActions} />
                    </TableCell>
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
              text={<Translate label={'products.admin.clients.add'} />}
              data-testid={'clients-create-button'}
              onClick={handlers.addClient(schema.fields)}
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
