import React from 'react';
import PropTypes from 'prop-types';

// app
import PremiumProcessingCaseHistoryView from './PremiumProcessingCaseHistory.view';

PremiumProcessingCaseHistory.propTypes = {
  taskId: PropTypes.string,
  caseDetailsObject: PropTypes.object,
};

export default function PremiumProcessingCaseHistory({ taskId, caseDetailsObject }) {
  return <PremiumProcessingCaseHistoryView caseDetailsObject={caseDetailsObject} />;
}
