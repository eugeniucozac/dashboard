import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

//app
import styles from './TasksManagement.styles';
import * as utils from 'utils';
import {
  TableActions,
  TableFilters,
  TableToolbar,
  FormLabel,
  FormRadio,
  Button,
  FormAutocompleteMui,
  FilterChips,
  Tooltip,
} from 'components';
import { TasksProcessingTable } from 'modules';
import { useMedia } from 'hooks';

//mui
import { makeStyles, Box, Typography, Switch, Grid } from '@material-ui/core';

TasksManagementView.propTypes = {
  isTaskTeam: PropTypes.bool.isRequired,
  hasTasks: PropTypes.bool.isRequired,
  enableBulkAssign: PropTypes.bool.isRequired,
  fields: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  taskTypeValue: PropTypes.string.isRequired,
  tasks: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  tableFilterFields: PropTypes.array.isRequired,
  isFetchingFilters: PropTypes.bool.isRequired,
  isPremiumProcessing: PropTypes.bool,
  notificationRefId: PropTypes.string,
  resetKey: PropTypes.number,
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
    premiumProcessingSaveAssignee: PropTypes.func,
    resetNotificationFilters: PropTypes.func,
    toggleCheckSigning: PropTypes.func,
  }).isRequired,
  isCheckSigningValue: PropTypes.bool,
};

export function TasksManagementView({
  isTaskTeam,
  hasTasks,
  enableBulkAssign,
  fields,
  control,
  taskTypeValue,
  tasks,
  sort,
  columnsArray,
  columnProps,
  tableFilterFields,
  isFetchingFilters,
  isPremiumProcessing,
  notificationRefId,
  resetKey,
  handlers,
  isCheckSigningValue,
}) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'TasksManagement' })({ isMobile: media.mobile });

  useEffect(() => {
    if (taskTypeValue) {
      handlers.setTaskType(taskTypeValue);
    }
  }, [taskTypeValue]); // eslint-disable-line react-hooks/exhaustive-deps
  let clearNotificationLabelData = [];
  if (isPremiumProcessing && notificationRefId) {
    clearNotificationLabelData.push(`${utils.string.t('globalNotification.filterByCaseId', { id: notificationRefId })}`);
  }

  return (
    <Box mt={3} data-testid="tasks-management">
      {isPremiumProcessing && notificationRefId && (
        <Box>
          <FilterChips
            items={clearNotificationLabelData.map((l) => ({ value: l, label: l }))}
            handleRemoveItems={(item) => {
              if (item) {
                handlers.resetNotificationFilters();
              }
            }}
          />
        </Box>
      )}

      {!isPremiumProcessing ? (
        <TableToolbar>
          <TableActions>
            <Grid container>
              <Grid item>
                <FormLabel label={`${utils.string.t('app.view')}: `} align="left" nestedClasses={{ root: classes.viewLabel }} />
              </Grid>
              <Grid item>
                <FormRadio {...utils.form.getFieldProps(fields, 'taskType')} control={control} />
              </Grid>
            </Grid>
          </TableActions>
          <TableFilters
            search
            searchBy={
              <Box className={classes.filterBox}>
                <FormLabel label={`${utils.string.t('claims.searchByClaims.label')}*`} nestedClasses={{ root: classes.optionLabel }} />
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'searchType')}
                  control={control}
                  nestedClasses={{ root: classes.selectAutocomplete }}
                />
              </Box>
            }
            searchPlaceholder={!isTaskTeam ? utils.string.t('claims.searchTasks') : utils.string.t('claims.searchTeamTasks')}
            searchMinChars={4}
            nestedClasses={{ searchMaxWidth: classes.searchMaxWidth, searchLeft: classes.searchLeft }}
            columns
            filters
            isFetchingFilters={isFetchingFilters}
            filtersArray={tableFilterFields}
            clearFilterKey={resetKey}
            isPremiumProcessing={isPremiumProcessing}
            columnsArray={
              isPremiumProcessing
                ? columnsArray
                    ?.slice(1)
                    ?.filter((d) => d.label)
                    ?.sort((a, b) => a.label?.localeCompare(b.label))
                : columnsArray?.slice(1)
            }
            handlers={{
              onSearch: handlers.handleSearch,
              onResetFilter: handlers.resetFilter,
              onResetSearch: handlers.resetSearch,
              onFilter: (values) => handlers.handleSearchFilter(values),
              onToggleColumn: handlers.toggleColumn,
            }}
          />
        </TableToolbar>
      ) : (
        <TableToolbar>
          <TableActions>
            <Grid container>
              <Grid item>
                <FormLabel label={`${utils.string.t('app.view')}: `} align="left" nestedClasses={{ root: classes.viewLabel }} />
              </Grid>
              <Grid item>
                <FormRadio {...utils.form.getFieldProps(fields, 'taskType')} control={control} />
              </Grid>
            </Grid>
          </TableActions>
          <TableFilters
            search
            searchPlaceholder={utils.string.t('premiumProcessing.premiumProcessingSearchPlaceHolder')}
            searchMinChars={3}
            nestedClasses={{ searchMaxWidth: classes.searchMaxWidth, searchLeft: classes.searchLeft }}
            columns
            filters
            isFetchingFilters={isFetchingFilters}
            filtersArray={tableFilterFields}
            clearFilterKey={resetKey}
            isPremiumProcessing={isPremiumProcessing}
            columnsArray={
              isPremiumProcessing
                ? columnsArray
                    ?.slice(1)
                    ?.filter((d) => d.label)
                    ?.sort((a, b) => a.label?.localeCompare(b.label))
                : columnsArray?.slice(1)
            }
            handlers={{
              onSearch: handlers.handleSearch,
              onResetFilter: handlers.resetFilter,
              onResetSearch: handlers.resetSearch,
              onFilter: (values) => handlers.handleSearchFilter(values),
              onToggleColumn: handlers.toggleColumn,
            }}
          />
        </TableToolbar>
      )}
      {isPremiumProcessing && (
        <Box display="flex" mb={1}>
          <Box className={classes.multiSelectContainer}>
            <Typography variant="body2" className={classes.multiSelectTitle}>
              {utils.string.t('premiumProcessing.checkSigning')}
            </Typography>
            <Switch
              disabled={tasks?.isTaskGridLoading}
              className={classes.defaultSwitch}
              checked={isCheckSigningValue}
              onChange={(event) => handlers.toggleCheckSigning(event)}
            />
          </Box>
          <Box display={'flex'} justifyContent={'right'} flex={'0.5'}>
            {isPremiumProcessing && hasTasks && isTaskTeam && (
              <Tooltip
                title={!enableBulkAssign && utils.string.t('claims.processing.bulkAssign.buttonTitle')}
                placement={'top'}
                arrow={true}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={!enableBulkAssign}
                  text={utils.string.t('claims.processing.bulkAssign.button')}
                  data-testid="bulk-button"
                  onClick={handlers.handleBulkAssign}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      )}
      <TasksProcessingTable
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
        premiumProcessingSaveAssignee={handlers.premiumProcessingSaveAssignee}
        isPremiumProcessing={isPremiumProcessing}
      />

      {!isPremiumProcessing && hasTasks && (
        <Button
          color="primary"
          variant="outlined"
          disabled={!enableBulkAssign}
          text={utils.string.t('claims.processing.bulkAssign.button')}
          data-testid="bulk-button"
          onClick={handlers.handleBulkAssign}
        />
      )}
    </Box>
  );
}
