import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './NewEnquiry.styles';
import { Form } from 'components';
import * as utils from 'utils';
import { DocumentUpload } from 'forms';
import * as constants from 'consts';

// mui
import { makeStyles } from '@material-ui/core';

NewEnquiryView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  handleRedirect: PropTypes.func,
};

export function NewEnquiryView({ fields, actions, placement, handleRedirect }) {
  const classes = makeStyles(styles, { name: 'NewEnquiry' })();

  return (
    <>
      {!placement && (
        <Form
          id="newEnquiry"
          type="dialog"
          fields={fields}
          actions={actions}
          defaultValues={utils.form.getInitialValues(fields)}
          validationSchema={utils.form.getValidationSchema(fields)}
          nestedClasses={{ fields: { inner: classes.fields } }}
        />
      )}
      {placement && (
        <DocumentUpload redirectionCallback={handleRedirect} documentType={constants.FOLDER_SUBMISSIONS} placement={placement} />
      )}
    </>
  );
}
