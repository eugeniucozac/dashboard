import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// app
import { ViewClaimInformationView } from './ViewClaimInformation.view';
import { hideModal, submitClaimDetailsInformation } from 'stores';
import * as utils from 'utils';
import {
  selectClaimsInformation,
  getClaimsPreviewInformation,
  getLossQualifiers,
  getCatCodes,
  getPolicyInformation,
  selectLossQualifiers,
  selectLossInformation,
  selectCatCodes,
  selectClaimsPolicyInformation,
  selectClaimsInterest,
  selectClaimsPolicySections,
  getLossInformation,
  claimsPolicyData,
  postClaimDetailsInformationSuccess,
  selectClaimsProcessingSelected,
  getInterest,
  getBEAdjuster,
  getPolicySections,
} from 'stores';
import * as constants from 'consts';

export default function ViewClaimInformation({ claimData, isAssignedToHidden = true, isWorkflowStatusHidden = true }) {
  useEffect(() => {
    dispatch(
      getLossInformation({
        lossDetailsId: claimData.lossDetailID,
        sourceIdParams: claimData.sourceID,
        divisionIdParam: claimData.divisionID,
        claimRefParam: claimData.claimReference,
      })
    );
    dispatch(claimsPolicyData({ xbInstanceID: claimData.xbInstanceID, xbPolicyID: claimData.xbPolicyID }));
    dispatch(getPolicyInformation());
    dispatch(getInterest());
    dispatch(getBEAdjuster());
    dispatch(postClaimDetailsInformationSuccess(claimData.claimID));
    dispatch(
      getClaimsPreviewInformation({
        claimId: claimData?.claimID,
        claimRefParams: claimData?.claimReference,
        sourceIdParams: claimData?.sourceID,
        divisionIDParams: claimData?.divisionID || claimData?.departmentID,
      })
    );
    if (utils.generic.isInvalidOrEmptyArray(lossQualifiers)) {
      dispatch(getLossQualifiers());
    }
    if (utils.generic.isInvalidOrEmptyArray(catCodes)) {
      dispatch(getCatCodes());
    }
    dispatch(getPolicySections());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dispatch = useDispatch();
  const claimPreviewInfo = useSelector(selectClaimsInformation);
  const lossInformation = useSelector(selectLossInformation);
  const catCodes = useSelector(selectCatCodes);
  const lossQualifiers = useSelector(selectLossQualifiers);
  const policyInformation = useSelector(selectClaimsPolicyInformation);
  const interests = useSelector(selectClaimsInterest)?.items;
  const policySections = useSelector(selectClaimsPolicySections);

  const interestObj = interests?.find((item) => item.policyInterestID === claimPreviewInfo.policyInterestID);
  const interest = interestObj?.description;
  let selectedLossQualifier =
    claimPreviewInfo && lossQualifiers.find((list) => parseInt(list.id) === claimPreviewInfo.lossQualifierID)?.name;
  const isSectionEnabled = constants.CLAIM_SECTION_ENABLED_UG.indexOf(policyInformation.policyType) > -1 || false;
  const claimsProcessingSelected = useSelector(selectClaimsProcessingSelected);
  const claimSelected = claimsProcessingSelected?.[0];
  const claimDetails = {
    claimant: claimPreviewInfo.claimantName,
    status: claimPreviewInfo.claimStatus,
    claimRef: claimPreviewInfo.claimReference,
    lossQualifierName: selectedLossQualifier,
    lossDateFrom: claimPreviewInfo.lossFromDate,
    lossDateTo: claimPreviewInfo.lossToDate,
    adjusterType:
      claimPreviewInfo?.beAdjusterID === 0
        ? utils.string.t('claims.claimInformation.nonBeAdjuster')
        : utils.string.t('claims.claimInformation.beAdjuster'),
    adjusterName: claimPreviewInfo?.beAdjusterID !== 0 ? claimPreviewInfo.adjusterName : claimPreviewInfo.nonBEAdjusterName,
    adjusterRef: claimPreviewInfo?.adjusterReference,
    priority: claimPreviewInfo?.priorityDescription,
    settlementCurrency: claimPreviewInfo?.settlementCurrencyCode,
    interest: interest,
    complexity: claimPreviewInfo?.complexity,
    complexityBasis: claimPreviewInfo?.complexityBasis,
    referral: claimPreviewInfo?.referralValue,
    referralResponse: claimPreviewInfo?.referralResponseDescription,
    location: claimPreviewInfo?.location,
    fguNarrative: claimPreviewInfo?.fgunarrative,
    processNotes: claimPreviewInfo?.processNotes,
    isBordereau: claimPreviewInfo?.isBordereau,
    certificateNumber: claimPreviewInfo?.certificateNumber,
    ucr: claimPreviewInfo?.ucr,
    claimReceivedDate: claimPreviewInfo.claimReceivedDate,
    certificateInceptionDate: claimPreviewInfo?.certificateInceptionDate,
    certificateExpiryDate: claimPreviewInfo?.certificateExpiryDate,
    basisOfOrder: `${claimPreviewInfo?.basisOfOrder || 0}%`,
    orderPercentage: `${claimPreviewInfo?.orderPercentage || 0} %`,
    movementType: claimPreviewInfo?.movementType,
    underWritingGroupData: claimPreviewInfo?.policyUnderWritingGroupDtoList,
    policySectionID: claimPreviewInfo?.policySectionID,
    policySectionDesc: !isSectionEnabled
      ? ''
      : !claimPreviewInfo?.policySectionID
      ? utils.string.t('app.all')
      : policySections?.find((sec) => sec.id.toString() === claimPreviewInfo?.policySectionID?.toString())?.name,
    documentInfo: {
      firmOrder: { name: 'Filename1.pdf', type: 'pdf' },
      processingInstructions: { name: 'Filename2.pdf', type: 'pdf' },
      transactionSheets: { name: 'Filename3.html', type: 'html' },
    },
    bordereauPeriod: claimPreviewInfo?.bordereauPeriod,
    assignedTo: claimSelected?.assignedTo,
    workflowStatus: claimSelected?.processState,
  };
  const underWritingGroupColumns = [
    {
      id: 'groupRef',
      label: utils.string.t('claims.underWritingGroups.groupRef'),
    },
    {
      id: 'percentage',
      label: utils.string.t('claims.underWritingGroups.percentage'),
    },
    {
      id: 'facility',
      label: utils.string.t('claims.underWritingGroups.facility'),
    },
    {
      id: 'facilityRef',
      label: utils.string.t('claims.underWritingGroups.facilityRef'),
    },
    {
      id: 'slipLeader',
      label: utils.string.t('claims.underWritingGroups.slipLeader'),
    },
    {
      id: 'narrative',
      label: utils.string.t('claims.underWritingGroups.narrative'),
    },
    {
      id: 'dateValidFrom',
      label: utils.string.t('claims.underWritingGroups.dateValidFrom'),
    },
    {
      id: 'dateValidTo',
      label: utils.string.t('claims.underWritingGroups.dateValidTo'),
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.yes'),
      handler: () => dispatch(hideModal()),
    },
    {
      name: 'cancel',
      label: utils.string.t('app.no'),
      handler: () => dispatch(submitClaimDetailsInformation()),
    },
  ];

  const handleCancel = () => {
    dispatch(hideModal());
  };

  return (
    <ViewClaimInformationView
      actions={actions}
      handleCancel={handleCancel}
      lossInformation={lossInformation}
      catCodes={catCodes}
      policyInformation={policyInformation}
      claimInformation={claimDetails}
      columns={underWritingGroupColumns}
      isAssignedToHidden={isAssignedToHidden}
      isWorkflowStatusHidden={isWorkflowStatusHidden}
    />
  );
}
