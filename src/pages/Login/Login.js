import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { LoginView } from './Login.view';
import { AuthContext } from 'components';
import { selectUserAuthenticated } from 'stores';
import * as utils from 'utils';
import config from 'config';
import { BRAND_PRICEFORBES } from 'consts';

export default function Login() {
  const context = useContext(AuthContext);
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const userError = useSelector((state) => get(state, 'user.error'));
  const configVars = useSelector((state) => get(state, 'config.vars'));
  const isAuthenticated = useSelector(selectUserAuthenticated);
  const hasToken = utils.user.hasToken();
  const isPriceForbes = uiBrand === BRAND_PRICEFORBES;

  // abort / redirect
  if (isAuthenticated || hasToken) {
    return <Redirect to={config.routes.home.root} />;
  }

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('app.login')} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>

      <LoginView
        error={userError}
        isPriceForbes={isPriceForbes}
        redirects={{ analytics: configVars.url.analytics }}
        handlers={{ login: context.login }}
      />
    </>
  );
}
