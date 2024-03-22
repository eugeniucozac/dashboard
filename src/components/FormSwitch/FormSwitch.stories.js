import React, { useEffect } from 'react';
import { FormSwitch } from 'components';
import { withKnobs, boolean, text, select } from '@storybook/addon-knobs';
import * as utils from 'utils';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';

export default {
  title: 'Form',
  decorators: [withKnobs],
};

export const Switch = () => {
  const type = select('Type', ['single', 'multiple'], 'single');
  const isSingle = type === 'single';
  const isMultiple = type === 'multiple';

  // prettier-ignore
  const field = {
    name: 'fieldSwitch',
    type: 'switch',
    options: [
      { label: 'yes', value: 'yes' },
      { label: 'no', value: 'no' },
      { label: 'maybe (disabled)', value: 'maybe', disabled: true },
      { label: 'sometimes', value: 'sometimes' },
      { label: 'always', value: 'always' },
      { label: 'never', value: 'never' },
    ],
    muiComponentProps: {
      onChange: (name, value) => {
        console.log('[Single Value]', name, value);
      },
    },
  };

  const defaultValues = utils.form.getInitialValues([field]);
  const { control, register, watch, reset } = useForm({ defaultValues });
  const onChangeTrigger = (e, name, value) => {};
  useEffect(
    () => {
      reset(defaultValues);
    },
    [type] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const color = select('Color', ['primary', 'secondary'], 'primary');
  const label = text('Label', 'Switch Field');
  const hint = text('Hint', 'Toggle a few options...');
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;

  return (
    <Box width={1}>
      {isSingle && (
        <FormSwitch
          control={control}
          register={register}
          watch={watch}
          name={field.name}
          type={field.type}
          title={label}
          hint={hint}
          error={error}
          color={color}
          value={false}
          label="yes"
          muiComponentProps={{
            onChange: (name, value) => {
              console.log('[SWITCH value]', name, value);
            },
          }}
        />
      )}

      {isMultiple && (
        <FormSwitch control={control} register={register} watch={watch} {...field} title={label} hint={hint} error={error} color={color} />
      )}
    </Box>
  );
};
