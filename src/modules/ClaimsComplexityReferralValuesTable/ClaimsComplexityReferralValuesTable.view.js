import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

//app
import * as utils from 'utils';
import styles from './ClaimsComplexityReferralValuesTable.styles';
import { TableCell, Overflow, TableHead, Pagination, Empty } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';

//mui
import { makeStyles, Grid, Table, TableRow, TableBody, Box } from '@material-ui/core';

ClaimsComplexityReferralValuesTableView.prototypes = {
  activeItem: PropTypes.object.isRequired,
  colsArr: PropTypes.array.isRequired,
  rows: PropTypes.object.isRequired,
  sortObj: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleValueSelect: PropTypes.func.isRequired,
};
export function ClaimsComplexityReferralValuesTableView({
  activeItem,
  cols: colsArr,
  rows = {},
  sort: sortObj,
  pagination,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  handleValueSelect,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsComplexityReferralValuesTable' })();
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const paginationObj = usePagination(rows, pagination, handleChangePage, handleChangeRowsPerPage);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box ml={2} className={classes.tableWrapper}>
            {rows.items ? (
              rows.items.length ? (
                <>
                  <Overflow>
                    <Table data-testid="complexity-table">
                      <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
                      <TableBody data-testid="complexity-list">
                        {rows.items.map((complexityValue) => {
                          return (
                            <TableRow
                              key={complexityValue.complexityRulesID}
                              onClick={() => handleValueSelect(complexityValue)}
                              className={activeItem?.complexityRulesID === complexityValue?.complexityRulesID ? classes.tableRowActive : ''}
                              hover
                            >
                              <TableCell data-testid={`row-col-${complexityValue.complexityRulesValue}`} className={classes.tableCell}>
                                {complexityValue.complexityRulesValue}
                              </TableCell>
                              <TableCell data-testid={`row-col-${complexityValue?.forCompany}`}> {complexityValue?.forCompany} </TableCell>
                              <TableCell data-testid={`row-col-${complexityValue?.forDivision}`}>
                                {' '}
                                {complexityValue?.forDivision}{' '}
                              </TableCell>
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
              )
            ) : (
              <Grid item xs={12}>
                <section className={classes.padding}></section>
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
