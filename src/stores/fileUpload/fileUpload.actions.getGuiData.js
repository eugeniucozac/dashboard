import * as utils from 'utils';
import { authLogout, getReferenceDataXbInstances } from 'stores';

export const getFileUploadGuiData = (requestList) => (dispatch, getState) => {
  // prettier-ignore
  const { user: {auth}, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/fileUpload.actions.getFileUploadGuiData',
  };

  dispatch(getFileUploadGuiDataRequest(requestList));

  if (utils.generic.isInvalidOrEmptyArray(requestList)) {
    dispatch(getFileUploadGuiDataFailure({ ...defaultError, message: 'Missing request list parameters' }));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'data/gui/screen/fileupload',
      data: {
        guiRequestList: requestList.map((component) => ({ componentName: component })),
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      if (json?.status === 'OK' && json?.data) {
        const guiDataObj = json.data.guiResponseList.reduce((acc, cur) => {
          if (cur.componentName) {
            return { ...acc, [cur.componentName]: cur.entity };
          } else {
            return acc;
          }
        }, {});
        dispatch(getReferenceDataXbInstances(guiDataObj?.XBInstance || []));
        dispatch(getFileUploadGuiDataSuccess(guiDataObj));
        return guiDataObj;
      } else {
        return Promise.reject({
          message: `API error${json.status ? ` (${json.status})` : ''}`,
          ...(json && { ...json }),
        });
      }
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (fileUpload.getFileUploadGuiData)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getFileUploadGuiDataFailure(err));
      return err;
    });
};

export const getFileUploadGuiDataRequest = (requestList) => {
  return {
    type: 'FILE_UPLOAD_GET_GUI_DATA_REQUEST',
    payload: requestList,
  };
};

export const getFileUploadGuiDataSuccess = (guiDataObj) => {
  return {
    type: 'FILE_UPLOAD_GET_GUI_DATA_SUCCESS',
    payload: guiDataObj,
  };
};

export const getFileUploadGuiDataFailure = (error) => {
  return {
    type: 'FILE_UPLOAD_GET_GUI_DATA_FAILURE',
    payload: error,
  };
};
