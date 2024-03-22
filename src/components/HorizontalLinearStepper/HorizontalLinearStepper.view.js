import React from 'react';
import PropTypes from 'prop-types';
import { useMedia } from 'hooks';
import classnames from 'classnames';

// app
import styles from './HorizontalLinearStepper.styles';
import * as utils from 'utils';

// mui
import { makeStyles, Stepper, Step, StepLabel, StepConnector, Typography, withStyles } from '@material-ui/core';

HorizontalLinearStepperView.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      isIcon: PropTypes.bool,
    })
  ).isRequired,
  stepContent: PropTypes.func,
  activeStep: PropTypes.number.isRequired,
  fullWidth: PropTypes.bool,
  showStepConnector: PropTypes.bool.isRequired,
  stepIcon: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    step: PropTypes.string,
    stepper: PropTypes.string,
    content: PropTypes.string,
  }),
};

export function HorizontalLinearStepperView({
  steps,
  stepContent,
  activeStep,
  fullWidth,
  showStepConnector,
  stepIcon,
  size,
  nestedClasses,
}) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'HorizontalLinearStepper' })({ isMobile: media.mobile, size });

  const Connector = withStyles({
    root: {},
    line: {
      borderTopWidth: 1,
      borderRadius: 1,
    },
  })(StepConnector);

  return (
    <div className={classnames({ [classes.root]: true, [nestedClasses.root]: Boolean(nestedClasses.root) })}>
      <div className={!fullWidth && classes.wrapper}>
        <Stepper
          connector={showStepConnector ? <Connector classes={{ root: classes.connector }} /> : null}
          activeStep={activeStep}
          alternativeLabel
          className={classnames({ [classes.stepper]: true, [nestedClasses.stepper]: Boolean(nestedClasses.stepper) })}
          data-testid="horizontalLinear-stepper"
        >
          {steps?.map((step, index) => {
            const isCompleted = index < activeStep;

            return (
              <Step key={step.slug} classes={{ root: classes.step }}>
                <StepLabel
                  StepIconProps={stepIcon ? { icon: step?.isIcon ? stepIcon : index + 1 } : null}
                  classes={{
                    root: classes.labelRoot,
                    label: classes.label,
                    iconContainer: classnames({ [classes.icon]: true, [classes.completed]: isCompleted }),
                  }}
                >
                  <Typography
                    variant="h4"
                    className={classnames({
                      [step?.isIcon ? classes.titleForRejectedStep : classes.title]: true,
                      [classes.completed]: isCompleted,
                    })}
                  >
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {utils.generic.isFunction(stepContent) && <div className={nestedClasses.content}>{stepContent(activeStep)}</div>}
      </div>
    </div>
  );
}
