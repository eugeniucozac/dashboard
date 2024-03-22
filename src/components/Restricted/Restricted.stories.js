import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import merge from 'lodash/merge';
import * as constants from 'consts';

import { Restricted } from 'components';
import { withKnobs, array } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'Restricted',
  component: Restricted,
  decorators: [withKnobs],
};

export const Default = () => {
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
  return (
    <Box m={4}>
      <Box>
        <Provider store={getStore()}>
          <Restricted include={array('include', [constants.ROLE_BROKER])}>
            <div>Test</div>
          </Restricted>
        </Provider>
      </Box>
    </Box>
  );
};
