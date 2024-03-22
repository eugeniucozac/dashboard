import React from 'react';
import { Button, FormActions, FormCheckbox, FormContainer, FormFields } from 'components';
import { withKnobs, boolean, text, select } from '@storybook/addon-knobs';
import * as utils from 'utils';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';

export default {
  title: 'Form',
  component: FormCheckbox,
  decorators: [withKnobs],
};

export const Checkbox = () => {
  const fields = [
    {
      name: 'single_value',
      type: 'checkbox',
      value: false,
      label: 'Banana',
      title: 'Single Value',
      muiComponentProps: {
        onChange: (name, value) => {
          console.log('[Single Value]', name, value);
        },
      },
    },
    {
      name: 'single_option',
      type: 'checkbox',
      title: 'Single Option',
      options: [{ label: 'Apple', name: 'apple', value: false }],
      value: ['apple'],
      muiComponentProps: {
        onChange: (group, name, value) => {
          console.log('[Single Option]', group, name, value);
        },
      },
    },
    {
      name: 'multiple_options',
      type: 'checkbox',
      title: 'Multiple Options',
      options: [
        { label: 'Grapes', name: 'grapes', value: false },
        { label: 'Kiwi', name: 'kiwi', value: false },
        { label: 'Lime', name: 'lime', value: true },
        { label: 'Lemon', name: 'lemon', value: true, disabled: true },
        { label: 'Orange', name: 'orange', value: false },
        { label: 'Pineapple', name: 'pineapple', value: false },
      ],
      value: ['lime', 'lemon'],
      muiComponentProps: {
        onChange: (group, name, value) => {
          console.log('[Multiple Options]', group, name, value);
        },
      },
    },
  ];

  const type = select('Type', ['Single Value', 'Single Option', 'Multiple Options'], 'Single Value');

  const defaultValues = utils.form.getInitialValues(fields);
  const { control, register, watch, handleSubmit } = useForm({ defaultValues });

  const color = select('Color', ['primary', 'secondary'], 'primary');
  const row = boolean('Row', false);
  const hint = text('Hint', 'Select at least one option...');
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;

  const submitHandler = (values) => {
    console.log('[submit]', values);
  };

  return (
    <Box width={1}>
      <FormContainer onSubmit={handleSubmit(submitHandler)}>
        <FormFields>
          {type === 'Single Value' && (
            <FormCheckbox control={control} register={register} watch={watch} {...fields[0]} hint={hint} error={error} color={color} />
          )}
          {type === 'Single Option' && <FormCheckbox control={control} {...fields[1]} color={color} hint={hint} error={error} />}
          {type === 'Multiple Options' && (
            <FormCheckbox
              control={control}
              register={register}
              {...fields[2]}
              color={color}
              hint={hint}
              error={error}
              muiFormGroupProps={{ row }}
            />
          )}
        </FormFields>

        <FormActions align="left">
          <Button text="Submit" type="submit" color="primary" />
        </FormActions>
      </FormContainer>
    </Box>
  );
};
