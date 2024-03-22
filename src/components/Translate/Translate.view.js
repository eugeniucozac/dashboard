import React from 'react';
import PropTypes from 'prop-types';

TranslateView.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  component: PropTypes.object,
  componentProps: PropTypes.object,
};

export function TranslateView({ content, component, componentProps }) {
  return React.createElement(component, { ...componentProps }, content);
}
