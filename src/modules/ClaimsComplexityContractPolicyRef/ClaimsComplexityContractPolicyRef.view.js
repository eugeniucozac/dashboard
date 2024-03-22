import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import get from 'lodash/get';

//app
import styles from './ClaimsComplexityContractPolicyRef.styles';
import * as utils from 'utils';
import { Button, TableCell, Overflow, TableHead, Search, Pagination, Empty, Tooltip, FormCheckbox } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';

//mui
import { makeStyles, Grid, Table, TableRow, TableBody, Typography, Box } from '@material-ui/core';

ClaimsComplexityContractPolicyRefView.propTypes = {
  cols: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  setIsSelectedTabDirty: PropTypes.func.isRequired,
  handlers: PropTypes.shape({
    handleSort: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    addPolicy: PropTypes.func.isRequired,
    removingPolicy: PropTypes.func.isRequired,
  }).isRequired,
  resetKey: PropTypes.string,
};

export function ClaimsComplexityContractPolicyRefView({
  cols: colsArr,
  rows = [],
  sort: sortObj,
  pagination,
  setIsSelectedTabDirty,
  handlers,
  resetKey,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsComplexityContractPolicyRef' })();
  const { cols, sort } = useSort(colsArr, sortObj, handlers.handleSort);
  const paginationObj = usePagination(rows, pagination, handlers.handleChangePage, handlers.handleChangeRowsPerPage);
  const cellLength = 25;

  const { control, register, watch } = useForm();
  const selectedPolicies = watch();
  const someCheckedPolicies = Object.values(selectedPolicies).some((value) => value);

  useEffect(() => {
    setIsSelectedTabDirty(someCheckedPolicies);
  }, [someCheckedPolicies]); // eslint-disable-line react-hooks/exhaustive-deps

  const fields =
    utils.generic.isValidArray(rows, true) &&
    rows.map((field) => ({
      name: field?.xbPolicyID.toString(),
      type: 'checkbox',
    }));

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            text={utils.string.t('app.add')}
            data-testid="addComplexPolicy"
            onClick={() => handlers.addPolicy()}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.actionButton }}
          />
          <Button
            text={utils.string.t('app.remove')}
            data-testid="removeComplexPolicy"
            disabled={!someCheckedPolicies}
            onClick={() => handlers.removingPolicy(selectedPolicies)}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.actionButton }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} className={classes.searchWrapper}>
        <Box>
          <Typography variant="h5">{utils.string.t('claims.complexityContractPolicy.title')}</Typography>
          <Search
            key={resetKey}
            text=""
            placeholder=""
            minChars={4}
            nestedClasses={{ root: classes.search }}
            handlers={{
              search: handlers.handleSearch,
              reset: handlers.handleReset,
            }}
          />
          <Typography variant="h5">{utils.string.t('claims.searchPolicy.minimumCharacters')}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box ml={2} className={classes.tableWrapper}>
          {utils.generic.isValidArray(rows, true) ? (
            <>
              <Overflow>
                <Table data-testid="claims-table">
                  <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
                  <TableBody data-testid="claims-list">
                    {rows.map((item) => {
                      return (
                        <TableRow key={item.xbPolicyID} hover>
                          {cols.map((col, i) => {
                            if (col.id === 'actions') {
                              return (
                                <TableCell compact key={col.id} data-testid={`row-col-${col.id}`}>
                                  <FormCheckbox
                                    {...utils.form.getFieldProps(fields, item.xbPolicyID.toString())}
                                    control={control}
                                    register={register}
                                    watch={watch}
                                  />
                                </TableCell>
                              );
                            }
                            if (col.id === 'riskDetails') {
                              return (
                                <TableCell key={col.id} data-testid={`row-col-${item[col.id]}`}>
                                  {item[col.id].length > cellLength ? (
                                    <Tooltip block title={item[col.id]}>
                                      {item[col.id].slice(0, cellLength)}...
                                    </Tooltip>
                                  ) : (
                                    item[col.id]
                                  )}
                                </TableCell>
                              );
                            }
                            if (col.id === 'company') {
                              return (
                                <TableCell key={col.id} data-testid={`row-col-${item[col.id]}`}>
                                  <strong>{item[col.id]}</strong>
                                </TableCell>
                              );
                            } else {
                              return (
                                <TableCell key={col.id} data-testid={`row-col-${item[col.id]}`}>
                                  {item[col.id]}
                                </TableCell>
                              );
                            }
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Overflow>
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
            </>
          ) : (
            <Grid item xs={12}>
              <Empty
                title={utils.string.t('claims.noMatchFound')}
                text={utils.string.t('claims.noMatchDetails')}
                icon={<IconSearchFile />}
                padding
              />
            </Grid>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
