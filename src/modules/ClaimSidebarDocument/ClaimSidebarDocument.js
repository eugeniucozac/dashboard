import React from 'react';
import PropTypes from 'prop-types';

// app
import { ClaimSidebarDocumentView } from './ClaimSidebarDocument.view';

ClaimSidebarDocument.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default function ClaimSidebarDocument({ claim }) {
  return <ClaimSidebarDocumentView claim={claim} />;
}
