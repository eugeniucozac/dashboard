import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import {
  RegisterNewLossFixedBottomBar,
  ClaimsEnterLossInformation,
  LinkSearchPolicy,
  RegisterClaimCardInformation,
  ClaimsAcknowledgement,
  ClaimsManageDocuments,
} from 'modules';
import { selectCatCodes, getCatCodes, getPriorityLevels, getLossQualifiers } from 'stores';
import styles from './ClaimsRegisterNewLoss.style';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { LinearProgress, Stepper, Step, StepLabel, makeStyles } from '@material-ui/core';

ClaimsRegisterNewLossView.propTypes = {
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
  handleStep: PropTypes.func.isRequired,
  steps: PropTypes.array.isRequired,
  progress: PropTypes.number.isRequired,
  isFormsEdited: PropTypes.array.isRequired,
  isAllStepsCompleted: PropTypes.bool.isRequired,
  handleFormStatus: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  setFormEditedStatus: PropTypes.func.isRequired,
  setSaveStatus: PropTypes.func.isRequired,
  saveStatus: PropTypes.number.isRequired,
};

export default function ClaimsRegisterNewLossView({
  activeStep,
  setActiveStep,
  handleStep,
  steps,
  progress,
  isFormsEdited,
  isAllStepsCompleted,
  handleNext,
  handleFormStatus,
  handleBack,
  handleSave,
  setFormEditedStatus,
  saveStatus,
  setSaveStatus,
  launchFinishModal,
  lossProperties,
  claimProperties,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsRegisterNewLoss' })();

  const [policyRef, setPolicyRef] = useState(false);
  const catCodes = useSelector(selectCatCodes);
  const dispatch = useDispatch();

  const getAllReferentialData = () => {
    if (utils.generic.isInvalidOrEmptyArray(catCodes)) {
      dispatch(getCatCodes());
    }
  };

  useEffect(() => {
    getAllReferentialData();
    dispatch(getLossQualifiers());
    dispatch(getPriorityLevels());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isStepCompleted = (index) => {
    return isFormsEdited?.[index]?.isSubmitted === true;
  };
  const stepContent = (index) => {
    switch (index) {
      case 0:
        return (
          <ClaimsEnterLossInformation
            policyRef={policyRef}
            isAllStepsCompleted={isAllStepsCompleted}
            handleNext={() => handleNext(index)}
            handleSave={() => {
              handleSave(index);
            }}
            activeStep={activeStep}
            lastStep={false}
            context={constants.DMS_CONTEXT_LOSS}
            saveStatus={saveStatus}
            handleBack={handleBack}
            handleFormStatus={handleFormStatus}
            lossProperties={lossProperties}
          />
        );
      case 1:
        return (
          <LinkSearchPolicy
            policyRef={policyRef}
            setPolicyRef={setPolicyRef}
            isFormsEdited={isFormsEdited}
            setFormEditedStatus={setFormEditedStatus}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            isAllStepsCompleted={isAllStepsCompleted}
            handleBack={handleBack}
            handleSave={handleSave}
            handleNext={handleNext}
            save={isFormsEdited[index]?.formEditedStatus}
            index={index}
            saveStatus={saveStatus}
            setSaveStatus={setSaveStatus}
            handleFormStatus={handleFormStatus}
            claimProperties={claimProperties}
          />
        );
      case 2:
        return (
          <RegisterClaimCardInformation
            activeStep={activeStep}
            isAllStepsCompleted={isAllStepsCompleted}
            handleBack={handleBack}
            handleSave={() => {
              handleSave(index);
            }}
            handleNext={handleNext}
            save={isFormsEdited?.[index]?.formEditedStatus}
            index={index}
            handleFormStatus={handleFormStatus}
          />
        );
      case 3:
        return (
          <ClaimsManageDocuments
            policyRef={policyRef}
            isAllStepsCompleted={isAllStepsCompleted}
            handleNext={() => handleNext(index)}
            handleSave={() => {
              handleSave(index);
            }}
            activeStep={activeStep}
            lastStep={false}
            context={constants.DMS_CONTEXT_LOSS}
            saveStatus={saveStatus}
            handleBack={handleBack}
            handleFormStatus={handleFormStatus}
          />
        );
      case 4:
        return (
          <ClaimsAcknowledgement
            lastStep={true}
            activeStep={activeStep}
            isAllStepsCompleted={isAllStepsCompleted}
            handleBack={() => {
              handleBack(index);
            }}
            handleSave={() => {
              handleSave(index);
            }}
            handleFinish={() => launchFinishModal()}
            save={isFormsEdited?.[index]?.formEditedStatus}
            handleStep={handleStep}
          />
        );
      default:
        return (
          <RegisterNewLossFixedBottomBar
            activeStep={activeStep}
            onSave={() => {}}
            isAllStepsCompleted={isAllStepsCompleted}
            handleSave={() => {
              handleSave(index);
            }}
            handleNextSubmit={() => handleNext(index)}
            save={isFormsEdited?.[index]?.formEditedStatus}
          />
        );
    }
  };

  const isNextSteppedAllowed = (step) => {
    if (activeStep < step) {
      if (
        !isFormsEdited?.[activeStep]?.['formEditedStatus'] &&
        isFormsEdited?.[activeStep]?.['isSubmitted'] &&
        !isFormsEdited?.[step - 1]?.['formEditedStatus'] &&
        isFormsEdited?.[step - 1]?.['isSubmitted']
      ) {
        return true;
      }
    } else if (activeStep > step) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Stepper alternativeLabel activeStep={activeStep} data-testid="LinearStepper" classes={{ root: classes.stepper }}>
        {steps.map((label, index) => {
          const stepProps = {};
          if (isStepCompleted(index)) {
            stepProps.completed = index === activeStep ? false : true;
          }
          return (
            <Step key={label} onClick={() => handleStep(index)} {...stepProps}>
              <StepLabel
                StepIconProps={{
                  classes: {
                    root: isNextSteppedAllowed(index) ? classes.iconContainerCompleted : classes.iconContainer,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <LinearProgress variant="determinate" value={progress} className={classes.linearProgress} />
      {stepContent(activeStep)}
    </>
  );
}
