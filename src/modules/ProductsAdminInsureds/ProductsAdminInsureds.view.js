import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './ProductsAdminInsureds.styles';
import { Button, Loader, Overflow, Pagination, PopoverMenu, TableCell, TableHead, Translate } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { Grid, makeStyles, Box, Table, TableBody, TableRow, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

ProductsAdminInsuredsView.propTypes = {
  schema: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  countries: PropTypes.array.isRequired,
  options: PropTypes.shape({
    clients: PropTypes.array.isRequired,
  }).isRequired,
  pagination: PropTypes.object.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  reInsured: PropTypes.bool.isRequired,
  popoverActions: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    addInsured: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changeRowsPerPage: PropTypes.func.isRequired,
  }).isRequired,
};

export function ProductsAdminInsuredsView({
  schema,
  loading,
  countries,
  options,
  pagination,
  buttonLabel,
  reInsured,
  popoverActions,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'ProductsAdminInsureds' })();

  const hasRows = utils.generic.isValidArray(schema.items, true);

  return (
    <Box position="relative" data-testid={reInsured ? 'products-admin-reInsureds' : 'products-admin-insureds'}>
      {loading && <Loader absolute />}

      <Overflow>
        <Table size="small">
          <TableHead columns={schema.fields} />
          <TableBody>
            {hasRows &&
              schema.items.map((item) => {
                const classesRow = { [classes.rowNew]: item.__new__ };
                return (
                  <TableRow key={`${item.id}`} className={classnames(classesRow)}>
                    {schema.fields &&
                      schema.fields.map((field) => {
                        const addressFields = ['street', 'city', 'zipCode', 'county', 'state', 'country'];
                        const isAddressField = addressFields.includes(field.id);
                        const isPartyType = field.id === 'partyType';

                        const parseField = () => {
                          if (isPartyType) {
                            const partyTypeField = get(item, `[${field.id}]`, '')?.toLowerCase();

                            if (['business', 'individual'].includes(partyTypeField)) {
                              return utils.string.t(`products.admin.insureds.typeOptions.${partyTypeField}`);
                            }
                          } else if (isAddressField) {
                            if (field.id === 'country') {
                              return utils.risk.getInsuredCountry(item.address, countries);
                            }

                            return get(item, `[address.${field.id}]`);
                          } else if (field.id === 'genderType') {
                            return utils.string.capitalise(get(item, `[${field.id}]`, ''));
                          } else if (field.id === 'dateOfBirth') {
                            return (
                              <Translate
                                label="format.date"
                                options={{ value: { date: get(item, `[${field.id}]`, ''), format: config.ui.format.date.text } }}
                              />
                            );
                          } else if (field.id === 'clientId') {
                            const clientID = get(item, `[${field.id}]`);
                            return utils.form.getSelectOption('clients', options, clientID) || '';
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
                      <PopoverMenu id="products-admin-edit-table-popover" data={{ fields: schema.fields, item }} items={popoverActions} />
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
              text={<Translate label={buttonLabel} />}
              data-testid={'insureds-create-button'}
              onClick={handlers.addInsured(schema.fields)}
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
