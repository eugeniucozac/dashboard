import React, { useState } from 'react';
import { MultiSelectAsync } from 'components';
import { withKnobs, text, number } from '@storybook/addon-knobs';

export default {
  title: 'MultiSelectAsync',
  component: MultiSelectAsync,
  decorators: [withKnobs],
};

export const Default = () => {
  const [values, setValues] = useState([]);

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

  const dummyFetch = (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(options.filter((o) => o.id.includes(query) || o.name.includes(query)));
      }, 750);
    });
  };

  const toggle = (field, value) => {
    if (value) {
      const isValueAlreadySelected = values.some((i) => i.id === value.id);

      setValues(isValueAlreadySelected ? values.filter((i) => i.id !== value.id) : [...values, value]);
    }
  };

  const placeholder = text('Placeholder', 'Type here...');
  const searchMinChars = number('Search min chars', 2, { range: true, min: 1, max: 8, step: 1 });
  const max = number('Maximum Selected', 3, { range: true, min: 1, max: 12, step: 1 });
  const minChars = text('Label minChars', 'Type at least {{min}} characters');
  const hint = text('Label hint', 'Search from the available options in the search bar above.');
  const noResults = text('Label noResults', 'Try Again');

  const getMinCharsLabel = (max) => {
    return minChars.replace('{{min}}', searchMinChars);
  };

  const labels = {
    minChars: getMinCharsLabel(max),
    hint,
    noResults,
  };

  return (
    <MultiSelectAsync
      id="stories"
      values={values}
      placeholder={placeholder}
      searchMinChars={searchMinChars}
      max={max}
      labels={labels}
      handlers={{
        fetch: dummyFetch,
        toggleOption: toggle,
      }}
    />
  );
};
