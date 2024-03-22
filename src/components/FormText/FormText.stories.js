import React from 'react';
import { FormText } from 'components';
import { withKnobs, boolean, text, select, number } from '@storybook/addon-knobs';
import * as utils from 'utils';
import { useForm } from 'react-hook-form';
import { Box, InputAdornment } from '@material-ui/core';
import { VpnKey, Visibility, Lock, Euro, AttachMoney } from '@material-ui/icons';

export default {
  title: 'Form',
  decorators: [withKnobs],
};

export const Text = () => {
  // prettier-ignore
  const field = {
    name: 'fieldText',
    type: 'text',
    value: '',
  };

  const defaultValues = utils.form.getInitialValues([field]);
  const { control } = useForm({ defaultValues });

  const icons = {
    '': null,
    lock: Lock,
    visibility: Visibility,
    vpnkey: VpnKey,
  };

  const label = text('Label', 'Text Field');
  const placeholder = text('Placeholder', 'Placeholder');
  const hint = text('Hint', 'Type some text...');
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;
  const readOnly = boolean('Readonly', false);
  const fullwidth = boolean('Fullwidth', true);
  const compact = boolean('Compact', false);
  const adornment = text('Adornment', '');
  const icon = select('Icon', Object.keys(icons), '');
  const position = select('Position', ['left', 'right'], 'left');

  const IconComponent = icons[icon];

  const startAdornment = {
    startAdornment: <InputAdornment position="start">{icon ? <IconComponent /> : adornment}</InputAdornment>,
  };

  const endAdornment = {
    endAdornment: <InputAdornment position="end">{icon ? <IconComponent /> : adornment}</InputAdornment>,
  };

  return (
    <Box width={1}>
      <FormText
        control={control}
        {...field}
        label={label}
        placeholder={placeholder}
        hint={hint}
        error={error}
        compact={compact}
        muiComponentProps={{
          fullWidth: fullwidth,
          InputProps: {
            ...(adornment || icon ? (position === 'left' ? startAdornment : endAdornment) : null),
            ...(readOnly && { readOnly: true }),
          },
        }}
      />
    </Box>
  );
};

export const Textarea = () => {
  // prettier-ignore
  const field = {
    name: 'fieldTextarea',
    type: 'textarea',
    value: '',
  };

  const defaultValues = utils.form.getInitialValues([field]);
  const { control } = useForm({ defaultValues });

  const icons = {
    '': null,
    lock: Lock,
    visibility: Visibility,
    vpnkey: VpnKey,
  };

  const label = text('Label', 'Textarea Field');
  const placeholder = text('Placeholder', 'Placeholder');
  const hint = text('Hint', 'Type a lot of text...');
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;
  const fullwidth = boolean('Fullwidth', true);
  const rows = number('Rows', 3, { range: true, min: 1, max: 6, step: 1 });
  const maxRows = number('Rows Max', 6, { range: true, min: 1, max: 20, step: 1 });
  const icon = select('Icon', Object.keys(icons), '');
  const position = select('Position', ['left', 'right'], 'left');

  const IconComponent = icons[icon];

  const startAdornment = {
    startAdornment: icon ? <InputAdornment position="start">{<IconComponent />}</InputAdornment> : null,
  };

  const endAdornment = {
    endAdornment: icon ? <InputAdornment position="end">{<IconComponent />}</InputAdornment> : null,
  };

  return (
    <Box width={1}>
      <FormText
        control={control}
        {...field}
        label={label}
        placeholder={placeholder}
        hint={hint}
        error={error}
        muiComponentProps={{
          fullWidth: fullwidth,
          multiline: true,
          minRows: rows,
          maxRows: maxRows,
          InputProps: {
            ...(position === 'left' ? startAdornment : endAdornment),
          },
        }}
      />
    </Box>
  );
};

export const Number = () => {
  // prettier-ignore
  const field = {
    name: 'fieldNumber',
    type: 'number',
    value: '',
  };

  const defaultValues = utils.form.getInitialValues([field]);
  const { control } = useForm({ defaultValues });

  const icons = {
    '': null,
    euro: Euro,
    dollar: AttachMoney,
  };

  const label = text('Label', 'Number Field');
  const placeholder = text('Placeholder', 'ex: 0, 1, 2.99, 10000');
  const hint = text('Hint', 'Type a number...');
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;
  const fullwidth = boolean('Fullwidth', true);
  const adornment = text('Adornment', '');
  const icon = select('Icon', Object.keys(icons), '');
  const position = select('Position', ['left', 'right'], 'left');

  const IconComponent = icons[icon];

  const startAdornment = {
    startAdornment: <InputAdornment position="start">{icon ? <IconComponent /> : adornment}</InputAdornment>,
  };

  const endAdornment = {
    endAdornment: <InputAdornment position="end">{icon ? <IconComponent /> : adornment}</InputAdornment>,
  };

  return (
    <Box width={1}>
      <FormText
        control={control}
        {...field}
        label={label}
        placeholder={placeholder}
        hint={hint}
        error={error}
        muiComponentProps={{
          fullWidth: fullwidth,
          InputProps: {
            ...(position === 'left' ? startAdornment : endAdornment),
          },
        }}
      />
    </Box>
  );
};
