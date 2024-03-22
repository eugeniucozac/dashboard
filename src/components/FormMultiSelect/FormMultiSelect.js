import React from 'react';
import PropTypes from 'prop-types';

// app
import { FormMultiSelectView } from './FormMultiSelect.view';

FormMultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  tagType: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary']),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  selectedOptions: PropTypes.array.isRequired,
  onSelectOption: PropTypes.func,
  nestedClasses: PropTypes.object,
};

FormMultiSelectView.defaultProps = {
  tagType: 'primary',
  color: 'primary',
  nestedClasses: {},
};

export function FormMultiSelect(props) {
  if (!props?.options?.length) return null;

  return <FormMultiSelectView {...props} />;
}

export default FormMultiSelect;
