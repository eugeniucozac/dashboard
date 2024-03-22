import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

// app
import styles from './ClaimSidebarDocument.styles';
import { Link, FormFileDrop } from 'components';
import * as utils from 'utils';
import { showModal, addLoader } from 'stores';
import * as constants from 'consts';
import config from 'config';

// mui
import { makeStyles, Grid } from '@material-ui/core';

ClaimSidebarDocumentView.propTypes = {
  claim: PropTypes.object.isRequired,
};

export function ClaimSidebarDocumentView({ claim }) {
  const classes = makeStyles(styles, { name: 'ClaimSidebarDocument' })();
  const dispatch = useDispatch();
  const history = useHistory();

  const uploadModal = () => (files) => {
    dispatch(addLoader('DmsUploadFiles'));

    dispatch(
      showModal({
        component: 'DMS_UPLOAD_FILES',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.upload.modalItems.uploadDocuments'),
          hideCompOnBlur: false,
          maxWidth: 'xl',
          componentProps: {
            files,
            context: constants.DMS_CONTEXT_TASK,
            referenceId: claim?.claimRef,
            sourceId: Number(claim?.sourceId),
            documentTypeKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim,
            confirmLabel: utils.string.t('app.ok'),
            cancelLabel: utils.string.t('app.goBack'),
            confirmMessage: utils.string.t('processingInstructions.documentsWillNotBeSaved'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
          },
        },
      })
    );
  };

  const viewAllDocs = () => {
    if (claim?.claimRef) {
      history.push(`${config.routes.claimsProcessing.claim}/${claim.claimRef}/claimRefDocs`);
    }
  };

  return (
    <Grid container justify-content="flex-end" spacing={2}>
      <Grid item xs={12} justify-content="flex-end" className={classes.viewDocs}>
        <Link text={utils.string.t('app.viewalldocuments')} color="secondary" handleClick={() => viewAllDocs()} />
      </Grid>
      <Grid item xs={12}>
        <FormFileDrop
          name="file"
          attachedFiles=""
          showUploadPreview={false}
          componentProps={{
            multiple: true,
          }}
          dragLabel={utils.string.t('dms.upload.modalItems.dragDrop')}
          onChange={uploadModal()}
        />
      </Grid>
    </Grid>
  );
}
