import React from 'react';
import { Box } from '@material-ui/core';
import { withKnobs } from '@storybook/addon-knobs';
import * as utils from 'utils';
import { FilterBar } from 'components';

export default {
  title: 'FilterBar',
  component: FilterBar,
  decorators: [withKnobs],
};

export const Default = () => {
  const options = [
    { id: 1, value: 1, label: 'One' },
    { id: 2, value: 2, label: 'Two' },
    { id: 3, value: 3, label: 'Three' },
  ];

  const fields = [
    {
      name: 'fullName',
      type: 'text',
      placeholder: 'Search by name',
      value: '',
    },
    {
      name: 'type',
      type: 'text',
      placeholder: 'Type',
      value: '',
    },
    {
      name: 'status',
      type: 'text',
      placeholder: 'Status',
      value: '',
    },
  ];

  const fields2 = [
    {
      name: 'fullName',
      type: 'autocomplete',
      placeholder: 'Search by name',
      value: [],
      options,
    },
    {
      name: 'type',
      type: 'autocomplete',
      placeholder: 'Type',
      value: [],
      options,
    },
    {
      name: 'status',
      type: 'autocomplete',
      placeholder: 'Status',
      value: [],
      options,
    },
  ];

  const actions = [
    {
      name: 'filter',
      label: utils.string.t('app.filter'),
      handler: (values) => {
        alert('Check console logs for values');
        console.log('Filter values', values);
      },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: () => {
        alert('Filter reset');
      },
    },
  ];

  return (
    <Box width="100%">
      <Box width="100%">
        <FilterBar fields={fields.slice(0, 1).map((f) => ({ ...f, gridSize: { xs: 12 } }))} actions={actions} />{' '}
      </Box>
      <Box width="100%">
        <FilterBar fields={fields.slice(0, 2).map((f) => ({ ...f, gridSize: { xs: 6 } }))} actions={actions} />{' '}
      </Box>
      <Box width="100%">
        <FilterBar fields={fields.map((f) => ({ ...f, gridSize: { xs: 12 / fields.length } }))} actions={actions} />{' '}
      </Box>
      <Box width="100%">
        <FilterBar fields={fields2.slice(0, 1).map((f) => ({ ...f, gridSize: { xs: 12 } }))} actions={actions} />{' '}
      </Box>
      <Box width="100%">
        <FilterBar fields={fields2.slice(0, 2).map((f) => ({ ...f, gridSize: { xs: 6 } }))} actions={actions} />{' '}
      </Box>
      <Box width="100%">
        <FilterBar fields={fields2.map((f) => ({ ...f, gridSize: { xs: 12 / fields2.length } }))} actions={actions} />{' '}
      </Box>
      <Box width="100%">
        <FilterBar fields={[...fields.slice(0, 1), ...fields2.slice(1, 2)].map((f) => ({ ...f, gridSize: { xs: 6 } }))} actions={actions} />{' '}
      </Box>
    </Box>
  );
};
