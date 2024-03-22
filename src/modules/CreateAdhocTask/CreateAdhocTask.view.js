import React from 'react';
import PropTypes from 'prop-types';

//app
import { EnterAdHockDetails, CreateAdhocUploadDocuments, CreateAdhocConfirm } from 'modules';
import styles from './CreateAdhocTask.style';

//mui
import { LinearProgress, Stepper, Step, StepLabel, makeStyles } from '@material-ui/core';

CreateAdhocTaskView.propTypes = {
  activeStep: PropTypes.number.isRequired,
  handleStep: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  steps: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
  formsStatus: PropTypes.array.isRequired,
  handleSkipUpload: PropTypes.func.isRequired,
  isNextSteppedAllowed: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
  handleFormStatus: PropTypes.func.isRequired,
  reminderList: PropTypes.array.isRequired,
};

export default function CreateAdhocTaskView({
  activeStep,
  handleStep,
  handleNext,
  steps,
  progress,
  formsStatus,
  handleSkipUpload,
  isNextSteppedAllowed,
  handleCancel,
  handleBack,
  handleSubmit,
  claim,
  handleFormStatus,
  reminderList,
}) {
  const classes = makeStyles(styles, { name: 'CreateAdhocTask' })();

  const isStepCompleted = (index) => {
    return formsStatus?.[index]?.isSubmitted === true;
  };
  const stepContent = (index) => {
    switch (index) {
      case 0:
        return (
          <EnterAdHockDetails
            handleNext={handleNext}
            handleSkipUpload={handleSkipUpload}
            handleCancel={handleCancel}
            claim={claim}
            handleFormStatus={handleFormStatus}
            reminderList={reminderList}
          />
        );
      case 1:
        return (
          <CreateAdhocUploadDocuments
            claim={claim}
            handleBack={handleBack}
            handleNext={handleNext}
            handleCancel={handleCancel}
            activeStep={activeStep}
          />
        );
      case 2:
        return (
          <CreateAdhocConfirm
            handleBack={handleBack}
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
            handleStep={handleStep}
            activeStep={activeStep}
            claim={claim}
            reminderList={reminderList}
          />
        );
      default:
        return <EnterAdHockDetails />;
    }
  };

  return (
    <>
      <Stepper alternativeLabel activeStep={activeStep} data-testid="LinearStepper-AdHockTask" classes={{ root: classes.stepper }}>
        {steps?.map((label, index) => {
          const stepProps = {};
          if (isStepCompleted(index)) {
            stepProps.completed = index === activeStep ? false : true;
          }
          return (
            <Step key={label?.form} onClick={() => handleStep(index)} {...stepProps}>
              <StepLabel
                StepIconProps={{
                  classes: {
                    root: isNextSteppedAllowed(index) ? classes.iconContainerCompleted : classes.iconContainer,
                  },
                }}
              >
                {label?.form}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <LinearProgress variant="determinate" value={progress} className={classes.linearProgress} />
      <div className={classes.container}>{stepContent(activeStep)}</div>
    </>
  );
}
