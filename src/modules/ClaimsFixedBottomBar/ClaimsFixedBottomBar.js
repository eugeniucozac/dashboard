import React from 'react';

// app
import * as utils from 'utils';
import { Button } from 'components';
import PropTypes from 'prop-types';
import styles from './ClaimsFixedBottomBar.styles';

//mui
import { makeStyles } from '@material-ui/core';

ClaimsFixedBottomBar.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func,
  handleFinish: PropTypes.func,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  next: PropTypes.bool,
  cancel: PropTypes.bool,
  save: PropTypes.bool,
};

ClaimsFixedBottomBar.defaultProps = {
  save: false,
  next: false,
};

export default function ClaimsFixedBottomBar({
  isAllStepsCompleted,
  handleCancel,
  handleFinish,
  handleBack,
  handleSave,
  activeStep,
  lastStep,
  save,
  next,
  cancel,
  onSave,
  handleNextSubmit,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsFixedBottomBar' })({ isAllStepsCompleted: isAllStepsCompleted });

  return (
    <div className={classes.footer}>
      <section>
        {handleCancel && !isAllStepsCompleted && (
          <Button
            text={utils.string.t('app.cancel')}
            onClick={() => handleCancel(cancel)}
            variant="outlined"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
        {handleSave && !isAllStepsCompleted && (
          <Button
            text={utils.string.t('app.save')}
            onClick={onSave}
            disabled={!save}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
      </section>
      <section>
        {activeStep && !isAllStepsCompleted && handleBack ? (
          <Button
            text={utils.string.t('app.back')}
            onClick={handleBack}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        ) : null}

        {!isAllStepsCompleted && !lastStep && (
          <Button
            text={activeStep === 3 ? 'Submit' : 'Next'}
            onClick={handleNextSubmit}
            disabled={!next}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
        {lastStep && (
          <Button text={'Finish'} onClick={handleFinish} color="primary" size="medium" nestedClasses={{ btn: classes.finishButton }} />
        )}
      </section>
    </div>
  );
}
