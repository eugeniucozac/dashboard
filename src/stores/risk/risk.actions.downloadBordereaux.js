import moment from 'moment';

// app
import { authLogout, hideModal, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const downloadRiskBordereaux =
  ({ product, from, to, facility, type, onlyBound }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/risk.actions.downloadBordereaux',
    };

    dispatch(downloadRiskBordereauxRequest({ product, from, to, facility, type, onlyBound }));

    if (!product || !from || !to) {
      return { ...defaultError, message: 'Data missing' };
    }

    const dateFrom = moment(from).format('YYYY-MM');
    const dateTo = moment(to).format('YYYY-MM');

    const facilityParam = facility ? `_${facility}` : '';
    const facilityIdParam = facility ? `&facilityId=${facility}` : '';
    const typeParam = type ? `&type=${type}` : '';
    const onlyBoundParam = type === 'DATA_DUMP' ? `&onlyBound=${onlyBound}` : '';

    const defaultFilename =
      type === 'DATA_DUMP'
        ? `data_${product}_${dateFrom}_${dateTo}${facilityParam}`
        : `bordereaux_${product}_${dateFrom}_${dateTo}${facilityParam}`;
    let responseFilename = '';

    utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path: `api/v1/products/${product}/bordereaux?from=${dateFrom}&to=${dateTo}${facilityIdParam}${typeParam}${onlyBoundParam}`,
      })
      .then(async (response) => {
        if (response.ok) {
          const blob = await response.blob();
          responseFilename = utils.file.getFilenameFromHeadersBlob(response.headers, blob, defaultFilename);
          return blob;
        } else {
          return Promise.reject({});
        }
      })
      .then((blob) => {
        utils.file.download(blob, responseFilename);
        dispatch(downloadRiskBordereauxSuccess());
        dispatch(hideModal());
        return responseFilename;
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API fetch error (blob)',
        };
        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(downloadRiskBordereauxFailure(err));
        dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      });
  };

export const downloadRiskBordereauxRequest = (formData) => {
  return {
    type: 'DOWNLOAD_RISK_BORDEREAUX_REQUEST',
    payload: formData,
  };
};

export const downloadRiskBordereauxSuccess = () => {
  return {
    type: 'DOWNLOAD_RISK_BORDEREAUX_SUCCESS',
  };
};

export const downloadRiskBordereauxFailure = (error) => {
  return {
    type: 'DOWNLOAD_RISK_BORDEREAUX_FAILURE',
    payload: error,
  };
};
