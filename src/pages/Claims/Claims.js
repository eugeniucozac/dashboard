import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Helmet } from 'react-helmet';

// app
import { ClaimsView } from './Claims.view';
import {
  postClaimDetailsInformationSuccess,
  getLossInformation,
  getClaimsPreviewInformation,
  selectCatCodes,
  selectLossQualifiers,
  selectPriorities,
  selectSettlementCurrency,
  selectReferralResponse,
  selectClaimData,
  setClaimData,
  claimsPolicyData,
  getPolicyInformation,
  getClaimantNames,
  getInterest,
  getBEAdjuster,
  getLossQualifiers,
  getCatCodes,
  getPriorityLevels,
  getSettlementCurrency,
  selectClaimsPolicyData,
  getClaimDetailsSuccess,
  setClaimsStepperControl,
  getComplexityValues,
  getReferralValues,
  getReferralResponse,
  getQueryCodeList,
  resetLossSubmission,
  resetLossPolicyClaimData,
  resetSelectedLossItem,
} from 'stores';
import * as utils from 'utils';
import config from 'config';

export default function Claims() {
  const dispatch = useDispatch();
  const history = useHistory();
  const brand = useSelector((state) => state.ui.brand);
  const claimData = useSelector(selectClaimData);
  const claimCurrentPolicyData = useSelector(selectClaimsPolicyData);
  const catCodes = useSelector(selectCatCodes);
  const priorities = useSelector(selectPriorities);
  const lossQualifiers = useSelector(selectLossQualifiers);
  const settlementCurrency = useSelector(selectSettlementCurrency);
  const referralResponse = useSelector(selectReferralResponse);

  const handleRegisterNewLoss = () => {
    dispatch(resetLossSubmission());
    dispatch(resetLossPolicyClaimData());
    history.push({
      pathname: config.routes.claimsFNOL.newLoss,
      state: {
        isNewLoss: true,
      },
    });
    dispatch(setClaimData({}));
  };

  const handleComplexityRulesManagement = () => {
    history.push(config.routes.claimsFNOL.complexityRules);
  };

  useEffect(() => {
    if (utils.generic.isInvalidOrEmptyArray(catCodes)) {
      dispatch(getCatCodes());
    }
    if (utils.generic.isInvalidOrEmptyArray(priorities)) {
      dispatch(getPriorityLevels());
    }
    if (utils.generic.isInvalidOrEmptyArray(lossQualifiers)) {
      dispatch(getLossQualifiers());
    }
    if (utils.generic.isInvalidOrEmptyArray(settlementCurrency)) {
      dispatch(getSettlementCurrency());
    }
    if (utils.generic.isInvalidOrEmptyArray(referralResponse)) {
      dispatch(getReferralResponse());
    }
    dispatch(setClaimData({}));
    dispatch(getQueryCodeList());
    dispatch(setClaimsStepperControl(0));
    dispatch(resetSelectedLossItem());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (claimData?.claimId) {
      dispatch(getLossInformation({ lossDetailsId: claimData.lossId, sourceIdParams: claimData.sourceID }));
      dispatch(
        claimsPolicyData({
          xbInstanceID: claimData.xbInstanceID,
          xbPolicyID: claimData.xbPolicyID,
          policyNumber: claimData.policyNumber,
          divisionID: claimData.divisionID,
        })
      );
    }
  }, [claimData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (claimData?.claimId && claimCurrentPolicyData?.xbInstanceID) {
      async function fetchData() {
        dispatch(getPolicyInformation());
        dispatch(getInterest());
        dispatch(getBEAdjuster());
        dispatch(getClaimantNames());

        dispatch(postClaimDetailsInformationSuccess(claimData.claimId));
        const claimDetails = await dispatch(
          getClaimsPreviewInformation({
            claimId: claimData?.claimId,
            claimRefParams: claimData?.claimReference,
            sourceIdParams: claimData?.sourceID,
            divisionIDParams: claimData?.divisionID,
          })
        );
        dispatch(getClaimDetailsSuccess(claimDetails));
        dispatch(getComplexityValues());
        dispatch(getReferralValues());
      }
      fetchData();
    }
  }, [claimCurrentPolicyData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('claims.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <ClaimsView handleComplexityRulesManagement={handleComplexityRulesManagement} handleRegisterNewLoss={handleRegisterNewLoss} />
    </>
  );
}
