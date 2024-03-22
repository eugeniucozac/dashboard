import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import get from 'lodash/get';
import auth0Js from 'auth0-js';
// app
import { showModal, selectHasUserTokenExpired, setTokenExpired, renewAuthentication } from 'stores';
import { BRAND_BISHOPSGATE } from 'consts';
import * as utils from 'utils';
import config from 'config';

export default function SessionExpired() {
  const dispatch = useDispatch();
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const configVars = useSelector((state) => get(state, 'config.vars', {}));
  const history = useHistory();

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

  const hasUserTokenExpired = useSelector(selectHasUserTokenExpired);
  const launchSessionExpireModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('app.sessionTimeout'),
          maxWidth: 'xs',
          hideCompOnBlur: false,
          componentProps: {
            confirmLabel: utils.string.t('app.staySignedIn'),
            confirmMessage: utils.string.t('app.sessionExpire'),
            hideCancelButton: true,
            submitHandler: () => {
              dispatch(renewAuthentication(auth0, history));
            },
            cancelHandler: () => {
              dispatch(setTokenExpired(false));
            },
          },
        },
      })
    );
  };

  useEffect(() => {
    if (hasUserTokenExpired) {
      launchSessionExpireModal();
    }
  }, [hasUserTokenExpired]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
