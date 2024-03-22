import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ClaimRefRfis.styles';
import { Overflow, TableCell, TableFilters, TableHead, TableToolbar, Status, Translate, Pagination, Link } from 'components';
import * as utils from 'utils';
import config from 'config';
import { RFI_COMPLETED_STATUS, RFI_INPROGRESS_STATUS } from 'consts';

// mui
import { makeStyles, Box, Table, TableBody, TableRow } from '@material-ui/core';

ClaimRefRfisView.propTypes = {
  rfis: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.object.isRequired,
  }).isRequired,
  filtersArray: PropTypes.array.isRequired,
  prioritiesList: PropTypes.array.isRequired,
  resetKey: PropTypes.number,
  handlers: PropTypes.shape({
    searchSubmit: PropTypes.func.isRequired,
    filterSearchSubmit: PropTypes.func.isRequired,
    resetSubmit: PropTypes.func.isRequired,
    clickRfiTask: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ClaimRefRfisView({ rfis, cols, columnProps, sort, pagination, filtersArray, prioritiesList, handlers, resetKey }) {
  const classes = makeStyles(styles, { name: 'TasksProcessingTableRow' })();

  const getStatus = (rfi) => {
    const targetDate = new Date(rfi?.targetDueDate).getTime();
    const createdDate = new Date(rfi?.queryCreatedOn).getTime();
    const dateNow = new Date().getTime();
    const targetDDMMYY = utils.string.t('format.date', {
      value: { date: rfi?.targetDueDate, format: config.ui.format.date.slashNumeric },
    });
    const dateNowDDMMYY = utils.string.t('format.date', { value: { date: new Date(), format: config.ui.format.date.slashNumeric } });

    if (targetDate > createdDate && rfi?.status.toLowerCase() === RFI_COMPLETED_STATUS.toLowerCase())
      return { id: rfi?.status, type: 'success' };
    else if (
      targetDate >= createdDate &&
      targetDate > dateNow &&
      targetDate !== dateNow &&
      targetDDMMYY !== dateNowDDMMYY &&
      rfi?.status.toLowerCase() === RFI_INPROGRESS_STATUS.toLowerCase()
    )
      return { id: rfi?.status, type: 'success' };
    else if (targetDate === dateNow || targetDDMMYY === dateNowDDMMYY) return { id: rfi?.status, type: 'alert' };
    else if (targetDate <= dateNow && rfi?.status.toLowerCase() === RFI_INPROGRESS_STATUS.toLowerCase())
      return { id: rfi?.status, type: 'error', dateAlert: true };
  };

  return (
    <Box mt={3}>
      <TableToolbar>
        <TableFilters
          search
          searchMinChars={4}
          filtersArray={filtersArray}
          clearFilterKey={resetKey}
          handlers={{
            onSearch: handlers.searchSubmit,
            onFilter: handlers.filterSearchSubmit,
            onResetFilter: handlers.resetSubmit,
          }}
        />
      </TableToolbar>
      <Overflow>
        <Table data-testid="claim-rfis-table">
          <TableHead columns={cols} sorting={sort}></TableHead>
          <TableBody>
            {utils.generic.isValidArray(rfis, true) &&
              rfis.map((rfi) => {
                const status = getStatus(rfi);
                const priorityName =
                  rfi.priority && prioritiesList.find((priority) => priority.id === rfi.priority.toString())?.description;
                return (
                  <TableRow key={rfi?.queryId} data-testid={`claim-rfis-table-row-${rfi?.queryId}`}>
                    <TableCell {...columnProps('queryId')} nowrap>
                      <Link text={rfi?.queryId} color="secondary" onClick={() => handlers.clickRfiTask(rfi)} />
                    </TableCell>
                    <TableCell {...columnProps('rfiSentTo')}>{rfi?.assigneeFullName}</TableCell>
                    <TableCell {...columnProps('queryCode')}>{rfi?.queryCodeDescription}</TableCell>
                    <TableCell {...columnProps('queryCreatedOn')} nowrap>
                      {utils.string.t('format.date', {
                        value: { date: rfi?.queryCreatedOn, format: config.ui.format.date.text },
                      })}
                    </TableCell>
                    <TableCell {...columnProps('targetDueDate')} nowrap className={getStatus(rfi)?.dateAlert ? classes.dateAlert : ''}>
                      {utils.string.t('format.date', {
                        value: { date: rfi?.targetDueDate, format: config.ui.format.date.text },
                      })}
                    </TableCell>
                    <TableCell {...columnProps('priority')}>{priorityName}</TableCell>
                    <TableCell {...columnProps('status')}>
                      <Status size="sm" text={<Translate label={status?.id} />} status={status?.type} />
                    </TableCell>
                    <TableCell {...columnProps('description')}>{rfi?.description}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Overflow>
      {pagination?.obj && pagination?.handlers && (
        <Pagination
          page={pagination.obj.page}
          count={pagination.obj.rowsTotal}
          rowsPerPage={pagination.obj.rowsPerPage}
          onChangePage={pagination.handlers.handleChangePage}
          onChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
          testid="claim-rfis"
        />
      )}
    </Box>
  );
}
