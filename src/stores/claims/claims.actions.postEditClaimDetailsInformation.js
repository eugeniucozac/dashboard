import get from 'lodash/get';

import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';

export const postEditClaimDetailsInformation = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postEditClaimDetailsInformation',
  };

  dispatch(postEditClaimDetailsInformationRequest(formData));
  dispatch(addLoader('postEditClaimDetailsInformation'));
  const claimSubmissionId = get(claims, 'claimData').claimId || get(claims, 'claimsInformation').claimID || '';
  const underWritingGroups = get(claims, 'underWritingGroups.items');
  const policyUnderWritingGroupDtoList = underWritingGroups.filter((ug) => ug.selected);
  const editClaimDetails = get(claims, 'claimsInformation');
  const beAdjusterID =
    formData?.adjuster && formData?.adjuster === 'beAdjuster'
      ? parseInt(formData?.beAdjuster?.id)
      : formData?.adjuster && formData?.adjuster === 'nonBeAdjuster'
      ? 0
      : editClaimDetails?.beAdjusterID;
  const adjusterName =
    formData?.adjuster && formData?.adjuster === 'beAdjuster' ? null : formData?.nonBeAdjuster || editClaimDetails?.adjusterName;
  const data = {
    ...editClaimDetails,
    policyInterestID: formData?.interest?.policyInterestID || editClaimDetails?.policyInterestID,
    clientID: parseInt(formData?.client?.id) || editClaimDetails?.clientID,
    insuredID: parseInt(formData?.insured?.id) || editClaimDetails?.insuredID,
    settlementCountry: formData?.countryCode?.countryCode || editClaimDetails?.settlementCountry,
    originalCurrency: formData?.originalCurrencyCode?.currencyCd || editClaimDetails?.originalCurrency,
    settlementCurrencyCode: formData?.settlementCurrencyCode?.currencyCd || editClaimDetails?.settlementCurrencyCode,
    movementType: formData?.movementType || editClaimDetails?.movementType,
    basisOfOrder: Boolean(formData?.order) ? formData?.order : editClaimDetails?.basisOfOrder,
    orderPercentage: formData?.orderPercentage || editClaimDetails?.orderPercentage,
    policyUnderWritingGroupDtoList,
    beAdjusterID: beAdjusterID,
    adjusterName,
    nonBEAdjusterName:
      formData?.adjuster && formData?.adjuster === 'nonBeAdjuster'
        ? formData?.nonBeAdjuster
        : formData?.adjuster === 'beAdjuster'
        ? null
        : editClaimDetails?.nonBEAdjusterName,
    adjusterReference: formData?.adjusterReference || editClaimDetails?.adjusterReference,
    claimantName: formData?.claimantName?.name || editClaimDetails?.claimantName,
    complexityBasis: formData?.complexity?.complexityRulesID || editClaimDetails?.complexityBasis,
    complexityValueID: formData?.complexity?.complexityRulesID || editClaimDetails?.complexityValueID,
    location: formData?.location || editClaimDetails?.location,
    fgunarrative: formData?.fgunarrative || editClaimDetails?.fgunarrative,
    claimReceivedDate: formData?.claimReceivedDate || editClaimDetails?.claimReceivedDate,
    lossQualifierID: parseInt(formData?.lossQualifierID) || editClaimDetails?.lossQualifierID,
    lossQualifierName: editClaimDetails?.lossQualifierName || null,
    priorityID: parseInt(formData?.priority) || editClaimDetails?.priorityID,
    referralValueID: formData?.referral?.complexityRulesID || editClaimDetails?.referralValueID,
    referralResponseID: formData?.rfiResponse?.id || editClaimDetails?.referralResponseID,
    lossFromDate: formData?.fromDate ? utils.date.toISOString(formData?.fromDate) : editClaimDetails?.lossFromDate,
    lossToDate: formData?.toDate ? utils.date.toISOString(formData?.toDate) : editClaimDetails?.lossToDate,
    bordereauClaim: formData?.bordereauClaim ? 1 : formData?.bordereauClaim === false ? 0 : editClaimDetails?.bordereauClaim,
    bordereauPeriod:
      typeof formData?.bordereauPeriod === 'undefined'
        ? editClaimDetails?.bordereauPeriod
        : typeof formData?.bordereauClaim !== 'undefined' && formData?.bordereauClaim
        ? formData?.bordereauPeriod?.id
        : null,
    certificateExpiryDate:
      typeof formData?.bordereauClaim !== 'undefined' && !formData?.bordereauClaim
        ? typeof formData?.certificateExpiryDate === 'undefined'
          ? editClaimDetails?.certificateExpiryDate
          : formData?.certificateExpiryDate
          ? utils.date.toISOString(formData?.certificateExpiryDate)
          : null
        : null,
    certificateInceptionDate:
      typeof formData?.bordereauClaim !== 'undefined' && !formData?.bordereauClaim
        ? typeof formData?.certificateInceptionDate === 'undefined'
          ? editClaimDetails?.certificateInceptionDate
          : formData?.certificateInceptionDate
          ? utils.date.toISOString(formData?.certificateInceptionDate)
          : null
        : null,
    certificateNumber:
      typeof formData?.bordereauClaim !== 'undefined' && !formData?.bordereauClaim
        ? typeof formData?.certificateNumber === 'undefined'
          ? editClaimDetails?.certificateNumber
          : formData?.certificateNumber
        : null,
  };

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims/${claimSubmissionId}/update`,
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postEditClaimDetailsInformationSuccess(data.data));
      dispatch(enqueueNotification('notification.claimEditDetails.success', 'success'));
      dispatch(removeLoader('postEditClaimDetailsInformation'));
      return data.data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postEditClaimDetailsInformationFailure(err));
      dispatch(enqueueNotification('notification.claimEditDetails.fail', 'error'));
      dispatch(removeLoader('postEditClaimDetailsInformation'));
      return err;
    });
};

export const postEditClaimDetailsInformationRequest = (data) => {
  return {
    type: 'CLAIMS_DETAILS_INFORMATION_UPDATE_REQUEST',
    payload: data,
  };
};

export const postEditClaimDetailsInformationSuccess = (data) => {
  return {
    type: 'CLAIMS_DETAILS_INFORMATION_UPDATE_SUCCESS',
    payload: data,
  };
};

export const postEditClaimDetailsInformationFailure = (error) => {
  return {
    type: 'CLAIMS_DETAILS_INFORMATION_UPDATE_FAILURE',
    payload: error,
  };
};
