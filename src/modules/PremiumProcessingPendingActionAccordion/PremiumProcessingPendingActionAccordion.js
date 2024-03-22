import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

// app
import { PremiumProcessingPendingActionAccordionView } from './PremiumProcessingPendingActionAccordion.view';
import config from 'config';
import * as constants from 'consts';

PremiumProcessingPendingActionAccordion.propTypes = {
  taskId: PropTypes.string.isRequired,
  isValidRPSection: PropTypes.bool,
  isUnassignedStage: PropTypes.bool.isRequired,
  isWorkBasket: PropTypes.bool.isRequired,
  isAllCases: PropTypes.bool.isRequired,
  isIssueDocumentStage: PropTypes.bool.isRequired,
  isCheckSigningCase: PropTypes.bool.isRequired,
  selectedCases: PropTypes.array,
};
export default function PremiumProcessingPendingActionAccordion({
  taskId,
  isValidRPSection,
  isWorkBasket,
  isUnassignedStage,
  isIssueDocumentStage,
  isAllCases,
  isCheckSigningCase,
  selectedCases,
}) {
  const history = useHistory();

  const issueDocumentsHandler = () => {
    history.push(
      `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS}/${constants.PREMIUM_PROCESSING_TAB_NON_BUREAU}`
    );
  };

  const newRfiHandler = () => {
    if (taskId) {
      history.push(`${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_RFI}`);
    }
  };

  const caseFlagType = selectedCases?.[0]?.type;
  const selectedCasesType = caseFlagType?.split(',');
  const isQcFlag = Boolean(selectedCasesType?.some((flag) => flag === constants.QC_FLAG));

  return (
    <PremiumProcessingPendingActionAccordionView
      taskId={taskId}
      isValidRPSection={isValidRPSection}
      isUnassignedStage={isUnassignedStage}
      isIssueDocumentStage={isIssueDocumentStage}
      isWorkBasket={isWorkBasket}
      isAllCases={isAllCases}
      isCheckSigningCase={isCheckSigningCase}
      isQcFlag={isQcFlag}
      handlers={{ issueDocumentsHandler, newRfiHandler }}
    />
  );
}
