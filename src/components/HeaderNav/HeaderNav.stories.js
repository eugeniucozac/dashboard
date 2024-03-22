import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from 'stores';

import { HeaderNav } from 'components';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import merge from 'lodash/merge';

export default {
  title: 'HeaderNav',
  component: HeaderNav,
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
    <Provider store={getStore()}>
      <HeaderNav showFloatingButton={boolean('ShowFloatingButton', true)} showMagnifierButton={boolean('ShowMagnifierButton', true)} />
    </Provider>
  );
};
