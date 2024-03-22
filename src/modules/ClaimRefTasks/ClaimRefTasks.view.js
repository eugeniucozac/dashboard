import React from 'react';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import { Button, TableFilters, TableToolbar } from 'components';
import { ClaimRefTasksTable } from 'modules';
import styles from './ClaimRefTasks.styles';

//mui
import { makeStyles, Box } from '@material-ui/core';

ClaimRefTasksView.propTypes = {
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  tasks: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  hasTasks: PropTypes.bool.isRequired,
  enableBulkAssign: PropTypes.bool.isRequired,
  tableFilterFields: PropTypes.array.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  handlers: PropTypes.shape({
    onResetFilter: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    handleSort: PropTypes.func.isRequired,
    selectTask: PropTypes.func.isRequired,
    handleBulkAssign: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ClaimRefTasksView({
  columnsArray,
  columnProps,
  tasks,
  sort,
  hasTasks,
  enableBulkAssign,
  toggleColumn,
  resetKey,
  tableFilterFields,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'ClaimRefTasks' })();

  return (
    <Box mt={3}>
      <TableToolbar>
        <TableFilters
          search
          searchPlaceholder={utils.string.t('claims.searchTasksTab')}
          searchMinChars={4}
          nestedClasses={{ searchMaxWidth: classes.searchMaxWidth, searchLeft: classes.searchLeft }}
          columns
          filters
          filtersArray={tableFilterFields}
          columnsArray={columnsArray.slice(1)}
          clearFilterKey={resetKey}
          handlers={{
            onSearch: handlers.handleSearch,
            onResetSearch: handlers.onResetSearch,
            onResetFilter: handlers.onResetFilter,
            onFilter: (values) => handlers.handleSearchFilter(values),
            onToggleColumn: toggleColumn,
          }}
        />
      </TableToolbar>

      <ClaimRefTasksTable
        tasks={tasks}
        cols={columnsArray}
        columnProps={columnProps}
        sort={sort}
        handlers={{
          handleSort: handlers.handleSort,
          handleChangePage: handlers.handleChangePage,
          handleChangeRowsPerPage: handlers.handleChangeRowsPerPage,
          selectTask: handlers.selectTask,
        }}
      />

      {hasTasks && (
        <Button
          color="primary"
          variant="outlined"
          disabled={!enableBulkAssign}
          text={utils.string.t('claims.processing.bulkAssign.button')}
          onClick={handlers.handleBulkAssign}
        />
      )}
    </Box>
  );
}
