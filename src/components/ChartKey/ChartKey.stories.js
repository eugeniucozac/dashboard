import React, { useState } from 'react';
import { ChartKey } from 'components';
import { withKnobs, text, select, boolean, number } from '@storybook/addon-knobs';
import { Grid } from '@material-ui/core';

export default {
  title: 'ChartKey',
  component: ChartKey,
  decorators: [withKnobs],
};

const mockItems = [
  { color: '#FF6633', checked: false, id: '1', label: 'Foo' },
  { color: '#FFB399', checked: false, id: '2', label: 'Bar' },
  { color: '#FF33FF', checked: false, id: '3', label: 'Baz' },
];

const gridStyles = {
  lineHeight: 1,
  position: 'relative',
};

export const Default = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item style={gridStyles}>
        <ChartKey
          title={text('Title', 'Key')}
          colorMode={select('Color Mode', ['light', 'dark'], 'light')}
          size={select('Size', ['xsmall', 'small'], 'small')}
          isCollapsed={boolean('Collapsed', true)}
          allowCollapse={boolean('Allow collapse', true)}
          items={mockItems}
          avatarSize={number('Avatar Size', 20)}
          hint={text('Hint', 'Hint text')}
        />
      </Grid>
    </Grid>
  );
};

export const Toggle = () => {
  const [items, setItems] = useState(mockItems);

  const filterByAccount = (id, checked) => {
    setItems(items.map((item) => ({ ...item, checked: id === item.id ? checked : item.checked })));
  };

  const filterAllByAccount = (checked) => {
    setItems(items.map((item) => ({ ...item, checked })));
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item style={gridStyles}>
        <ChartKey
          title={text('Title', 'Key')}
          colorMode={select('Color Mode', ['light', 'dark'], 'dark')}
          size={select('Size', ['xsmall', 'small'], 'small')}
          allowCollapse={boolean('Allow collapse', true)}
          items={items}
          onToggle={filterByAccount}
          onToggleAll={filterAllByAccount}
        />
      </Grid>
    </Grid>
  );
};
