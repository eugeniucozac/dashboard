import React from 'react';
import PropTypes from 'prop-types';

// app
import { FormRequiredView } from './FormRequired.view';

FormRequired.propTypes = {
  type: PropTypes.oneOf(['default', 'dialog', 'blank']),
};

FormRequired.defaultProps = {
  type: 'default',
};

export default function FormRequired(props) {
  return <FormRequiredView {...props} />;
}
