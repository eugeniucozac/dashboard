import React from 'react';

import { FormLabel, FormText } from 'components';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'FormLabel',
  component: FormLabel,
  decorators: [withKnobs],
};

export const Default = () => {
  const label = text('Label', 'Form Label');
  const type = select('variant', ['body1', 'body2', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], 'h1');

  return (
    <Box width={1}>
      <FormLabel variant={type} label={label} />
      <Box>
        <FormText
          type="text"
          name="field1"
          value="dummy field"
          muiComponentProps={{
            disabled: true,
          }}
        />
      </Box>
    </Box>
  );
};
