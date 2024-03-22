import React from 'react';
import PropTypes from 'prop-types';

// app
import { ClaimsUploadViewSearchDocs } from 'modules';
import * as constants from 'consts';

// mui
import { Box } from '@material-ui/core';

ProcessingInstructionsManageDocumentsView.propTypes = {
  riskRef: PropTypes.object.isRequired,
  documentTypeKey: PropTypes.string.isRequired,
  isDocumentsEditable: PropTypes.bool.isRequired,
};

export function ProcessingInstructionsManageDocumentsView({ riskRef, documentTypeKey, isDocumentsEditable }) {
  const sourceId = riskRef?.xbInstanceId;
  return (
    <Box mt={5} m={5}>
      <ClaimsUploadViewSearchDocs
        refData={riskRef}
        refIdName={constants.DMS_CONTEXT_PI_RISKREF_ID}
        dmsContext={constants.DMS_CONTEXT_POLICY}
        viewOptions={{
          upload: isDocumentsEditable,
          unlink: isDocumentsEditable,
          delete: isDocumentsEditable,
          editMetaData: isDocumentsEditable,
        }}
        searchOptions={{
          disabled: true,
        }}
        sourceId={Number(sourceId)}
        documentTypeKey={documentTypeKey}
      />
    </Box>
  );
}
