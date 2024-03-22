import React from 'react';
import PropTypes from 'prop-types';

// app
import { FormLabelView } from './FormLabel.view';

FormLabel.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.string,
  align: PropTypes.oneOf(['inherit', 'left', 'center', 'right', 'justify']),
  parseDangerousHtml: PropTypes.bool,
  nestedClasses: PropTypes.object,
};
FormLabel.defaultProps = {
  variant: 'body2',
  align: 'left',
  parseDangerousHtml: true,
  nestedClasses: {},
};

export default function FormLabel({ label, variant, align, parseDangerousHtml, nestedClasses }) {
  return (
    <FormLabelView label={label} variant={variant} align={align} parseDangerousHtml={parseDangerousHtml} nestedClasses={nestedClasses} />
  );
}
