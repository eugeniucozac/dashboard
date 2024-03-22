import get from 'lodash/get';

import { authLogout, addLoader, enqueueNotification, removeLoader, setClaimData } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const postClaimDetailsInformation = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, user, config: { vars: { endpoint } }, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postClaimDetailsInformation',
  };

  dispatch(postClaimDetailsInformationRequest(formData));
  dispatch(addLoader('postClaimDetailsInformation'));

  const nowIsoString = utils.date.toISOString(new Date());

  const assignedFullName = get(user, 'fullName');
  const defaultValues = get(claims, 'allClaimDetails');
  const claimantNames = get(claims, 'claimantNames');
  const referralValues = get(claims, 'referralValues');
  const referralResponse = get(claims, 'referralResponse');
  const underWritingGroups = get(claims, 'underWritingGroups.items');
  const newClaimants = claimantNames.filter((claimant) => typeof claimant.id === 'number').map((claimant) => claimant.name);
  const policyUnderWritingGroupDtoList = underWritingGroups.filter((ug) => ug.selected);
  const selectedbeAdjuster = get(claims, 'beAdjuster.selectedbeAdjuster');
  const beAdjusterID = formData?.adjuster === 'beAdjuster' ? selectedbeAdjuster?.id : null;
  const nonBEAdjusterName = formData?.adjuster === 'nonBeAdjuster' ? formData.nonBeAdjuster : null;
  const policyInterestID = get(claims, 'interest')?.items[0]?.policyInterestID;

  const referralValuesAssignedTo = referralValues.find((item) => item.complexityRulesID === Number(formData.referral));
  const findReferralValues = referralValuesAssignedTo?.complexityRulesValue.includes('Assign to Myself');
  const referralResponseAssignedTo = referralResponse.find((item) => item.id === formData.rfiResponse);
  const findReferralResponse = referralResponseAssignedTo?.description.includes('Assign to Myself');
  const refRequired = 'Referral Required';

  const addDateAndTime = (date, time) => {
    if (!date) return date;
    let actualDate = new Date(
      utils.string.t('format.date', { value: { date: date, format: 'D MMM YYYY' } }) + ' ' + (time ? time + ':00' : '00:00:00')
    );
    return actualDate || date;
  };

  const reqData = {
    ...defaultValues,
    assignedTo: findReferralValues || findReferralResponse ? assignedFullName : 'Unassigned',
    basisOfOrder: formData?.order,
    adjusterName: formData.adjusterName,
    adjusterReference: formData?.adjusterReference,
    fgunarrative: formData?.fgunarrative,
    location: formData.location,
    lossQualifierID: formData?.lossQualifierID?.id || '',
    lossQualifierName: formData?.lossQualifierID?.name || '',
    movementType: formData.movementType,
    orderPercentage: formData.orderPercentage,
    settlementCurrencyCode: formData?.settlementCurrencyCode?.currencyCd,
    newClaimants,
    createdBy: user.id,
    claimantName: formData?.claimantName?.name,
    createdDate: nowIsoString,
    policySectionID: formData?.ugSections?.id === constants.CLAIM_POLICY_SECTION_DEFAULT ? null : formData?.ugSections?.id,
    policyUnderWritingGroupDtoList,
    updatedBy: user.id,
    updatedDate: nowIsoString,
    submittedDate: nowIsoString,
    lossFromDate: formData.fromDate ? utils.date.toISOString(formData.fromDate) : null,
    lossToDate: formData.toDate ? utils.date.toISOString(formData.toDate) : null,
    priorityDescription: formData?.priority?.description || 'Medium',
    priorityID: formData?.priority?.id || 3,
    beAdjusterID,
    nonBEAdjusterName,
    policyInterestID,
    certificateExpiryDate:
      typeof formData?.bordereauClaim !== 'undefined' && !formData?.bordereauClaim && formData?.certificateExpiryDate
        ? utils.date.toISOString(formData?.certificateExpiryDate)
        : null,
    certificateInceptionDate:
      typeof formData?.bordereauClaim !== 'undefined' && !formData?.bordereauClaim && formData?.certificateInceptionDate
        ? utils.date.toISOString(formData?.certificateInceptionDate)
        : null,
    certificateNumber:
      typeof formData?.bordereauClaim !== 'undefined' && !formData?.bordereauClaim && formData?.certificateNumber
        ? formData?.certificateNumber
        : null,
    complexityValueID: formData?.complexity?.complexityRulesID,
    complexityValue: formData?.complexity?.complexityRulesValue,
    referralValueID: formData?.complexity?.complexityRulesValue === refRequired ? formData?.referral?.complexityRulesID : null,
    referralValue: formData?.complexity?.complexityRulesValue === refRequired ? formData?.referral?.complexityRulesValue : null,
    referralResponseID: formData?.complexity?.complexityRulesValue === refRequired ? formData?.rfiResponse?.id : null,
    referralResponseDescription: formData?.complexity?.complexityRulesValue === refRequired ? formData?.rfiResponse?.description : null,
    claimReceivedDate: addDateAndTime(formData?.claimReceivedDate, formData?.claimReceivedTime),
    bordereauPeriod: typeof formData?.bordereauClaim !== 'undefined' && formData?.bordereauClaim ? formData?.bordereauPeriod?.id : null,
    bordereauClaim: formData?.bordereauClaim ? 1 : 0,
    insuredID: parseInt(formData?.insured?.id) || null,
    clientID: parseInt(formData?.client?.id) || null,
    settlementCountry: formData?.countryCode?.countryCode || null,
    originalCurrency: formData?.originalCurrencyCode?.currencyCd || null,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims',
      data: reqData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postClaimDetailsInformationSuccess(data.data));
      dispatch(enqueueNotification('notification.claimInformation.success', 'success'));
      dispatch(removeLoader('postClaimDetailsInformation'));
      dispatch(
        setClaimData({
          lossId: reqData.lossDetailID,
          claimId: data?.data?.claimID,
          policyRef: reqData.policyRef,
          policyNumber: reqData.policyRef,
          xbInstanceID: reqData.xbInstanceID,
          xbPolicyID: reqData.xbPolicyID,
          claimRef: data?.data?.claimReference,
        })
      );
      return data.data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postClaimDetailsInformationFailure(err));
      dispatch(enqueueNotification('notification.claimInformation.fail', 'error'));
      dispatch(removeLoader('postClaimDetailsInformation'));
      return err;
    });
};

export const postClaimDetailsInformationRequest = (data) => {
  return {
    type: 'CLAIMS_DETAILS_INFORMATION_POST_REQUEST',
    payload: data,
  };
};

export const postClaimDetailsInformationSuccess = (responseData) => {
  return {
    type: 'CLAIMS_DETAILS_INFORMATION_POST_SUCCESS',
    payload: responseData,
  };
};

export const postClaimDetailsInformationFailure = (error) => {
  return {
    type: 'CLAIMS_DETAILS_INFORMATION_POST_FAILURE',
    payload: error,
  };
};
