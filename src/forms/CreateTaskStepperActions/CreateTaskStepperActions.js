import React from 'react';

// app
import * as utils from 'utils';
import { Button } from 'components';
import PropTypes from 'prop-types';
import styles from './CreateTaskStepperActions.style';

//mui
import { makeStyles } from '@material-ui/core';

CreateTaskStepperActions.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func,
  handleFinish: PropTypes.func,
  handleNext: PropTypes.func,
  handleBack: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool,
  next: PropTypes.bool,
  cancel: PropTypes.bool,
  save: PropTypes.bool,
};

CreateTaskStepperActions.defaultProps = {
  save: false,
  next: false,
};

export default function CreateTaskStepperActions({
  isAllStepsCompleted,
  handleFinish,
  handleBack,
  handleSkip,
  handleCancel,
  activeStep,
  lastStep,
  save,
  next,
  handleNextSubmit,
}) {
  const classes = makeStyles(styles, { name: 'CreateTaskStepperActions' })({ isAllStepsCompleted: isAllStepsCompleted });

  return (
    <div className={classes.footer}>
      <section>
        {activeStep === 0 && !isAllStepsCompleted && (
          <Button
            text={utils.string.t('app.skipUpload')}
            onClick={handleSkip}
            disabled={!save}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.saveButton }}
          />
        )}
        <Button
          text={utils.string.t('app.cancel')}
          onClick={handleCancel}
          color="primary"
          size="medium"
          nestedClasses={{ btn: classes.backButton }}
        />
        {activeStep && !isAllStepsCompleted && handleBack ? (
          <Button
            text={utils.string.t('app.back')}
            onClick={handleBack}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.backButton }}
          />
        ) : null}

        {!isAllStepsCompleted && !lastStep && (
          <Button
            text={utils.string.t('app.next')}
            onClick={handleNextSubmit}
            disabled={next}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.nextButton }}
          />
        )}
        {lastStep && (
          <Button
            text={utils.string.t('claims.rfis.actions.sendRFI')}
            onClick={handleFinish}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.nextButton }}
          />
        )}
      </section>
    </div>
  );
}
