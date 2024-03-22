import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';


//app
import { 
  getPriorityLevels,
  getUsersByOrg,
  selectPriorities,
  selectClaimsAssignedToUsers,
  showModal,
  postDraftRFI,
  selectCreateRfiInfo,
  postSaveRFIReset,
  setRFIDocuments,
  resetDmsTaskTypeContext,
} from 'stores';
import * as utils from 'utils';
import ClaimsCreateRFIStepperView from './ClaimsCreateRFIStepper.view';
import { CREATE_RFI_FORM, API_RESPONSE_OK } from 'consts';

ClaimsCreateRFIStepper.propTypes = {
  claim: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  cancelHandler: PropTypes.func.isRequired,
}

export default function ClaimsCreateRFIStepper({ claim, cancelHandler, type }) {

  const dispatch = useDispatch();
  const [stepFields, setStepFields] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFormsEdited, setFormEditedStatus] = useState([]);
  const [saveStatus, setSaveStatus] = useState();
  const [isAnyformDirty, checkDirtyStatus] = useState(false);
  const priorities = useSelector(selectPriorities);
  const createRfiInfo = useSelector(selectCreateRfiInfo);
  const selectAssignees = useSelector(selectClaimsAssignedToUsers);

  const [forms, editFormStatus] = useState([
    { id: 0, form: utils.string.t('claims.columns.createRFIStepper.rfiDetails'), formEditedStatus: false, isSubmitted: false },
    { id: 1, form: utils.string.t('claims.columns.createRFIStepper.uploadDocs'), formEditedStatus: false, isSubmitted: false },
    { id: 2, form: utils.string.t('claims.columns.createRFIStepper.confirmRFI'), formEditedStatus: false, isSubmitted: false }]);
  const steps = forms.map((frm) => frm?.form);
  const initialFormStatus = forms;
  const stepsForms = forms;
  const currentStep = 0;
  useEffect(() => {
    currentStep && setActiveStep(currentStep);
    setStepFields(steps);
    setFormEditedStatus(stepsForms);
    return () => {
      findDirtyForm(initialFormStatus);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setProgress(activeStep ? (activeStep / stepFields.length) * 100 : 0);
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isFormsEdited) {
      findDirtyForm(isFormsEdited);
    }
  }, [isFormsEdited]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    !utils.generic.isValidArray(priorities, true) && dispatch(getPriorityLevels());
    !utils.generic.isValidArray(selectAssignees.items, true) && dispatch(getUsersByOrg('', [claim], CREATE_RFI_FORM, true));
    return () => {
      dispatch(postSaveRFIReset());
      dispatch(setRFIDocuments([]));
      dispatch(resetDmsTaskTypeContext());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const findDirtyForm = (forms) => {
    editFormStatus(forms?.map((form) => ({ ...form })));
    checkDirtyStatus(forms.some((form) => form?.formEditedStatus === true));
  };

  const handleNext = () => {
    setSaveStatus(new Date().getTime());
    const formState = isFormsEdited.map((form) => ({ ...form }));
    formState?.forEach((form) => {
      if (form?.id > activeStep && formState?.[activeStep]?.['formEditedStatus']) {
        form['isSubmitted'] = false;
      }
    });
    formState[activeStep]['isSubmitted'] = true;
    formState[activeStep]['formEditedStatus'] = false;
    setFormEditedStatus(formState);
    setActiveStep(activeStep + 1);
  };
  const handleSkip = (step) => {
    if (activeStep === 0) {
      setActiveStep(step);
    }
  }
  const handleStep = (step) => {
    if (activeStep < step) {
      if (
        !isFormsEdited?.[activeStep]?.['formEditedStatus'] &&
        isFormsEdited?.[activeStep]?.['isSubmitted'] &&
        !isFormsEdited?.[step - 1]?.['formEditedStatus'] &&
        isFormsEdited?.[step - 1]?.['isSubmitted']
      ) {
        setActiveStep(step);
      }
    } else if (activeStep > step) {
      setActiveStep(step);
    }
  };

  const handleFormStatus = () => {
    const formState = isFormsEdited?.map((form) => ({ ...form }));
    formState[activeStep]['formEditedStatus'] = true;
    formState[activeStep]['isSubmitted'] = false;
    setFormEditedStatus(formState);
  };

  const handleSubmitRFI = () => {
    const rfiDetails =
    {
      processInstanceId: createRfiInfo?.processId,
      queryCodeDescription: createRfiInfo?.queryCodeDescription,
      sendToTeam: createRfiInfo?.sendToTeam,
      sendToUser: createRfiInfo?.sendToUser,
      taskId: createRfiInfo?.taskId
    };

    dispatch(postDraftRFI(rfiDetails)).then((response) => {
      if (response?.status === API_RESPONSE_OK) {
        cancelHandler();
      }
    });
  };


  const handleRFIModalClose = () => {
    if (isAnyformDirty) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('status.alert'),
            hint: utils.string.t('navigation.title'),
            fullWidth: true,
            maxWidth: 'xs',
            componentProps: {
              cancelLabel: utils.string.t('app.no'),
              confirmLabel: utils.string.t('app.yes'),
              submitHandler: () => {
                cancelHandler();
              },
            },
          },
        })
      );
    }
    else { cancelHandler(); }
  };

  // On click of Finish button
  const launchFinishModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('claims.modals.confirmRfiSubmission.title'),
          fullWidth: true,
          maxWidth: 'sm',
          componentProps: {
            confirmLabel: utils.string.t('app.yes'),
            cancelLabel: utils.string.t('app.no'),
            confirmMessage: utils.string.t('claims.modals.confirmRfiSubmission.content'),
            submitHandler: () => {
              handleSubmitRFI();
            },
            handleClose: () => { },
          },
        },
      })
    );
  };

  return (
    <ClaimsCreateRFIStepperView
      setActiveStep={setActiveStep}
      steps={steps}
      progress={progress}
      claimData={claim}
      rfiType={type}
      handleStep={handleStep}
      isFormsEdited={isFormsEdited}
      isAllStepsCompleted={false}
      handleFormStatus={handleFormStatus}
      findDirtyForm={(forms) => findDirtyForm(forms)}
      handleNext={handleNext}
      activeStep={activeStep}
      handleBack={handleBack}
      handleSkip={handleSkip}
      cancelHandler={handleRFIModalClose}
      setFormEditedStatus={setFormEditedStatus}
      launchFinishModal={launchFinishModal}
      saveStatus={saveStatus}
      setSaveStatus={setSaveStatus}
      createRfiInfo={createRfiInfo}
    />
  );
}
