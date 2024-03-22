import React from 'react';
import { useSelector } from 'react-redux';
//app
import PremiumProcessingCaseResubmissionDetailsView from './PremiumProcessingCaseResubmissionDetails.view';
import { selectCaseHistoryDetails, selectCaseHistoryLoadingFlag, selectCaseHistoryDetailsAPIError } from 'stores';
import * as utils from 'utils';

export default function PremiumProcessingCaseResubmissionDetails() {
  const caseHistoryDetailsObject = useSelector(selectCaseHistoryDetails);
  const rsHistoryData = utils.generic.isValidArray(caseHistoryDetailsObject?.resubmitDetailsHistory, true)
    ? caseHistoryDetailsObject.resubmitDetailsHistory
    : [];
  const isCaseResubmissionDetailsLoading = useSelector(selectCaseHistoryLoadingFlag);
  const isAPIErrorMsg = useSelector(selectCaseHistoryDetailsAPIError);
  return <PremiumProcessingCaseResubmissionDetailsView caseResubmitDetails={rsHistoryData} isCaseResubmissionDetailsLoading={isCaseResubmissionDetailsLoading} isAPIErrorMsg={isAPIErrorMsg}/>;
}
