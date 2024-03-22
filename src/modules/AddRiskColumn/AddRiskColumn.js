import React from 'react';
import PropTypes from 'prop-types';

// app
import { AddRiskColumnView } from './AddRiskColumn.view';

AddRiskColumn.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
};

export default function AddRiskColumn({ field, formProps }) {
  // abort
  if (!field || !field.name || !field.arrayItemDef) return null;
  if (!formProps || !formProps.control) return null;

  return <AddRiskColumnView field={field} formProps={formProps} />;
}
