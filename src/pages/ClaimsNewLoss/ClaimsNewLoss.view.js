import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import styles from './ClaimsNewLoss.styles';
import { HorizontalLinearStepper, Layout, PreventNavigation } from 'components';
import {
  postLossInformation,
  selectLossInformation,
  postClaimDetailsInformation,
  selectClaimIdUnderProgress,
  addNewClaimUnderCurrentLoss,
  postEditClaimDetailsInformation,
  postEditLossInformation,
  selectClaimIdFromGrid,
  selectorDmsViewFiles,
  selectDmsDocDetails,
  getDmsDocumentList,
  resetLossPolicyClaimData,
} from 'stores';
import {
  ClaimsAcknowledgement,
  ClaimsEnterLossInformation,
  ClaimsPolicySearch,
  ClaimsPreviewInformation,
  EnterClaimInformation,
} from 'modules';
import config from 'config';

import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { makeStyles } from '@material-ui/core';

ClaimsNewLossView.propTypes = {
  steps: PropTypes.array,
  currentStep: PropTypes.number.isRequired,
  claim: PropTypes.object.isRequired,
  isNavigationAllowed: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinishNewLoss: PropTypes.func.isRequired,
  handleSaveNewLoss: PropTypes.func.isRequired,
  handleSaveNewClaim: PropTypes.func.isRequired,
};

export function ClaimsNewLossView({
  steps,
  currentStep,
  claim,
  isNavigationAllowed,
  handleCancel,
  handleSaveNewLoss,
  handleSaveNewClaim,
  handleFinishNewLoss,
  validation,
  setValidation,
  getModalTitle,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsNewLoss' })();

  const dispatch = useDispatch();
  const lossInformation = useSelector(selectLossInformation);
  const claimData = useSelector(selectClaimIdUnderProgress);
  const selectClaimID = get(claimData, 'claimID') || '';
  const claimsInformation = useSelector(selectClaimIdFromGrid);
  const editClaimId = get(claimsInformation, 'claimID') || '';
  const [policyRef, setPolicyRef] = useState(false);
  const [activeStep, setActiveStep] = useState(currentStep);
  const isAllStepsCompleted = activeStep === steps?.length;
  const lastStep = activeStep === steps?.length - 1;
  const stepperLabel = [
    { id: 0, label: utils.string.t('claims.stepperLabel.registerLoss') },
    { id: 1, label: utils.string.t('claims.stepperLabel.searchPolicy') },
    { id: 2, label: utils.string.t('claims.stepperLabel.enterClaimInformation') },
    { id: 3, label: utils.string.t('claims.stepperLabel.previewInfo') },
    { id: 4, label: utils.string.t('claims.stepperLabel.acknowledgement') },
  ];
  const [activeStepperLabel, setActiveStepperLabel] = useState(stepperLabel.find((label) => label.id === 0)?.label);

  const viewDocumentList = useSelector(selectorDmsViewFiles);
  const savedDmsDocList = useSelector(selectDmsDocDetails);

  useEffect(() => {
    setActiveStepperLabel(stepperLabel.find((stepperLbl) => stepperLbl.id === activeStep)?.label);
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getModalTitle(activeStepperLabel);
  }, [activeStepperLabel]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = async (values) => {
    utils.app.scrollTo(0, '#layout-main');
    if (activeStep === 0) {
      const docList = viewDocumentList.length > 0 ? [...viewDocumentList] : [...savedDmsDocList?.lossDocDetails];
      dispatch(getDmsDocumentList('LOSS_INFORMATION', docList));
      await dispatch(!lossInformation?.lossDetailID ? postLossInformation(values) : postEditLossInformation(values));
    }
    if (activeStep === 2 && !selectClaimID) {
      const docList = viewDocumentList.length > 0 ? [...viewDocumentList] : [...savedDmsDocList?.linkPolicyDocDetails];
      dispatch(getDmsDocumentList('LINK_POLICY', docList));
      if (editClaimId) {
        await dispatch(postEditClaimDetailsInformation(values));
      } else {
        await dispatch(postClaimDetailsInformation(values));
      }
    }

    if (activeStep === 2 && selectClaimID) {
      const docList = viewDocumentList.length > 0 ? [...viewDocumentList] : [...savedDmsDocList?.claimsDocDetails];
      dispatch(getDmsDocumentList('CLAIM_INFORMATION', docList));
      await dispatch(postEditClaimDetailsInformation(values));
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    utils.app.scrollTo(0, '#layout-main');
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    handleFinishNewLoss();
  };

  const handleAddNewClaimInLoss = () => {
    dispatch(addNewClaimUnderCurrentLoss());
    setActiveStep(1);
  };

  const stepContent = (index) => {
    switch (index) {
      case 0:
        return (
          <ClaimsEnterLossInformation
            policyRef={policyRef}
            isAllStepsCompleted={isAllStepsCompleted}
            handleCancel={handleCancel}
            handleFinish={handleFinish}
            handleNext={handleNext}
            handleBack={handleBack}
            handleSave={handleSaveNewLoss}
            activeStep={activeStep}
            lastStep={lastStep}
            context={constants.DMS_CONTEXT_LOSS}
          />
        );
      case 1:
        return (
          <ClaimsPolicySearch
            policyRef={policyRef}
            setPolicyRef={setPolicyRef}
            isAllStepsCompleted={isAllStepsCompleted}
            handleCancel={handleCancel}
            handleFinish={handleFinish}
            handleNext={handleNext}
            handleBack={handleBack}
            activeStep={activeStep}
            lastStep={lastStep}
          />
        );
      case 2:
        return (
          <EnterClaimInformation
            policyRef={policyRef}
            setPolicyRef={setPolicyRef}
            isAllStepsCompleted={isAllStepsCompleted}
            handleCancel={handleCancel}
            handleFinish={handleFinish}
            handleNext={handleNext}
            handleBack={handleBack}
            handleSave={handleSaveNewClaim}
            validation={validation}
            setValidation={setValidation}
            activeStep={activeStep}
            lastStep={lastStep}
            context={constants.DMS_CONTEXT_CLAIM}
          />
        );
      case 3:
        return (
          <ClaimsPreviewInformation
            policyRef={policyRef}
            setPolicyRef={setPolicyRef}
            isAllStepsCompleted={isAllStepsCompleted}
            handleCancel={handleCancel}
            handleFinish={handleFinish}
            handleNext={handleNext}
            handleBack={handleBack}
            activeStep={activeStep}
            lastStep={lastStep}
            next={true}
          />
        );
      case 4:
        return (
          <ClaimsAcknowledgement
            claim={claim}
            isAllStepsCompleted={isAllStepsCompleted}
            handleFinish={handleFinish}
            activeStep={activeStep}
            lastStep={lastStep}
            next={true}
            handleClaim={handleAddNewClaimInLoss}
          />
        );
      default:
        return (
          <ClaimsEnterLossInformation
            policyRef={policyRef}
            isAllStepsCompleted={isAllStepsCompleted}
            handleCancel={handleCancel}
            handleFinish={handleFinish}
            handleNext={handleNext}
            handleBack={handleBack}
            handleSave={handleSaveNewLoss}
            activeStep={activeStep}
            lastStep={lastStep}
          />
        );
    }
  };

  return (
    <>
      <Layout testid="claims-register-new-loss">
        <Layout main>
          <HorizontalLinearStepper
            steps={steps}
            stepContent={stepContent}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            showStepConnector
            handleCancel={handleCancel}
            handleSave={handleSaveNewLoss}
            nestedClasses={{ stepper: classes.stepper }}
          />
        </Layout>
      </Layout>
      {isNavigationAllowed && (
        <PreventNavigation
          dirty={true}
          allowedUrls={isNavigationAllowed ? [config.routes.claimsFNOL.root] : [config.routes.claimsFNOL.newLoss]}
          title={'status.alert'}
          subtitle={''}
          hint={'navigation.title'}
          confirmLabel={'form.options.yesNoNa.yes'}
          cancelLabel={'form.options.yesNoNa.no'}
          maxWidth={'xs'}
          onSubmitCallBack={() => {
            dispatch(resetLossPolicyClaimData());
          }}
        />
      )}
    </>
  );
}
