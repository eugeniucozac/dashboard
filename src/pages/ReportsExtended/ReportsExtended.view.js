import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ReportsExtended.styles';
import {
  Button,
  Layout,
  PopoverMenu,
  SectionHeader,
  TableCell,
  TableHead,
  TableFilters,
  TableToolbar,
  Warning,
  Breadcrumb,
  Pagination,
  AccessControl,
  Skeleton,
} from 'components';
import * as utils from 'utils';
import { useSort } from 'hooks';

// mui
import { makeStyles, Box, TableContainer, Table, TableBody, TableRow, Grid, Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

ReportsExtendedView.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ).isRequired,
  columns: PropTypes.array.isRequired,
  reports: PropTypes.array.isRequired,
  popoverActions: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  hasCreateReportPermission: PropTypes.bool.isRequired,
  reportGroupTitle: PropTypes.string.isRequired,
  isReportListLoading: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    handleClickRow: PropTypes.func.isRequired,
    handleCreateEditReport: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    searchSubmit: PropTypes.func.isRequired,
    onSortColumn: PropTypes.func.isRequired,
  }).isRequired,
};

export function ReportsExtendedView({
  breadcrumbs,
  columns,
  reports,
  popoverActions,
  pagination,
  sort: sortObj,
  hasCreateReportPermission,
  reportGroupTitle,
  isReportListLoading,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'ReportExtended' })();

  const hasNoReport = reports?.length === 0;

  const { cols, sort } = useSort(columns, sortObj, handlers.onSortColumn);

  return (
    <>
      <Breadcrumb links={breadcrumbs} />
      <Divider />
      <Layout isCentered>
        <Layout main>
          <SectionHeader title={reportGroupTitle} testid="report-extended" />
          <TableToolbar>
            <TableFilters
              search
              searchPlaceholder={utils.string.t('reportingExtended.reporting.searchPlaceholder')}
              filters
              filtersArray={[]}
              handlers={{
                onSearch: handlers.searchSubmit,
                onFilter: () => {},
                onResetFilter: () => {},
              }}
            />
          </TableToolbar>
          <TableContainer>
            <Table size="small">
              <TableHead columns={cols} sorting={sort} />
              {isReportListLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={cols.length}>
                      <Skeleton height={40} animation="wave" displayNumber={pagination?.rowsPerPage} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {utils.generic.isValidArray(reports, true) &&
                    reports?.map((report) => (
                      <TableRow key={report.id} className={classes.row} onClick={handlers.handleClickRow(report)} hover>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{report.description}</TableCell>
                        <TableCell>{report.createdByName}</TableCell>
                        <TableCell>{report.createdDate}</TableCell>
                        <AccessControl feature="reporting.editReport" permissions={['delete', 'update']}>
                          <TableCell>
                            <PopoverMenu id="reporting-extended-menu-list" items={popoverActions} data={{ report }} />
                          </TableCell>
                        </AccessControl>
                      </TableRow>
                    ))}
                </TableBody>
              )}
            </Table>
            {hasNoReport && !isReportListLoading && (
              <Box p={5}>
                <Warning
                  text={utils.string.t('reportingExtended.reporting.gridDataEmptyWarning')}
                  type="info"
                  align="center"
                  size="large"
                  icon
                />
              </Box>
            )}
          </TableContainer>

          <Grid container>
            <Grid item xs={12} sm={4} className={classes.createReport}>
              {hasCreateReportPermission && (
                <Box mt={2}>
                  <Button
                    icon={AddIcon}
                    size="small"
                    text={utils.string.t('reportingExtended.reporting.button.createReport')}
                    variant="contained"
                    color="primary"
                    onClick={() => handlers.handleCreateEditReport(false)}
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
    </>
  );
}
