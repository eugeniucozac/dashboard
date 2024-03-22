import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import startCase from 'lodash/startCase';
import get from 'lodash/get';

// app
import styles from './ProductsAdminFacilities.styles';
import { Button, Loader, Overflow, Pagination, PopoverMenu, TableCell, TableHead, Translate } from 'components';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';
import { ROLE_UNDERWRITER } from 'consts';

// mui
import { Grid, makeStyles, Box, Table, TableBody, TableRow, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

ProductsAdminFacilitiesView.propTypes = {
  schema: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.object.isRequired,
  popoverActions: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    addFacility: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changeRowsPerPage: PropTypes.func.isRequired,
  }).isRequired,
};

export function ProductsAdminFacilitiesView({ schema, options, loading, pagination, popoverActions, handlers }) {
  const classes = makeStyles(styles, { name: 'ProductsAdminFacilities' })();

  const transformValue = (field, value, options) => {
    if (!value) return;
    switch (field.transform) {
      case 'option':
        return utils.form.getSelectOption(field.optionsDynamicKey, options, value) || '';
      case 'currency':
        return <Translate label="format.currency" options={{ value: { number: value, currency: get(constants.CURRENCY_USD, 'code') } }} />;
      case 'date':
        return <Translate label="format.date" options={{ value: { date: value, format: config.ui.format.date.text } }} />;
      case 'capitalise':
        return startCase(value.toLowerCase());
      default:
        return value;
    }
  };

  const formatValue = (item, field) => {
    switch (field?.id) {
      case 'permissionToBindGroups':
      case 'permissionToDismissIssuesGroups':
        return item[field.id]
          ?.filter((f) => f !== ROLE_UNDERWRITER)
          .map((a) => a.charAt(0).toUpperCase() + a.substr(1).toLowerCase())
          .join(', ');
      case 'preBind': {
        return item[field.id] ? utils.string.t('app.yes') : utils.string.t('app.no');
      }
      default:
        return item[field.id];
    }
  };

  const isReady = !loading && schema.dependenciesLoaded(options);
  const hasRows = utils.generic.isValidArray(schema.items, true);
  const newSchemaFields = schema?.fields?.filter((field) => field?.displayColumn !== false && field.id !== 'notifiedUsers');

  return (
    <Box position="relative" data-testid="products-admin-facilities">
      {(loading || !isReady) && <Loader absolute />}

      <Overflow>
        <Table size="small">
          <TableHead columns={[...utils.schemas.removeIcons(newSchemaFields), { id: 'menu' }]} />
          <TableBody>
            {hasRows &&
              schema.items.map((item) => {
                const classesRow = { [classes.rowNew]: item.__new__ };
                return (
                  <TableRow key={`${item.id}`} className={classnames(classesRow)}>
                    {newSchemaFields &&
                      newSchemaFields.map((field) => {
                        return field?.id === 'notifiedUsers' ? null : (
                          <TableCell key={`${item.id}-${field.id}`} {...field.cellProps}>
                            <Typography variant="body2" className={classes.layers}>
                              {field.transform ? transformValue(field, item[field.id], options) : formatValue(item, field)}
                            </Typography>
                          </TableCell>
                        );
                      })}
                    <TableCell menu data-testid={`facility-menu`}>
                      <PopoverMenu
                        id="products-admin-facility-table-popover"
                        data={{ facility: item, fields: schema.fields, options }}
                        items={popoverActions}
                      />
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
              text={<Translate label={'products.admin.facilities.add'} />}
              data-testid={'facilities-create-button'}
              onClick={handlers.addFacility(schema.fields)}
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
