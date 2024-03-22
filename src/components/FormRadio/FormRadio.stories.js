import React from 'react';
import { FormRadio } from 'components';
import { withKnobs, boolean, text, select } from '@storybook/addon-knobs';
import * as utils from 'utils';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';

export default {
  title: 'Form',
  decorators: [withKnobs],
};

export const Radio = () => {
  // prettier-ignore
  const field = {
    name: 'fieldRadio',
    type: 'radio',
    options: [
      { label: 'yes', value: 'yes' },
      { label: 'no', value: 'no' },
      { label: 'maybe (disabled)', value: 'maybe', disabled: true },
      { label: 'sometimes', value: 'sometimes' },
      { label: 'always', value: 'always' },
      { label: 'never', value: 'never' },
    ],
    value: '',
  };

  const defaultValues = utils.form.getInitialValues([field]);
  const { control } = useForm({ defaultValues });

  const color = select('Color', ['primary', 'secondary'], 'primary');
  const row = boolean('Row', false);
  const label = text('Label', 'Radio Field');
  const hint = text('Hint', 'Select one option...');
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;

  return (
    <Box width={1}>
      <FormRadio control={control} {...field} title={label} hint={hint} error={error} color={color} muiFormGroupProps={{ row: row }} />
    </Box>
  );
};
