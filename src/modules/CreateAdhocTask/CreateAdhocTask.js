import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

//app
import CreateAdhocTaskView from './CreateAdhocTask.view';
import {
  hideModal,
  resetClaimsAssignedToUsers,
  getPriorityLevels,
  getUsersByOrg,
  showModal,
  resetAdhocTaskStatus,
  getSelectedClaimDetails,
  selectClaimsProcessingItem,
  setAdhocTaskDocuments,
} from 'stores';
import * as utils from 'utils';

CreateAdhocTaskView.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default function CreateAdhocTask({ claim }) {
  const stepFields = [
    {
      id: 0,
      form: utils.string.t('claims.processing.adHocTask.adHocDetails'),
      formEditedStatus: false,
      isSubmitted: false,
    },
    {
      id: 1,
      form: utils.string.t('claims.processing.adHocTask.uploadDocuments'),
      formEditedStatus: false,
      isSubmitted: false,
    },
    {
      id: 2,
      form: utils.string.t('claims.processing.adHocTask.confirmTask'),
      formEditedStatus: false,
      isSubmitted: false,
    },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formsStatus, setFormEditedStatus] = useState(stepFields);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPriorityLevels());
    dispatch(getUsersByOrg(claim?.team, [{ ...claim, divisionID: claim?.divisionId }], 'createRfiForm'));
    return () => {
      dispatch(resetClaimsAssignedToUsers());
      dispatch(resetAdhocTaskStatus());
      dispatch(setAdhocTaskDocuments([]));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setProgress(activeStep ? (activeStep / stepFields.length) * 100 : 0);
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (utils.generic.isValidObject(claim, 'claimReference')) {
      dispatch(selectClaimsProcessingItem(claim, true));
      dispatch(
        getSelectedClaimDetails({
          claimId: claim?.claimId,
          claimRefParams: claim?.claimReference,
          sourceIdParams: claim?.sourceId,
          divisionIDParams: claim?.divisionId,
          viewLoader: false,
        })
      );
    }
  }, [claim]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStep = (step) => {
    if (activeStep < step) {
      if (
        !formsStatus?.[activeStep]?.['formEditedStatus'] &&
        formsStatus?.[activeStep]?.['isSubmitted'] &&
        !formsStatus?.[step - 1]?.['formEditedStatus'] &&
        formsStatus?.[step - 1]?.['isSubmitted']
      ) {
        setActiveStep(step);
      }
    } else if (activeStep > step) {
      setActiveStep(step);
    }
  };

  const handleNext = () => {
    const formState = formsStatus.map((form) => ({ ...form }));
    formState?.forEach((form) => {
      if (form?.id > activeStep && formState?.[activeStep]?.['formEditedStatus']) {
        form['isSubmitted'] = false;
      }
    });
    formState[activeStep]['formEditedStatus'] = false;
    formState[activeStep]['isSubmitted'] = true;
    setFormEditedStatus(formState);

    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSave = () => {
    const formState = formsStatus?.map((form) => ({ ...form }));
    formState[activeStep]['formEditedStatus'] = false;
    formState[activeStep]['isSubmitted'] = false;
    formState?.map((frm) => (frm?.id >= activeStep ? (frm['isSubmitted'] = false) : (frm['isSubmitted'] = true)));
    setFormEditedStatus(formState);
  };

  const handleFormStatus = () => {
    const formState = formsStatus?.map((form) => ({ ...form }));
    formState[activeStep]['formEditedStatus'] = true;
    formState[activeStep]['isSubmitted'] = false;
    setFormEditedStatus(formState);
  };

  const isNextSteppedAllowed = (step) => {
    if (activeStep < step) {
      if (
        !formsStatus?.[activeStep]?.['formEditedStatus'] &&
        formsStatus?.[activeStep]?.['isSubmitted'] &&
        !formsStatus?.[step - 1]?.['formEditedStatus'] &&
        formsStatus?.[step - 1]?.['isSubmitted']
      ) {
        return true;
      }
    } else if (activeStep > step) {
      return true;
    } else {
      return false;
    }
  };
  const handleSkipUpload = () => {
    setActiveStep(2);
  };
  const isAnyformIsDirty = formsStatus.some((form) => form?.formEditedStatus === true);

  const handleCancel = () => {
    if (isAnyformIsDirty) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            fullWidth: true,
            title: utils.string.t('claims.complexityRulesManagementDetails.alertModal.title'),
            maxWidth: 'xs',
            componentProps: {
              confirmLabel: utils.string.t('app.yes'),
              cancelLabel: utils.string.t('app.no'),
              confirmMessage: utils.string.t('claims.processing.modal.adhocCancelLabel'),
              buttonColors: { confirm: 'secondary', cancel: 'default' },
              submitHandler: () => {
                dispatch(hideModal());
              },
            },
          },
        })
      );
    } else {
      dispatch(hideModal());
    }
  };

  const handleSubmit = () => {
    dispatch(hideModal());
  };

  const reminderList = [
    { id: '1D', name: utils.string.t('claims.processing.taskReminderLabels.oneDayBfr') },
    { id: '2D', name: utils.string.t('claims.processing.taskReminderLabels.twoDayBfr') },
    { id: '3D', name: utils.string.t('claims.processing.taskReminderLabels.threeDayBfr') },
    { id: '4D', name: utils.string.t('claims.processing.taskReminderLabels.fourDayBfr') },
    { id: '1W', name: utils.string.t('claims.processing.taskReminderLabels.oneWeekBfr') },
    { id: '2W', name: utils.string.t('claims.processing.taskReminderLabels.twoWeekBfr') },
    { id: 'NA', name: utils.string.t('claims.processing.taskReminderLabels.noReminder') },
  ];
  return (
    <>
      <CreateAdhocTaskView
        activeStep={activeStep}
        steps={stepFields}
        progress={progress}
        handleStep={handleStep}
        formsStatus={formsStatus}
        isAllStepsCompleted={false}
        handleBack={handleBack}
        handleFormStatus={handleFormStatus}
        handleSave={handleSave}
        handleNext={handleNext}
        isNextSteppedAllowed={isNextSteppedAllowed}
        handleSkipUpload={handleSkipUpload}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        claim={claim}
        reminderList={reminderList}
      />
    </>
  );
}
