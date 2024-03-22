import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

//app
import styles from './ClaimsTable.styles';
import { Empty, Overflow, TableHead, Pagination } from 'components';
import { ClaimsTableRowView } from './ClaimsTableRow.view';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';
import * as utils from 'utils';

//mui
import { makeStyles, Table, TableBody, Grid, Box } from '@material-ui/core';

ClaimsTableView.prototype = {
  rows: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleViewClaimClick: PropTypes.func.isRequired,
  handleCreateClaim: PropTypes.func.isRequired,
  isTableHidden: PropTypes.bool.isRequired,
};

export function ClaimsTableView({
  rows,
  sort: sortObj,
  pagination,
  cols: colsArr,
  columnProps,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  handleViewClaimClick,
  handleCreateClaim,
  handleEditClaim,
}) {
  const classes = makeStyles(styles, { name: 'SearchTable' })();
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const hasRows = utils.generic.isValidArray(rows, true);
  const paginationObj = usePagination(rows, pagination, handleChangePage, handleChangeRowsPerPage);

  return (
    <Box data-testid="claims-search-table" className={classes.wrapper}>
      <Overflow>
        <Table data-testid="claims-table">
          <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
          <TableBody data-testid="claims-list">
            {hasRows &&
              rows.map((search, index) => {
                return (
                  <ClaimsTableRowView
                    data={search}
                    handleCreateClaim={handleCreateClaim}
                    handleViewClaimClick={handleViewClaimClick}
                    columnProps={columnProps}
                    handleEditClaim={handleEditClaim}
                  />
                );
              })}
          </TableBody>
        </Table>
      </Overflow>
      {rows ? (
        rows.length ? (
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
        ) : (
          <Grid item xs={12}>
            <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />
          </Grid>
        )
      ) : (
        <Grid item xs={12}>
          <Empty title={utils.string.t('claims.searchLossAndClaims')} icon={<IconSearchFile />} padding />
        </Grid>
      )}
    </Box>
  );
}
