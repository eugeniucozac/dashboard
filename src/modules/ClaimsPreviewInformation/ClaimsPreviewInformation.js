import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// app
import { ClaimsPreviewInformationView } from './ClaimsPreviewInformation.view';
import * as utils from 'utils';
import {
  selectClaimsInformation,
  getClaimsPreviewInformation,
  getPolicyInformation,
  selectLossQualifiers,
  selectLossInformation,
  selectCatCodes,
  selectClaimsPolicyInformation,
  selectClaimsInterest,
  selectBEAdjusterList,
  selectClaimsPolicySections,
  showModal,
} from 'stores';
import * as constants from 'consts';

export default function ClaimsPreviewInformation(props) {
  const dispatch = useDispatch();
  const claimPreviewInfo = useSelector(selectClaimsInformation);
  const lossInformation = useSelector(selectLossInformation);
  const catCodes = useSelector(selectCatCodes);
  const lossQualifiers = useSelector(selectLossQualifiers);
  const policyInformation = useSelector(selectClaimsPolicyInformation);
  const interests = useSelector(selectClaimsInterest)?.items;
  const beAdjuster = useSelector(selectBEAdjusterList)?.items;
  const policySections = useSelector(selectClaimsPolicySections);
  const [currentContextActive, setCurrentContextActive] = useState(true);

  const interestObj = interests?.find((item) => item.policyInterestID === claimPreviewInfo.policyInterestID);
  const interest = interestObj?.description;
  const beAdjusterName = beAdjuster?.find((item) => item.id === claimPreviewInfo?.beAdjusterID?.toString())?.name;
  const selectedLossQualifier =
    claimPreviewInfo && lossQualifiers.find((list) => parseInt(list.id) === claimPreviewInfo.lossQualifierID)?.name;
  const isSectionEnabled = constants.CLAIM_SECTION_ENABLED_UG.indexOf(policyInformation.policyType) > -1 || false;

  const claimDetails = {
    claimant: claimPreviewInfo.claimantName,
    status: claimPreviewInfo.claimStatus,
    claimRef: claimPreviewInfo.claimReference,
    lossQualifierName: selectedLossQualifier,
    lossDateFrom: claimPreviewInfo?.lossFromDate,
    lossDateTo: claimPreviewInfo?.lossToDate,
    adjusterType:
      claimPreviewInfo?.beAdjusterID === 0
        ? utils.string.t('claims.claimInformation.nonBeAdjuster')
        : utils.string.t('claims.claimInformation.beAdjuster'),
    adjusterName: claimPreviewInfo?.beAdjusterID !== 0 ? beAdjusterName : claimPreviewInfo.nonBEAdjusterName,
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
    claimReceivedDate: claimPreviewInfo?.claimReceivedDate,
    bordereauPeriod: claimPreviewInfo?.bordereauPeriod,
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
    dispatch(getClaimsPreviewInformation({ claimId: claimPreviewInfo?.claimId, claimRefParams: claimPreviewInfo?.claimReference, sourceIdParams: claimPreviewInfo?.sourceID, divisionIDParams: claimPreviewInfo?.divisionID }));
    dispatch(getPolicyInformation());
    if (claimPreviewInfo.claimStatus === 'submitted') {
      props.handleNext();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClaimSubmit = () => {
    if (claimPreviewInfo.complexityBasis === 'Referral Required' && claimPreviewInfo.referralResponseDescription === null) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            fullWidth: true,
            title: utils.string.t('claims.complexityRulesManagementDetails.alertModal.title'),
            maxWidth: 'xs',
            componentProps: {
              confirmLabel: utils.string.t('app.ok'),
              confirmMessage: utils.string.t('claims.modals.referralResponse.subtitle'),
              hideCancelButton: true,
              buttonColors: { confirm: 'secondary' },
              submitHandler: () => { },
              handleClose: () => { },
            },
          },
        })
      );
    } else {
      dispatch(
        showModal({
          component: 'CONFIRM_CLAIM_SUBMISSION',
          props: {
            title: utils.string.t('claims.modals.confirmClaimSubmission.title'),
            fullWidth: false,
            maxWidth: 'sm',
            disableAutoFocus: true,
            componentProps: { handleNext: props.handleNext },
          },
        })
      );
    }
  };

  return (
    <ClaimsPreviewInformationView
      {...props}
      policyInformation={policyInformation}
      lossInformation={lossInformation}
      catCodes={catCodes}
      lossQualifiers={lossQualifiers}
      claimInformation={claimDetails}
      columns={underWritingGroupColumns}
      handleClaimSubmit={handleClaimSubmit}
      claimPreviewInfo={claimPreviewInfo}
      setCurrentContextActive={setCurrentContextActive}
      currentContextActive={currentContextActive}
    />
  );
}
