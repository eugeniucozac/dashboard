import React from 'react';
import { useSelector } from 'react-redux';
//app
import PremiumProcessingCaseQualityControlView from './PremiumProcessingCaseQualityControl.view';
import { selectCaseDetails,selectCaseHistoryLoadingFlag, selectCaseHistoryDetailsAPIError } from 'stores';
import * as utils from 'utils';

export default function PremiumProcessingCaseQualityControl() {
  const caseDetailsObject = useSelector(selectCaseDetails);
  const qcHistoryData = utils.generic.isValidArray(caseDetailsObject?.caseHistoryDetails?.qualityControlHistory, true)
    ? caseDetailsObject?.caseHistoryDetails?.qualityControlHistory
    : [];
  const isCaseQualityControlLoading = useSelector(selectCaseHistoryLoadingFlag);
  const isAPIErrorMsg = useSelector(selectCaseHistoryDetailsAPIError);

  return <PremiumProcessingCaseQualityControlView caseQcList={qcHistoryData} caseDetailsObject={caseDetailsObject} isCaseQualityControlLoading={isCaseQualityControlLoading} isAPIErrorMsg={isAPIErrorMsg}/>;
}
