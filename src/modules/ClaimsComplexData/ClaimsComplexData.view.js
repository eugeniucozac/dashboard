import React from 'react';
import get from 'lodash/get';

//app
import * as utils from 'utils';
import styles from './ClaimsComplexData.styles';
import { Button, FormCheckbox, TableCell, Overflow, TableHead, Search, Pagination, Empty, Tooltip } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';

//mui
import { makeStyles, Grid, Table, TableRow, TableBody, Typography, Box } from '@material-ui/core';

export function ClaimsComplexDataView({
  cols: colsArr,
  rows = [],
  sort: sortObj,
  pagination,
  setData,
  searchBy,
  checkedBy,
  control,
  register,
  watch,
  handleSort,
  handleSearch,
  handleReset,
  handleChangePage,
  handleChangeRowsPerPage,
  saveComplexButton,
  selectedPolicyItemsHandler,
  complexityFlag,
  postSaveComplexPolicyHandler,
  enableDisableFlag,
  selectedPoliciesData,
  title,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsSelectData' })();
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const paginationObj = usePagination(rows, pagination, handleChangePage, handleChangeRowsPerPage);
  const cellLength = 25;

  const fields =
    rows.items &&
    rows.items.length &&
    rows.items.map((field) => ({
      name: field[checkedBy],
      type: 'checkbox',
      disabled: complexityFlag ? field.complexityFlag : false,
      defaultValue: complexityFlag ? field.complexityFlag || enableDisableFlag(field[checkedBy]) : false,
    }));

  return (
    <>
      <Grid container>
        <Grid item xs={12} className={classes.searchWrapper}>
          <Box>
            <Typography variant="h5">{title}</Typography>
            <Search
              key="key"
              text=""
              placeholder=""
              minChars={4}
              nestedClasses={{ root: classes.search }}
              handlers={{
                search: handleSearch,
                reset: handleReset,
              }}
            />
            <Typography variant="h5">{utils.string.t('claims.searchPolicy.minimumCharacters')}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box ml={2} className={classes.tableWrapper}>
            {rows.items ? (
              rows.items.length ? (
                <>
                  <Overflow>
                    <Table data-testid="claims-table">
                      <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
                      <TableBody data-testid="claims-list">
                        {rows.items.map((item) => {
                          return (
                            <TableRow key={item[checkedBy]} hover>
                              {cols.map((col, i) => {
                                if (col.id === 'actions') {
                                  return (
                                    <TableCell compact data-testid={`row-col-${item[checkedBy]}`}>
                                      <FormCheckbox
                                        {...utils.form.getFieldProps(fields, item[checkedBy])}
                                        control={control}
                                        register={register}
                                        watch={watch}
                                        muiComponentProps={{
                                          onChange: (id, checked) =>
                                            complexityFlag ? selectedPolicyItemsHandler(id, checked, item) : null,
                                        }}
                                      />
                                    </TableCell>
                                  );
                                }
                                if (col.id === 'riskDetails') {
                                  return (
                                    <TableCell data-testid={`row-col-${item[col.id]}`}>
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
                                    <TableCell data-testid={`row-col-${item[col.id]}`}>
                                      <strong>{item[col.id]}</strong>
                                    </TableCell>
                                  );
                                } else {
                                  return <TableCell data-testid={`row-col-${item[col.id]}`}>{item[col.id]}</TableCell>;
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
                      {saveComplexButton && (
                        <Grid item xs={12}>
                          <Box mt={3} display="flex" justifyContent="flex-end">
                            <Button
                              text={utils.string.t('claims.complexityRulesManagementDetails.saveAsComplex')}
                              onClick={() => postSaveComplexPolicyHandler()}
                              disabled={selectedPoliciesData?.length === 0 ? true : false}
                              color="primary"
                              size="medium"
                              nestedClasses={{ btn: classes.actionButton }}
                            />
                          </Box>
                        </Grid>
                      )}
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
      </Grid>
    </>
  );
}
