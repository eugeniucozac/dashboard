import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from 'stores';

import { LayerComment } from 'components';
import { withKnobs } from '@storybook/addon-knobs';
import merge from 'lodash/merge';

export default {
  title: 'LayerComment',
  component: LayerComment,
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
      <LayerComment
        newComments={true}
        hasComments={true}
        isOpen={true}
        handleAddCommentClose={() => console.log('comment closed!')}
        commentsOptions={{
          id: `12345`,
        }}
      />
    </Provider>
  );
};
