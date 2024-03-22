import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import config from 'config';
import { APPLICATION_TYPE_JSON, APPLICATION_TYPE_TEXT, STATUS_UNAUTHORIZED } from 'consts';
import * as utils from 'utils';
import { setTokenExpired } from 'stores';
const utilsApi = {
  get: ({ token, endpoint, path, params, mode = 'cors', headers = true }) => {
    if (!endpoint) return Promise.reject({ message: 'Missing fetch parameters' });

    return fetch(getUrl(endpoint, path, params), {
      method: 'GET',
      mode: mode,
      headers: headers ? getHeaders(token) : {},
    }).then((data) => data);
  },

  post: ({ token, endpoint, path, params, data, mode = 'cors', headers = true }) => {
    if (!endpoint) return Promise.reject({ message: 'Missing fetch parameters' });

    return fetch(getUrl(endpoint, path, params), {
      method: 'POST',
      mode: mode,
      headers: headers ? getHeaders(token) : {},
      body: JSON.stringify(data),
    });
  },

  multiPartPost: ({ token, endpoint, path, params, data, mode = 'cors', headers = true }) => {
    if (!endpoint) return Promise.reject({ message: 'Missing fetch parameters' });

    return fetch(getUrl(endpoint, path, params), {
      method: 'POST',
      mode: mode,
      headers: headers ? getHeaders(token, false) : {},
      body: data,
    });
  },

  put: ({ token, endpoint, path, params, data, mode = 'cors', headers = true }) => {
    if (!endpoint) return Promise.reject({ message: 'Missing fetch parameters' });

    return fetch(getUrl(endpoint, path, params), {
      method: 'PUT',
      mode: mode,
      headers: headers ? getHeaders(token) : {},
      body: JSON.stringify(data),
    });
  },

  patch: ({ token, endpoint, path, params, data, mode = 'cors', headers = true }) => {
    if (!endpoint) return Promise.reject({ message: 'Missing fetch parameters' });

    return fetch(getUrl(endpoint, path, params), {
      method: 'PATCH',
      mode: mode,
      headers: headers ? getHeaders(token) : {},
      body: JSON.stringify(data),
    });
  },

  delete: ({ token, endpoint, path, params, mode = 'cors', headers = true }) => {
    if (!endpoint) return Promise.reject({ message: 'Missing fetch parameters' });

    return fetch(getUrl(endpoint, path, params), {
      method: 'DELETE',
      mode: mode,
      headers: headers ? getHeaders(token) : {},
    });
  },
  handleEmptyResponse: (response) => {
    const responseObj = {
      ok: response.ok,
      ...(response.type && { type: response.type }),
      ...(response.status && { status: response.status }),
      ...(response.statusText && { statusText: response.statusText }),
      ...(response.url && { url: response.url }),
    };
    if (response.ok) {
      return true;
    }
    // fail
    return response.json().then((json) => {
      return Promise.reject({
        response: responseObj,
        ...(json && { json }),
      });
    });
  },

  handleResponse: (response) => {
    const applicationType = response.headers.get('content-type') || '';
    const isJson = applicationType.includes(APPLICATION_TYPE_JSON);
    const isText = applicationType.includes(APPLICATION_TYPE_TEXT);

    const responseObj = {
      ok: response.ok,
      ...(response.type && { type: response.type }),
      ...(response.status && { status: response.status }),
      ...(response.statusText && { statusText: response.statusText }),
      ...(response.url && { url: response.url }),
    };

    // json
    if (isJson) {
      if (response.ok) {
        return response.json();
      }

      // fail
      return response.json().then((json) => {
        return Promise.reject({
          response: responseObj,
          ...(json && { json }),
        });
      });
    }

    // text
    if (isText) {
      if (response.ok) {
        return response.text();
      }

      // fail
      return response.text().then((text) => {
        return Promise.reject({
          response: responseObj,
          ...(text && { text }),
        });
      });
    }

    // if application type isn't supported
    return Promise.reject({ type: 'application type not supported' });
  },

  handleResponseBlob: (response) => {
    if (response.ok) {
      return response.blob();
    } else {
      return response.blob().then((blob) => {
        return Promise.reject({
          response,
          ...(blob && { blob }),
        });
      });
    }
  },

  handleResponseJsonObject: (json, keyToCheck = 'id') => {
    // if the API is supposed to return a simple json object with a specific key to check validity:
    if (json && json[keyToCheck]) {
      return json;
    } else if (json && json.error) {
      return Promise.reject({ message: 'API data format error', ...json });
    } else if (typeof json === 'string') {
      return Promise.reject({ message: 'API data format error', error: json });
    } else {
      return Promise.reject({ message: 'API data format error' });
    }
  },

  handleResponseJsonArray: (json) => {
    // if the API is supposed to return an array:
    if (utils.generic.isValidArray(json)) {
      return json;
    } else if (json && json.error) {
      return Promise.reject({ message: 'API data format error', ...json });
    } else if (typeof json === 'string') {
      return Promise.reject({ message: 'API data format error', error: json });
    } else {
      return Promise.reject({ message: 'API data format error' });
    }
  },

  handleData: (json, skipDataCheck) => {
    // our APis should always return a response in this format:
    // {
    //   "status": "success",
    //   "data": [...],
    // }

    if (json && json.status === 'success' && (skipDataCheck || !!json.data)) {
      return json.data;
    } else {
      return Promise.reject({
        message: `API data format error${json.status ? ` (${json.status})` : ''}`,
        ...(json && { ...json }),
      });
    }
  },

  handleNewData: (json, skipDataCheck) => {
    if (json && json.status === 'OK' && (skipDataCheck || json.data || json.pagination)) {
      //if success
      return json;
    } else {
      //if fails
      return Promise.reject({
        message: `API data format error${json.status ? ` (${json.status})` : ''}`,
        ...(json && { ...json }),
      });
    }
  },

  handleError: (error = {}, params = {}) => {
    const { response, json = {}, text = '' } = error;
    const errorObject = {
      ...(params.file && { file: params.file }),
      ...(params.message && { message: params.message }),
      ...(response && { response }),
      ...(json?.message && { message: json.message }), // if it exists, the endpoint message will override the generic params message provided in the code
      ...(text && { message: text }),
      ...(Object.keys(error).length > 0 &&
        !isEmpty(json) && {
          error: {
            ...json,
          },
        }),
    };

    console.error('Error', errorObject);
    return errorObject;
  },

  handleUnauthorized: (error = {}, dispatch) => {
    if ((error?.status === 401 || error?.text === STATUS_UNAUTHORIZED) && dispatch) {
      console.error('Unauthorized', error);
      const hasToken = utils.user.hasToken();
      const isTokenValid = utils.user.isTokenValid();
      const hasOldInvalidToken = hasToken && !isTokenValid;
      dispatch(setTokenExpired(hasOldInvalidToken));
    }
  },

  pagination: (data) => {
    if (!data) return {};

    return {
      itemsTotal: get(data, 'pagination.totalElements', 0),
      page: get(data, 'pagination.page', 1),
      pageSize: get(data, 'pagination.size', config.ui.pagination.default),
      pageTotal: get(data, 'pagination.totalPages', 0),
      query: get(data, 'pagination.query') || '',
    };
  },

  getErrorMessage: (err, defaultErrorMsg) => {
    return err?.json?.message || defaultErrorMsg || utils.string.t('notification.generic.request');
  },
};

export const getUrl = (endpoint, path, params) => {
  if (!endpoint) return '';

  return `${endpoint}${path ? `/${path}` : ''}${getQueryString(params)}`;
};

export const getQueryString = (params) => {
  const isObject = params !== null && typeof params === 'object' && Array.isArray(params) === false;

  if (!isObject) return '';

  const paramsArray = Object.entries(params).map((param) => {
    return `${param[0]}=${param[1]}`;
  });

  return paramsArray.length > 0 ? `?${paramsArray.join('&')}` : '';
};

export const getHeaders = (token, type = 'json') => {
  return {
    ...(type === 'json' && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export default utilsApi;
