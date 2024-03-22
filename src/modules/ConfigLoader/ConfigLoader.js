import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { ConfigLoaderView } from './ConfigLoader.view';
import { setBrand, setConfigVars } from 'stores';
import * as utils from 'utils';

export default function ConfigLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const configVars = useSelector((state) => get(state, 'config.vars'));
  const dispatch = useDispatch();

  const defaultError = {
    file: 'modules/ConfigLoader',
  };

  useEffect(
    () => {
      dispatch(setBrand(utils.app.getHostName()));

      // fetch config file
      fetch('/config/config.json', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then(() => {
              return Promise.reject({
                ok: response.ok,
                message: 'Configuration fetch response invalid',
                ...(response.status && { status: response.status }),
                ...(response.type && { type: response.type }),
                ...(response.statusText && { statusText: response.statusText }),
              });
            });
          }
        })
        .then((json) => {
          if (json && json.env) {
            dispatch(setConfigVars(json));
            return json;
          } else {
            return Promise.reject({ message: 'Configuration properties missing or corrupted' });
          }
        })
        .catch((err) => {
          utils.api.handleError(err, defaultError);
          return err;
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ConfigLoaderView isLoading={loading} hasConfig={Boolean(configVars && configVars.env)}>
      {children}
    </ConfigLoaderView>
  );
}
