import { DmsSearch } from 'components';
import * as constants from 'consts';

// mui
import { Box } from '@material-ui/core';

export function DmsSearchDocumentsView({ referenceId, sourceId }) {
  return (
    <Box>
      <DmsSearch
        context={constants.DMS_CONTEXT_TASK}
        referenceId={referenceId}
        sourceId={sourceId}
        isAutoSearchScreen={false}
        isClientSideLinkDocument={true}
      />
    </Box>
  );
}
