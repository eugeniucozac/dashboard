import React from 'react';
import { Form } from 'components';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import * as Yup from 'yup';
import * as utils from 'utils';

export default {
  title: 'Form',
  component: Form,
  decorators: [withKnobs],
};

export const Default = () => {
  const legend = text('Legend', 'Form Legend');
  const cancel = boolean('Cancel', true);
  const secondary = boolean('Secondary', false);
  const submit = boolean('Submit', true);

  const fields = [
    ...(legend
      ? [
          {
            name: 'legend',
            type: 'legend',
            label: legend,
          },
        ]
      : []),
    {
      name: 'field-text',
      type: 'text',
      label: 'Text',
      hint: 'Type some text',
      placeholder: 'placeholder',
      value: '',
      validation: Yup.string().max(6).required(),
      muiComponentProps: {
        fullWidth: true,
      },
    },
    {
      name: 'field-number',
      type: 'number',
      label: 'Number',
      hint: 'Type any number',
      placeholder: 'ex: 0, 1000, 9.95',
      value: '',
      validation: Yup.number()
        .min(20)
        .nullable()
        .transform((value) => (Number.isNaN(value) ? null : value))
        .required(),
      muiComponentProps: {
        fullWidth: true,
      },
    },
  ];

  return (
    <Form
      id="storybook"
      fields={fields}
      actions={[
        ...(cancel
          ? [
              {
                name: 'cancel',
                label: 'Reset',
              },
            ]
          : []),
        ...(secondary
          ? [
              {
                name: 'secondary',
                label: 'Validate',
                handler: (data) => {
                  alert('Secondary action - check console logs');
                  console.log('[Secondary action]', data);
                },
              },
            ]
          : []),
        ...(submit
          ? [
              {
                name: 'submit',
                label: 'Submit',
                handler: (data) => {
                  alert('Submit - check console logs');
                  console.log('[Submit]', data);
                },
              },
            ]
          : []),
      ]}
      defaultValues={utils.form.getInitialValues(fields)}
      validationSchema={utils.form.getValidationSchema(fields)}
    />
  );
};
