import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ClaimRefDetailView from './ClaimRefDetail.view';

// app
import * as utils from 'utils';

import {
  selectClaimsInformation,
  getLossInformation,
  claimsPolicyData,
  getClaimsPreviewInformation,
  getInterest,
  getBEAdjuster,
  getClaimsAssociateWithLoss,
  getLossQualifiers,
  getCatCodes,
  getPolicyInformation,
  selectLossQualifiers,
  selectLossInformation,
  selectCatCodes,
  selectClaimsPolicyInformation,
  selectClaimsInterest,
  selectClaimsProcessingSelected,
  selectClaimsPolicySections,
  getPolicySections,
} from 'stores';
import { CLAIM_SECTION_ENABLED_UG } from 'consts';

ClaimRefDetail.propTypes = {
  claimData: PropTypes.object.isRequired,
  setCheckPage: PropTypes.func,
};

export default function ClaimRefDetail({ claimData, setCheckPage }) {
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
  const selectedLossQualifier = lossQualifiers?.find(
    (list) => list?.id?.toString() === claimPreviewInfo?.lossQualifierID?.toString()
  )?.name;
  const claimsProcessingSelected = useSelector(selectClaimsProcessingSelected);
  const claimSelected = claimsProcessingSelected?.[0];

  const isSectionEnabled = CLAIM_SECTION_ENABLED_UG.includes(policyInformation.policyType);

  const claimDetails = {
    claimant: claimPreviewInfo?.claimantName || '',
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
    ucr: claimPreviewInfo?.ucr,
    adjusterRef: claimPreviewInfo?.adjusterReference,
    priority: claimPreviewInfo?.priorityDescription,
    settlementCurrency: claimPreviewInfo?.settlementCurrencyCode,
    interest,
    complexity: claimPreviewInfo?.complexity,
    complexityBasis: claimPreviewInfo?.complexityBasis,
    referral: claimPreviewInfo?.referralValue,
    referralResponse: claimPreviewInfo?.referralResponseDescription,
    location: claimPreviewInfo?.location,
    fguNarrative: claimPreviewInfo?.fgunarrative,
    processNotes: claimPreviewInfo?.processNotes,
    isBordereau: claimPreviewInfo?.isBordereau,
    certificateNumber: claimPreviewInfo?.certificateNumber,
    certificateInceptionDate: claimPreviewInfo?.certificateInceptionDate,
    certificateExpiryDate: claimPreviewInfo?.certificateExpiryDate,
    orderPercentage: `${claimPreviewInfo?.orderPercentage || 0} %`,
    underWritingGroupData: claimPreviewInfo?.policyUnderWritingGroupDtoList,
    claimReceivedDate: claimPreviewInfo?.claimReceivedDate,
    movementType: claimPreviewInfo?.movementType,
    basisOfOrder: `${claimPreviewInfo?.basisOfOrder || 0}%`,
    bordereauPeriod: claimPreviewInfo?.bordereauPeriod,
    assignedTo: claimSelected?.assignedTo,
    workflowStatus: claimSelected?.processState,
    policySectionDesc: !isSectionEnabled
      ? ''
      : !claimPreviewInfo?.policySectionID
      ? utils.string.t('app.all')
      : policySections?.find((sec) => sec.id.toString() === claimPreviewInfo?.policySectionID?.toString())?.name,
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
  useEffect(() => {
    if (utils.generic.isValidObject(claimData)) {
      dispatch(
        getLossInformation({
          lossDetailsId: claimData?.lossDetailID,
          sourceIdParams: claimData?.sourceId,
          divisionIdParam: claimData?.divisionID,
          claimRefParam: claimData?.claimRef,
        })
      );
      dispatch(claimsPolicyData({ xbInstanceID: claimData?.sourceId, xbPolicyID: claimData?.policyId }));
      dispatch(getPolicyInformation());
      dispatch(getInterest());
      dispatch(getBEAdjuster());
      dispatch(
        getClaimsPreviewInformation({
          claimId: claimData?.claimID,
          claimRefParams: claimData?.claimRef,
          sourceIdParams: claimData?.sourceId,
          divisionIDParams: claimData?.divisionID,
        })
      );
      if (!lossQualifiers.length) {
        dispatch(getLossQualifiers());
      }
      if (!catCodes.length) {
        dispatch(getCatCodes());
      }
      dispatch(getClaimsAssociateWithLoss(claimData?.lossDetailID));
      dispatch(getPolicySections());
    }
  }, [claimData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ClaimRefDetailView
      policyInformation={policyInformation}
      lossInformation={lossInformation}
      catCodes={catCodes}
      lossQualifiers={lossQualifiers}
      claimInformation={claimDetails}
      columns={underWritingGroupColumns}
      setCheckPage={setCheckPage}
    />
  );
}
