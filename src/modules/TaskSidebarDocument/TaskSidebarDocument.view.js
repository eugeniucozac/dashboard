import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

// app
import styles from './TaskSidebarDocument.styles';
import { Link, FormFileDrop } from 'components';
import { showModal, selectClaimsTasksProcessingSelected, addLoader } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';
import config from 'config';

// mui
import { makeStyles, Grid } from '@material-ui/core';

TaskSidebarDocumentView.propTypes = {
  fields: PropTypes.array,
};

export function TaskSidebarDocumentView({ fields }) {
  const classes = makeStyles(styles, { name: 'TaskSidebarDocument' })();
  const dispatch = useDispatch();
  const history = useHistory();

  const tasksSelected = useSelector(selectClaimsTasksProcessingSelected);
  const task = tasksSelected[0];

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
            referenceId: task?.taskId,
            sourceId: Number(task?.sourceID),
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

  const isAnRfiTask = (task) => {
    return task?.taskType === 'RFI' || task?.taskRef.startsWith('Q');
  };

  const viewAllDocs = () => {
    if (task?.taskRef) {
      if (isAnRfiTask(task)) {
        history.push(`${config.routes.claimsProcessing.rfi}/${task.taskRef}/documents`);
      } else {
        history.push(`${config.routes.claimsProcessing.task}/${task.taskRef}/documents`);
      }
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
