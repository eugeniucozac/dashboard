import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import styles from './TasksTab.style';
import { TableActions, TableFilters, TableToolbar, FormRadio, FormLabel, FormSelect } from 'components';
import { TasksTabTable } from 'modules';
import * as utils from 'utils';

// mui
import { makeStyles, Box } from '@material-ui/core';

TasksTabView.propTypes = {
  isTaskTeam: PropTypes.bool.isRequired,
  fields: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  taskTypeValue: PropTypes.string.isRequired,
  tasks: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  tableFilterFields: PropTypes.array.isRequired,
  isFetchingFilters: PropTypes.bool.isRequired,
  searchByTerm: PropTypes.string,
  resetKey: PropTypes.number,
  multiSelectField: PropTypes.array.isRequired,
  isMultiSelect: PropTypes.bool,
  handlers: PropTypes.shape({
    toggleColumn: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    handleSort: PropTypes.func.isRequired,
    setTaskType: PropTypes.func.isRequired,
    refreshTasksGrid: PropTypes.func.isRequired,
    handleBulkAssign: PropTypes.func.isRequired,
    handleUpdateTaskPriority: PropTypes.func,
    resetNotificationFilters: PropTypes.func,
    toggleCheckSigning: PropTypes.func,
  }).isRequired,
};

export default function TasksTabView({
  isTaskTeam,
  fields,
  control,
  taskTypeValue,
  tasks,
  sort,
  columnsArray,
  columnProps,
  tableFilterFields,
  isFetchingFilters,
  searchByTerm,
  resetKey,
  multiSelectField,
  isMultiSelect,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'TasksTab' })();

  useEffect(() => {
    if (taskTypeValue) {
      handlers.setTaskType(taskTypeValue);
    }
  }, [taskTypeValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box mt={3} data-testid="tasks-management">
      <TableToolbar>
        <TableActions nestedClasses={{ root: classes.radioContainer }}>
          <Box display="flex" alignItems="center">
            <FormLabel label={`${utils.string.t('app.view')}: `} align="left" nestedClasses={{ root: classes.viewLabel }} />
            <FormRadio {...utils.form.getFieldProps(fields, 'taskType')} control={control} />
          </Box>
        </TableActions>
        <TableFilters
          search
          searchBy={
            <Box className={classes.filterBox}>
              <FormSelect
                {...utils.form.getFieldProps(fields, 'searchBy')}
                control={control}
                nestedClasses={{ root: classes.selectAutocomplete }}
              />
            </Box>
          }
          searchByTerm={searchByTerm}
          searchPlaceholder={utils.string.t('claims.TasksTabsearch')}
          searchMinChars={3}
          searchTerm={tasks?.query}
          columns
          filters
          isFetchingFilters={isFetchingFilters}
          filtersArray={tableFilterFields}
          clearFilterKey={resetKey}
          nestedClasses={{
            root: classes.filtersContainer,
            searchBox: classes.searchBox,
          }}
          handlers={{
            onSearch: handlers.handleSearch,
            onResetFilter: handlers.resetFilter,
            onResetSearch: handlers.resetSearch,
            onFilter: (values) => handlers.handleSearchFilter(values),
            onToggleColumn: handlers.toggleColumn,
          }}
        />
      </TableToolbar>
      <TasksTabTable
        isTaskTeam={isTaskTeam}
        tasks={tasks}
        cols={columnsArray}
        columnProps={columnProps}
        handleUpdateTaskPriority={handlers.handleUpdateTaskPriority}
        sort={sort}
        handleSort={handlers.handleSort}
        handleChangePage={handlers.handleChangePage}
        handleChangeRowsPerPage={handlers.handleChangeRowsPerPage}
        refreshTasksGrid={handlers.refreshTasksGrid}
        isMultiSelect={isMultiSelect}
        control={control}
        multiSelectField={multiSelectField}
      />
    </Box>
  );
}
