import React, { useState } from 'react';
import { PopoverFilter, MultiSelect } from 'components';
import { withKnobs, text, number, select, boolean } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'PopoverFilter',
  component: PopoverFilter,
  decorators: [withKnobs],
};

export const Default = () => {
  const options = [
    { id: 'astonmartin', name: 'Aston Martin' },
    { id: 'audi', name: 'Audi' },
    { id: 'bentley', name: 'Bentley' },
    { id: 'bmw', name: 'BMW (Bayerische Motoren Werke AG)' },
    { id: 'chevrolet', name: 'Chevrolet' },
    { id: 'citroen', name: 'Citroen' },
    { id: 'dodge', name: 'Dodge' },
    { id: 'ferrari', name: 'Ferrari' },
    { id: 'ford', name: 'Ford' },
    { id: 'honda', name: 'Honda' },
    { id: 'hyundai', name: 'Hyundai' },
    { id: 'infiniti', name: 'Infiniti' },
    { id: 'jaguar', name: 'Jaguar' },
    { id: 'kia', name: 'Kia' },
    { id: 'lotus', name: 'Lotus' },
    { id: 'lexus', name: 'Lexus' },
    { id: 'maseratti', name: 'Maseratti' },
    { id: 'mercedesbenz', name: 'Mercedes-Benz' },
    { id: 'nissan', name: 'Nissan' },
    { id: 'porsche', name: 'Porsche' },
    { id: 'renault', name: 'Renault' },
    { id: 'rollsroyce', name: 'Rolls Royce' },
    { id: 'saab', name: 'Saab' },
    { id: 'subaru', name: 'Subaru' },
    { id: 'tesla', name: 'Tesla' },
    { id: 'toyota', name: 'Toyota' },
    { id: 'vw', name: 'Volkswagen' },
    { id: 'volvo', name: 'Volvo' },
  ];

  const [values, setValues] = useState([]);

  const toggle = (field, value) => {
    if (value) {
      const isValueAlreadySelected = values.some((i) => i.id === value.id);

      setValues(isValueAlreadySelected ? values.filter((i) => i.id !== value.id) : [...values, value]);
    }
  };

  return (
    <Box display="flex" width="100%" justifyContent="flex-start">
      <PopoverFilter
        id="stories"
        label={text('Label', 'Filter')}
        type={select('Type', ['multiSelect', 'other'], 'multiSelect')}
        options={options}
        value={values}
        placeholder={text('Placeholder', '')}
        maxHeight={number('Height', 300)}
        content={<MultiSelect id="stories" search options={options} values={values} placeholder={text('Placeholder', 'Select')} />}
        color={select('Colour', ['primary', 'secondary', 'default'], 'default')}
        disabled={boolean('Disabled', false)}
        text={boolean('Custom text', false) ? { label: 'Custom hard coded text' } : null}
        handlers={{ onToggleOption: toggle }}
      />
    </Box>
  );
};
