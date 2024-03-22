import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
export const getRfiQueryHistory = () => (dispatch) => {
  dispatch(addLoader('getRfiQueryHistory'));
  return fetch('')
    .then(() => {})
    .catch((err) => {
      utils.api.handleUnauthorized(err, dispatch, authLogout);
    })
    .finally(() => {
      dispatch(removeLoader('getRfiQueryHistory'));
    });
};
