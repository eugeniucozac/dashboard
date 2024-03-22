import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import get from 'lodash/get';

//app
import styles from './ClaimsComplexityInsured.styles';
import * as utils from 'utils';
import { Button, TableCell, Overflow, TableHead, Search, Pagination, Empty, FormCheckbox } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';

//mui
import { makeStyles, Grid, Table, TableRow, TableBody, Typography, Box } from '@material-ui/core';

ClaimsComplexityInsuredView.prototype = {
  cols: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  addInsured: PropTypes.func.isRequired,
  removeInsured: PropTypes.func.isRequired,
  setIsSelectedTabDirty: PropTypes.func.isRequired,
};

export function ClaimsComplexityInsuredView({
  cols: colsArr,
  rows = [],
  sort: sortObj,
  pagination,
  handleSort,
  handleSearch,
  handleReset,
  handleChangePage,
  handleChangeRowsPerPage,
  addInsured,
  removeInsured,
  setIsSelectedTabDirty,
  resetKey,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsComplexityInsured' })();
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const paginationObj = usePagination(rows, pagination, handleChangePage, handleChangeRowsPerPage);

  const { control, register, watch } = useForm();
  const insured = watch();
  const someCheckedInsured = Object.values(insured).some((value) => value);

  useEffect(() => {
    setIsSelectedTabDirty(someCheckedInsured);
  }, [someCheckedInsured]); // eslint-disable-line react-hooks/exhaustive-deps

  const fields =
    rows &&
    rows.length &&
    rows.map((field) => ({
      name: field.insured.split('.').join(''),
      type: 'checkbox',
    }));

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            text={utils.string.t('app.add')}
            data-testid="addInsured"
            onClick={() => addInsured()}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.actionButton }}
          />
          <Button
            text={utils.string.t('app.remove')}
            data-testid="removeInsured"
            disabled={!someCheckedInsured}
            onClick={() => removeInsured(insured)}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.actionButton }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} className={classes.searchWrapper}>
        <Box>
          <Typography variant="h5">{utils.string.t('claims.complexityInsured.title')}</Typography>
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
          <Typography variant="h5">{utils.string.t('claims.searchPolicy.minimumCharacters')}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box ml={2} className={classes.tableWrapper}>
          {utils.generic.isValidArray(rows, true) && (
            <>
              <Overflow>
                <Table data-testid="claims-table">
                  <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
                  <TableBody data-testid="claims-list">
                    {rows.map((item, iter) => {
                      return (
                        <TableRow key={`${item.insured}-${iter}`} hover>
                          <TableCell compact data-testid={`row-col-${iter}`}>
                            <FormCheckbox
                              {...utils.form.getFieldProps(fields, item.insured.split('.').join(''))}
                              control={control}
                              register={register}
                              watch={watch}
                            />
                          </TableCell>
                          <TableCell data-testid={`row-col-${item.insured}`}>{item.insured}</TableCell>
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
          )}
          {!utils.generic.isValidArray(rows, true) && (
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
