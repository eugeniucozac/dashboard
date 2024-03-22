import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DmsVersionHistory.styles';
import { Info, Overflow, TableHead, TableCell } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Typography, Table, TableBody, TableRow, Box } from '@material-ui/core';
import CloudDownloadOutlined from '@material-ui/icons/CloudDownloadOutlined';

DmsVersionHistoryView.propTypes = {
  columns: PropTypes.array.isRequired,
  filename: PropTypes.string.isRequired,
  versions: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    documentsDownload: PropTypes.func.isRequired,
  }).isRequired,
};

export function DmsVersionHistoryView({ columns, filename, versions, handlers }) {
  const classes = makeStyles(styles, { name: 'DmsVersionHistory' })();

  return (
    <Box className={classes.root}>
      <Box pl={0.25} mb={1}>
        <Info title={utils.string.t('dms.view.versionHistory.fileName')} description={filename} />
      </Box>
      <Overflow>
        <Table size="small">
          <TableHead columns={columns} />
          <TableBody>
            {utils.generic.isValidArray(versions) &&
              versions.map((version, index) => {
                return (
                  <TableRow key={version.id}>
                    <TableCell>
                      <Box display="flex">
                        <Typography>
                          {utils.string.t(index === 0 ? 'dms.view.versionHistory.versionCurrent' : 'dms.view.versionHistory.version', {
                            version: version.documentVersion,
                          })}
                        </Typography>
                        {index === 0 && <CloudDownloadOutlined className={classes.icon} onClick={() => handlers.documentsDownload()} />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {version.UserName && <Typography>{version.UserName}</Typography>}
                      {version.createdDate && (
                        <Typography className={classes.date}>
                          {utils.string.t('format.date', {
                            value: { date: version.createdDate },
                          })}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Overflow>
    </Box>
  );
}
