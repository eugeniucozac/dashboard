import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormToggle } from 'components';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'FormToggle',
  component: FormToggle,
  decorators: [withKnobs],
};

export const Default = () => {
  const { control, errors } = useForm({
    defaultValues: [],
  });

  const [resetKey, setResetKey] = useState();

  const label = text('Label', 'Label');
  const size = select('Size', ['small', 'medium', 'large'], 'small');
  const exclusive = boolean('Exclusive', true);
  const disabled = boolean('Disabled', false);
  const error = text('Error', '');
  const errorObj = error ? { message: error } : null;

  useEffect(() => {
    setResetKey(new Date().getTime());
  }, [exclusive]);

  return (
    <Box width={1} key={resetKey}>
      <FormToggle
        control={control}
        name="toggle1"
        label={label}
        options={[
          { id: 'INBOX', value: 'INBOX', label: 'Inbox' },
          { id: 'SENT', value: 'SENT', label: 'Sent' },
          { id: 'BIN', value: 'BIN', label: 'Bin' },
        ]}
        error={errorObj}
        hint={text('Hint', 'Choose an option')}
        buttonGroupProps={{
          disabled,
          exclusive,
          size,
        }}
      />
    </Box>
  );
};
