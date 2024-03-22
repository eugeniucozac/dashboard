import React, { useState } from 'react';
import PropTypes from 'prop-types';

// app
import { Layout, Overflow, SectionHeader, TableCell, TableHead, Breadcrumb, PopoverMenu, Button, Translate, Documents } from 'components';
import * as utils from 'utils';
import styles from './ReportingGroup.styles';
import { ReportingGroupUser } from 'modules';
import config from 'config';

// mui
import { makeStyles, Table, TableRow, TableBody, Divider, Grid, Box, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DescriptionIcon from '@material-ui/icons/Description';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TablePagination from '@material-ui/core/TablePagination';
import AssessmentIcon from '@material-ui/icons/Assessment';

ReportingGroupView.propTypes = {
  groupTitle: PropTypes.string,
  groupId: PropTypes.string,
  list: PropTypes.array.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ).isRequired,
  handleClickRow: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  loader: PropTypes.array,
  isReportAdmin: PropTypes.bool.isRequired,
  uploadNew: PropTypes.func.isRequired,
  documents: PropTypes.array,
  folders: PropTypes.array,
};

export function ReportingGroupView({
  groupTitle,
  groupId,
  list,
  breadcrumbs,
  handleClickRow,
  handleAdd,
  handleEdit,
  handleDelete,
  isReportAdmin,
  uploadNew,
  documents,
  folders,
}) {
  const classes = makeStyles(styles, { name: 'ReportingGroup' })();
  const { pagination } = config?.ui;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pagination.defaultMobile);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const cols = [
    { id: 'title', label: utils.string.t('reportingReport.title') },
    { id: 'description', label: utils.string.t('reportingReport.description') },
  ];

  return (
    <>
      <Breadcrumb links={breadcrumbs} />
      <Divider />

      <Layout testid="reporting">
        <Layout main>
          <SectionHeader title={groupTitle} testid="reportingGroup_header"></SectionHeader>
          <Box marginBottom="1px" display="flex" alignItems="center" maxWidth="100%">
            <Box className={classes.icon}>
              <AssessmentIcon />
            </Box>
            <Typography variant="h2" color="textSecondary">
              {utils.string.t('products.reports')}
            </Typography>
          </Box>
          <Divider />
          <Overflow>
            <Table size="small">
              <TableHead columns={cols} />
              <TableBody data-testid="reporting-list">
                {list &&
                  list.length > 0 &&
                  list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report) => {
                    return (
                      <TableRow
                        key={report.id}
                        className={classes.row}
                        onClick={handleClickRow(report)}
                        hover
                        data-testid={`reporting-row-${report.id}`}
                      >
                        <TableCell data-testid={`reporting-title-${report.id}`} className={classes.cellName}>
                          {report.title}
                        </TableCell>
                        <TableCell data-testid={`reporting-description-${report.id}`}>{report.description}</TableCell>
                        {isReportAdmin && (
                          <TableCell nestedClasses={{ root: classes.dataCellLast }} menu data-testid="reporting-isReportAdmin">
                            <PopoverMenu
                              id="renewal-list"
                              data={{
                                id: report.id,
                                title: report.title,
                              }}
                              items={[
                                {
                                  id: 'edit',
                                  label: 'app.edit',
                                  callback: (e) => handleEdit(report),
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
                    );
                  })}
              </TableBody>
            </Table>
          </Overflow>
          <Grid container>
            {isReportAdmin && (
              <Grid item xs={12} sm={4}>
                <Box mt={2}>
                  <Button
                    icon={AddIcon}
                    size="small"
                    text={utils.string.t('app.report')}
                    variant="contained"
                    color="primary"
                    onClick={handleAdd}
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={8}>
              <TablePagination
                rowsPerPageOptions={pagination.options}
                component="div"
                count={list.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
            <Grid item xs={12} sm={12} style={{ marginTop: '50px' }}>
              <Box marginBottom="1px" display="flex" alignItems="center" maxWidth="100%">
                <Box className={classes.icon}>
                  <DescriptionIcon />
                </Box>
                <Typography variant="h2" color="textSecondary">
                  {utils.string.t('placement.document.title')}
                </Typography>
              </Box>
              <Divider />
              <Table size="small">
                <TableBody>
                  <TableRow className={classes.row}>
                    <TableCell padding="none" data-testid="reporting-dcouments">
                      {documents?.length > 0 ? (
                        <Documents
                          documents={documents}
                          folders={folders}
                          showDelete={isReportAdmin}
                          isReportingDoc={true}
                          showPagination
                        />
                      ) : (
                        <Box mt={5} className={classes.noDocuments}>
                          <Translate label="app.noDocuments" />
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>
          {isReportAdmin && (
            <Grid item xs={12} sm={4}>
              <Box mt={2} className={classes.uploadButton}>
                <Button
                  icon={CloudUploadIcon}
                  iconWide={true}
                  color="primary"
                  variant="outlined"
                  text={<Translate label="app.upload" />}
                  onClick={uploadNew}
                  size="small"
                />
              </Box>
            </Grid>
          )}
        </Layout>
        {isReportAdmin && (
          <Layout sidebar padding={false}>
            <ReportingGroupUser groupTitle={groupTitle} groupId={groupId} />
          </Layout>
        )}
      </Layout>
    </>
  );
}
