import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import { AdvanceSearchTabTableRow } from 'modules';
import { Empty, Overflow, TableHead, Pagination, Skeleton } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';
import * as utils from 'utils';

// mui
import { Table, TableBody, Box } from '@material-ui/core';

AdvanceSearchTabTableView.prototype = {
  tableData: PropTypes.array.isRequired,
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
  isTblLoader: PropTypes.bool.isRequired,
  emptyData: PropTypes.bool.isRequired,
};

export default function AdvanceSearchTabTableView(props) {
  const {
    tableData,
    sort: sortObj,
    pagination,
    cols: colsArr,
    columnProps,
    handleSort,
    handleChangePage,
    handleChangeRowsPerPage,
    isTblLoader,
    emptyData,
  } = props;
  const rows = tableData || [];
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const hasRows = utils.generic.isValidArray(rows, true);
  const paginationObj = usePagination(rows, pagination, handleChangePage, handleChangeRowsPerPage);

  return (
    <Box data-testid="Advance-search-table-grid">
      <Overflow>
        <Table size="small" data-testid="Advance-search-table">
          <TableHead columns={cols} sorting={sort} />
          <TableBody>
            {!isTblLoader &&
              !emptyData &&
              hasRows &&
              rows?.map((rowDetails, index) => {
                return <AdvanceSearchTabTableRow data={rowDetails} columnProps={columnProps} />;
              })}
          </TableBody>
        </Table>
      </Overflow>

      {!isTblLoader && !emptyData && rows ? (
        rows.length ? (
          <Pagination
            page={get(paginationObj, 'obj.page')}
            count={get(paginationObj, 'obj.rowsTotal')}
            rowsPerPage={get(paginationObj, 'obj.rowsPerPage')}
            onChangePage={get(paginationObj, 'handlers.handleChangePage')}
            onChangeRowsPerPage={get(paginationObj, 'handlers.handleChangeRowsPerPage')}
          />
        ) : (
          <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />
        )
      ) : isTblLoader ? (
        <Skeleton height={40} animation="wave" displayNumber={10} />
      ) : emptyData ? (
        <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />
      ) : (
        <Empty title={utils.string.t('claims.searchLossAndClaims')} icon={<IconSearchFile />} padding />
      )}
    </Box>
  );
}
