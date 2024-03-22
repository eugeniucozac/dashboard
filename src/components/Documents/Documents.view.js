import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './Documents.styles';
import { PopoverMenu, Restricted, TableCell, TableHead, Avatar, Tooltip } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';
import config from 'config';
import { useMedia } from 'hooks';

// mui
import { makeStyles, Table, TableBody, TableRow, Typography, Grid, Box } from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination';

DocumentsView.propTypes = {
  folders: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  documentGroups: PropTypes.object.isRequired,
  handleDownloadDocument: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
  showDelete: PropTypes.bool,
  isReportingDoc: PropTypes.bool.isRequired,
  showPagination: PropTypes.bool,
};

export function DocumentsView({
  folders,
  cols,
  documentGroups,
  handleDownloadDocument,
  handleDeleteClick,
  inlineComponent,
  showDelete,
  isReportingDoc,
  showPagination,
}) {
  const classes = makeStyles(styles, { name: 'Documents' })();
  const media = useMedia();
  const { pagination } = config?.ui;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <>
      <Table>
        {!inlineComponent && <TableHead columns={cols} sorting={{ by: 'filename', type: 'text', direction: 'asc' }} />}
        {folders && folders.length > 0 && (
          <TableBody>
            {Object.keys(documentGroups)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((k) => {
                const docs = documentGroups[k].documents;
                const label = documentGroups[k].label;

                return docs.map((d, i) => {
                  return (
                    <TableRow key={`${k}-${d.id}`} className={classnames({ [classes.inlineComponentRow]: inlineComponent })}>
                      {i === 0 && !inlineComponent ? (
                        <TableCell rowSpan={docs.length}>
                          <Typography variant="h5" className={classes.folder}>
                            {label}
                          </Typography>
                        </TableCell>
                      ) : null}
                      <TableCell className={classnames({ [classes.filenameCell]: true, [classes.inlineComponentCell]: inlineComponent })}>
                        <Typography
                          variant="h5"
                          className={classnames(classes.filename, { [classes.inlineComponentText]: inlineComponent })}
                          onClick={() => {
                            handleDownloadDocument(d);
                          }}
                        >
                          {d.fileName}
                        </Typography>
                      </TableCell>
                      {isReportingDoc ? (
                        <>
                          <TableCell>
                            <Box className={classes.avatar}>
                              <Tooltip title={d?.uploaderFullName} placement="top">
                                <Avatar
                                  text={d?.uploaderFullName
                                    ?.match(/(\b\S)?/g)
                                    .join('')
                                    .match(/(^\S|\S$)?/g)
                                    .join('')
                                    .toUpperCase()}
                                  size={media.wideUp ? 30 : 25}
                                />
                              </Tooltip>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography variant="h5">
                              {utils.string.t('format.date', {
                                value: { date: d.createdAt, format: config.ui.format.date.text },
                              })}
                            </Typography>
                          </TableCell>
                        </>
                      ) : null}
                      <TableCell menu className={classnames({ [classes.inlineComponentCell]: inlineComponent })}>
                        <Restricted include={[constants.ROLE_BROKER]}>
                          <PopoverMenu
                            id="document"
                            data={{
                              item: d,
                            }}
                            items={[
                              {
                                id: 'downloadDocument',
                                label: utils.string.t('app.download'),
                                callback: () => {
                                  handleDownloadDocument(d);
                                },
                              },
                              {
                                id: 'deleteDocument',
                                label: utils.string.t('app.delete'),
                                callback: () => {
                                  handleDeleteClick(d);
                                },
                                hidden: !showDelete,
                              },
                            ]}
                          />
                        </Restricted>
                      </TableCell>
                    </TableRow>
                  );
                });
              })}
          </TableBody>
        )}
      </Table>
      {showPagination ? (
        <Grid item xs={12} sm={8} style={{ marginLeft: 'auto' }}>
          <TablePagination
            rowsPerPageOptions={pagination.options}
            component="div"
            count={Object.keys(documentGroups).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      ) : null}
    </>
  );
}
