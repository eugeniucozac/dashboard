import React from 'react';
import PropTypes from 'prop-types';

// app
import { Empty, Overflow, Pagination, TableCell, TableFilters, TableHead, TableToolbar } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import * as utils from 'utils';
import config from 'config';

// mui
import { Box, Table, TableBody, TableRow } from '@material-ui/core';

ClaimRefAuditTrailView.propTypes = {
  audits: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  filtersArray: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.object.isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    searchSubmit: PropTypes.func.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    onResetFilter: PropTypes.func.isRequired,
    onResetSearch: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ClaimRefAuditTrailView({ audits, cols, columnProps, filtersArray, sort, pagination, handlers }) {
  const hasAudits = utils.generic.isValidArray(audits, true);

  return (
    <Box mt={3}>
      <TableToolbar>
        <TableFilters
          search
          searchMinChars={4}
          filtersArray={filtersArray}
          handlers={{
            onSearch: handlers.searchSubmit,
            onFilter: handlers.handleSearchFilter,
            onResetFilter: handlers.onResetFilter,
            onResetSearch: handlers.onResetSearch,
          }}
        />
      </TableToolbar>
      <Overflow>
        <Table data-testid="claim-audits-table">
          <TableHead columns={cols} sorting={sort}></TableHead>
          <TableBody>
            {hasAudits &&
              audits.map((audit, index) => {
                return (
                  <TableRow key={index} data-testid={`claim-audits-table-row-${audit.id}`}>
                    <TableCell {...columnProps('createdDate')} nowrap>
                      {utils.string.t('format.date', {
                        value: { date: audit?.createdDate, format: config.ui.format.date.textTime },
                      })}
                    </TableCell>
                    <TableCell {...columnProps('eventName')}>{audit?.eventName}</TableCell>
                    <TableCell {...columnProps('createdBy')}>{audit?.createdBy}</TableCell>
                    <TableCell {...columnProps('oldValue')}>{audit?.oldValue ? audit.oldValue : null}</TableCell>
                    <TableCell {...columnProps('newValue')}>{audit?.newValue ? audit.newValue : null}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Overflow>
      {!hasAudits && <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />}
      {pagination?.obj && pagination?.handlers && (
        <Pagination
          page={pagination.obj.page}
          count={pagination.obj.rowsTotal}
          rowsPerPage={pagination.obj.rowsPerPage}
          onChangePage={pagination.handlers.handleChangePage}
          onChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
          testid="claim-audits"
        />
      )}
    </Box>
  );
}
