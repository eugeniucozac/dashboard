import React from 'react';
import { Button } from 'components';
import { withKnobs, boolean, text, select } from '@storybook/addon-knobs';
import { Add, Edit, Refresh, Hotel } from '@material-ui/icons';
import { Box, Grid } from '@material-ui/core';

export default {
  title: 'Button',
  component: Button,
  decorators: [withKnobs],
};

const icons = {
  '': undefined,
  add: Add,
  edit: Edit,
  refresh: Refresh,
  hotel: Hotel,
};

const gridStyles = {
  lineHeight: 1,
};

export const Text = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {['xsmall', 'small', 'medium', 'large'].map((size) => (
        <Grid item style={gridStyles} key={size}>
          <Button
            text={text('Text', 'Click me')}
            size={size}
            color={select('Colour', ['primary', 'secondary', 'default'], 'primary')}
            variant={select('Variant', ['contained', 'outlined', 'text'], 'contained')}
            icon={icons[select('Icon', Object.keys(icons), '')]}
            iconPosition={select('Icon Position', ['left', 'right'], 'left')}
            iconWide={boolean('Icon Wide', false)}
            danger={boolean('Danger', false)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export const Icon = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {['xsmall', 'small', 'medium', 'large'].map((size) => (
        <Grid item style={gridStyles} key={size}>
          <Button
            size={size}
            color={select('Colour', ['primary', 'secondary', 'default'], 'primary')}
            variant={select('Variant', ['contained', 'outlined', 'text'], 'contained')}
            icon={
              icons[
                select(
                  'Icon',
                  Object.keys(icons).filter((key) => key),
                  'add'
                )
              ]
            }
          />
        </Grid>
      ))}
    </Grid>
  );
};

export const Tooltip = () => {
  return (
    <Box m={4}>
      <Button
        text="Hover me"
        size="medium"
        color="primary"
        variant="contained"
        tooltip={{
          title: text('Text', 'Tooltip text...'),
          placement: select('Position', ['top', 'right', 'bottom', 'left'], 'top'),
        }}
      />
    </Box>
  );
};
