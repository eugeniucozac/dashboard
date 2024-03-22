import get from 'lodash/get';
import has from 'lodash/has';
import compact from 'lodash/compact';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader, updateSelectedPolicyMarket } from 'stores';
import * as utils from 'utils';

export const postPlacementEditQuote = (data) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const policies = get(getState(), 'placement.selected.policies', []);
  const policyMarket = utils.policies.getMarketById(policies, data.policyMarketId);
  const market = get(policyMarket, 'market', {});
  const isMarketUpdated = data.capacityTypeId && data.capacityTypeId !== market.capacityTypeId;

  const defaultError = {
    file: 'stores/placement.actions.editQuote',
    message: 'Data missing for PUT request',
  };

  dispatch(postPlacementEditQuoteRequest(data));
  dispatch(addLoader('postPlacementEditQuote'));

  if (!data || !policyMarket || !policyMarket.id) {
    dispatch(postPlacementEditQuoteFailure(defaultError));
    dispatch(enqueueNotification('notification.editQuote.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postPlacementEditQuote'));
    return;
  }

  // create the body for PUT
  // update the policyMarket object with edited data
  const body = {
    ...policyMarket,
    statusId: has(data, 'statusId') ? data.statusId : policyMarket.statusId,
    isLeader: data.isLeader,
    lineToStand: data.lineToStand,
    subjectivities: has(data, 'subjectivities') ? data.subjectivities : policyMarket.subjectivities,
    quoteDate: has(data, 'quoteDate') ? data.quoteDate : policyMarket.quoteDate,
    validUntilDate: has(data, 'validUntilDate') ? data.validUntilDate : policyMarket.validUntilDate,
    premium: has(data, 'premium') ? (data.premium === '' ? null : parseFloat(data.premium)) : parseFloat(policyMarket.premium),
    writtenLinePercentage: has(data, 'writtenLinePercentage')
      ? data.writtenLinePercentage === ''
        ? null
        : parseFloat(data.writtenLinePercentage)
      : parseFloat(policyMarket.writtenLinePercentage),
  };

  return Promise.all(
    compact([
      utils.api.put({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/policy/market/${policyMarket.id}`,
        data: body,
      }),
      isMarketUpdated
        ? utils.api.patch({
            token: auth.accessToken,
            endpoint: endpoint.edge,
            path: `api/market/${market.id}`,
            data: {
              capacityTypeId: data.capacityTypeId,
            },
          })
        : null,
    ])
  )
    .then((response) => Promise.all(response.map((r) => utils.api.handleResponse(r))))
    .then((json) => Promise.all(json.map((j) => utils.api.handleData(j))))
    .then((data) => {
      dispatch(
        postPlacementEditQuoteSuccess({
          ...data[0],
          ...(data[1] && { market: data[1] }),
        })
      );
      dispatch(updateSelectedPolicyMarket());
      dispatch(enqueueNotification('notification.editQuote.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementEditQuote'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API put error (placement.editQuote)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementEditQuoteFailure(err));
      dispatch(enqueueNotification('notification.editQuote.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementEditQuote'));
      return err;
    });
};

export const postPlacementEditQuoteRequest = (formData) => {
  return {
    type: 'PLACEMENT_EDIT_QUOTE_POST_REQUEST',
    payload: formData,
  };
};

export const postPlacementEditQuoteSuccess = (responseData) => {
  return {
    type: 'PLACEMENT_POLICY_MARKET_EDIT_POST_SUCCESS',
    payload: responseData,
  };
};

export const postPlacementEditQuoteFailure = (error) => {
  return {
    type: 'PLACEMENT_EDIT_QUOTE_POST_FAILURE',
    payload: error,
  };
};
