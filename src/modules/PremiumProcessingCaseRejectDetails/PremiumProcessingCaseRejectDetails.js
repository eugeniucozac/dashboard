import React from 'react';
import { useSelector } from 'react-redux';
//app
import PremiumProcessingCaseRejectDetailsView from './PremiumProcessingCaseRejectDetails.view';
import { selectCaseHistoryDetails, selectCaseHistoryLoadingFlag, selectCaseHistoryDetailsAPIError } from 'stores';
import * as utils from 'utils';

export default function PremiumProcessingCaseRejectDetails() {
  const caseHistoryDetailsObject = useSelector(selectCaseHistoryDetails);
  const rdHistoryData = utils.generic.isValidObject(caseHistoryDetailsObject?.rejectDetailsHistory)
    ? caseHistoryDetailsObject.rejectDetailsHistory
    : {};
  const isCaseRejectDetailsLoading = useSelector(selectCaseHistoryLoadingFlag);
  const isAPIErrorMsg = useSelector(selectCaseHistoryDetailsAPIError);

  return <PremiumProcessingCaseRejectDetailsView caseRejectDetails={rdHistoryData} isCaseRejectDetailsLoading={isCaseRejectDetailsLoading} isAPIErrorMsg={isAPIErrorMsg}/>;
}
