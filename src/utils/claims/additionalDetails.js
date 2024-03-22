import moment from 'moment';

// app
import * as utils from 'utils';
import config from 'config';

const utilsAdditionalDetails = {
  getLossCardInfo: (lossInformation, catCodes, isInflightLoss, isLoading) => {
    return [
      { title: utils.string.t('claims.lossInformation.ref'), value: lossInformation?.lossRef || 'NA', isLoading },
      {
        title: utils.string.t('claims.lossInformation.fromDate'),
        value: (lossInformation?.fromDate && moment(lossInformation?.fromDate).format(config.ui.format.date.slashNumeric)) || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.lossInformation.toDate'),
        value: (lossInformation?.toDate && moment(lossInformation?.toDate).format(config.ui.format.date.slashNumeric)) || 'NA',
        isLoading,
      },
      { title: utils.string.t('claims.lossInformation.name'), value: lossInformation?.lossName || 'NA', isLoading },
      {
        title: utils.string.t('claims.lossInformation.dateAndTime'),
        value:
          (lossInformation?.firstContactDate &&
            moment(lossInformation?.firstContactDate).format(config.ui.format.date.slashNumericDateAndTime)) ||
          (isInflightLoss ? 'NA' : ''),
        isLoading,
      },
      {
        title: utils.string.t('claims.lossInformation.assignedTo'),
        value: lossInformation?.assignedToName || (isInflightLoss ? 'NA' : ''),
      },
      { title: utils.string.t('claims.lossInformation.details'), value: lossInformation?.lossDescription || 'NA', isLoading },
      {
        title: utils.string.t('claims.lossInformation.catCode'),
        value: !utils.generic.isInvalidOrEmptyArray(catCodes)
          ? catCodes.find((item) => Number(item?.catCodesID) === Number(lossInformation?.catCodesID))?.catCodeDescription || 'NA'
          : 'NA',
        isLoading,
      },
    ];
  },

  getPolicyCardInfo: (
    policyInformation,
    claimsInformation,
    interests,
    originalCurrencies,
    settlementCurrencies,
    countriesList,
    isPolicyInfoLoading,
    isClaimInfoLoading
  ) => {
    return [
      {
        title: utils.string.t('claims.columns.claimsManagement.policyRef'),
        value: policyInformation?.policyRef || 'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.columns.claimsManagement.policyType'),
        value: policyInformation?.policyType || 'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.searchPolicy.columns.policyStatus'),
        value: policyInformation?.statusCode || 'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.columns.claimsManagement.company'),
        value: policyInformation?.company || 'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.columns.claimsManagement.division'),
        value: policyInformation?.division || 'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.searchPolicy.columns.riskDetails'),
        value: policyInformation?.policyNote || 'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.columns.claimsManagement.client'),
        value: policyInformation?.client || 'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.columns.claimsManagement.insured'),
        value: policyInformation?.insured || 'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.columns.claimsManagement.reinsured'),
        value: policyInformation?.reInsured || 'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.searchPolicy.columns.inceptionDate'),
        value:
          (policyInformation?.inceptionDate &&
            moment(policyInformation?.inceptionDate).format(config.ui.format.date.slashNumericDateAndTime)) ||
          'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.searchPolicy.columns.expiryDate'),
        value:
          (policyInformation?.expiryDate && moment(policyInformation?.expiryDate).format(config.ui.format.date.slashNumericDateAndTime)) ||
          'NA',
        isLoading: isPolicyInfoLoading,
      },
      {
        title: utils.string.t('claims.columns.claimsManagement.interest'),
        value: interests?.find((item) => item?.policyInterestID === claimsInformation?.policyInterestID)?.description || 'NA',
        isLoading: isClaimInfoLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.certificateInceptionDate'),
        value: claimsInformation?.isBordereau
          ? (claimsInformation?.certificateInceptionDate &&
              moment(claimsInformation?.certificateInceptionDate).format(config.ui.format.date.slashNumericDateAndTime)) ||
            'NA'
          : 'NA',
        isLoading: isClaimInfoLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.certificateExpiryDate'),
        value: claimsInformation?.isBordereau
          ? (claimsInformation?.certificateExpiryDate &&
              moment(claimsInformation?.certificateExpiryDate).format(config.ui.format.date.slashNumericDateAndTime)) ||
            'NA'
          : 'NA',
        isLoading: isClaimInfoLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.certificateNumber'),
        value: claimsInformation?.isBordereau ? claimsInformation?.certificateNumber || 'NA' : 'NA',
        isLoading: isClaimInfoLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.originalCurrency'),
        value:
          !utils.generic.isInvalidOrEmptyArray(originalCurrencies) && claimsInformation?.originalCurrency
            ? `${claimsInformation?.originalCurrency} - ${
                originalCurrencies.find(
                  (currency) => currency?.currencyCd?.toLowerCase() === claimsInformation?.originalCurrency?.toLowerCase()
                )?.currencyName
              }`
            : '--',
        isLoading: isClaimInfoLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.settlementCurrency'),
        value:
          !utils.generic.isInvalidOrEmptyArray(settlementCurrencies) && claimsInformation?.settlementCurrencyCode
            ? `${claimsInformation?.settlementCurrencyCode} - ${
                settlementCurrencies.find(
                  (currency) => currency?.currencyCd?.toLowerCase() === claimsInformation?.settlementCurrencyCode?.toLowerCase()
                )?.currencyName
              }`
            : '--',
        isLoading: isClaimInfoLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.country'),
        value:
          !utils.generic.isInvalidOrEmptyArray(countriesList) && claimsInformation?.settlementCountry
            ? countriesList?.find((country) => country?.countryCode?.toLowerCase() === claimsInformation?.settlementCountry?.toLowerCase())
                ?.countryName
            : '--',
        isLoading: isClaimInfoLoading,
      },
    ];
  },

  getClaimCardInfo: (claimsInformation, lossQualifiers, isLoading) => {
    return [
      {
        title: utils.string.t('claims.claimInformation.claimRef'),
        value: claimsInformation?.claimReference || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.claimReceivedDateTime'),
        value:
          (claimsInformation?.claimReceivedDate &&
            moment(claimsInformation?.claimReceivedDate).format(config.ui.format.date.slashNumeric)) ||
          'NA',
        isLoading,
      },
      { title: utils.string.t('claims.claimInformation.claimant'), value: claimsInformation?.claimantName || 'NA', isLoading },
      {
        title: utils.string.t('claims.columns.claimsManagement.lossDateFrom'),
        value:
          (claimsInformation?.lossFromDate &&
            moment(claimsInformation?.lossToDate).format(config.ui.format.date.slashNumericDateAndTime)) ||
          'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.columns.claimsManagement.lossDateTo'),
        value:
          (claimsInformation?.lossToDate && moment(claimsInformation?.lossToDate).format(config.ui.format.date.slashNumericDateAndTime)) ||
          'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.lossQualifier'),
        value:
          claimsInformation?.lossQualifierName || claimsInformation?.lossQualifierID
            ? lossQualifiers?.find((Lq) => Number(Lq?.id) === Number(claimsInformation?.lossQualifierID))?.name
            : 'NA',
        isLoading,
      },
      { title: utils.string.t('claims.claimInformation.location'), value: claimsInformation?.location || 'NA', isLoading },
      {
        title: utils.string.t('claims.claimInformation.fguNarrative'),
        value: claimsInformation?.fgunarrative || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.priority'),
        value: claimsInformation?.priorityDescription || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.adjustorType'),
        value:
          claimsInformation?.beAdjusterID === 0
            ? utils.string.t('claims.claimInformation.nonBeAdjuster')
            : utils.string.t('claims.claimInformation.beAdjuster'),
        isLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.adjustorName'),
        value: claimsInformation?.beAdjusterID !== 0 ? claimsInformation?.adjusterName : claimsInformation?.nonBEAdjusterName,
        isLoading,
      },

      {
        title: utils.string.t('claims.claimInformation.adjustorRef'),
        value: claimsInformation?.adjusterReference || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.complexityBasis'),
        value: claimsInformation?.complexity || 'NA',
        isLoading,
      },
      { title: utils.string.t('claims.claimInformation.referral'), value: claimsInformation?.referralValue || 'NA', isLoading },
      {
        title: utils.string.t('claims.claimInformation.rfiResponse'),
        value: claimsInformation?.referralResponseDescription || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.bordereauClaim'),
        value: claimsInformation?.bordereauClaim === 1 ? 'Yes' : 'No',
        isLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.bordereauPeriod'),
        value: claimsInformation?.bordereauClaim === 1 ? claimsInformation?.bordereauPeriod : 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.claimInformation.claimStatus'),
        value: claimsInformation?.claimStatus || 'NA',
        isLoading,
      },
    ];
  },

  getTaskCardInfo: (taskInformation, sanctionCheckStatus, isLoading) => {
    return [
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.taskRef'),
        value: taskInformation?.taskRef || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.targetDueDate'),
        value: (taskInformation?.targetDueDate && moment(taskInformation?.targetDueDate).format(config.ui.format.date.text)) || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.status'),
        value: taskInformation?.status || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.taskType'),
        value: taskInformation?.taskType || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.assignedTo'),
        value: taskInformation?.assigneeFullName || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.priority'),
        value: taskInformation?.priority || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.dateCreated'),
        value: (taskInformation?.createdOn && moment(taskInformation?.createdOn).format(config.ui.format.date.text)) || 'NA',
        isLoading,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.sanctionsCheckStatus'),
        value: sanctionCheckStatus?.value || 'NA',
        isLoading,
      },
    ];
  },
};

export default utilsAdditionalDetails;
