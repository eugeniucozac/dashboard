// polyfills
import 'react-app-polyfill/ie11';
import 'core-js/features/object';
import 'core-js/features/array';
import 'core-js/features/promise/finally';
import smoothscroll from 'smoothscroll-polyfill';

// react
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

// redux
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore, compose } from 'redux';
import reducer from 'stores';

import thunk from 'redux-thunk';

// utils
import * as utils from 'utils';

// styles
import './index.css';

// components
import { Auth, App, ResetUi, Theme } from 'components';
import { ConfigLoader } from 'modules';

// mui
import { StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// i18n
import { initialiseI18n } from 'utils';
initialiseI18n();

// polyfills
smoothscroll.polyfill();

// middleware
const middleware = [thunk];

// redux logger
if (!utils.app.isProduction()) {
  let logs;
  const options = { collapsed: true };

  try {
    if ('URLSearchParams' in window) {
      const urlParams = new URLSearchParams(window.location.search);
      logs = urlParams.get('logs') || localStorage.getItem('edge-logger');
      const logsList = logs ? logs.split('|') : [];

      if (logs && !['false', 'true', '0', '1'].includes(logs)) {
        options.predicate = (getState, action) => {
          return logsList.some((log) => {
            return action.type.includes(log.toUpperCase());
          });
        };
      }
    }
  } catch (error) {
    console.error(error);
  }

  if (logs) {
    localStorage.setItem('edge-logger', logs);
  }

  if (!['false', '0'].includes(logs)) {
    middleware.push(createLogger(options));
  }
}

// react dev tools (development only)
// https://github.com/facebook/react-devtools/issues/191#issuecomment-367905536
if (utils.app.isProduction()) {
  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
    for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = utils.generic.isFunction(value) ? () => {} : null;
    }
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)));

ReactDOM.render(
  <Provider store={store}>
    <StylesProvider injectFirst>
      <CssBaseline />
      <Theme>
        <BrowserRouter>
          <ConfigLoader>
            <Auth>
              <ResetUi>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <App />
                </MuiPickersUtilsProvider>
              </ResetUi>
            </Auth>
          </ConfigLoader>
        </BrowserRouter>
      </Theme>
    </StylesProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

if (process.env.REACT_APP_START_MOCK_API) {
  const { worker } = require('./mocks/browser');
  worker.start();
  serviceWorkerRegistration.register();
} else serviceWorkerRegistration.unregister();
