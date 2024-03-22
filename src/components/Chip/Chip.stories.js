import React from 'react';
import { Chip } from 'components';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { Check, Search, Cancel } from '@material-ui/icons';

export default {
  title: 'Chip',
  component: Chip,
  decorators: [withKnobs],
};

const icons = {
  '': null,
  done: <Check />,
  search: <Search />,
  cancel: <Cancel />,
};

export const Default = () => {
  const title = text('Text', 'Hello, world!');

  const type = select('Type', ['', 'new', 'info', 'success', 'alert', 'error', 'light', 'unknown', 'pink'], '');
  const iconName = select('Icon', Object.keys(icons), '');
  const color = select('Color', ['', 'primary', 'secondary'], '');

  const outlined = boolean('Outlined', false);
  const small = boolean('Small', false);
  const disabled = boolean('Disabled', false);
  const clickable = boolean('Clickable', false);

  return (
    <Chip
      type={type || undefined}
      label={title}
      variant={outlined ? 'outlined' : undefined}
      size={small ? 'small' : undefined}
      color={color || undefined}
      disabled={disabled}
      clickable={clickable}
      deleteIcon={iconName ? icons[iconName] : undefined}
      onDelete={iconName ? () => {} : undefined}
    />
  );
};
