import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DmsUploadFiles.styles';
import { DmsUploadFilesRow, DmsUploadMetaData } from 'forms';
import { Button, FormContainer, FormActions, FormFields, TableHead, FormAutocompleteMui, FormLabel } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Typography, Box, Table, TableBody } from '@material-ui/core';

DmsUploadFilesView.propTypes = {
  context: PropTypes.string,
  files: PropTypes.array,
  duplicateFileIndexes: PropTypes.array,
  cols: PropTypes.array,
  currencies: PropTypes.array,
  folderTypes: PropTypes.array,
  documentTypes: PropTypes.array,
  isMetaDataLoaded: PropTypes.bool,
  showDocTypeRequired: PropTypes.bool,
  canSubmit: PropTypes.bool,
  filesSubmitted: PropTypes.bool,
  isUploading: PropTypes.bool,
  uploadStatus: PropTypes.array,
  showFolderFilter: PropTypes.bool,
  postUploadMetaData: PropTypes.array,
  resetDocTypeRequired: PropTypes.func,
  handlers: PropTypes.shape({
    handleFolderTypeSelection: PropTypes.func,
    handleRemoveFiles: PropTypes.func,
    handleTableForm: PropTypes.func,
    handleFilesSubmission: PropTypes.func,
    handleRetrySingleFile: PropTypes.func,
  }),
};

export function DmsUploadFilesView({
  context,
  files,
  duplicateFileIndexes,
  cols,
  currencies,
  folderTypes,
  documentTypes,
  isMetaDataLoaded,
  showDocTypeRequired,
  canSubmit,
  filesSubmitted,
  isUploading,
  uploadStatus,
  showFolderFilter,
  postUploadMetaData,
  resetDocTypeRequired,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'DmsUploadFiles' })();

  const { handleFolderTypeSelection, handleRemoveFiles, handleTableForm, handleFilesSubmission, handleRetrySingleFile, handleCancel } =
    handlers;

  return (
    <FormContainer type="dialog" onSubmit={handleFilesSubmission}>
      <FormFields type="dialog">
        {showFolderFilter && (
          <Box mx={1}>
            <FormLabel className={classes.selectText} label={utils.string.t('dms.upload.modalItems.selectFolder')} />
            <Box className={classes.formAuto}>
              <FormAutocompleteMui
                name="selectFolder"
                options={folderTypes}
                defaultValue={null}
                optionKey="id"
                optionLabel="label"
                callback={(event, value) => handleFolderTypeSelection(event, value)}
              />
            </Box>
          </Box>
        )}

        <Box mx={1}>
          <Typography className={classes.subTitle}>{`${files?.length} ${utils.string.t('dms.upload.modalItems.uploads')}`}</Typography>
        </Box>

        <Table>
          <TableHead columns={cols} />
          <TableBody>
            {utils.generic.isValidArray(files, true) &&
              files?.map((file, index) => {
                return (
                  <Fragment key={utils.dms.getFileKey(file)}>
                    <DmsUploadFilesRow
                      index={index}
                      file={file}
                      duplicateFileIndexes={duplicateFileIndexes}
                      filesSubmitted={filesSubmitted}
                      currencies={currencies}
                      documentTypes={documentTypes}
                      showDocTypeRequired={showDocTypeRequired}
                      isUploading={isUploading}
                      uploadStatus={uploadStatus[index]}
                      resetDocTypeRequired={resetDocTypeRequired}
                      handlers={{
                        removeFiles: handleRemoveFiles,
                        updateTableForm: handleTableForm,
                        retrySingleFile: handleRetrySingleFile,
                      }}
                    />
                  </Fragment>
                );
              })}
          </TableBody>
        </Table>
        <DmsUploadMetaData dmsContext={context} filesSubmitted={filesSubmitted} postUploadMetaData={postUploadMetaData} />
      </FormFields>
      <FormActions type="dialog">
        <Button text={utils.string.t('dms.upload.modalItems.cancel')} variant="text" onClick={handleCancel} />
        <Button
          text={utils.string.t('dms.upload.modalItems.saveUpload')}
          type="submit"
          color="primary"
          disabled={!isMetaDataLoaded || !canSubmit}
        />
      </FormActions>
    </FormContainer>
  );
}
