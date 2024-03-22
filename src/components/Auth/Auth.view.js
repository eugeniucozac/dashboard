import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

// app
import { AuthContext, Loader } from 'components';
import { Authentication, Login, Logout } from 'pages';
import * as utils from 'utils';
import config from 'config';

AuthView.propTypes = {
  isAuthenticated: PropTypes.bool,
  isAuthInProgress: PropTypes.bool,
  handlers: PropTypes.shape({
    login: PropTypes.func,
    logout: PropTypes.func,
    handleCallback: PropTypes.func,
  }),
  children: PropTypes.any,
};

export function AuthView({ isAuthenticated, isAuthInProgress, handlers, children }) {
  // only display children <App /> if user is authenticated
  if (isAuthenticated) {
    return <AuthContext.Provider value={handlers}>{children}</AuthContext.Provider>;
  }

  // if auth is in progress show a loader
  else if (isAuthInProgress) {
    return <Loader visible label={utils.string.t('app.authenticating')} />;
  }

  // else show the un-protected routes (login, logout and authentication)
  else {
    return (
      <AuthContext.Provider value={handlers}>
        <Suspense fallback={<Loader visible />}>
          <Switch>
            <Route path={config.routes.login.root}>
              <Login />
            </Route>

            <Route path={config.routes.logout.root}>
              <Logout />
            </Route>

            <Route path={config.routes.authentication.root}>
              <Authentication />
            </Route>
          </Switch>
        </Suspense>
      </AuthContext.Provider>
    );
  }
}
