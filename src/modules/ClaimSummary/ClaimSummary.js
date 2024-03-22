import React from 'react';
import PropTypes from 'prop-types';

// app
import { ClaimSummaryView } from './ClaimSummary.view';
import * as utils from 'utils';

ClaimSummary.propTypes = {
  claim: PropTypes.object,
  allowNavigation: PropTypes.func.isRequired,
};

export default function ClaimSummary({ claim, allowNavigation }) {
  // abort
  if (!utils.generic.isValidObject(claim)) return null;

  return <ClaimSummaryView claim={claim} allowNavigation={allowNavigation} />;
}
