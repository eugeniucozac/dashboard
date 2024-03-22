import React, { useState } from 'react';
import { MultiSelect } from 'components';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

export default {
  title: 'MultiSelect',
  component: MultiSelect,
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

  const [values, setValues] = useState([options[2]]);

  const toggle = (field, value) => {
    if (value) {
      const isValueAlreadySelected = values.some((i) => i.id === value.id);

      setValues(isValueAlreadySelected ? values.filter((i) => i.id !== value.id) : [...values, value]);
    }
  };

  return (
    <MultiSelect
      id="stories"
      search={boolean('Search', true)}
      options={options}
      values={values}
      placeholder={text('Placeholder', 'Select')}
      handlers={{ toggleOption: toggle }}
    />
  );
};
