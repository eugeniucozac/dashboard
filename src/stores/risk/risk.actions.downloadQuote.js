import kebabCase from 'lodash/kebabCase';
import moment from 'moment';

// app
import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';
import config from 'config';

export const downloadRiskQuote =
  ({ quote = {}, insureds = [] }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/risk.actions.downloadQuote',
    };

    dispatch({
      type: 'RISK_DOWNLOAD_QUOTE',
      payload: { quote, insureds },
    });

    if (!quote.id) {
      return { ...defaultError, message: 'Data missing' };
    }

    const insuredsName = insureds.map((i) => kebabCase(i.name)).join('-') || quote.riskId;
    const date = quote.validUntil ? moment(quote.validUntil).format(config.ui.format.date.numeric) : '';
    const defaultFilename = `quote${insuredsName ? `_${insuredsName}` : ''}${date ? `_${date}` : ''}`;
    let responseFilename = '';

    dispatch(addLoader({ key: 'downloadRiskQuote', message: utils.string.t('app.downloadFile') }));

    utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path: `api/v1/quotes/${quote.id}/documents?renew=true`,
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
        return responseFilename;
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API fetch error (blob)',
        };
        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
      })
      .finally(() => {
        dispatch(removeLoader('downloadRiskQuote'));
      });
  };
