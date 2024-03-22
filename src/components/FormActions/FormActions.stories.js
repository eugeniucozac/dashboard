import React from 'react';

import { FormActions, Button } from 'components';
import { select, withKnobs, boolean } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';
import { useFormActions } from 'hooks';
import { useForm } from 'react-hook-form';

import * as utils from 'utils';

export default {
  title: 'FormActions',
  component: FormActions,
  decorators: [withKnobs],
};

export const Default = () => {
  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.submit'),
      handler: () => alert('submitted'),
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => alert('cancelled'),
    },
  ];
  const { reset, handleSubmit, formState } = useForm({
    defaultValues: [],
  });
  const { cancel, submit } = useFormActions(actions, reset);

  const options = ['default', 'dialog', 'blank'];
  const defaultValue = 'default';
  const type = select('Type', options, defaultValue);

  const optionsAlign = ['left', 'right'];
  const defaultValueAlign = 'left';
  const align = select('Align', optionsAlign, defaultValueAlign);

  return (
    <Box width="100%">
      <FormActions type={type} align={align} divider={boolean('Divider', true)}>
        {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={cancel.handler} />}
        {submit && (
          <Button
            text={submit.label}
            type="submit"
            disabled={formState.isSubmitting}
            onClick={handleSubmit(submit.handler)}
            color="primary"
          />
        )}
      </FormActions>
    </Box>
  );
};
