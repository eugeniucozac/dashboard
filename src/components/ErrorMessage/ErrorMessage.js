import React from 'react';
import PropTypes from 'prop-types';

// app
import { ErrorMessageView } from './ErrorMessage.view';

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  hint: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  bold: PropTypes.bool,
  component: PropTypes.string,
  nestedClasses: PropTypes.object,
};

ErrorMessage.defaultProps = {
  size: 'xs',
  nestedClasses: {},
};

export default function ErrorMessage(props) {
  return props.error || props.hint ? <ErrorMessageView {...props} /> : null;
}
