import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ReportGroupExtended.styles';
import {
  Layout,
  SectionHeader,
  TableToolbar,
  TableHead,
  TableCell,
  PopoverMenu,
  Warning,
  Pagination,
  Button,
  Tabs,
  TableFilters,
  AccessControl,
  Skeleton,
} from 'components';
import * as utils from 'utils';
import { useSort } from 'hooks';

// mui
import { makeStyles, Table, TableBody, TableRow, TableContainer, Box, Grid } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import AddIcon from '@material-ui/icons/Add';

ReportGroupExtendedView.propTypes = {
  columns: PropTypes.array.isRequired,
  reportGroupList: PropTypes.array.isRequired,
  popoverActions: PropTypes.array.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedTab: PropTypes.string.isRequired,
  pagination: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  hasCreateReportGroupPermission: PropTypes.bool.isRequired,
  isReportGroupListLoading: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    handleClickRow: PropTypes.func.isRequired,
    handleSelectTab: PropTypes.func.isRequired,
    handleCreateEditReportGroup: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    searchSubmit: PropTypes.func.isRequired,
    onSortColumn: PropTypes.func.isRequired,
  }).isRequired,
};

export function ReportGroupExtendedView({
  columns,
  reportGroupList,
  popoverActions,
  tabs,
  selectedTab,
  pagination,
  sort: sortObj,
  hasCreateReportGroupPermission,
  isReportGroupListLoading,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'ReportGroupExtended' })();

  const hasNoReportGroup = reportGroupList?.length === 0;

  const { cols, sort } = useSort(columns, sortObj, handlers.onSortColumn);

  return (
    <Layout isCentered>
      <Layout main>
        <SectionHeader title={utils.string.t('reportingExtended.title')} icon={DonutLargeIcon} testid="report-group-extended" />
        <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handlers.handleSelectTab(tabName)} />
        <TableToolbar>
          <TableFilters
            search
            searchPlaceholder={utils.string.t('reportingExtended.reportingGroup.searchPlaceholder')}
            filters
            filtersArray={[]}
            handlers={{
              onSearch: handlers.searchSubmit,
              onFilter: () => {},
              onResetFilter: () => {},
            }}
            nestedClasses={{ root: classes.tableFilters }}
          />
        </TableToolbar>

        <TableContainer>
          <Table size="small">
            <TableHead columns={cols} sorting={sort} />
            {isReportGroupListLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={cols.length}>
                    <Skeleton height={40} animation="wave" displayNumber={pagination?.rowsPerPage} />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {utils.generic.isValidArray(reportGroupList, true) &&
                  reportGroupList?.map((reportGrp) => {
                    return (
                      <TableRow key={reportGrp.id} className={classes.row} onClick={handlers.handleClickRow(reportGrp)} hover>
                        <TableCell>{reportGrp.name}</TableCell>
                        <TableCell>{reportGrp.description}</TableCell>
                        <TableCell>{reportGrp.createdByName}</TableCell>
                        <TableCell>{reportGrp.createdDate}</TableCell>
                        <TableCell>{reportGrp.count}</TableCell>
                        <AccessControl feature="reporting.editGroup" permissions={['delete', 'update']}>
                          <TableCell>
                            <PopoverMenu id="reporting-extended-menu-list" items={popoverActions} data={{ reportGrp }} />
                          </TableCell>
                        </AccessControl>
                      </TableRow>
                    );
                  })}
              </TableBody>
            )}
          </Table>
          {hasNoReportGroup && !isReportGroupListLoading && (
            <Box p={5}>
              <Warning
                text={utils.string.t('reportingExtended.reportingGroup.gridDataEmptyWarning')}
                type="info"
                align="center"
                size="large"
                icon
              />
            </Box>
          )}
        </TableContainer>

        <Grid container>
          <Grid item xs={12} sm={4} className={classes.createReportGroup}>
            {hasCreateReportGroupPermission && (
              <Box mt={2}>
                <Button
                  icon={AddIcon}
                  size="small"
                  text={utils.string.t('reportingExtended.reportingGroup.button.createReportGroup')}
                  variant="contained"
                  color="primary"
                  onClick={() => handlers.handleCreateEditReportGroup(false)}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={8} className={classes.pagination}>
            {pagination && (
              <Pagination
                page={pagination.page}
                count={pagination.rowsTotal}
                rowsPerPage={pagination.rowsPerPage}
                onChangePage={handlers.handleChangePage}
                onChangeRowsPerPage={handlers.handleChangeRowsPerPage}
              />
            )}
          </Grid>
        </Grid>
      </Layout>
    </Layout>
  );
}
