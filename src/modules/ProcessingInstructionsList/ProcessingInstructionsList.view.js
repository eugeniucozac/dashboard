import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';

//app
import styles from './ProcessingInstructionsList.styles';
import {
  AccessControl,
  Pagination,
  TableHead,
  TableCell,
  Warning,
  TableFilters,
  TableToolbar,
  TableActions,
  Status,
  Translate,
  Button,
  Skeleton,
} from 'components';
import { usePagination, useSort } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { Box, Grid, Table, TableBody, TableRow, Hidden, makeStyles, TableContainer, Typography, Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

ProcessingInstructionsListView.propTypes = {
  rows: PropTypes.array.isRequired,
  processTypes: PropTypes.arrayOf(
    PropTypes.shape({
      processTypeID: PropTypes.number.isRequired,
      processTypeDetails: PropTypes.string.isRequired,
    })
  ).isRequired,
  refDataXbInstances: PropTypes.arrayOf(
    PropTypes.shape({
      sourceID: PropTypes.number.isRequired,
      sourceName: PropTypes.string.isRequired,
    })
  ).isRequired,
  departmentList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  sort: PropTypes.shape({
    by: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
    type: PropTypes.oneOf(['lexical', 'date', 'number']).isRequired,
  }).isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  }).isRequired,
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  filtersArray: PropTypes.array.isRequired,
  isTableHidden: PropTypes.bool.isRequired,
  isPiGridDataLoading: PropTypes.bool.isRequired,
  isPiHasNoGridData: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    handleSort: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    handleProcessSelection: PropTypes.func.isRequired,
    searchSubmit: PropTypes.func.isRequired,
    toggleColumn: PropTypes.func.isRequired,
  }).isRequired,
};

export function ProcessingInstructionsListView({
  rows,
  processTypes,
  refDataXbInstances,
  departmentList,
  sort: sortObj,
  pagination,
  columnsArray,
  columnProps,
  filtersArray,
  isTableHidden,
  isPiGridDataLoading,
  isPiHasNoGridData,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'ProcessingInstructionsList' })();
  const paginationObj = usePagination(rows, pagination, handlers.handleChangePage, handlers.handleChangeRowsPerPage);
  const { cols, sort } = useSort(columnsArray, sortObj, handlers.handleSort);
  const getStatus = (statusId) => {
    if (utils.processingInstructions.status.isDraft(statusId)) {
      return { type: 'info', id: `processingInstructions.status.${constants.PI_STATUS_DRAFT}` };
    } else if (utils.processingInstructions.status.isRejectedDraft(statusId)) {
      return { type: 'error', id: `processingInstructions.status.${constants.PI_STATUS_REJECTED_DRAFT}` };
    } else if (utils.processingInstructions.status.isSubmittedAuthorisedSignatory(statusId)) {
      return { type: 'alert', id: `processingInstructions.status.${constants.PI_STATUS_SUBMITTED_AUTHORISED_SIGNATORY}` };
    } else if (utils.processingInstructions.status.isSubmittedProcessing(statusId)) {
      return { type: 'success', id: `processingInstructions.status.${constants.PI_STATUS_SUBMITTED_PROCESSING}` };
    } else if (utils.processingInstructions.status.isReopened(statusId)) {
      return { type: 'reopen', id: `processingInstructions.status.${constants.PI_STATUS_DRAFT_POST_SUBMISSION}` };
    } else {
      return { type: '', name: 'status.other' };
    }
  };

  const getProcessTypeName = (processTypeId) => {
    return processTypes.find((processType) => processType?.processTypeID?.toString() === processTypeId?.toString())?.processTypeDetails;
  };

  const getXbInstanceName = (xbInstanceId) => {
    return refDataXbInstances.find((xbInstance) => xbInstance?.sourceID?.toString() === xbInstanceId?.toString())?.sourceName;
  };

  const getDepartmentName = (departmentId) => {
    return departmentList.find((dept) => dept?.id?.toString() === departmentId?.toString())?.deptName;
  };

  return (
    <Box data-testid="processing-instructions-search-table">
      <TableToolbar nestedClasses={{ root: classes.toolbar }}>
        <AccessControl feature="processingInstructions.processingInstructions" permissions="create">
          <Box display="flex" flexDirection="column" width="100%">
            <Box>
              <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.chooseProcess')}</Typography>
              <Divider />
            </Box>
            <Box pt={1} pb={3}>
              <TableActions nestedClasses={{ root: classes.actions }}>
                {utils.generic.isValidArray(processTypes, true) ? (
                  <div className={classes.chips}>
                    {processTypes
                      .filter((type) => type?.primary && type?.businessProcessID === constants.BUSINESS_PROCESS_PREMIUM_PROCESSING_ID)
                      .map((type) => (
                        <Button
                          icon={AddIcon}
                          key={type.processTypeID}
                          text={utils.string.t(`processingInstructions.type.${type.processTypeID}`)}
                          color={'primary'}
                          size="small"
                          onClick={() => handlers.handleProcessSelection(type)}
                        />
                      ))}
                  </div>
                ) : (
                  <Skeleton height={40} animation="wave" displayNumber={1} />
                )}
              </TableActions>
            </Box>
          </Box>
        </AccessControl>

        <Hidden>
          <Box className={classes.tableTitle}>
            <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.listOfPisCreated')}</Typography>
          </Box>
        </Hidden>
        <TableFilters
          searchPlaceholder={utils.string.t('processingInstructions.searchRiskReferences')}
          columns
          columnsArray={cols}
          filters
          filtersArray={filtersArray}
          handlers={{
            onSearch: handlers.searchSubmit,
            onFilter: handlers.searchSubmit,
            onResetFilter: handlers.resetSubmit,
            onToggleColumn: handlers.toggleColumn,
          }}
          nestedClasses={{ root: classes.filters }}
        />
      </TableToolbar>

      <Hidden only={['sm', 'md', 'lg']} xsUp>
        <Box py={1} className={classes.tableTitle}>
          <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.listOfPisCreated')}</Typography>
        </Box>
      </Hidden>
      <Divider />

      <AccessControl feature="processingInstructions.processingInstructions" permissions="read">
        {!isTableHidden && (
          <TableContainer>
            <Table size="small" data-testid="processing-instructions-grid">
              <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
              <TableBody>
                {rows?.length > 0 &&
                  !isPiGridDataLoading &&
                  rows.map((data) => {
                    const status = getStatus(data.statusId);
                    const processTypeName = getProcessTypeName(data.processTypeId);
                    const xbInstanceName = getXbInstanceName(data.sourceID);
                    const departmentName = getDepartmentName(data.departmentXbInstanceId);

                    return (
                      <TableRow key={data.instructionId}>
                        <TableCell {...columnProps('instructionId')}>
                          <Link to={`${config.routes.processingInstructions.steps}/${data.instructionId}`} className={classes.link}>
                            {`PI${data.instructionId}`}
                          </Link>
                        </TableCell>
                        <TableCell {...columnProps('status')}>
                          <Status size="sm" text={<Translate label={status.id} />} status={status.type} />
                        </TableCell>
                        <TableCell {...columnProps('insuredName')}>{data.insuredName}</TableCell>
                        <TableCell {...columnProps('inceptionDate')}>{data.inceptionDate}</TableCell>
                        <TableCell {...columnProps('createdByDept')}>{departmentName}</TableCell>
                        <TableCell {...columnProps('gxbInstance')}>{xbInstanceName}</TableCell>
                        <TableCell {...columnProps('processType')}>{processTypeName}</TableCell>
                        <TableCell {...columnProps('frontEndContact')}>{data.frontEndContact}</TableCell>
                        <TableCell {...columnProps('createdDate')}>{data.createdDate}</TableCell>
                        <AccessControl feature="processingInstructions.processingInstructions" permissions={['create', 'update']}>
                          <TableCell {...columnProps('update')} compact narrow center>
                            {utils.processingInstructions.status.isSubmittedProcessing(data.statusId) && (
                              <Button
                                icon={EditIcon}
                                onClick={() => {
                                  handlers.editPopup(data.instructionId);
                                }}
                                size="xsmall"
                                tooltip={{ title: utils.string.t('app.update') }}
                                variant="text"
                                color="default"
                                light
                              />
                            )}
                          </TableCell>
                        </AccessControl>
                      </TableRow>
                    );
                  })}
                {isPiGridDataLoading && !isPiHasNoGridData && (
                  <TableRow>
                    <TableCell colSpan={cols.length}>
                      <Skeleton height={40} animation="wave" displayNumber={10} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {rows?.length === 0 && isPiHasNoGridData && (
              <Box p={5}>
                <Warning
                  text={utils.string.t('processingInstructions.gridDataEmptyWarning')}
                  type="info"
                  align="center"
                  size="large"
                  icon
                />
              </Box>
            )}
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
          </TableContainer>
        )}
      </AccessControl>
    </Box>
  );
}
