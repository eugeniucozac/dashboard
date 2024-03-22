import React from 'react';

// app
import { AccessControl } from 'components';
import { ClaimsTasksReporting } from 'modules';

//mui
import { Box } from '@material-ui/core';

export default function ReportsTabView() {
  return (
    <Box mt={5} data-testid="reports-tab">
      <Box mt={4}>
        <AccessControl feature="claimsFNOL.loss" permissions={['read', 'create', 'update']}>
          <ClaimsTasksReporting isExpanded />
        </AccessControl>
      </Box>
    </Box>
  );
}
