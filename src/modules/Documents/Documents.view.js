import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Documents.styles';
import { Button, Translate, SectionHeader, Documents } from 'components';

// mui
import { makeStyles } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DescriptionIcon from '@material-ui/icons/Description';

DocumentsView.propTypes = {
  folders: PropTypes.array.isRequired,
  documents: PropTypes.array.isRequired,
  uploadNew: PropTypes.func.isRequired,
};

export function DocumentsView({ uploadNew, folders, documents }) {
  const classes = makeStyles(styles, { name: 'Documents' })();
  return (
    <>
      <SectionHeader title={<Translate label="placement.document.title" />} icon={DescriptionIcon} testid="placement-documents">
        <Button
          icon={CloudUploadIcon}
          iconWide={true}
          color="primary"
          variant="outlined"
          text={<Translate label="app.upload" />}
          onClick={uploadNew}
          nestedClasses={{
            btn: classes.button,
          }}
        />
      </SectionHeader>
      <Documents folders={folders} documents={documents} />
    </>
  );
}
