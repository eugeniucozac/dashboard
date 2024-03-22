import React from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';

//app
import { ClaimsUploadViewSearchDocs } from 'modules';
import { CreateTaskStepperActions } from 'forms';
import styles from './ClaimsCreateRFIDocs.styles';
import { DMS_CONTEXT_TASK_ID, DMS_CONTEXT_TASK, DMS_DOCUMENT_TYPE_SECTION_KEYS, RFI_ON_CLAIMS, RFI_ON_TASKS, RFI_ON_LOSS } from 'consts';

//mui
import { makeStyles, Box } from '@material-ui/core';

ClaimsCreateRFIDocsView.propTypes = {
  createRfiInfo: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  isAllStepsCompleted: PropTypes.bool,
  save: PropTypes.bool,
  sourceId: PropTypes.number,
  taskId: PropTypes.string,
  handlers: PropTypes.shape({
    handleBack: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleNextSubmit: PropTypes.func.isRequired
  })
}

export default function ClaimsCreateRFIDocsView({
  createRfiInfo,
  activeStep,
  index,
  isAllStepsCompleted,
  handlers,
  save,
  sourceId,
  taskId,
}) {

  const classes = makeStyles(styles, { name: 'ClaimsCreateRFIDocs' })();
  const { lossRef, claimRef, taskRef, caseIncidentRefType } = createRfiInfo;
  const parentContextId = caseIncidentRefType === RFI_ON_LOSS ? lossRef : (caseIncidentRefType === RFI_ON_CLAIMS ? claimRef : taskRef);

  return (
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box className={classes.root} flex="1 1 auto">
        <ClaimsUploadViewSearchDocs
          refData={createRfiInfo}
          refIdName={DMS_CONTEXT_TASK_ID}
          dmsContext={DMS_CONTEXT_TASK}
          documentTypeKey={DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
          sourceId={sourceId}
          viewOptions={{ 
            link: caseIncidentRefType === RFI_ON_CLAIMS || caseIncidentRefType === RFI_ON_TASKS,
            linkToParentContext: caseIncidentRefType === RFI_ON_LOSS,
            linkToTask: caseIncidentRefType === RFI_ON_TASKS
          }}
          parentContext={startCase(caseIncidentRefType)}
          parentContextId={parentContextId}
          fnolViewOptions={{
            isClaimsFNOL: true,
          }}
          parentRefs={{
            claimRef,
            lossRef,
            taskId
          }}
        />
      </Box>
      <Box flex="0 1 auto">
        <CreateTaskStepperActions
          activeStep={activeStep}
          onSave={() => { }}
          isAllStepsCompleted={isAllStepsCompleted}
          handleBack={() => {
            handlers?.handleBack(index);
          }}
          handleCancel={handlers?.handleCancel}
          handleNextSubmit={() => handlers?.handleNextSubmit(index)}
          save={save}
        />
      </Box>
    </Box>
  );
}
