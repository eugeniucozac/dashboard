import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import { DmsAdvancedSearchView } from './DmsAdvancedSearch.view';
import * as constants from 'consts';

DmsAdvancedSearch.propTypes = {
  fields: PropTypes.array.isRequired,
  buttons: PropTypes.shape({
    cancel: PropTypes.object.isRequired,
    submit: PropTypes.object.isRequired,
  }).isRequired,
  formProps: PropTypes.object.isRequired,
  resetKey: PropTypes.number,
};

export default function DmsAdvancedSearch({ fields, buttons, formProps, resetKey }) {
  const documentType = formProps.watch('documentType');

  let isDocumentTypePayment;

  useEffect(() => {
    // workaround to reposition the popover
    // if new fields are displayed after selecting a new document type
    // https://github.com/mui-org/material-ui/issues/10595#issuecomment-403130358
    window.dispatchEvent(new CustomEvent('resize'));
  }, [documentType]);

  if (documentType?.documentTypeDescription === constants.DMS_DOCUMENT_TYPE_PAYMENT) isDocumentTypePayment = true;

  return (
    <DmsAdvancedSearchView
      fields={fields}
      buttons={buttons}
      formProps={formProps}
      isDocumentTypePayment={isDocumentTypePayment}
      resetKey={resetKey}
    />
  );
}
