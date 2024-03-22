import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// app
import { Layout, Overflow, SectionHeader, TableCell, TableHead, Button, PopoverMenu, Pagination, Empty } from 'components';
import * as utils from 'utils';
import styles from './Reporting.styles';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';

// mui
import { makeStyles, Table, TableRow, TableBody, Grid, Box } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import AddIcon from '@material-ui/icons/Add';

ReportingView.propTypes = {
  list: PropTypes.array.isRequired,
  handleClickRow: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number,
  }).isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  isReportAdmin: PropTypes.bool.isRequired,
  sort: PropTypes.shape({
    by: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }),
};

export function ReportingView({
  list,
  handleClickRow,
  handleEdit,
  handleDelete,
  pagination,
  handleChangePage,
  handleChangeRowsPerPage,
  isReportAdmin,
  sort,
}) {
  const classes = makeStyles(styles, { name: 'ReportingGroup' })();
  const cols = [
    { id: 'name', label: utils.string.t('app.reportingGroup') },
    { id: 'description', label: utils.string.t('app.description') },
    { id: 'count', label: utils.string.t('app.count') },
  ];
  return (
    <Layout isCentered testid="reporting">
      <Layout main>
        <SectionHeader title={utils.string.t('reporting.title')} icon={DonutLargeIcon} testid="reporting_header"></SectionHeader>
        <Overflow>
          {list && (list.length > 0 || isReportAdmin) ? (
            <Table size="small">
              <TableHead columns={cols} sorting={sort} />
              <TableBody data-testid="reporting-list">
                {list.map((repoGrp) => {
                  return (
                    <Fragment key={`reporting-table-row-${repoGrp.id}`}>
                      <TableRow className={classes.row} onClick={handleClickRow(repoGrp)} hover data-testid={`reporting-row-${repoGrp.id}`}>
                        <TableCell nestedClasses={{ root: classes.idCell }} data-testid={`reporting-reportingGroup-${repoGrp.id}`}>
                          {repoGrp.name}
                        </TableCell>
                        <TableCell data-testid={`reporting-reportingGroup-${repoGrp.id}`}>{repoGrp.description}</TableCell>
                        <TableCell nestedClasses={{ root: classes.dateCell }} data-testid={`reporting-count-${repoGrp.id}`}>
                          {repoGrp.count}
                        </TableCell>
                        {isReportAdmin && (
                          <TableCell nestedClasses={{ root: classes.dataCellLast }} menu data-testid="reporting-isReportAdmin">
                            <PopoverMenu
                              id="renewal-list"
                              data={{
                                id: repoGrp.id,
                                name: repoGrp.name,
                                description: repoGrp.description,
                              }}
                              items={[
                                {
                                  id: 'edit',
                                  label: 'app.edit',
                                  callback: (e) => handleEdit(true, repoGrp),
                                },
                                {
                                  id: 'delete',
                                  label: 'app.delete',
                                  callback: handleDelete,
                                },
                              ]}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Fragment>
              {!isReportAdmin && (
                <Empty
                  title={utils.string.t('reporting.noAccess')}
                  text={utils.string.t('reporting.noAccessHint')}
                  icon={<IconSearchFile />}
                  padding
                />
              )}
            </Fragment>
          )}
        </Overflow>

        <Grid container>
          {isReportAdmin && (
            <Grid item xs={12} sm={4} className={classes.addButton}>
              <Box mt={2}>
                <Button
                  icon={AddIcon}
                  size="small"
                  text={utils.string.t('app.reportGroup')}
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleEdit(false)}
                />
              </Box>
            </Grid>
          )}
          {list && (list.length > 0 || isReportAdmin) ? (
            <Grid item xs={12} sm={8}>
              <Pagination
                page={pagination.page}
                count={pagination.rowsTotal}
                rowsPerPage={pagination.rowsPerPage}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Grid>
          ) : null}
        </Grid>
      </Layout>
    </Layout>
  );
}
