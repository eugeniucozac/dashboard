import React from 'react';
import { Comments } from 'components';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import merge from 'lodash/merge';

export default {
  title: 'Comments',
  component: Comments,
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
  const commentUser = {
    1: [
      {
        date: '2021-05-10T14:22:31.663+00:00',
        id: 1,
        message: 'Hello?',
        type: 'risk',
        typeId: '1',
        user: {
          id: 1000,
          firstName: 'John',
          lastName: 'Smith',
          'fullName:': 'John Smith',
          emailId: 'j.smith@aa.com',
        },
      },
      {
        date: '2021-05-10T22:22:31.663+00:00',
        id: 2,
        message: "Hi. Who's there?",
        type: 'risk',
        typeId: '1',
        user: {
          id: 1001,
          firstName: 'Susan',
          lastName: 'Richards',
          'fullName:': 'Susan Richards',
          emailId: 's.richards@aa.com',
        },
      },
      {
        date: '2021-05-11T14:22:31.663+00:00',
        id: 3,
        message: "It's me.",
        type: 'risk',
        typeId: '1',
        user: {
          id: 1000,
          firstName: 'John',
          lastName: 'Smith',
          'fullName:': 'John Smith',
          emailId: 'j.smith@aa.com',
        },
      },
      {
        date: '2021-05-25T14:22:31.663+00:00',
        id: 4,
        message: 'Oh hi!',
        type: 'risk',
        typeId: '1',
        user: {
          id: 1001,
          firstName: 'Susan',
          lastName: 'Richards',
          'fullName:': 'Susan Richards',
          emailId: 's.richards@aa.com',
        },
      },
      {
        date: '2021-06-10T14:22:31.663+00:00',
        id: 5,
        message: 'Great.',
        type: 'risk',
        typeId: '1',
        user: {
          id: 1000,
          firstName: 'John',
          lastName: 'Smith',
          'fullName:': 'John Smith',
          emailId: 'j.smith@aa.com',
        },
      },
    ],
  };

  return (
    <Provider store={getStore({ config: { vars: { endpoint: {} } }, comment: { items: commentUser } })}>
      <Comments
        id="1"
        divider={boolean('Divider', true)}
        title={text('Title', '')}
        placeholder={text('Placeholder', '')}
        truncate={number('truncate', 50)}
      />
    </Provider>
  );
};
