import React from 'react';

import { Formik } from 'formik';

import { InlineEdit } from 'components';
import { object, select, text, boolean, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'InlineEdit',
  component: InlineEdit,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Formik>
      <InlineEdit
        name={text('Name', 'InlineEdit')}
        type={select('Type', ['text', 'textarea', 'number'], 'textarea')}
        variant={select('variant', ['text', 'percent', 'currency', 'number'], 'percent')}
        value={text('value', 'value')}
        currency={text('currency', 'USD')}
        error={boolean('error', true)}
        editing={boolean('editing', false)}
        compact={boolean('compact', false)}
        title={boolean('title', true)}
        multiline={boolean('multiline', true)}
        muiComponentProps={object('muiComponentProps', {})}
        onClick={(e) => console.log('onClick')}
        onClickAway={(e) => console.log('onClickAway')}
      />
    </Formik>
  );
};
