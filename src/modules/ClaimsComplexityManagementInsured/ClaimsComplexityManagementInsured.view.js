import React from 'react';
import get from 'lodash/get';

//app
import * as utils from 'utils';

import styles from './ClaimsComplexityManagementInsured.styles';
import { Button, FormCheckbox, TableCell, Overflow, TableHead, Search, Pagination, Empty } from 'components';

//mui
import { makeStyles, Grid, Table, TableRow, TableBody, Typography, Box } from '@material-ui/core';

import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';

export function ClaimsComplexityManagementInsuredView({
  cols: colsArr,
  rows = [],
  sort: sortObj,
  pagination,
  control,
  register,
  watch,
  handleSort,
  handleSearch,
  handleReset,
  handleChangePage,
  handleChangeRowsPerPage,
  complexPolicyFlag,
  selectedInsuredItemsHandler,
  enableDisableFlag,
  claimsSelectedInsured,
  postSaveComplexInsuredHandler,
  resetKey,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsComplexityManagementInsured' })();
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const paginationObj = usePagination(rows, pagination, handleChangePage, handleChangeRowsPerPage);

  const fields =
    rows.items &&
    rows.items.length &&
    rows.items.map((field) => ({
      name: field.attributeValue,
      type: 'checkbox',
      disabled: complexPolicyFlag ? field.complexityFlag : false,
      defaultValue: complexPolicyFlag ? field.complexityFlag || enableDisableFlag(field.attributeValue) : false,
    }));

  return (
    <>
      <Grid container>
        <Grid item xs={12} className={classes.searchWrapper}>
          <Box>
            <Typography variant="h5">Enter Insured</Typography>
            <Search
              key={resetKey}
              text=""
              placeholder=""
              minChars={4}
              nestedClasses={{ root: classes.search }}
              handlers={{
                search: handleSearch,
                reset: handleReset,
              }}
            />
            <Typography variant="h5">Enter minimum 4 characters</Typography>
          </Box>
        </Grid>
        {
          <Grid item xs={12}>
            <Box ml={2} className={classes.tableWrapper}>
              {rows.items ? (
                rows.items.length ? (
                  <>
                    <Overflow>
                      <Table data-testid="claims-table">
                        <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
                        <TableBody data-testid="claims-list">
                          {rows.items.map((insured) => {
                            return (
                              <TableRow key={insured.attributeValue} hover>
                                <TableCell compact data-testid={`row-col-${insured.attributeValue}`}>
                                  <FormCheckbox
                                    {...utils.form.getFieldProps(fields, insured.attributeValue)}
                                    control={control}
                                    register={register}
                                    watch={watch}
                                    muiComponentProps={{
                                      onChange: (id, checked) =>
                                        complexPolicyFlag ? selectedInsuredItemsHandler(id, checked, insured) : null,
                                    }}
                                  />
                                </TableCell>
                                <TableCell data-testid={`row-col-${insured.insured}`}>{insured.insured}</TableCell>
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
                        <Grid item xs={12}>
                          <Box mt={3} display="flex" justifyContent="flex-end">
                            <Button
                              text={utils.string.t('claims.complexityRulesManagementDetails.saveAsComplex')}
                              onClick={() => postSaveComplexInsuredHandler()}
                              disabled={claimsSelectedInsured?.length === 0 ? true : false}
                              color="primary"
                              size="medium"
                              nestedClasses={{ btn: classes.actionButton }}
                            />
                          </Box>
                        </Grid>
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
                )
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
        }
      </Grid>
    </>
  );
}
