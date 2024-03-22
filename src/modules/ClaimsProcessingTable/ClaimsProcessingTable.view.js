import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import { Empty, Overflow, TableHead, Pagination } from 'components';
import { ClaimsProcessingTableRow } from 'modules';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { useSort } from 'hooks';
import * as utils from 'utils';

// mui
import { Table, TableBody, Box } from '@material-ui/core';

ClaimsProcessingTableView.prototype = {
  claims: PropTypes.array.isRequired,
  claimsSelected: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    bulkAssignClaims: PropTypes.func.isRequired,
    clickClaim: PropTypes.func.isRequired,
    handleCreateAdHocTaskModal: PropTypes.func.isRequired,
    handleCreateRFIModal: PropTypes.func.isRequired,
    handleReassignClaim: PropTypes.func.isRequired,
    handleReturnClaimToTeamQueue: PropTypes.func.isRequired,
    handleSetClaimPriority: PropTypes.func.isRequired,
    handleReOpenClaim: PropTypes.func.isRequired,
    selectClaim: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsProcessingTableView({ claims, claimsSelected, cols: colsArr, columnProps, sort: sortObj, pagination, handlers }) {
  const { cols, sort } = useSort(colsArr, sortObj, handlers.sort);

  const hasNotSearchClaims = !claims;
  const hasClaims = utils.generic.isValidArray(claims, true);

  return (
    <Box data-testid="claims-processing-search-table">
      <Overflow>
        <Table size="small" data-testid="claims-processing-table">
          <TableHead columns={cols} sorting={sort} />
          <TableBody data-testid="claims-list-body">
            {hasClaims &&
              claims.map((claim) => {
                return (
                  <ClaimsProcessingTableRow
                    key={claim.processID}
                    claim={claim}
                    isSelected={Boolean(claimsSelected.map((c) => c.processID).includes(claim.processID))}
                    columnProps={columnProps}
                    handlers={{
                      clickClaim: handlers.clickClaim,
                      createRFI: handlers.handleCreateRFIModal,
                      createTask: handlers.handleCreateAdHocTaskModal,
                      selectClaim: handlers.selectClaim,
                      setClaimPriority: handlers.handleSetClaimPriority,
                      reAssign: handlers.handleReassignClaim,
                      returnClaimToTeamQueue: handlers.handleReturnClaimToTeamQueue,
                      reOpenClaim: handlers.handleReOpenClaim,
                    }}
                  />
                );
              })}
          </TableBody>
        </Table>
      </Overflow>
      {hasNotSearchClaims ? (
        <Empty title={utils.string.t('claims.searchLossAndClaims')} icon={<IconSearchFile />} padding />
      ) : hasClaims ? (
        <Pagination
          page={get(pagination, 'obj.page')}
          count={get(pagination, 'obj.rowsTotal')}
          rowsPerPage={get(pagination, 'obj.rowsPerPage')}
          onChangePage={get(pagination, 'handlers.handleChangePage')}
          onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
        />
      ) : (
        <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />
      )}
    </Box>
  );
}
