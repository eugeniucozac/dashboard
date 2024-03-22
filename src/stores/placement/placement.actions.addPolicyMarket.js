import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';
import numbro from 'numbro';

export const postPlacementAddPolicyMarket = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(postPlacementAddPolicyMarketRequest(formData));
  dispatch(addLoader('postPlacementAddPolicyMarket'));

  const policyId = get(formData, 'policy');
  const market = get(formData, 'market[0]');
  const nonPFMarket = get(formData, 'nonPFMarket');
  const uw = get(formData, 'underwriter') || [];
  const uwDefault = uw.filter((uw) => !Boolean(uw.__isNew__))[0];
  const uwProvisional = uw
    .filter((uw) => Boolean(uw.__isNew__))
    .map((uw) => {
      return Object.assign({}, { name: uw.value });
    })[0];

  const defaultError = {
    file: 'stores/placement.actions.addPolicyMarket',
    message: 'Data missing for POST request',
  };

  const marketType = {
    ...(market && { market: pick(market, ['id']) }),
    ...(nonPFMarket && { nonPFMarket }),
  };

  if (!formData || !policyId || isEmpty(marketType)) {
    dispatch(postPlacementAddPolicyMarketFailure(defaultError));
    dispatch(enqueueNotification('notification.addMarket.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postPlacementAddPolicyMarket'));
    return;
  }

  const hasQuote = formData.status || formData.premium || formData.writtenLinePercentage;

  // get the data for POST
  const body = {
    parentPolicyId: policyId,
    sourceSystemId: get(getState(), 'placement.selected.sourceSystemId'),
    ...marketType,
    ...(uwDefault && { underwriter: pick(uwDefault, ['id']) }),
    ...(uwProvisional && { provisionalUnderwriter: pick(uwProvisional, ['name']) }),
    ...(hasQuote && {
      ...omit(formData, ['status', 'currency', 'policy', 'market', 'underwriter', 'quoteOptions']),
      statusId: get(formData, 'status'),
      isLeader: formData.isLeader,
      lineToStand: formData.lineToStand,
      ...(formData.premium && { premium: numbro.unformat(formData.premium) }),
      ...(formData.writtenLinePercentage && { writtenLinePercentage: numbro.unformat(formData.writtenLinePercentage) }),
    }),
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/policy/market',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementAddPolicyMarketSuccess(data));
      dispatch(enqueueNotification('notification.addMarket.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementAddPolicyMarket'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (placement.addPolicyMarket)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementAddPolicyMarketFailure(err));
      dispatch(enqueueNotification('notification.addMarket.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementAddPolicyMarket'));
      return err;
    });
};

export const postPlacementAddPolicyMarketRequest = (formData) => {
  return {
    type: 'PLACEMENT_ADD_POLICY_MARKET_POST_REQUEST',
    payload: formData,
  };
};

export const postPlacementAddPolicyMarketSuccess = (responseData) => {
  return {
    type: 'PLACEMENT_POLICY_MARKET_ADD_POST_SUCCESS',
    payload: responseData,
  };
};

export const postPlacementAddPolicyMarketFailure = (error) => {
  return {
    type: 'PLACEMENT_ADD_POLICY_MARKET_POST_FAILURE',
    payload: error,
  };
};
