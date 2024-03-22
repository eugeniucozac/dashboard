import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

//app
import * as constants from 'consts';
import * as utils from 'utils';
import styles from './CreateAdhocUploadDocuments.style';
import { CreateAdhocTaskFooter, ClaimsUploadViewSearchDocs } from 'modules';
import {
  selectAdhocTaskData,
  setDmsTaskContextType,
  resetDmsTaskTypeContext,
  setAdhocTaskDocuments,
  selectorDmsViewFiles,
  selectAdhocTaskDocuments,
} from 'stores';

//mui
import { makeStyles, Box } from '@material-ui/core';

CreateAdhocUploadDocumentsView.propTypes = {
  claim: PropTypes.object.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
}

function CreateAdhocUploadDocumentsView({
  claim,
  handleBack,
  handleCancel,
  handleNext,
  activeStep,
}) {
  const classes = makeStyles(styles, { name: 'CreateAdhocUploadDocuments' })();
  const dispatch = useDispatch();
  const taskDetails = useSelector(selectAdhocTaskData);
  const refData = {
    taskId: taskDetails?.id,
    ...taskDetails,
  };
  const viewDmsDocuments = useSelector(selectorDmsViewFiles);
  const adhocDocuments = useSelector(selectAdhocTaskDocuments);

  useEffect(() => {
    if (!utils.generic.isInvalidOrEmptyArray(viewDmsDocuments)) {
      dispatch(setAdhocTaskDocuments(viewDmsDocuments));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewDmsDocuments]);

  useEffect(() => {
    if (taskDetails?.id) {
      dispatch(setDmsTaskContextType({ type: constants.DMS_TASK_CONTEXT_TYPE_ADHOC, refId: taskDetails?.id }));
    }

    return () => {
      dispatch(resetDmsTaskTypeContext());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDetails]);

  return (
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box mt={2} flex="1 1 auto" className={classes.container}>
        <ClaimsUploadViewSearchDocs
          refData={refData}
          refIdName={constants.DMS_CONTEXT_TASK_ID}
          dmsContext={constants.DMS_CONTEXT_TASK}
          documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
          viewOptions={{ link: true }}
          docList={!utils.generic.isInvalidOrEmptyArray(adhocDocuments) ? adhocDocuments : []}
          parentRefs={{
            claimRef: claim?.claimReference,
            lossRef: claim?.lossRef
          }}
        />
      </Box>
      <Box flex="0 1 auto">
        <CreateAdhocTaskFooter
          handleNext={handleNext}
          handleCancel={handleCancel}
          handleBack={handleBack}
          activeStep={activeStep}
        />
      </Box>
    </Box>
  );
}

export default CreateAdhocUploadDocumentsView;
