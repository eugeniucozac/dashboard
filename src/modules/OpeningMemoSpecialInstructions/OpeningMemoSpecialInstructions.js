import React from 'react';
import PropTypes from 'prop-types';

// app
import { OpeningMemoSpecialInstructionsView } from './OpeningMemoSpecialInstructions.view';

OpeningMemoSpecialInstructions.propTypes = {
  formProps: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
};

export default function OpeningMemoSpecialInstructions({ formProps, fields }) {
  return <OpeningMemoSpecialInstructionsView formProps={formProps} fields={fields} />;
}
