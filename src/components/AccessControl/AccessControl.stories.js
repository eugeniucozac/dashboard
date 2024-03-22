import React from 'react';
import { AccessControl, Warning } from 'components';
import { withKnobs, select } from '@storybook/addon-knobs';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import merge from 'lodash/merge';
import { Box, Typography } from '@material-ui/core';

export default {
  title: 'AccessControl',
  component: AccessControl,
  decorators: [withKnobs],
};

const getStore = (obj) => {
  const enhancer = compose(applyMiddleware(thunk));
  const defaultStore = createStore(reducer, {}, enhancer);
  const preloadedState = merge(defaultStore.getState(), obj);

  // return default store if no custom JSON is passed
  if (!obj) {
    return defaultStore;
  }

  // otherwise, return new deeply-merged store with data from JSON obj
  return createStore(reducer, preloadedState, enhancer);
};

export const Feature = () => {
  return (
    <Provider
      store={getStore({
        config: { vars: { endpoint: {} } },
        user: { privilege: { movies: ['read'], music: { jazz: [], rock: ['read', 'update'], soul: [], hiphop: [] } } },
      })}
    >
      <Box display="flex" flexDirection="column">
        <Box>
          <Typography variant="body2">This dummy user has access to the following feature/permissions combinations:</Typography>
          <ul>
            <li>
              <Typography variant="body2">
                <strong>"movies"</strong> - READ access
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>"music.rock"</strong> - READ and UPDATE access
              </Typography>
            </li>
          </ul>
        </Box>

        <AccessControl
          feature={select(
            'Feature',
            ['', 'arts', 'movies', 'sports', 'music', 'music.hiphop', 'music.jazz', 'music.rock', 'music.soul'],
            'movies'
          )}
          permissions={select('Permissions', ['create', 'read', 'update', 'delete'], 'read')}
        >
          <Box mt={3} mb={3} width="300px" display="flex" justifyContent="center" alignSelf="center">
            <Warning icon border type="success" text="Access granted" />
          </Box>
        </AccessControl>
      </Box>
    </Provider>
  );
};

export const Route = () => {
  return (
    <Provider store={getStore({ config: { vars: { endpoint: {} } }, user: { privilege: { routes: ['home', 'arts'] } } })}>
      <Box display="flex" flexDirection="column">
        <Box>
          <Typography variant="body2">This dummy user only has access to the following pages:</Typography>
          <ul>
            <li>
              <Typography variant="body2">
                <strong>home</strong>
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>arts</strong>
              </Typography>
            </li>
          </ul>
        </Box>

        <AccessControl route={select('Route', ['', 'home', 'arts', 'movies', 'music'], 'home')}>
          <Box mt={3} mb={3} width="300px" display="flex" justifyContent="center" alignSelf="center">
            <Warning icon border type="success" text="Access granted" />
          </Box>
        </AccessControl>
      </Box>
    </Provider>
  );
};
