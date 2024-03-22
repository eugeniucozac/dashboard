import React, { useState } from 'react';
import { FormDate } from 'components';
import { withKnobs, boolean, text, select } from '@storybook/addon-knobs';
import * as utils from 'utils';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';

export default {
  title: 'Form',
  decorators: [withKnobs],
};

export const Date = () => {
  // prettier-ignore
  const field = {
    name: 'fieldDate',
    type: 'date',
    value: '',
  };

  const defaultValues = utils.form.getInitialValues([field]);
  const { control } = useForm({ defaultValues });

  const label = text('Label', 'Date Field');
  const hint = text('Hint', 'Type/pick a date using native controls...');
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;
  const fullwidth = boolean('Fullwidth', true);

  return (
    <Box width={1}>
      <FormDate
        control={control}
        {...field}
        label={label}
        hint={hint}
        error={error}
        muiComponentProps={{
          fullWidth: fullwidth,
        }}
      />
    </Box>
  );
};

export const DatePicker = () => {
  // prettier-ignore
  const field = {
    name: 'fieldDatepicker',
    type: utils.string.t('app.datepicker'),
    value: null,
  };

  const defaultValues = utils.form.getInitialValues([field]);
  const { control } = useForm({ defaultValues });

  const label = text('Label', 'Datepicker Field');
  const hint = text('Hint', 'Pick a date...');
  const placeholder = text('Placeholder', 'Custom date placeholder...') || undefined;
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;
  const fullwidth = boolean('Fullwidth', true);
  const plainText = boolean('Plain Text', false);
  const plainTextIcon = boolean('Plain Text Icon', false);
  const format = select('Format', ['D/M/YYYY', 'DD-MM-YYYY', 'dddd, MMMM Do YYYY', 'L', 'LL', 'LLL'], 'dddd, MMMM Do YYYY');
  const handleUpdate = (name, date) => {
    console.log('SELCTED_DATE', date);
  };
  return (
    <Box width={1}>
      <FormDate
        control={control}
        {...field}
        label={label}
        hint={hint}
        placeholder={placeholder}
        error={error}
        plainText={plainText}
        plainTextIcon={plainTextIcon}
        muiComponentProps={{
          fullWidth: fullwidth,
          margin: 'dense',
        }}
        handlers={{
          toggelDatePicker: handleUpdate,
        }}
        muiPickerProps={{
          variant: boolean('Inline', true) ? 'inline' : undefined,
          disableToolbar: !boolean('Toolbar', true),
          clearable: boolean('Clearable', true),
          disablePast: boolean('Disable Past', false),
          disableFuture: boolean('Disable Future', false),
          showTodayButton: boolean('Show Today Button', false),
          format: format,
        }}
      />
    </Box>
  );
};
