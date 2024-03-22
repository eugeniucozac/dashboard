import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './LinkSearchPolicy.styles';
import { LinkClaimSelectPolicy, RegisterNewLossFixedBottomBar, ClaimsUploadViewSearchDocs } from 'modules';
import * as constants from 'consts';
import * as utils from 'utils';

//mui
import { makeStyles, Box } from '@material-ui/core';

LinkSearchPolicyView.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNextSubmit: PropTypes.func,
  policyData: PropTypes.object,
  policyInformation: PropTypes.object,
  index: PropTypes.number,
  isFormsEdited: PropTypes.array,
  linkPolicyDocList: PropTypes.array,
};

export default function LinkSearchPolicyView(props) {
  const {
    activeStep,
    setActiveStep,
    isAllStepsCompleted,
    index,
    isFormsEdited,
    setFormEditedStatus,
    confirm,
    setConfirm,
    formEditedStatus,
    sectionEnabledValidationFlag,
    validation,
    setValidation,
    saveStatus,
    onSaveHandle,
    backStepperHandler,
    nextStepperhandler,
    policyData,
    policyInformation,
    linkPolicyDocList,
    handleFormStatus,
    claimProperties,
  } = props;

  const classes = makeStyles(styles, { name: 'LinkSearchPolicyView' })();

  const hasPolicyRef = Boolean(policyInformation?.policyRef || policyData?.policyNumber);
  const refData = !policyInformation?.policyRef ? policyInformation : { policyRef: policyData?.policyNumber };

  return (
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box flex="1 1 auto" className={classes.container}>
        <LinkClaimSelectPolicy
          confirm={confirm}
          validation={validation}
          setValidation={setValidation}
          setConfirm={setConfirm}
          hasPolicyRef={hasPolicyRef}
          formEditedStatus={formEditedStatus}
          setActiveStep={setActiveStep}
          index={index}
          isFormsEdited={isFormsEdited}
          saveStatus={saveStatus}
          sectionEnabledValidationFlag={sectionEnabledValidationFlag}
          policyInformation={policyInformation}
          handleFormStatus={handleFormStatus}
          setFormEditedStatus={setFormEditedStatus}
          claimProperties={claimProperties}
        />
        {hasPolicyRef && (
          <Box mt={6} mb={4}>
            <ClaimsUploadViewSearchDocs
              uploadDocumentsTitle={utils.string.t('dms.view.documents.title')}
              refData={{ ...refData }}
              refIdName={constants.DMS_CONTEXT_POLICY_ID}
              dmsContext={constants.DMS_CONTEXT_POLICY}
              viewOptions={{
                upload: false,
                multiSelect: false,
              }}
              defaultTab={constants.DMS_VIEW_TAB_SEARCH}
              documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
              isTabView={false}
              fnolViewOptions={{
                isClaimsFNOL: true,
                isDmsDocumentMenuDisabled: true,
              }}
              docList={linkPolicyDocList}
            />
          </Box>
        )}
      </Box>
      <Box flex="0 1 auto">
        <RegisterNewLossFixedBottomBar
          activeStep={activeStep}
          isAllStepsCompleted={isAllStepsCompleted}
          handleBack={backStepperHandler}
          handleSave={onSaveHandle}
          handleNextSubmit={nextStepperhandler}
          save={isFormsEdited[index]?.formEditedStatus || confirm}
        />
      </Box>
    </Box>
  );
}
