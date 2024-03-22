import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import merge from 'lodash/merge';

import { Modal } from 'components';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Modal',
  component: Modal,
  decorators: [withKnobs],
};

export const Default = () => {
  const [isClicked, setIsClicked] = React.useState(false);
  const handleClick = (event) => {
    setIsClicked(true);
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
    <>
      {/* <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                Open Modal
            </Button>
            {isClicked ? ( <Provider store={getStore()}><Modal /> </Provider> ) : null} */}
      <Provider store={getStore()}>
        <Modal />{' '}
      </Provider>
    </>
  );
};
