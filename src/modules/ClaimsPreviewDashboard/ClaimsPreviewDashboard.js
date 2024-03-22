import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import get from 'lodash/get';
import moment from 'moment';

// app
import { ClaimsPreviewDashboardView } from './ClaimsPreviewDashboard.view';
import {
  selectClaimsInformation,
  selectLossInformation,
  selectClaimsPolicyInformation,
  getClaimsPreviewInformation,
  selectClaimsInterest,
  selectClaimInfoIsLoading,
  selectRefDataCatCodesList,
  getLossInformation,
  selectLossInfoIsLoading,
  getPolicyInformation,
  selectPolicyInfoIsLoading,
  getPolicySections,
  selectPolicySectionIsLoading,
  selectClaimsPolicySections,
  setClaimsStepperControl,
  selectClaimsTabSelectedClaimData,
  getViewTableDocuments,
  getBpmClaimDetails,
  selectBpmClaimInformation,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { Edit } from '@material-ui/icons';

export default function ClaimsPreviewDashboard(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const claimData = props.claimDataFromRef;
  const claimId = get(claimData, 'claimId') ?? '';
  const claimsInformation = useSelector(selectClaimsInformation);
  const claimStatus = claimsInformation?.claimStatus ?? '';
  const lossId = useSelector(selectClaimsTabSelectedClaimData)?.lossDetailID || '';

  const lossInformation = useSelector(selectLossInformation);
  const policyInformation = useSelector(selectClaimsPolicyInformation);
  const interests = useSelector(selectClaimsInterest)?.items;
  const isClaimInfoLoading = useSelector(selectClaimInfoIsLoading);
  const isLossInfoLoading = useSelector(selectLossInfoIsLoading);
  const isPolicyInfoLoading = useSelector(selectPolicyInfoIsLoading);
  const isPolicySectionLoading = useSelector(selectPolicySectionIsLoading);
  const policySections = useSelector(selectClaimsPolicySections);
  const origCurrencies = useSelector((state) => get(state, 'referenceData.currencyCodes'));
  const countriesList = useSelector((state) => get(state, 'referenceData.countriesList'));
  const catCodes = useSelector(selectRefDataCatCodesList);
  const catCode = catCodes.find((item) => Number(item.catCodesID) === lossInformation.catCodesID)?.catCodeDescription;

  const isInflightLoss = lossInformation?.isInflighLoss === 1;
  const isSectionEnabled = constants.CLAIM_SECTION_ENABLED_UG.indexOf(policyInformation.policyType) > -1 || false;

  const { data: bpmClaimInfo = {}, isLoading: isBpmClaimInfoLoading = false } = useSelector(selectBpmClaimInformation);

  const underWritingInfo = {
    items: claimsInformation?.policyUnderWritingGroupDtoList,
    isLoading: isClaimInfoLoading,
    basisOfOrder:
      claimsInformation?.basisOfOrder?.toString() === '0'
        ? utils.string.t('claims.typeOfSettlement.ourShare')
        : utils.string.t('claims.typeOfSettlement.oneHundredPercent'),
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
    return countryName;
  };

  useEffect(() => {
    if (claimData) {
      dispatch(
        getClaimsPreviewInformation({
          claimId: claimId.toString() || claimData?.claimID,
          claimRefParams: claimData?.claimReference,
          sourceIdParams: claimData?.sourceId || claimData?.sourceID,
          divisionIDParams: claimData?.divisionId || claimData?.departmentID || claimData?.divisionID,
          viewLoader: false,
        })
      );
      dispatch(
        getLossInformation({
          lossDetailsId: lossId || claimData?.lossDetailID,
          sourceIdParams: claimData?.sourceId || claimData?.sourceID,
          divisionIdParam: claimData?.divisionId || claimData?.departmentID || claimData?.divisionID,
          claimRefParam: claimData?.claimReference,
          viewLoader: false,
        })
      );
      dispatch(getBpmClaimDetails({ claimId: claimId || claimsInformation?.claimID, viewLoader: false }));
      dispatch(getPolicyInformation({ xbPolicyID: claimData?.policyId, xbInstanceID: claimData?.sourceId, viewLoader: false }));
      dispatch(getPolicySections({ xbPolicyID: claimData?.policyId, xbInstanceID: claimData?.sourceId, viewLoader: false }));
    }
  }, [claimData, lossId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditClaim = () => {
    dispatch(getViewTableDocuments({ referenceId: claimData?.claimReference, sectionType: constants.DMS_CONTEXT_CLAIM }));
    dispatch(setClaimsStepperControl(1));

    history.push({
      pathname: `${config.routes.claimsFNOL.newLoss}`,
      state: {
        linkPolicy: {
          isSearchTerm: '',
          claimObj: claimData,
        },
        redirectUrl: location?.pathname,
      },
    });
  };

  const lossInfo = [
    { title: utils.string.t('claims.lossInformation.ref'), value: lossInformation?.lossRef },
    {
      title: utils.string.t('claims.lossInformation.fromDate'),
      value: lossInformation?.fromDate && moment(lossInformation?.fromDate).format(config.ui.format.date.text),
    },
    {
      title: utils.string.t('claims.lossInformation.toDate'),
      value: lossInformation?.toDate && moment(lossInformation?.toDate).format(config.ui.format.date.text),
    },
    {
      title: utils.string.t('claims.lossInformation.dateAndTime'),
      value:
        (lossInformation?.firstContactDate && moment(lossInformation?.firstContactDate).format(config.ui.format.date.dateTime)) ||
        (isInflightLoss ? 'NA' : ''),
    },
    { title: utils.string.t('claims.lossInformation.name'), value: lossInformation?.lossName },
    { title: utils.string.t('claims.lossInformation.details'), value: lossInformation?.lossDescription },
    { title: utils.string.t('claims.lossInformation.catCode'), value: catCode },
    { title: utils.string.t('claims.lossInformation.assignedTo'), value: lossInformation?.assignedToName || (isInflightLoss ? 'NA' : '') },
  ];

  const claimInfo = [
    { title: utils.string.t('claims.claimInformation.claimRef'), value: claimsInformation?.claimReference },
    {
      title: utils.string.t('claims.claimInformation.claimReceivedDateTime'),
      value: claimsInformation?.claimReceivedDate && moment(claimsInformation?.claimReceivedDate).format(config.ui.format.date.dateTime),
    },
    { title: utils.string.t('claims.claimInformation.claimant'), value: claimsInformation?.claimantName },
    {
      title: utils.string.t('claims.columns.claimsManagement.lossDateQualifier'),
      value: claimsInformation?.lossQualifierName,
    },
    {
      title: utils.string.t('claims.columns.claimsManagement.lossDateFrom'),
      value: claimsInformation?.lossFromDate && moment(claimsInformation?.lossFromDate).format(config.ui.format.date.text),
    },
    {
      title: utils.string.t('claims.columns.claimsManagement.lossDateTo'),
      value: claimsInformation?.lossToDate && moment(claimsInformation?.lossToDate).format(config.ui.format.date.text),
    },
    { title: utils.string.t('claims.claimInformation.location'), value: claimsInformation?.location },
    {
      title: utils.string.t('claims.claimInformation.fguNarrative'),
      value: claimsInformation?.fgunarrative,
    },
    {
      title: utils.string.t('claims.claimInformation.adjustorType'),
      value:
        claimsInformation?.beAdjusterID === 0
          ? utils.string.t('claims.claimInformation.nonBeAdjuster')
          : utils.string.t('claims.claimInformation.beAdjuster'),
    },
    {
      title: `${utils.string.t('claims.claimInformation.complexityBasis')}${'*'}`,
      value: claimsInformation?.complexity,
    },
    {
      title: utils.string.t('claims.claimInformation.adjustorName'),
      value: claimsInformation?.beAdjusterID !== 0 ? claimsInformation.adjusterName : claimsInformation.nonBEAdjusterName,
    },
    { title: utils.string.t('claims.claimInformation.referral'), value: claimsInformation?.referralValue },
    { title: utils.string.t('claims.claimInformation.claimStatus'), value: claimsInformation?.claimStatus },
    { title: utils.string.t('claims.claimInformation.workflowStatus'), value: bpmClaimInfo?.status, type: 'bpm' },

    {
      title: utils.string.t('claims.claimInformation.adjustorRef'),
      value: claimsInformation?.adjusterReference,
    },
    {
      title: utils.string.t('claims.claimInformation.rfiResponse'),
      value: claimsInformation?.referralResponseDescription,
    },
    {
      title: utils.string.t('claims.claimInformation.priority'),
      value: claimsInformation?.priorityDescription,
    },
    { title: utils.string.t('claims.claimInformation.claimStage'), value: bpmClaimInfo?.claimStage, type: 'bpm' },
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
    {
      title: utils.string.t('claims.searchPolicy.columns.riskDetails'),
      value: policyInformation?.policyNote,
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.inceptionDate'),
      value: policyInformation?.inceptionDate && moment(policyInformation?.inceptionDate).format(config.ui.format.date.text),
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.expiryDate'),
      value: policyInformation?.expiryDate && moment(policyInformation?.expiryDate).format(config.ui.format.date.text),
      isLoading: isPolicyInfoLoading,
    },
    { title: utils.string.t('claims.columns.claimsManagement.client'), value: policyInformation?.client, isLoading: isPolicyInfoLoading },
    { title: utils.string.t('claims.columns.claimsManagement.insured'), value: policyInformation?.insured, isLoading: isPolicyInfoLoading },
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
      title: utils.string.t('claims.columns.claimsManagement.reinsured'),
      value: policyInformation?.reInsured,
      isLoading: isPolicyInfoLoading,
    },
    { title: utils.string.t('claims.columns.claimsManagement.company'), value: policyInformation?.company, isLoading: isPolicyInfoLoading },
    {
      title: utils.string.t('claims.columns.claimsManagement.division'),
      value: policyInformation?.division,
      isLoading: isPolicyInfoLoading,
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
      title: utils.string.t('claims.columns.claimsManagement.interest'),
      value: interests?.find((item) => item.policyInterestID === claimsInformation.policyInterestID)?.description,
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

  const [accordionsExpandStatus, setAccordiansStatus] = useState({
    [utils.string.t('claims.lossInformation.title')]: true,
    [utils.string.t('claims.claimInformation.policyTitle')]: true,
    [utils.string.t('claims.underWritingGroups.tilteInformation')]: true,
    [utils.string.t('claims.claimInformation.title')]: true,
  });

  const setAccordiansIsExpanded = (cardName, isExpand) => {
    const accordionsStatus = { ...accordionsExpandStatus };
    accordionsStatus[cardName] = isExpand;
    setAccordiansStatus(accordionsStatus);
  };

  const sections = [
    {
      title: utils.string.t('claims.claimInformation.title'),
      handleExpanded: (isExpanded) => {
        setAccordiansIsExpanded(utils.string.t('claims.claimInformation.title'), isExpanded);
      },
      isExpanded: accordionsExpandStatus[utils.string.t('claims.claimInformation.title')],
      data: claimInfo?.map((info) => ({
        ...info,
        isLoading: info?.type === 'bpm' ? isBpmClaimInfoLoading : isClaimInfoLoading,
      })),
      actions: [
        ...(!utils.string.isEqual(claimStatus, constants.STATUS_CLAIMS_DRAFT, { caseSensitive: false })
          ? []
          : [
              {
                id: 'edit',
                icon: Edit,
                color: 'primary',
                disabled: true,
                onClick: () => handleEditClaim(claimsInformation),
              },
            ]),
      ],
    },
    {
      title: utils.string.t('claims.claimInformation.policyTitle'),
      isExpanded: accordionsExpandStatus[utils.string.t('claims.claimInformation.policyTitle')],
      handleExpanded: (isExpanded) => {
        setAccordiansIsExpanded(utils.string.t('claims.claimInformation.policyTitle'), isExpanded);
      },
      data: policyInfo,
    },
    {
      title: utils.string.t('claims.underWritingGroups.tilteInformation'),
      isExpanded: accordionsExpandStatus[utils.string.t('claims.underWritingGroups.tilteInformation')],
      handleExpanded: (isExpanded) => {
        setAccordiansIsExpanded(utils.string.t('claims.underWritingGroups.tilteInformation'), isExpanded);
      },
      data: underWritingInfo,
    },
    {
      title: utils.string.t('claims.lossInformation.title'),
      isExpanded: accordionsExpandStatus[utils.string.t('claims.lossInformation.title')],
      handleExpanded: (isExpanded) => {
        setAccordiansIsExpanded(utils.string.t('claims.lossInformation.title'), isExpanded);
      },
      data: lossInfo?.map((info) => ({
        ...info,
        isLoading: isLossInfoLoading,
      })),
    },
  ];

  // abort
  if (!claimsInformation) return null;

  return <ClaimsPreviewDashboardView sections={sections} underWritingGroupColumns={underWritingGroupColumns} />;
}
