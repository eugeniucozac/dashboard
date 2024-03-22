import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import { PremiumProcessingCaseAccordionView } from './PremiumProcessingCaseAccordion.view';
import * as utils from 'utils';
import config from 'config';
import { selectCaseIsCheckSigning, selectRefDataQueryCodes } from 'stores';

PremiumProcessingCaseAccordion.propTypes = {
  caseTeamDetails: PropTypes.object,
  caseRfiDetails: PropTypes.object.isRequired,
  caseInstructionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  caseInstructionStatusId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedCases: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    caseTeamHandler: PropTypes.func.isRequired,
    caseRfiHandler: PropTypes.func.isRequired,
  }).isRequired,
};

export default function PremiumProcessingCaseAccordion({
  caseTeamDetails,
  caseRfiDetails,
  caseInstructionId,
  caseInstructionStatusId,
  selectedCases,
  handlers,
}) {
  const selectedCase = selectedCases?.[0];
  const isSubmittedProcessing = utils.processingInstructions.status.isSubmittedProcessing(caseInstructionStatusId);
  const isRfiCase = utils.generic.isValidArray(selectedCases, true) && utils.premiumProcessing.isRfi(selectedCases?.[0]);
  const isCheckSigningCase = useSelector(selectCaseIsCheckSigning);
  const queryCodes = useSelector(selectRefDataQueryCodes);
  const queryCodesRfi = queryCodes.find((queryCode) => queryCode?.queryCodeDetails === caseRfiDetails?.queryCode);
  const clickCaseDetails = () => {
    handlers.caseTeamHandler();
  };

  const clickPiLink = () => {
    if (isSubmittedProcessing) {
      window.open(`${config.routes.processingInstructions.steps}/${caseInstructionId}`, '_blank');
    } else {
      handlers.openUpdatingPopup();
    }
  };

  return (
    <PremiumProcessingCaseAccordionView
      selectedCase={selectedCase}
      caseDetails={caseTeamDetails}
      caseInstructionId={caseInstructionId}
      rfiDetails={caseRfiDetails}
      isRfi={isRfiCase}
      isCheckSigningCase={isCheckSigningCase}
      queryCodesRfi={queryCodesRfi}
      handlers={{ ...handlers, clickCaseDetails, clickPiLink }}
    />
  );
}
