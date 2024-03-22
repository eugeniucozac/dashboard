import React, { useState } from 'react';
import { FormMultiSelect } from 'components';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'FormMultiSelect',
  component: FormMultiSelect,
  decorators: [withKnobs],
};

export const Default = () => {
  const [selectedOptions, setSelectedOptions] = useState([
    { id: 1, label: 'Option 1', value: 1 },
    { id: 2, label: 'Option 2', value: 2 },
  ]);

  const options = [
    { id: 1, label: 'Option 1', value: 1 },
    { id: 2, label: 'Option 2', value: 2 },
    { id: 3, label: 'Option 3', value: 3 },
    { id: 4, label: 'Option 4', value: 4 },
    { id: 5, label: 'Option 5', value: 5 },
  ];

  return (
    <Box width={1}>
      <FormMultiSelect
        label={text('Label', 'Label')}
        placeholder={text('Placeholder', 'Placeholder')}
        color={select('Color', ['primary', 'secondary'], 'primary')}
        tagType="quantity"
        options={options}
        selectedOptions={selectedOptions}
        setSelectOption={(value) => {
          setSelectedOptions(value);
        }}
      />
    </Box>
  );
};
