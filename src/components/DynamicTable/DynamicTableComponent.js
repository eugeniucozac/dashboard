import React from 'react';
import PropTypes from 'prop-types';

// app
import { DynamicTableComponentView } from './DynamicTableComponent.view';

DynamicTableComponent.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
};

export default function DynamicTableComponent({ field, formProps }) {
  return <DynamicTableComponentView field={field} formProps={formProps} />;
}
