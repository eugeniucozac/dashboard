import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import auth0Js from 'auth0-js';
import get from 'lodash/get';

// app
import { AuthView } from './Auth.view';
import {
  reuseExistingToken,
  renewAuthentication,
  parseAuth0Hash,
  authLogin,
  authLogout,
  selectUserAuthenticated,
  selectUserAuthInProgress,
} from 'stores';
import * as utils from 'utils';
import config from 'config';
import { BRAND_BISHOPSGATE } from 'consts';
// context
export const AuthContext = React.createContext({});

export default function Auth({ children }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const configVars = useSelector((state) => get(state, 'config.vars', {}));
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const authenticated = useSelector(selectUserAuthenticated);
  const authInProgress = useSelector(selectUserAuthInProgress);

  const auth0 = useMemo(
    () =>
      new auth0Js.WebAuth({
        domain: config.auth.domain,
        clientID: uiBrand === BRAND_BISHOPSGATE ? config.auth.bishopsgate.clientID : config.auth.clientID,
        audience: get(configVars, 'auth0.audience'),
        redirectUri: config.auth.redirectAuthentication,
        responseType: config.auth.responseType,
        scope: config.auth.scope,
        leeway: config.auth.leeway,
      }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // check auth status and token expiry
  // if token is valid --> re-use that token
  // if token has expired --> renew the authentication
  // if there's no token --> redirect to /login
  useEffect(() => {
    const hasToken = utils.user.hasToken();
    const isTokenValid = utils.user.isTokenValid();
    const hasValidToken = hasToken && isTokenValid;
    const hasOldInvalidToken = hasToken && !isTokenValid;
    const unprotectedRoutes = [config.routes.login.root, config.routes.logout.root, config.routes.authentication.root];
    const isProtectedRoute = !unprotectedRoutes.includes(history.location.pathname);

    // if not logged in and trying to access any page other than login, logout or authentication
    // save the requested path to session storage
    // this will be used to redirect after a successful Auth0 login
    if (!authenticated && !hasToken && isProtectedRoute) {
      sessionStorage.setItem('edge-redirect', history.location.pathname);
    }

    // if the user still has a valid token, re-use it...
    if (hasValidToken) {
      dispatch(reuseExistingToken(history));
    }

    // if the user has an old token but it's not valid anymore, renew it...
    else if (hasOldInvalidToken) {
      dispatch(renewAuthentication(auth0, history));
    }

    // if there's no token at all, redirect to login...
    else if (!hasToken) {
      history.replace(config.routes.login.root);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = () => {
    const theme = get(config, `ui.brand[${uiBrand}]` || {});

    dispatch(authLogin(auth0, theme));
  };

  const handleLogout = () => {
    dispatch(authLogout(auth0));
    history.push(config.routes.logout.root);
  };

  const handleCallback = (locationHash) => {
    const redirectUrl = sessionStorage.getItem('edge-redirect');

    localStorage.removeItem('edge-auth');
    sessionStorage.removeItem('edge-redirect');
    dispatch(parseAuth0Hash(auth0, history, locationHash, redirectUrl));
  };

  return (
    <AuthView
      isAuthenticated={authenticated}
      isAuthInProgress={authInProgress}
      handlers={{
        login: handleLogin,
        logout: handleLogout,
        handleCallback: handleCallback,
      }}
      children={children}
    />
  );
}
