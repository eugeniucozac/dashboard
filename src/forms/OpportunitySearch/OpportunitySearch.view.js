import React from 'react';
import PropTypes from 'prop-types';

// app
import { Form } from 'components';

OpportunitySearchView.propTypes = {
  fields: PropTypes.array.isRequired,
};

export function OpportunitySearchView({ fields }) {
  return <Form id="opportunitySearch" fields={fields} />;
}
