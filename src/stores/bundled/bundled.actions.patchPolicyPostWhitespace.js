// app
import { enqueueNotification } from 'stores';
import * as utils from 'utils';
import { createWhitespacePolicy, patchPolicy } from 'stores';

export const patchPolicyPostWhitespace = (policy, body) => (dispatch, getState) => {
  dispatch(patchPolicyPostWhitespaceRequest(policy, body));

  const defaultError = {
    file: 'stores/bundled.actions.patchPolicyPostWhitespace',
    message: 'Data missing for request',
  };

  if (!utils.generic.isValidObject(policy) || !utils.generic.isValidObject(body)) {
    dispatch(patchPolicyPostWhitespaceFailure(defaultError));
    dispatch(enqueueNotification('notification.patchPolicyPostWhitespace.fail', 'error'));
    return;
  }

  const { umrId } = body;
  return dispatch(patchPolicy(policy.id, { umrId }))
    .then(() => {
      return dispatch(
        createWhitespacePolicy({
          toPeriod: policy.expiryDate,
          fromPeriod: policy.inceptionDate,
          ...body,
        })
      );
    })
    .catch((err) => err);
};

export const patchPolicyPostWhitespaceRequest = (policy, body) => {
  return {
    type: 'PATCH_POLICY_POST_WHITESPACE_REQUEST',
    payload: { policy, body },
  };
};

export const patchPolicyPostWhitespaceFailure = (error) => {
  return {
    type: 'PATCH_POLICY_POST_WHITESPACE_FAILURE',
    payload: error,
  };
};
