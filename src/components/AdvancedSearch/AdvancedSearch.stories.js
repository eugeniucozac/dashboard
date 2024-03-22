import React from 'react';
import { AdvancedSearch } from 'components';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import merge from 'lodash/merge';

export default {
  title: 'AdvancedSearch',
  component: AdvancedSearch,
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

export const Default = () => {
  const search = text('Search Term', 'Google');
  const loading = boolean('Loading', false);
  const error = boolean('Error', false);

  const results = {
    clients: {
      total: 8,
      items: [
        { id: 1, name: 'Audi' },
        { id: 2, name: 'BMW' },
        { id: 3, name: 'Ford' },
        { id: 4, name: 'Honda' },
        { id: 5, name: 'Maserati' },
        { id: 6, name: 'Mercedez-Benz' },
        { id: 7, name: 'Tesla' },
        { id: 8, name: 'Toyota' },
      ],
    },
    policies: {
      total: 6,
      items: [
        { id: 1, name: 'Microsoft' },
        { id: 2, name: 'Google' },
        { id: 3, name: 'Facebook (Meta)' },
        { id: 4, name: 'Uber' },
        { id: 5, name: 'Yahoo' },
        { id: 6, name: 'Alibaba' },
      ],
    },
  };

  return (
    <Provider
      store={getStore({
        search: { results, resultsTerm: search, isLoading: loading, error: error ? 'There was an error loading search results.' : '' },
      })}
    >
      <AdvancedSearch />
    </Provider>
  );
};
