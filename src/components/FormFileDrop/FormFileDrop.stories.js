import React from 'react';
import { useForm } from 'react-hook-form';

import { FormFileDrop } from 'components';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'Form',
  component: FormFileDrop,
  decorators: [withKnobs],
};

export const FileDrop = () => {
  const { control, errors, setValue } = useForm({
    defaultValues: [],
  });

  const field = {
    label: 'Attach files here',
    name: 'files',
    type: 'FILE',
    placeholder: 'Type Street address',
    validation: {
      required: true,
      message: 'This field is required',
    },
    hint: 'Hint goes here',
  };

  const max = number('Max files', 1, { range: true, min: 1, max: 8, step: 1 });
  const label = text('Label', field.label);
  const hint = text('Hint', field.hint);
  const error = text('Error', errors[field.name]);
  const errorObj = error ? { message: error } : null;

  return (
    <Box width={1}>
      <FormFileDrop
        {...field}
        control={control}
        error={errorObj}
        label={label}
        hint={hint}
        componentProps={{
          multiple: max > 1,
          maxFiles: max,
        }}
        onChange={(file) => setValue(field.name, file, { shouldDirty: true })}
      />
    </Box>
  );
};
