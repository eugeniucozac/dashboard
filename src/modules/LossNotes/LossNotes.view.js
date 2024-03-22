import React from 'react';
import PropTypes from 'prop-types';

// app
import { Button, Empty, Overflow, Pagination, TableActions, TableCell, TableFilters, TableHead, TableToolbar } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import * as utils from 'utils';
import config from 'config';

// mui
import { Box, Table, TableBody, TableRow } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

LossNotesView.propTypes = {
  notes: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  filtersArray: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.object.isRequired,
  }).isRequired,
  resetKey: PropTypes.number,
  handlers: PropTypes.shape({
    addNote: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    searchSubmit: PropTypes.func.isRequired,
    resetSubmit: PropTypes.func.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
  }).isRequired,
};

export default function LossNotesView({ notes, cols, columnProps, filtersArray, sort, pagination, handlers, resetKey }) {
  const hasNotes = notes?.length > 0;

  return (
    <Box mt={3}>
      <TableToolbar>
        <TableActions>
          <Button
            icon={AddIcon}
            color="primary"
            variant="contained"
            size="small"
            text={utils.string.t('claims.notes.addNote')}
            onClick={handlers.addNote}
          />
        </TableActions>
        {hasNotes && (
          <TableFilters
            search
            searchMinChars={4}
            filtersArray={filtersArray}
            clearFilterKey={resetKey}
            handlers={{
              onSearch: handlers.searchSubmit,
              onResetFilter: handlers.resetSubmit,
              onFilter: handlers.handleSearchFilter,
            }}
          />
        )}
      </TableToolbar>
      <Overflow>
        <Table data-testid="claim-notes-table">
          <TableHead columns={cols} sorting={sort}></TableHead>
          <TableBody>
            {hasNotes &&
              notes.map((note) => {
                return (
                  <TableRow key={note.caseIncidentNotesID} data-testid={`claim-notes-table-row-${note.caseIncidentNotesID}`}>
                    <TableCell {...columnProps('createdDate')} nowrap>
                      {utils.string.t('format.date', {
                        value: { date: note.createdDate, format: config.ui.format.date.textTime },
                      })}
                    </TableCell>
                    <TableCell {...columnProps('createdByName')}>{note.createdByName}</TableCell>
                    <TableCell {...columnProps('noteDetails')}>{note.notesDescription}</TableCell>
                    <TableCell {...columnProps('updatedDate')} nowrap>
                      {utils.string.t('format.date', {
                        value: { date: note.updatedDate, format: config.ui.format.date.textTime },
                      })}
                    </TableCell>
                    <TableCell {...columnProps('updatedByName')}>{note.updatedByName}</TableCell>
                    <TableCell {...columnProps('menu')}>
                      <Button
                        icon={EditIcon}
                        onClick={() => handlers.editNote(note)}
                        size="xsmall"
                        tooltip={{ title: utils.string.t('app.update') }}
                        variant="text"
                        color="default"
                        light
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Overflow>

      {!hasNotes && <Empty title={utils.string.t('claims.notes.notFound')} icon={<IconSearchFile />} padding />}

      {hasNotes && pagination?.obj && pagination?.handlers && (
        <Pagination
          page={pagination.obj.page}
          count={pagination.obj.rowsTotal}
          rowsPerPage={pagination.obj.rowsPerPage}
          onChangePage={pagination.handlers.handleChangePage}
          onChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
          testid="claim-notes"
        />
      )}
    </Box>
  );
}
