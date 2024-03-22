import React from 'react';
import PropTypes from 'prop-types';

// app
import { ProcessingInstructionsManageDocumentsView } from './ProcessingInstructionsManageDocuments.view';

ProcessingInstructionsManageDocuments.propTypes = {
  riskRef: PropTypes.object.isRequired,
  documentTypeKey: PropTypes.string.isRequired,
  isDocumentsEditable: PropTypes.bool.isRequired,
};

export default function ProcessingInstructionsManageDocuments({ riskRef, documentTypeKey, isDocumentsEditable }) {
  return (
    <ProcessingInstructionsManageDocumentsView
      riskRef={riskRef}
      documentTypeKey={documentTypeKey}
      isDocumentsEditable={isDocumentsEditable}
    />
  );
}
