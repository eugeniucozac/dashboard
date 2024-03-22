import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { AppView } from './App.view';
import { setBrand, selectUser, selectUserIsExtended, selectIsAdmin, selectUserIsCurrent, selectDmsDocViewerState } from 'stores';
import * as utils from 'utils';
import { HOTJAR_ID, HOTJAR_VERSION } from 'consts';

export default function App() {
  const [userIsLoaded, setUserIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const userIsAdmin = useSelector(selectIsAdmin);
  const userIsExtendedEdge = useSelector(selectUserIsExtended);
  const userIsCurrentEdge = useSelector(selectUserIsCurrent);
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const uiLoaderQueue = useSelector((state) => get(state, 'ui.loader.queue', []));
  const configVars = useSelector((state) => get(state, 'config.vars'));

  const isServiceWorkerUpdated = useSelector((state) => get(state, 'ui.serviceWorkerUpdated'));
  const serviceWorkerRegistration = useSelector((state) => get(state, 'ui.serviceWorkerRegistration'));
  const isDmsDocViewerModeOn = useSelector(selectDmsDocViewerState);

  const updateServiceWorker = () => {
    const registrationWaiting = serviceWorkerRegistration.waiting;

    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: 'SKIP_WAITING' });

      registrationWaiting.addEventListener('statechange', (e) => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  useEffect(() => {
    user?.id && user?.auth?.accessToken && setUserIsLoaded(true);
  }, [user]);

  useEffect(() => {
    if (!uiBrand) {
      dispatch(setBrand(utils.app.getHostName()));
    }

    document.title = utils.app.getAppName(uiBrand);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (utils.app.isPriceForbesProduction()) {
      utils.app.hotjar(HOTJAR_ID, HOTJAR_VERSION);
    }
  }, []);

  return userIsLoaded ? (
    <AppView
      isBroker={utils.user.isBroker(user)}
      isUnderwriter={utils.user.isUnderwriter(user)}
      isAdmin={userIsAdmin}
      isExtendedEdge={userIsExtendedEdge}
      isCurrentEdge={userIsCurrentEdge}
      isUserLoaded={utils.user.isLoaded(user)}
      isDev={utils.app.isDevelopment(configVars)}
      isDmsDocViewerModeOn={isDmsDocViewerModeOn}
      landingPage={utils.user.getLandingPage(user)}
      hasLoader={uiLoaderQueue.length > 0}
      sw={{ isServiceWorkerUpdated: isServiceWorkerUpdated, updateServiceWorker: updateServiceWorker }}
    />
  ) : null;
}
