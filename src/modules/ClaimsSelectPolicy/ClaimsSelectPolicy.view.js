import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';

//app
import styles from './ClaimsSelectPolicy.styles';
import * as utils from 'utils';
import config from 'config';
import { TableCell, TableHead, Pagination, Empty, Tooltip, TableFilters, FormLabel, TableToolbar, FormAutocompleteMui } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';

//mui
import { makeStyles, Grid, TableContainer, Table, TableRow, TableBody, Typography, Box, RadioGroup, Radio } from '@material-ui/core';

ClaimsSelectPolicyView.propTypes = {
  columnsArray: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  policyData: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  viewControl: PropTypes.object.isRequired,
  isFetchingFilters: PropTypes.bool,
  tableFilterFields: PropTypes.array.isRequired,
  viewFields: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    handleSort: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    onResetFilter: PropTypes.func.isRequired,
    onResetSearch: PropTypes.func.isRequired,
    handlePolicyData: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    columnProps: PropTypes.func.isRequired,
    toggleColumn: PropTypes.func.isRequired,
    onSelectSearchBy: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsSelectPolicyView({
  columnsArray,
  rows = [],
  sort: sortObj,
  policyData,
  pagination,
  tableFilterFields,
  handlers,
  viewControl,
  viewFields,
  isFetchingFilters,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsSelectPolicy' })();
  const { cols, sort } = useSort(columnsArray, sortObj, handlers.handleSort);
  const paginationObj = usePagination(rows, pagination, handlers.handleChangePage, handlers.handleChangeRowsPerPage);
  const cellLength = 25;

  return (
    <Box mt={2}>
      <Typography variant="body2" className={classes.title}>
        {utils.string.t('claims.searchPolicy.newClaim')}
      </Typography>
      <Box my={1}>
        <Typography variant="h5">{utils.string.t('claims.searchPolicy.searchInputLabel')}</Typography>
        <TableToolbar>
          <TableFilters
            search
            searchBy={
              <Box className={classes.filterBox}>
                <FormLabel label={`${utils.string.t('claims.searchByClaims.label')}*`} />
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(viewFields, 'searchBy')}
                  control={viewControl}
                  nestedClasses={{ root: classes.selectAutocomplete }}
                  callback={(event, obj) => {
                    handlers.onSelectSearchBy(obj?.value, obj?.label);
                  }}
                />
              </Box>
            }
            searchPlaceholder={utils.string.t('claims.searchPolicy.minimumCharacters')}
            searchMinChars={4}
            filtersArray={tableFilterFields}
            isFetchingFilters={isFetchingFilters}
            columns
            searchTerm={policyData.searchTerm}
            columnsArray={cols}
            handlers={{
              onSearch: handlers.handleSearch,
              onFilter: handlers.handleSearchFilter,
              onResetFilter: handlers.onResetFilter,
              onResetSearch: handlers.onResetSearch,
              onToggleColumn: handlers.toggleColumn,
            }}
            nestedClasses={{ searchMaxWidth: classes.searchMaxWidth }}
          />
        </TableToolbar>
      </Box>
      <Box>
        {utils.generic.isValidArray(rows, true) && (
          <Box mb={4}>
            <TableContainer>
              <RadioGroup name="policyRef" value={policyData.xbPolicyID} onChange={handlers.handlePolicyData}>
                <Table data-testid="claims-policy-search-table">
                  <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
                  <TableBody data-testid="claims-list">
                    {rows.map((policy) => (
                      <TableRow key={policy.policyNumber} hover>
                        <TableCell
                          {...handlers.columnProps('policyRef')}
                          className={classes.tableCell}
                          data-testid={`row-col-${policy.policyNumber}`}
                        >
                          <Grid container>
                            <Grid item>
                              <Radio
                                checked={Number(policyData.xbPolicyID) === policy.xbPolicyID}
                                onChange={handlers.handlePolicyData}
                                value={policy.xbPolicyID}
                                name="policyRef"
                                color="primary"
                                className={classes.radio}
                              />
                            </Grid>
                            <Grid item>{policy.policyNumber}</Grid>
                          </Grid>
                        </TableCell>
                        <TableCell {...handlers.columnProps('coverHolder')} data-testid={`row-col-${policy.coverHolder}`}>
                          {policy.coverHolder}
                        </TableCell>
                        <TableCell {...handlers.columnProps('statusCode')} data-testid={`row-col-${policy.statusCode}`}>
                          {policy.statusCode}
                        </TableCell>
                        <TableCell {...handlers.columnProps('policyType')} data-testid={`row-col-${policy.policyType}`}>
                          {policy.policyType}
                        </TableCell>
                        <TableCell {...handlers.columnProps('insured')} data-testid={`row-col-${policy.insured}`}>
                          {policy.insured}
                        </TableCell>
                        <TableCell {...handlers.columnProps('reInsured')} data-testid={`row-col-${policy.reInsured}`}>
                          {policy.reInsured || utils.string.t('app.na')}
                        </TableCell>
                        <TableCell {...handlers.columnProps('clientName')} data-testid={`row-col-${policy.clientName}`}>
                          {policy.clientName}
                        </TableCell>
                        <TableCell {...handlers.columnProps('riskDetails')} data-testid={`row-col-${policy.riskDetails}`}>
                          {policy.riskDetails.length > cellLength ? (
                            <Tooltip block title={policy.riskDetails}>
                              {policy.riskDetails.slice(0, cellLength)}...
                            </Tooltip>
                          ) : (
                            policy.riskDetails
                          )}
                        </TableCell>
                        <TableCell {...handlers.columnProps('inceptionDate')} data-testid={`row-col-${policy.inceptionDate}`}>
                          {utils.string.t('format.date', {
                            value: { date: policy?.inceptionDate, format: config.ui.format.date.text },
                          })}
                        </TableCell>
                        <TableCell {...handlers.columnProps('expiryDate')} data-testid={`row-col-${policy.expiryDate}`}>
                          {utils.string.t('format.date', {
                            value: { date: policy?.expiryDate, format: config.ui.format.date.text },
                          })}
                        </TableCell>
                        <TableCell {...handlers.columnProps('company')} data-testid={`row-col-${policy.company}`}>
                          <strong>{policy.company}</strong>
                        </TableCell>
                        <TableCell {...handlers.columnProps('division')} data-testid={`row-col-${policy.division}`}>
                          {policy.division}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </RadioGroup>
            </TableContainer>
            <Grid container>
              <Grid item xs={12}>
                <Pagination
                  page={get(paginationObj, 'obj.page')}
                  count={get(paginationObj, 'obj.rowsTotal')}
                  rowsPerPage={get(paginationObj, 'obj.rowsPerPage')}
                  onChangePage={get(paginationObj, 'handlers.handleChangePage')}
                  onChangeRowsPerPage={get(paginationObj, 'handlers.handleChangeRowsPerPage')}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        {!utils.generic.isValidArray(rows, true) && (
          <Grid container>
            <Grid item xs={12}>
              <Empty
                title={utils.string.t('claims.noMatchFound')}
                text={utils.string.t('claims.noMatchDetails')}
                icon={<IconSearchFile />}
                padding
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
