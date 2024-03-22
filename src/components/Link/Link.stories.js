import React from 'react';
import { Link } from 'components';
import { withKnobs, boolean, text, select } from '@storybook/addon-knobs';
import { Add, Edit, OpenInNew } from '@material-ui/icons';

export default {
  title: 'Link',
  component: Link,
  decorators: [withKnobs],
};

const icons = {
  '': undefined,
  add: Add,
  edit: Edit,
  external: OpenInNew,
};

export const Default = () => {
  return (
    <Link
      text={text('Text', 'Click me')}
      disabled={boolean('Disabled', false)}
      color={select('Colour', ['primary', 'secondary', 'neutral'], 'primary')}
      icon={icons[select('Icon', Object.keys(icons), '')]}
      iconPosition={select('Icon Position', ['left', 'right'], 'left')}
      handleClick={() => alert('You clicked the link')}
    />
  );
};
