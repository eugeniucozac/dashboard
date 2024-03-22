import React from 'react';
import PropTypes from 'prop-types';

// app
import { Form } from 'components';
import * as utils from 'utils';

DocumentUploadView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
};

export function DocumentUploadView({ fields, actions }) {
  return (
    <Form
      id="uploadDocument"
      type="dialog"
      fields={fields}
      actions={actions}
      defaultValues={utils.form.getInitialValues(fields)}
      validationSchema={utils.form.getValidationSchema(fields)}
    />
  );
}
