import get from 'lodash/get';
import has from 'lodash/has';
import round from 'lodash/round';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';
import config from 'config';

export const postPlacementSignDown = (values) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  let markets = [];
  const isSignDown = has(values, 'signedDownPercentage');

  const defaultError = {
    file: 'stores/placement.actions.signDown',
    message: 'Data missing for PUT request',
  };

  dispatch(postPlacementSignDownRequest(values));
  dispatch(addLoader('postPlacementSignDown'));

  if (!values || !values.policy_id) {
    dispatch(postPlacementSignDownFailure(defaultError));
    dispatch(enqueueNotification('notification.signDown.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postPlacementSignDown'));
    return;
  }

  // get the data for POST
  const policy = utils.policies.getById(get(getState(), 'placement.selected.policies'), values.policy_id);
  const statuses = get(getState(), 'referenceData.statuses.policyMarketQuote');
  const statusId = utils.referenceData.status.getIdByCode(statuses, constants.STATUS_MARKET_QUOTED);
  const marketsQuoted = utils.markets.getByStatusIds(utils.policy.getMarkets(policy), [statusId]);

  // update markets signed %
  if (isSignDown) {
    markets = utils.markets.signDown(marketsQuoted, values.signedDownPercentage);
  } else {
    markets = marketsQuoted.map((marketObj) => {
      if (marketObj.id === values.market_id) {
        const value = values.orderPercentage;
        const finalValue = value === 0 || value === '' || Boolean(value) ? value : utils.market.getLineSize(marketObj, true);

        return {
          ...marketObj,
          orderPercentage: round(finalValue, config.ui.format.percent.decimal),
        };
      }

      return marketObj;
    });
  }

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/policy/market/signdown/${values.policy_id}`,
      data: { markets },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementSignDownSuccess(data.markets));
      dispatch(enqueueNotification('notification.signDown.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementSignDown'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API put error (placement.signDown)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementSignDownFailure(err));
      dispatch(enqueueNotification('notification.signDown.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementSignDown'));
      return err;
    });
};

export const postPlacementSignDownRequest = (values) => {
  return {
    type: 'PLACEMENT_SIGN_DOWN_POST_REQUEST',
    payload: values,
  };
};

export const postPlacementSignDownSuccess = (responseData) => {
  return {
    type: 'PLACEMENT_POLICIES_SIGN_DOWN_POST_SUCCESS',
    payload: responseData,
  };
};

export const postPlacementSignDownFailure = (error) => {
  return {
    type: 'PLACEMENT_SIGN_DOWN_POST_FAILURE',
    payload: error,
  };
};
