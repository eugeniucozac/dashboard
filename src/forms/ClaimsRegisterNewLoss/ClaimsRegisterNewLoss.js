import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

//app
import { DrawerComponent } from 'components';
import { selectorDmsViewFiles, selectDmsDocDetails, getDmsDocumentList, resetDmsWidgetDocuments } from 'stores';
import ClaimsRegisterNewLossView from './ClaimsRegisterNewLoss.view';
import { DmsFnolWidget } from 'modules';

ClaimsRegisterNewLoss.propTypes = {
  steps: PropTypes.array.isRequired,
  stepsForms: PropTypes.array.isRequired,
  findDirtyForm: PropTypes.func,
  initialFormStatus: PropTypes.array,
  currentStep: PropTypes.number,
};

ClaimsRegisterNewLoss.defaultProps = {
  currentStep: 0,
  findDirtyForm: () => {},
  initialFormStatus: [],
};

export default function ClaimsRegisterNewLoss({
  currentStep,
  steps,
  stepsForms,
  findDirtyForm,
  initialFormStatus,
  launchFinishModal,
  lossProperties,
  claimProperties,
}) {
  const [stepFields, setStepFields] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFormsEdited, setFormEditedStatus] = useState([]);
  const [saveStatus, setSaveStatus] = useState();

  const dispatch = useDispatch();
  const viewDocumentList = useSelector(selectorDmsViewFiles);
  const savedDmsDocList = useSelector(selectDmsDocDetails);

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

  const handleNext = () => {
    setSaveStatus(new Date().getTime());
    const formState = isFormsEdited.map((form) => ({ ...form }));
    formState?.forEach((form) => {
      if (form?.id > activeStep && formState?.[activeStep]?.['formEditedStatus']) {
        form['isSubmitted'] = false;
      }
    });
    formState[activeStep]['isSubmitted'] = true;
    if (activeStep === 0) {
      const docList = viewDocumentList.length > 0 ? [...viewDocumentList] : [...savedDmsDocList?.lossDocDetails];
      dispatch(getDmsDocumentList('LOSS_INFORMATION', docList));
    }
    if (activeStep === 1) {
      const docList = viewDocumentList.length > 0 ? [...viewDocumentList] : [...savedDmsDocList?.linkPolicyDocDetails];
      dispatch(getDmsDocumentList('LINK_POLICY', docList));
    }
    if (activeStep === 2) {
      const docList = viewDocumentList.length > 0 ? [...viewDocumentList] : [...savedDmsDocList?.claimsDocDetails];
      dispatch(getDmsDocumentList('CLAIM_INFORMATION', docList));
    }

    if (activeStep === 3) {
      formState[4]['isSubmitted'] = true;
    }
    if (activeStep !== 1) {
      formState[activeStep]['formEditedStatus'] = false;
      setFormEditedStatus(formState);
      setActiveStep(activeStep + 1);
    } else {
      formState[activeStep]['formEditedStatus'] = true;
      setFormEditedStatus(formState);
      setSaveStatus(new Date().getTime());
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSave = () => {
    setSaveStatus(new Date().getTime());
    const formState = isFormsEdited?.map((form) => ({ ...form }));
    formState[activeStep]['formEditedStatus'] = false;
    formState[activeStep]['isSubmitted'] = false;
    formState?.map((frm) => (frm?.id >= activeStep ? (frm['isSubmitted'] = false) : (frm['isSubmitted'] = true)));
    setFormEditedStatus(formState);
    if (activeStep === 1) setSaveStatus(new Date().getTime());
  };

  const handleFormStatus = () => {
    const formState = isFormsEdited?.map((form) => ({ ...form }));
    formState[activeStep]['formEditedStatus'] = true;
    formState[activeStep]['isSubmitted'] = false;
    setFormEditedStatus(formState);
  };

  useEffect(() => {
    currentStep && setActiveStep(currentStep);
    setStepFields(steps);
    setFormEditedStatus(stepsForms);
    return () => {
      findDirtyForm(initialFormStatus);
      resetDmsWidgetDocuments();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setProgress(activeStep ? (activeStep / stepFields.length) * 100 : 0);
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    findDirtyForm(isFormsEdited);
  }, [isFormsEdited]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ClaimsRegisterNewLossView
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={steps}
        progress={progress}
        handleStep={handleStep}
        isFormsEdited={isFormsEdited}
        isAllStepsCompleted={false}
        handleFormStatus={handleFormStatus}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSave={handleSave}
        setFormEditedStatus={setFormEditedStatus}
        saveStatus={saveStatus}
        setSaveStatus={setSaveStatus}
        launchFinishModal={launchFinishModal}
        lossProperties={lossProperties}
        claimProperties={claimProperties}
      />
      <DrawerComponent isDrawerOpen>
        <DmsFnolWidget activeStep={activeStep} />
      </DrawerComponent>
    </>
  );
}
