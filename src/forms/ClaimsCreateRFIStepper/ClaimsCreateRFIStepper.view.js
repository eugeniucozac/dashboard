import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ClaimsCreateRFIStepper.style';
import { CreateRFI, ConfirmRFISubmission } from 'forms';
import { ClaimsCreateRFIDocs } from 'modules';

// mui
import { LinearProgress, Stepper, Step, StepLabel, makeStyles } from '@material-ui/core';

ClaimsCreateRFIStepperView.propTypes = {
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
  createRfiInfo: PropTypes.object.isRequired,
};

export default function ClaimsCreateRFIStepperView({
  activeStep,
  handleStep,
  steps,
  claimData,
  rfiType,
  progress,
  isFormsEdited,
  isAllStepsCompleted,
  handleNext,
  handleSkip,
  handleFormStatus,
  handleBack,
  cancelHandler,
  launchFinishModal,
  createRfiInfo,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsCreateRFIStepper' })();
  const stepContent = (index) => {
    switch (index) {
      case 0:
        return (
          <CreateRFI
            claim={claimData}
            rfiType={rfiType}
            activeStep={activeStep}
            index={index}
            onSave={() => { }}
            isAllStepsCompleted={isAllStepsCompleted}
            handleFormStatus={handleFormStatus}
            handleBack={() => {
              handleBack(index);
            }}
            handleSkip={handleSkip}
            handleCancel={cancelHandler}
            handleNextSubmit={() => handleNext(index)}
            save={isFormsEdited?.[index]?.formEditedStatus}
          />
        );
      case 1:
        return (
          <ClaimsCreateRFIDocs
            claim={claimData}
            createRfiInfo={createRfiInfo}
            activeStep={activeStep}
            index={index}
            isAllStepsCompleted={isAllStepsCompleted}
            handlers={{
              handleBack,
              handleCancel: cancelHandler,
              handleNextSubmit: handleNext,
            }}
            save={isFormsEdited?.[index]?.formEditedStatus}
          />
        );
      case 2:
        return (
          <ConfirmRFISubmission
            activeStep={activeStep}
            lastStep={true}
            isAllStepsCompleted={isAllStepsCompleted}
            handleBack={() => {
              handleBack(index);
            }}
            handleFinish={() => launchFinishModal()}
            handleCancel={cancelHandler}
            handleStep={handleStep}
          />
        )
      default:
        return (
          <ConfirmRFISubmission
            activeStep={activeStep}
            lastStep={true}
            isAllStepsCompleted={isAllStepsCompleted}
            handleBack={() => {
              handleBack(index);
            }}
            handleFinish={() => launchFinishModal()}
            handleCancel={cancelHandler}
          />
        )
    }
  }
  const isStepCompleted = (index) => {
    return isFormsEdited?.[index]?.isSubmitted === true;
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
      <div>
        <Stepper alternativeLabel activeStep={activeStep} data-testid="LinearStepper" classes={{ root: classes.stepper }}>
          {steps?.map((label, index) => {
            const stepProps = {};
            if (isStepCompleted(index)) {
              stepProps.completed = index === activeStep ? false : true;
            }
            return (
              <Step key={label} onClick={() => handleStep(index)} {...stepProps}>
                <StepLabel
                  StepIconProps={{
                    classes: { root: isNextSteppedAllowed(index) ? classes.iconContainerCompleted : classes.iconContainer },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
      <LinearProgress variant="determinate" value={progress} className={classes.linearProgress} />
      {stepContent(activeStep)}
    </>
  )

}