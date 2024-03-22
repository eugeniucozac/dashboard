import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DocumentTable.styles';
import { TableCell, Documents, Translate } from 'components';

// mui
import { TableRow, makeStyles } from '@material-ui/core';

DocumentTableView.propTypes = {
  documents: PropTypes.array.isRequired,
  folders: PropTypes.array.isRequired,
  handleUploadDocument: PropTypes.func,
};

export function DocumentTableView({ folders, documents }) {
  const classes = makeStyles(styles, { name: 'DocumentTable' })();
  return (
    <TableRow className={classes.tableRow}>
      <TableCell padding="none" data-testid={`document-upload-cell`} colSpan={6}>
        {documents.length > 0 ? (
          <Documents documents={documents} folders={folders} inlineComponent={true} />
        ) : (
          <div className={classes.noDocuments}>
            <Translate label="app.noDocuments" />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
