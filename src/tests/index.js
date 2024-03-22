import React from 'react';
import { render, waitForElementToBeRemoved, within, prettyDOM } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { Route, Switch, MemoryRouter } from 'react-router';
import { useForm, FormProvider } from 'react-hook-form';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { StylesProvider } from '@material-ui/styles';
import MomentUtils from '@date-io/moment';
import merge from 'lodash/merge';
import '@testing-library/jest-dom/extend-expect';

import { Auth, Theme } from 'components';
import reducer from 'stores';
import configJson from '../../public/config/config.json';

export const publicConfig = configJson;

const initialStateWithConfig = {
  config: {
    vars: configJson,
  },
  user: {
    id: 1,
    departmentIds: [1, 2, 3],
    auth: {
      accessToken: 'abc123',
    },
  },
};

// react-testing-library
// -----------------------------------
// -----------------------------------
// https://testing-library.com/docs/example-react-redux
// https://testing-library.com/docs/react-testing-library/setup

export const getInitialState = (obj) => {
  return merge({}, initialStateWithConfig, obj);
};

/**
 * Testing Library utility function to wrap tested component in React Hook Form
 * @param {ReactElement} ui A React component
 * @param objectParameters
 * @param {Object} objectParameters.defaultValues Initial form values to pass into
 * React Hook Form, which you can then assert against
 */
export const renderWithReactHookForm = (
  ui,
  {
    initialState,
    store = createStore(reducer, getInitialState(initialState), compose(applyMiddleware(thunk))),
    route,
    defaultValues = {},
  } = {}
) => {
  let reactHookFormMethods = {};

  const Wrapper = ({ children }) => {
    const methods = useForm({ defaultValues });
    return (
      <Provider store={store}>
        <StylesProvider injectFirst>
          <Theme>
            <MemoryRouter initialEntries={route}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <FormProvider {...methods}>{children}</FormProvider>;
              </MuiPickersUtilsProvider>
            </MemoryRouter>
          </Theme>
        </StylesProvider>
      </Provider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper }),
  };
};

/**
 * custom render method that includes global context providers, data stores, etc.
 * available globally - re-exports everything from React Testing Library
 * @param ui
 * @param initialState
 * @param store
 * @param route
 * @returns {RenderResult | RenderResult<Queries>}
 */
const renderNoAuth = (
  ui,
  { initialState, store = createStore(reducer, getInitialState(initialState), compose(applyMiddleware(thunk))), route } = {}
) => {
  const Component = () => {
    return (
      <Provider store={store}>
        <StylesProvider injectFirst>
          <Theme>
            <MemoryRouter initialEntries={route}>
              <MuiPickersUtilsProvider utils={MomentUtils}>{ui}</MuiPickersUtilsProvider>
            </MemoryRouter>
          </Theme>
        </StylesProvider>
      </Provider>
    );
  };

  return render(ui, { wrapper: Component });
};

export const renderWithAuth = (
  ui,
  { initialState, store = createStore(reducer, getInitialState(initialState), compose(applyMiddleware(thunk))), route } = {}
) => {
  const Component = () => {
    return (
      <Provider store={store}>
        <StylesProvider injectFirst>
          <Theme>
            <MemoryRouter initialEntries={route}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <Auth>{ui}</Auth>
              </MuiPickersUtilsProvider>
            </MemoryRouter>
          </Theme>
        </StylesProvider>
      </Provider>
    );
  };

  return render(ui, { wrapper: Component });
};

export const debugElem = (element) => {
  if (element) {
    if (element.length) {
      element.forEach((node) => {
        return console.log(prettyDOM(node));
      });
    } else {
      return console.log(prettyDOM(element));
    }
  }
};

// Select Material-UI Select Option
// https://github.com/testing-library/react-testing-library/issues/322#issuecomment-581650108
export const changeMuiSelectOption = async (element, optionText) => {
  return new Promise((resolve) => {
    const selectButton = element.parentNode.querySelector('[role=button]');
    UserEvent.click(selectButton);

    // Get the dropdown element. We don't use getByRole() because it includes <select>s too.
    const listbox = document.body.querySelector('ul[role=listbox]');
    const listItem = within(listbox).getByText(optionText);
    UserEvent.click(listItem);

    waitForElementToBeRemoved(() => document.body.querySelector('ul[role=listbox]')).then(resolve);
  });
};

export const openMuiSelect = async (element) => {
  return new Promise((resolve) => {
    const selectButton = element.parentNode.querySelector('[role=button]');
    UserEvent.click(selectButton);
    resolve();
  });
};

export const setLocation = (hostname, { path, hash } = {}) => {
  // save the original location object
  const locationOriginal = global.window.location;
  delete global.window.location;

  global.window = Object.create(window);
  global.window.location = {
    origin: `http://${hostname}.com`,
    protocol: 'http:',
    host: hostname,
    hostname: hostname,
    port: '3000',
    pathname: `/${path}`,
    search: '',
    hash: hash || '',
    href: `http://${hostname}${hostname !== 'localhost' ? '.com' : ''}${path ? `/${path}` : ''}`,
  };

  return locationOriginal;
};

export const resetLocation = (location) => {
  global.window.location = location;
};

/**
 * mockIntersectionObserver
 * IntersectionObserver isn't available in test environment
 * https://stackoverflow.com/a/63684771/353193
 */
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();

  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn().mockReturnValue(null),
    unobserve: jest.fn().mockReturnValue(null),
    disconnect: jest.fn().mockReturnValue(null),
  });

  window.IntersectionObserver = mockIntersectionObserver;
};

export const getFormText = (name) => {
  return `input[type="text"][name="${name}"]`;
};

export const getFormTextarea = (name) => {
  return `textarea[name="${name}"]`;
};

export const getFormNumber = (name) => {
  return `input[type="text"][name="${name}"]`;
};

export const getFormDate = (name) => {
  return `input[type="date"][name="${name}"]`;
};

export const getFormDatepicker = (name) => {
  return `input[data-form-type="datepicker"][name="${name}"]`;
};

export const getFormRadio = (name, value) => {
  return `input[type="radio"][name="${name}"]${value ? `[value="${value}"]` : ''}`;
};

export const getFormCheckbox = (name, value) => {
  return `input[type="checkbox"][name="${name}"]${value ? `[value="${value}"]` : ''}`;
};

export const getFormSwitch = (name) => {
  return `input[data-form-type="switch"][name="${name}"]`;
};

export const getFormToggle = (name, value) => {
  return `div[name="${name}"] > button[type="button"]${value ? `[value="${value}"]` : ''}`;
};

export const getFormSelect = (name) => {
  return `input[data-form-type="select"][name="${name}"]`;
};

export const getFormAutocomplete = (name) => {
  return `div[data-form-type="autocomplete"] div[name="${name}"]`;
};

export const getFormAutocompleteMui = (name) => {
  return `div[data-form-type="autocomplete"] input[type="text"][name="${name}"]`;
};

export const getFormFile = (name) => {
  return `div[data-form-type="file"][name="${name}"] > [type="file"]`;
};

export const getFormHidden = (name, value) => {
  return `input[data-form-type="hidden"][name="${name}"]${value ? `[value="${value}"]` : ''}`;
};

// re-export everything from Testing Library
export * from '@testing-library/react';
export { renderNoAuth as render };
