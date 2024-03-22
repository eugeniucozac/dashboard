import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import merge from 'lodash/merge';

import { Logo } from 'components';
import { number, withKnobs } from '@storybook/addon-knobs';
import { Grid } from '@material-ui/core';

export default {
  title: 'Logo',
  component: Logo,
  decorators: [withKnobs],
};

export const Default = () => {
  const logo = {
    display: 'inline-block',
    height: 70,
    marginBottom: 'auto',
  };
  const login = {
    width: '100% !important',
    maxWidth: '300px !important',
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
  return (
    <Provider store={getStore()}>
      <Grid item xs={12}>
        <Logo className={[logo, login]} height={number('Logo', 30)}>
          <div>test</div>
        </Logo>
      </Grid>
    </Provider>
  );
};
