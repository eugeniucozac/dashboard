import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import get from 'lodash/get';
import moment from 'moment';

import * as utils from 'utils';
import { ClaimsAcknowledgementView } from './ClaimsAcknowledgement.view';
import {
  selectClaimIdUnderProgress,
  selectClaimsInformation,
  selectLossInformation,
  selectClaimsPolicyInformation,
  getClaimsPreviewInformation,
  selectClaimsInterest,
  selectClaimInfoIsLoading,
  selectCatCodes,
  getLossInformation,
  selectLossInfoIsLoading,
  getPolicyInformation,
  selectPolicyInfoIsLoading,
  getPolicySections,
  selectPolicySectionIsLoading,
  selectClaimsPolicySections,
  setClaimData,
  setClaimsStepperControl,
  getCatCodes,
} from 'stores';
import config from 'config';
import * as constants from 'consts';

export default function ClaimsAcknowledgement(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const claimData = useSelector(selectClaimIdUnderProgress) || props.claimDataFromRef;
  const claimId = get(claimData, 'claimID') ?? '';

  const claimsInformation = useSelector(selectClaimsInformation);
  const lossInformation = useSelector(selectLossInformation);
  const policyInformation = useSelector(selectClaimsPolicyInformation);
  const interests = useSelector(selectClaimsInterest)?.items;
  const isClaimInfoLoading = useSelector(selectClaimInfoIsLoading);
  const isLossInfoLoading = useSelector(selectLossInfoIsLoading);
  const isPolicyInfoLoading = useSelector(selectPolicyInfoIsLoading);
  const isPolicySectionLoading = useSelector(selectPolicySectionIsLoading);
  const catCodes = useSelector(selectCatCodes);
  const policySections = useSelector(selectClaimsPolicySections);
  const origCurrencies = useSelector((state) => get(state, 'referenceData.currencyCodes'));
  const countriesList = useSelector((state) => get(state, 'referenceData.countriesList'));

  const catCodeDescription = (id) => {
    let description = catCodes.find((item) => Number(item.id) === id)?.description;
    let catCodeName = catCodes.find((item) => Number(item.id) === id)?.name;
    return `${catCodeName} - ${description}`;
  };

  const isInflightLoss = lossInformation?.isInflighLoss === 1;
  const isSectionEnabled = constants.CLAIM_SECTION_ENABLED_UG.indexOf(policyInformation.policyType) > -1 || false;

  const underWritingInfo = {
    items: claimsInformation?.policyUnderWritingGroupDtoList,
    isLoading: isClaimInfoLoading,
    basisOfOrder: claimsInformation?.basisOfOrder?.toString() === '0' ? 'Our Share' : '100%',
    movementType: claimsInformation?.movementType,
    orderPercentage: claimsInformation?.orderPercentage,
    isPolicySectionLoading: isPolicySectionLoading,
    policySectionInfo: !isSectionEnabled
      ? 'NA'
      : !claimsInformation?.policySectionID
      ? utils.string.t('app.all')
      : policySections?.find((sec) => sec?.id?.toString() === claimsInformation?.policySectionID?.toString())?.name,
  };

  const getCurrencyName = (currencyCode) => {
    const currencyName = origCurrencies?.find(
      (currency) => currency?.currencyCd?.toLowerCase() === currencyCode?.toLowerCase()
    )?.currencyName;
    return `${currencyCode} - ${currencyName}`;
  };

  const getCountryName = (countryCode) => {
    const countryName = countriesList?.find((country) => country?.countryCode?.toLowerCase() === countryCode?.toLowerCase())?.countryName;
    return `${countryCode}-${countryName}`;
  };

  useEffect(() => {
    dispatch(
      getLossInformation({
        lossDetailsId: claimData?.lossDetailID,
        sourceIdParams: claimData?.sourceID,
        divisionIdParam: claimData?.divisionID,
        claimRefParam: claimData?.claimReference,
        viewLoader: false,
      })
    );
    dispatch(
      getClaimsPreviewInformation({
        claimId: claimId,
        claimRefParams: claimData?.claimReference,
        sourceIdParams: claimData?.sourceID,
        divisionIDParams: claimData?.divisionID || claimData?.departmentID,
        viewLoader: false,
      })
    );
    dispatch(getPolicyInformation({ viewLoader: false }));
    dispatch(getPolicySections({ viewLoader: false }));
    dispatch(getCatCodes());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditClaim = () => {
    async function fetchData() {
      dispatch(
        setClaimData({
          lossId: claimData?.lossDetailID,
          claimId: claimId,
          policyRef: policyInformation?.policyRef,
          policyNumber: policyInformation?.policyRef,
          xbInstanceID: policyInformation?.xbInstanceID,
          xbPolicyID: policyInformation?.xbPolicyID,
          divisionID: claimData?.divisionID,
          sourceID: claimData?.sourceID,
          claimReference: claimData?.claimReference,
        })
      );
      await dispatch(setClaimsStepperControl(1));
      await history.push(config.routes.claimsFNOL.newLoss);
    }
    fetchData();
  };

  const lossInfo = [
    { title: utils.string.t('claims.lossInformation.ref'), value: lossInformation?.lossRef },
    {
      title: utils.string.t('claims.lossInformation.fromDate'),
      value: lossInformation?.fromDate && moment(lossInformation?.fromDate).format(config.ui.format.date.slashNumeric),
    },
    {
      title: utils.string.t('claims.lossInformation.toDate'),
      value: lossInformation?.toDate && moment(lossInformation?.toDate).format(config.ui.format.date.slashNumeric),
    },
    { title: utils.string.t('claims.lossInformation.name'), value: lossInformation?.lossName },
    {
      title: utils.string.t('claims.lossInformation.dateAndTime'),
      value:
        (lossInformation?.firstContactDate &&
          moment(lossInformation?.firstContactDate).format(config.ui.format.date.slashNumericDateAndTime)) ||
        (isInflightLoss ? 'NA' : ''),
    },
    { title: utils.string.t('claims.lossInformation.assignedTo'), value: lossInformation?.assignedToName || (isInflightLoss ? 'NA' : '') },
    { title: utils.string.t('claims.lossInformation.details'), value: lossInformation?.lossDescription },
    {
      title: utils.string.t('claims.lossInformation.catCode'),
      value: !isNaN(lossInformation?.catCodesID) && catCodeDescription(lossInformation?.catCodesID),
    },
  ];

  const claimInfo = [
    { title: utils.string.t('claims.claimInformation.claimRef'), value: claimsInformation?.claimReference },
    {
      title: utils.string.t('claims.claimInformation.claimReceivedDateTime'),
      value:
        claimsInformation?.claimReceivedDate && moment(claimsInformation?.claimReceivedDate).format(config.ui.format.date.slashNumeric),
    },
    { title: utils.string.t('claims.claimInformation.claimant'), value: claimsInformation?.claimantName },
    {
      title: utils.string.t('claims.columns.claimsManagement.lossDateFrom'),
      value:
        claimsInformation?.lossFromDate && moment(claimsInformation?.lossFromDate).format(config.ui.format.date.slashNumericDateAndTime),
    },
    {
      title: utils.string.t('claims.columns.claimsManagement.lossDateTo'),
      value: claimsInformation?.lossToDate && moment(claimsInformation?.lossToDate).format(config.ui.format.date.slashNumericDateAndTime),
    },
    { title: utils.string.t('claims.columns.claimsManagement.lossDateQualifier'), value: claimsInformation?.lossQualifierName },
    { title: utils.string.t('claims.claimInformation.location'), value: claimsInformation?.location },
    { title: utils.string.t('claims.claimInformation.fguNarrative'), value: claimsInformation?.fgunarrative },
    { title: utils.string.t('claims.claimInformation.priority'), value: claimsInformation?.priorityDescription },
    {
      title: utils.string.t('claims.claimInformation.adjustorType'),
      value:
        claimsInformation?.beAdjusterID === 0
          ? utils.string.t('claims.claimInformation.nonBeAdjuster')
          : utils.string.t('claims.claimInformation.beAdjuster'),
    },
    {
      title: utils.string.t('claims.claimInformation.adjustorName'),
      value: claimsInformation?.beAdjusterID !== 0 ? claimsInformation.adjusterName : claimsInformation.nonBEAdjusterName,
    },

    { title: utils.string.t('claims.claimInformation.adjustorRef'), value: claimsInformation?.adjusterReference },
    { title: utils.string.t('claims.claimInformation.complexityBasis') + '*', value: claimsInformation?.complexity },
    { title: utils.string.t('claims.claimInformation.referral') + '*', value: claimsInformation?.referralValue },
    { title: utils.string.t('claims.claimInformation.rfiResponse') + '*', value: claimsInformation?.referralResponseDescription },
    { title: utils.string.t('claims.claimInformation.claimStatus'), value: claimsInformation?.claimStatus },
  ];

  const policyInfo = [
    {
      title: utils.string.t('claims.columns.claimsManagement.policyRef'),
      value: policyInformation?.policyRef,
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.columns.claimsManagement.policyType'),
      value: policyInformation?.policyType,
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.policyStatus'),
      value: policyInformation?.statusCode,
      isLoading: isPolicyInfoLoading,
    },
    { title: utils.string.t('claims.columns.claimsManagement.company'), value: policyInformation?.company, isLoading: isPolicyInfoLoading },
    {
      title: utils.string.t('claims.columns.claimsManagement.division'),
      value: policyInformation?.division,
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.riskDetails'),
      value: policyInformation?.policyNote,
      isLoading: isPolicyInfoLoading,
    },
    { title: utils.string.t('claims.columns.claimsManagement.client'), value: policyInformation?.client, isLoading: isPolicyInfoLoading },
    { title: utils.string.t('claims.columns.claimsManagement.insured'), value: policyInformation?.insured, isLoading: isPolicyInfoLoading },
    {
      title: utils.string.t('claims.columns.claimsManagement.reinsured'),
      value: policyInformation?.reInsured,
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.inceptionDate'),
      value:
        policyInformation?.inceptionDate && moment(policyInformation?.inceptionDate).format(config.ui.format.date.slashNumericDateAndTime),
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.expiryDate'),
      value: policyInformation?.expiryDate && moment(policyInformation?.expiryDate).format(config.ui.format.date.slashNumericDateAndTime),
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.columns.claimsManagement.interest'),
      value: interests?.find((item) => item.policyInterestID === claimsInformation.policyInterestID)?.description,
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.bordereauClaim'),
      value: claimsInformation?.bordereauClaim === 1 ? 'Yes' : 'No',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.certificateInceptionDate'),
      value: claimsInformation?.isBordereau
        ? claimsInformation?.certificateInceptionDate &&
          moment(claimsInformation?.certificateInceptionDate).format(config.ui.format.date.slashNumericDateAndTime)
        : 'NA',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.certificateExpiryDate'),
      value: claimsInformation?.isBordereau
        ? claimsInformation?.certificateExpiryDate &&
          moment(claimsInformation?.certificateExpiryDate).format(config.ui.format.date.slashNumericDateAndTime)
        : 'NA',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.certificateNumber'),
      value: claimsInformation?.isBordereau ? claimsInformation?.certificateNumber : 'NA',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.bordereauPeriod'),
      value: claimsInformation?.bordereauClaim === 1 ? claimsInformation?.bordereauPeriod : 'NA',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.originalCurrency'),
      value: claimsInformation?.originalCurrency && getCurrencyName(claimsInformation?.originalCurrency),
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.settlementCurrency'),
      value: claimsInformation?.settlementCurrencyCode && getCurrencyName(claimsInformation?.settlementCurrencyCode),
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.country'),
      value: claimsInformation?.settlementCountry && getCountryName(claimsInformation?.settlementCountry),
      isLoading: isClaimInfoLoading,
    },
  ];

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
      id: 'ucr',
      label: utils.string.t('claims.underWritingGroups.ucr'),
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

  return (
    <ClaimsAcknowledgementView
      {...props}
      lossInfo={lossInfo?.map((info) => ({
        ...info,
        isLoading: isLossInfoLoading,
      }))}
      policyInfo={policyInfo}
      underWritingInfo={underWritingInfo}
      underWritingGroupColumns={underWritingGroupColumns}
      claimInfo={claimInfo?.map((info) => ({
        ...info,
        isLoading: isClaimInfoLoading,
      }))}
      claimsInformation={claimsInformation}
      handlers={{
        back: props?.handleBack,
        finish: props?.handleFinish,
        step: props?.handleStep,
        editClaim: handleEditClaim,
      }}
    />
  );
}
