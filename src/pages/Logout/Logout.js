import React from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { LogoutView } from './Logout.view';
import { selectUserAuthenticated } from 'stores';
import * as utils from 'utils';
import config from 'config';

export default function Logout() {
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const isAuthenticated = useSelector(selectUserAuthenticated);
  const hasToken = utils.user.hasToken();

  // abort / redirect
  if (isAuthenticated || hasToken) {
    return <Redirect to={config.routes.home.root} />;
  }

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('app.logout')} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>

      <LogoutView />
    </>
  );
}
