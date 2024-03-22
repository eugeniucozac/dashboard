import React, { useState } from 'react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { SingleSelect } from 'components';
import isEqual from 'lodash/isEqual';

export default {
  title: 'SingleSelect',
  component: SingleSelect,
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
  ];

  const initialValue = {};
  const [selectedListItem, setSelectedListItem] = useState(options[1]);

  const toggle = (selectedValue) => {
    if (isEqual(selectedValue, selectedListItem)) {
      setSelectedListItem({ ...initialValue });
    } else {
      setSelectedListItem(selectedValue);
    }
  };

  return (
    <SingleSelect
      id="stories"
      search={boolean('Search', true)}
      options={options}
      value={selectedListItem}
      placeholder={text('Placeholder', 'Search')}
      handlers={{ onToggleOption: toggle }}
    />
  );
};
