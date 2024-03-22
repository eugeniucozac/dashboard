import React from 'react';
import PropTypes from 'prop-types';

// app
import { HorizontalLinearStepperView } from './HorizontalLinearStepper.view';

HorizontalLinearStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      isIcon: PropTypes.bool,
    })
  ).isRequired,
  stepContent: PropTypes.func,
  activeStep: PropTypes.number,
  fullWidth: PropTypes.bool,
  showStepConnector: PropTypes.bool,
  stepIcon: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    step: PropTypes.string,
    stepper: PropTypes.string,
    content: PropTypes.string,
  }),
};

HorizontalLinearStepper.defaultProps = {
  showStepConnector: false,
  size: 'md',
  nestedClasses: {},
};

export default function HorizontalLinearStepper({ activeStep, ...rest }) {
  return <HorizontalLinearStepperView activeStep={activeStep === undefined ? 0 : activeStep} {...rest} />;
}
