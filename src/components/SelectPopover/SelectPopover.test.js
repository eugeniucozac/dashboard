import React from 'react';
import * as utils from 'utils';
import { text } from '@storybook/addon-knobs';
// app
import SelectPopover from './SelectPopover';
import { SingleSelect } from 'components';
import { render } from 'tests';

describe('COMPONENTS › SelectPopover', () => {
  let openPopover = false;
  const setOpenPopover = () => {
    openPopover = !openPopover;
  };
  const onToggleOption = jest.fn();
  const options = [
    { id: 'astonmartin', name: 'Aston Martin' },
    { id: 'audi', name: 'Audi' },
    { id: 'bentley', name: 'Bentley' },
    { id: 'bmw', name: 'BMW (Bayerische Motoren Werke AG)' },
    { id: 'chevrolet', name: 'Chevrolet' },
    { id: 'citroen', name: 'Citroen' },
  ];
  const parentProps = {
    id: 'selectPopoverStorie',
    text: text('Display Text', 'Click me'),
    value: { id: 'astonmartin', name: 'Aston Martin' },
    displaySelectedText: { id: 'astonmartin', name: 'Aston Martin' },
    buttonText: utils.string.t('app.assign'),
    handlers: {
      onToggleOption,
    },
    openPopover,
    setOpenPopover,
  };

  const childrenProps = {
    value: { id: 'astonmartin', name: 'Aston Martin' },
    placeholder: 'Search',
    options: options,
    handlers: {
      onToggleOption,
    },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      render(
        <SelectPopover {...parentProps}>
          <SingleSelect search {...childrenProps}></SingleSelect>
        </SelectPopover>
      );
    });
  });
});
