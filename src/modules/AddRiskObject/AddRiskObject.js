import React from 'react';
import PropTypes from 'prop-types';

// app
import { AddRiskObjectView } from './AddRiskObject.view';

AddRiskObject.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
};

export default function AddRiskObject({ field, formProps }) {
  // abort
  if (!field || !field.name || !field.objectDef) return null;
  if (!formProps || !formProps.control) return null;

  return <AddRiskObjectView field={field} formProps={formProps} />;
}
