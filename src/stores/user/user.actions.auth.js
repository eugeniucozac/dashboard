import {
  addLoader,
  removeLoader,
  getUser,
  getReferenceData,
  getReferenceDataNew,
  getUserData,
  getReferenceDataNewBpm,
  getNewOdsReferenceTypes,
} from 'stores';
import config from 'config';
import get from 'lodash/get';
import * as utils from 'utils';

const getExtendedOrBasicEdgeUserData = (dispatch, params) => () => {
  // try to get user from Extended Edge API
  // & default Edge API and load respective reference API's
  const promises = [
    dispatch(getUserData(params))
      .then((res) => Promise.resolve(res))
      .catch((err) => Promise.reject(err)),
    dispatch(getUser(params))
      .then((res) => Promise.resolve(res))
      .catch((err) => Promise.reject(err)),
  ];
  return Promise.allSettled(promises).then((results) => Promise.resolve(results));
};

const checkUserServiceData = (dispatch, userData, params) => {
  if (utils.generic.isValidArray(userData, true)) {
    const extendedUser = userData[0].status === 'fulfilled' ? userData[0]?.value : null;
    const currentEdgeUser = userData[1].status === 'fulfilled' ? userData[1]?.value : null;
    if (utils.user.isExtended(extendedUser) && utils.user.isCurrentEdge(currentEdgeUser)) {
      // if user is available as both EXTENDED EDGE user & CURRENT EDGE user
      dispatch(getReferenceData());
      dispatch(getReferenceDataNew());
      dispatch(getReferenceDataNewBpm());
      dispatch(getNewOdsReferenceTypes());

      // after login, redirect to user CURRENT EDGE landing page
      if (params?.isLogin && utils.generic.isFunction(params?.history.push)) {
        params.history.push(utils.user.getLandingPage(currentEdgeUser));
      }
    } else if (utils.user.isExtended(extendedUser) && !utils.user.isCurrentEdge(currentEdgeUser)) {
      // if user only an EXTENDED EDGE user
      dispatch(getReferenceDataNew());
      dispatch(getReferenceDataNewBpm());
      dispatch(getNewOdsReferenceTypes());

      // after login, redirect to user EXTENDED EDGE landing page
      if (params?.isLogin && utils.generic.isFunction(params?.history?.push)) {
        params.history.push(params?.redirectUrl || utils.user.getLandingPage(extendedUser));
      }
    } else if (!utils.user.isExtended(extendedUser) && utils.user.isCurrentEdge(currentEdgeUser)) {
      // if user only an CURRENT EDGE user
      dispatch(getReferenceData());
      // after login, redirect to user CURRENT EDGE landing page
      if (params?.isLogin && utils.generic.isFunction(params?.history.push)) {
        params.history.push(utils.user.getLandingPage(currentEdgeUser));
      }
    }
  }
};

export const reuseExistingToken = (history) => (dispatch) => {
  dispatch(addLoader('reuseExistingToken'));

  const localStorageAuth = utils.user.getLocalStorageAuth();
  const authData = {
    accessToken: localStorageAuth.accessToken,
    idToken: localStorageAuth.idToken,
    expiresIn: localStorageAuth.expiresIn,
    expiresAt: localStorageAuth.expiresAt,
  };

  dispatch(setSessionState(authData))
    .then(getExtendedOrBasicEdgeUserData(dispatch))
    .then((userObj) => {
      checkUserServiceData(dispatch, userObj);
      dispatch(removeLoader('reuseExistingToken'));
      //For extended user new ref data api is created
      if (utils.user.isExtended(userObj)) {
        dispatch(getReferenceDataNew());
        dispatch(getReferenceDataNewBpm());
      } else {
        dispatch(getReferenceData());
      }
    })
    .catch((err) => {
      dispatch(authFailure('Error', { ...err }));
      history.replace(config.routes.login.root);
    });
};

export const renewAuthentication = (auth0, history) => (dispatch) => {
  dispatch(addLoader('renewAuthentication'));
  dispatch(authInProgress());

  dispatch(renewAuth0Token(auth0))
    .then((response) => dispatch(setSessionState(response)))
    .then(getExtendedOrBasicEdgeUserData(dispatch))
    .then((userObj) => {
      checkUserServiceData(dispatch, userObj);
      dispatch(removeLoader('renewAuthentication'));
      //For extended user new ref data api is created

      if (utils.user.isExtended(userObj)) {
        dispatch(getReferenceDataNew());
        dispatch(getReferenceDataNewBpm());
      } else {
        dispatch(getReferenceData());
      }
    })
    .catch((err) => {
      dispatch(authFailure('Error', { ...err }));
      history.replace(config.routes.login.root);
    });
};

export const parseAuth0Hash = (auth0, history, locationHash, redirectUrl) => (dispatch) => {
  dispatch(authInProgress());

  dispatch(parseHash(auth0, locationHash))
    .then((response) => dispatch(setSessionState(response, true, history, redirectUrl)))
    .then(getExtendedOrBasicEdgeUserData(dispatch, { history, redirectUrl, isLogin: true }))
    .then((userObj) => {
      checkUserServiceData(dispatch, userObj, { history, redirectUrl, isLogin: true });
    })
    .catch((err) => {
      dispatch(authFailure('Error', { ...err }));
      history.replace(config.routes.home.root);
    });
};

export const renewAuth0Token = (auth0) => (dispatch) => {
  return new Promise((resolve, reject) => {
    auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        resolve(authResult);
      } else {
        reject({
          ...err,
          file: 'stores/auth.actions',
          message: 'Check session error',
        });

        dispatch(authFailure(`Authentication: Could not get a new token (${err.error}: ${err.error_description}).`));
      }
    });
  });
};

export const setSessionState = (authResult, isCallback, history, redirectUrl) => (dispatch) => {
  return new Promise((resolve, reject) => {
    if (isCallback) {
      dispatch(authSuccess(authResult));
      resolve(authResult);
    } else {
      dispatch(authSuccess(authResult));
      resolve(authResult);
    }
  });
};

export const parseHash = (auth0, locationHash) => (dispatch) => {
  return new Promise((resolve, reject) => {
    if (/access_token|id_token|error/.test(locationHash)) {
      auth0.parseHash((err, result) => {
        if (result && result.accessToken && result.idToken) {
          resolve(result);
        } else {
          reject({ ...err, file: 'stores/auth.actions', message: 'Unknown error.' });
        }
      });
    } else {
      reject({
        file: 'stores/auth.actions',
        message: 'Location hash is missing required parameters.',
      });
    }
  });
};

export const authLogin = (auth0, theme = {}) => {
  const themeObj = {
    logo: get(theme, 'logo' || ''),
    primaryColor: get(theme, 'primaryColor' || ''),
  };

  auth0.authorize({
    prompt: 'login',
    language: config.locale,
    theme: themeObj,
  });

  return {
    type: 'AUTH_LOGIN',
  };
};

export const authLogout = (auth0) => {
  localStorage.removeItem('edge-auth');

  if (auth0 && utils.generic.isFunction(auth0.logout)) {
    auth0.logout({
      returnTo: config.auth.redirectLogout,
      client_id: config.auth.clientID,
    });
  } else {
    window.location.href = config.auth.redirectLogout;
  }

  return {
    type: 'AUTH_LOGOUT',
  };
};

export const authInProgress = () => {
  return {
    type: 'AUTH_IN_PROGRESS',
  };
};

export const authSuccess = (payload) => {
  const expiresAt = payload.expiresAt || payload.expiresIn * 1000 + Date.now();
  const edgeAuth = {
    accessToken: payload.accessToken,
    idToken: payload.idToken,
    expiresIn: payload.expiresIn,
    expiresAt: expiresAt,
    expiresAtDate: utils.string.t('format.date', {
      value: { date: expiresAt, format: 'ddd, MMMM Do YYYY, h:mm:ss a' },
    }),
  };

  localStorage.setItem('edge-auth', JSON.stringify(edgeAuth));

  return {
    type: 'AUTH_SUCCESS',
    payload: {
      accessToken: payload.accessToken,
      idToken: payload.idToken,
      expiresAt,
    },
  };
};

export const authFailure = (error) => {
  localStorage.removeItem('edge-auth');

  return {
    type: 'AUTH_FAILURE',
    payload: error,
  };
};
