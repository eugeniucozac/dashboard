import React from 'react';
import PropTypes from 'prop-types';

// app
import { OpeningMemoInfoView } from './OpeningMemoInfo.view';

OpeningMemoInfo.propTypes = {
  formProps: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
};

OpeningMemoInfo.defaultProps = {
  formProps: {},
};

export default function OpeningMemoInfo({ formProps, fields }) {
  return <OpeningMemoInfoView fields={fields} formProps={formProps} />;
}
