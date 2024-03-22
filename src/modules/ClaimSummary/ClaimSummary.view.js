import React from 'react';
import PropTypes from 'prop-types';

// app
import { Accordion, Summary } from 'components';
import { ClaimDetailsSidebar, ClaimSummaryActions, ClaimSidebarDocument, ClaimSidebarNotes } from 'modules';
import * as utils from 'utils';

// mui
import { Box } from '@material-ui/core';

ClaimSummaryView.propTypes = {
  claim: PropTypes.object.isRequired,
  allowNavigation: PropTypes.func.isRequired,
};

export function ClaimSummaryView({ claim, allowNavigation }) {
  return (
    <Summary>
      <Box mt={4}>
        <Accordion expanded title={utils.string.t('claims.processing.summary.accordions.details')}>
          <ClaimDetailsSidebar claim={claim} />
        </Accordion>
        <Accordion expanded title={utils.string.t('claims.processing.summary.accordions.actions')}>
          <ClaimSummaryActions claim={claim} />
        </Accordion>
        <Accordion expanded title={utils.string.t('claims.processing.summary.accordions.documents')}>
          <ClaimSidebarDocument claim={claim} />
        </Accordion>
        <Accordion expanded title={utils.string.t('claims.processing.summary.accordions.notes')}>
          <ClaimSidebarNotes claim={claim} allowNavigation={allowNavigation} />
        </Accordion>
      </Box>
    </Summary>
  );
}
