import React from 'react';
import { Confirm, Modal } from 'components';
import { withKnobs, text, button } from '@storybook/addon-knobs';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import merge from 'lodash/merge';

export default {
  title: 'Confirm',
  component: Confirm,
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
  const confirmCancelTitle = text('Cancel Title', '').toString();
  const confirmConfirmTitle = text('Confirm Title', '').toString();
  const handler = () => {};
  const showModal = button('Show Confirm Modal', handler);

  const onClick = (text) => {
    console.log(`[onClick] ${text}`);
  };

  const modalVal = {
    ui: {
      modal: [
        {
          visible: true,
          type: 'CONFIRM',
          props: {
            title: 'Confirm Modal',
            subtitle: 'This is a confirm dialog modal',
            fullWidth: true,
            maxWidth: 'sm',
            componentProps: {
              cancelLabel: confirmCancelTitle,
              confirmLabel: confirmConfirmTitle,
              cancelHandler: () => onClick('Cancel'),
              submitHandler: () => onClick('Submit'),
            },
          },
        },
      ],
    },
  };

  return (
    <Provider store={getStore(modalVal)}>
      <Modal />
    </Provider>
  );
};
