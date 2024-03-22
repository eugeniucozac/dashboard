import React, { useEffect, useState } from 'react';
import { FormSelect } from 'components';
import { withKnobs, boolean, text, select } from '@storybook/addon-knobs';
import * as utils from 'utils';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';

export default {
  title: 'Form',
  decorators: [withKnobs],
};

export const Select = () => {
  const [valueSingle, setValueSingle] = useState('__placeholder__');
  const [valueMultiple, setValueMultiple] = useState(['__placeholder__']);

  const label = text('Label', 'Select Field');
  const hint = text('Hint', 'Select one option...');
  const placeholder = boolean('Placeholder', true);
  const value = placeholder ? '__placeholder__' : '';
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;
  const fullWidth = boolean('Fullwidth', true);
  const multi = boolean('Multi', true);
  const size = select('Size', ['xs', 'sm', 'md'], 'md');
  const rhf = boolean('React Hook Form', true);

  // prettier-ignore
  const fields = [
    {
      name: 'fieldSelectSingle',
      type: 'select',
      value: value,
      options: [
        ...(placeholder ? [{ label: 'Custom select placeholder...', value: '__placeholder__', placeholder: true }] : []),
        { label: 'yes', value: 'yes' },
        { label: 'no', value: 'no' },
        { label: 'maybe (disabled)', value: 'maybe', disabled: true },
        { label: 'it is long length label to test the ellipsis based on the form select width', value: 'longLengthLabel' },
        { label: 'always', value: 'always' },
        { label: 'never', value: 'never' },
      ],
    },
    {
      name: 'fieldSelectMultiple',
      type: 'select',
      value: [value],
      options: [
        ...(placeholder ? [{ label: 'Custom select placeholder...', value: '__placeholder__', placeholder: true }] : []),
        { label: 'yes', value: 'yes' },
        { label: 'no', value: 'no' },
        { label: 'maybe (disabled)', value: 'maybe', disabled: true },
        { label: 'it is long length label to test the ellipsis based on the form select width', value: 'longLengthLabel' },
        { label: 'always', value: 'always' },
        { label: 'never', value: 'never' },
      ],
    }
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const { control, reset } = useForm({ defaultValues });

  useEffect(
    () => {
      reset(defaultValues);
    },
    [placeholder, multi] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Box width={1}>
      {rhf && !multi && (
        <FormSelect
          control={control}
          {...fields[0]}
          label={label}
          hint={hint}
          error={error}
          size={size}
          muiComponentProps={{
            fullWidth: fullWidth,
          }}
        />
      )}

      {rhf && multi && (
        <FormSelect
          control={control}
          {...fields[1]}
          label={label}
          hint={hint}
          error={error}
          size={size}
          muiComponentProps={{
            fullWidth: fullWidth,
            multiple: true,
          }}
        />
      )}

      {!rhf && !multi && (
        <FormSelect
          {...fields[0]}
          value={valueSingle}
          label={label}
          hint={hint}
          error={error}
          size={size}
          muiComponentProps={{
            fullWidth: fullWidth,
          }}
          handleUpdate={(name, value) => {
            setValueSingle(value);
            setTimeout(() => alert(`Select Single dropdown changed:\n${name} - ${value}`), 50);
          }}
        />
      )}

      {!rhf && multi && (
        <FormSelect
          {...fields[1]}
          value={valueMultiple}
          label={label}
          hint={hint}
          error={error}
          size={size}
          muiComponentProps={{
            fullWidth: fullWidth,
            multiple: true,
          }}
          handleUpdate={(name, value) => {
            setValueMultiple(value);
            setTimeout(() => alert(`Select Multiple dropdown changed:\n${name} - ${value}`), 50);
          }}
        />
      )}
    </Box>
  );
};
