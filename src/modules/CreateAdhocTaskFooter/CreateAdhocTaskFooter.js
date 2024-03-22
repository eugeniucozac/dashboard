import React from 'react';

// app
import * as utils from 'utils';
import { Button } from 'components';
import PropTypes from 'prop-types';
import styles from './CreateAdhocTaskFooter.style';
//mui
import { makeStyles } from '@material-ui/core';

CreateAdhocTaskFooter.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  next: PropTypes.bool,
  cancel: PropTypes.bool,
};

CreateAdhocTaskFooter.defaultProps = {
  next: false,
};

export default function CreateAdhocTaskFooter({
  isAllStepsCompleted,
  handleSubmit,
  handleBack,
  handleCancel,
  activeStep,
  lastStep,
  next,
  handleNext,
  handleSkipUpload,
}) {
  const classes = makeStyles(styles, { name: 'CreateAdhocTaskFooter' })({ isAllStepsCompleted });

  return (
    <div className={classes.footer}>
      <section>
        {!isAllStepsCompleted && handleSkipUpload && (
          <Button
            text={utils.string.t('app.skipUploadStep')}
            onClick={handleSkipUpload}
            variant="text"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
        {!isAllStepsCompleted && handleCancel && (
          <Button
            text={utils.string.t('app.cancel')}
            onClick={handleCancel}
            variant="text"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
        {activeStep && !isAllStepsCompleted && handleBack ? (
          <Button
            text={utils.string.t('app.back')}
            onClick={handleBack}
            variant="text"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        ) : null}

        {!isAllStepsCompleted && !lastStep && (
          <Button
            text={utils.string.t('app.next')}
            onClick={handleNext}
            disabled={next}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
        {lastStep && handleSubmit && (
          <Button
            text={utils.string.t('app.submit')}
            onClick={handleSubmit}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
      </section>
    </div>
  );
}
