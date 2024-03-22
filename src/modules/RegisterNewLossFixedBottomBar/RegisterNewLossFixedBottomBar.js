import React from 'react';

// app
import * as utils from 'utils';
import { Button } from 'components';
import PropTypes from 'prop-types';
import styles from './RegisterNewLossFixedBottomBar.styles';
import { PopoverMenu } from 'components';

//mui
import { makeStyles } from '@material-ui/core';

RegisterNewLossFixedBottomBar.propTypes = {
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

RegisterNewLossFixedBottomBar.defaultProps = {
  save: false,
  next: false,
};

export default function RegisterNewLossFixedBottomBar({
  isAllStepsCompleted,
  handleFinish,
  handleBack,
  handleSave,
  activeStep,
  lastStep,
  save,
  next,
  handleNextSubmit,
}) {
  const classes = makeStyles(styles, { name: 'RegisterNewLossFixedBottomBar' })({ isAllStepsCompleted });

  return (
    <div className={classes.footer}>
      <section>
        <PopoverMenu
          variant="outlined"
          id="claims-functions"
          size="small"
          color="primary"
          text={utils.string.t('claims.registerLoss.taskFunction')}
          isButton
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          items={[]}
        />
      </section>
      <section>
        {handleSave && !isAllStepsCompleted && (
          <Button
            text={utils.string.t('claims.registerLoss.saveDraft')}
            onClick={handleSave}
            disabled={!save}
            color="secondary"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
        {activeStep && !isAllStepsCompleted && handleBack ? (
          <Button
            text={utils.string.t('app.back')}
            onClick={handleBack}
            color="primary"
            variant="outlined"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        ) : null}

        {!isAllStepsCompleted && !lastStep && (
          <Button
            text={utils.string.t('app.next')}
            onClick={handleNextSubmit}
            disabled={next}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
        {lastStep && (
          <Button
            text={utils.string.t('app.submit')}
            onClick={handleFinish}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.button }}
          />
        )}
      </section>
    </div>
  );
}
