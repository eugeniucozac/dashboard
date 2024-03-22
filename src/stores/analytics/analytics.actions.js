// app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import config from 'config';

export const getReportByPlacement = (placementId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/analytics.actions',
  };

  dispatch(getReportByPlacementRequest(placementId));
  dispatch(addLoader('getReportByPlacement'));

  if (!placementId) {
    dispatch(getReportByPlacementFailure(defaultError));
    dispatch(removeLoader('getReportByPlacement'));
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/analytics/placement/${placementId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      if (!utils.generic.isValidArray(data)) return;
      const reports = data
        .map((report) => {
          const { reportId, embedUrl, embedToken, insuredName, modellingDueDate, ...rest } = report;
          if (!reportId || !embedUrl || !embedToken) return null;
          return {
            id: reportId,
            embedUrl: embedUrl,
            accessToken: embedToken,
            label: `${insuredName} - ${utils.string.t('format.date', {
              value: { date: modellingDueDate, format: config.ui.format.date.text },
            })}`,
            ...rest,
          };
        })
        .filter((report) => !!report);
      dispatch(getReportByPlacementSuccess({ reports, placementId }));
      return reports;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReportByPlacementFailure(err));
    })
    .finally(() => {
      dispatch(removeLoader('getReportByPlacement'));
    });
};

export const getReportByPlacementRequest = (payload) => {
  return {
    type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_REQUEST',
    payload,
  };
};

export const getReportByPlacementSuccess = (payload) => {
  return {
    type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_SUCCESS',
    payload,
  };
};

export const getReportByPlacementFailure = (error) => {
  return {
    type: 'ANALYTICS_GET_REPORT_BY_PLACEMENT_FAILURE',
    payload: error,
  };
};

export const getReportByModelRequest = (payload) => {
  return {
    type: 'ANALYTICS_GET_REPORT_BY_MODEL_REQUEST',
    payload,
  };
};

export const getReportByModelSuccess = (payload) => {
  return {
    type: 'ANALYTICS_GET_REPORT_BY_MODEL_SUCCESS',
    payload,
  };
};

export const getReportByModelFailure = (error) => {
  return {
    type: 'ANALYTICS_GET_REPORT_BY_MODEL_FAILURE',
    payload: error,
  };
};
