import React, { useState } from 'react';
import * as utils from 'utils';
import { SelectPopover, SingleSelect } from 'components';
import isEqual from 'lodash/isEqual';
import { withKnobs, text } from '@storybook/addon-knobs';

export default {
  title: 'SelectPopover',
  component: SelectPopover,
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
  const [selectedValue, setSelectedValue] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  let openPopover = false;
  const setOpenPopover = () => {
    openPopover = !openPopover;
  };
  const toggle = (data) => {
    if (isEqual(data, selectedValue)) {
      setSelectedValue({ ...initialValue });
    } else {
      setSelectedValue(data);
    }
  };
  const parentProps = {
    id: 'selectPopoverStorie',
    text: text('Display Text', 'Click me'),
    value: selectedValue,
    displaySelectedText: selectedItem,
    buttonText: utils.string.t('app.assign'),
    buttonDisabled: false,
    openPopover,
    setOpenPopover,
    showButtonTextOnly: true,
    buttonVariant: 'outlined',
    handlers: {
      onToggleOption: toggle,
    },
  };

  const childrenProps = {
    value: selectedItem,
    placeholder: 'Search',
    options: options,
    handlers: {
      onToggleOption: (item) => {
        setSelectedItem(item);
      },
    },
  };

  return (
    <SelectPopover {...parentProps}>
      <SingleSelect search {...childrenProps}></SingleSelect>
    </SelectPopover>
  );
};
