import React from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import merge from 'lodash/merge';
import { Tooltip, Button, DynamicTable } from 'components';
import { withKnobs, number } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as utils from 'utils';

export default {
  title: 'DynamicTable',
  component: DynamicTable,
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

const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => ({
  id: num,
  rowKey: num,
  name: `row${num}`,
  cells: [
    { label: `Row ${num}` },
    { type: 'text', name: `text${num}`, value: '' },
    { type: 'checkbox', name: `checkbox${num}`, value: false },
    {
      type: 'select',
      name: `select${num}`,
      optionsKey: 'placementType',
      value: '',
    },
    { type: 'datepicker', name: `datepicker${num}`, value: '' },
    {
      type: 'toggle',
      name: `toggle${num}`,
      value: null,
      optionsKey: 'yesNoNa',
    },
  ],
}));

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'text', label: 'Text' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'select', label: 'Select' },
  { id: 'datepicker', label: 'Datepicker' },
  { id: 'toggle', label: 'Toggle' },
];

export const Default = () => {
  const defaultValues = utils.form.getInitialValues(
    rows.reduce((acc, cur) => {
      const fields = cur.cells.filter((cell) => cell.type);
      return [...acc, ...fields];
    }, [])
  );
  const formProps = useForm({
    defaultValues,
  });

  const count = number('Rows', 1, { range: true, min: 1, max: 10, step: 1 });

  return (
    <Provider store={getStore()}>
      <Box width="100%">
        <DynamicTable rows={rows.slice(0, count)} columnHeaders={columns} formProps={formProps} />
        <Tooltip title="Check console logs for values" placement="top">
          <Button
            color="primary"
            size="small"
            text="Submit"
            onClick={() => {
              console.log('[DynamicTable.stories]', formProps.getValues());
            }}
          />
        </Tooltip>
      </Box>
    </Provider>
  );
};
