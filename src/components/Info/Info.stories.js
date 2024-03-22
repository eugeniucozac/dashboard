import React from 'react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { Button, Info } from 'components';
import { Box } from '@material-ui/core';
import { Theaters } from '@material-ui/icons';

export default {
  title: 'Info',
  component: Info,
  decorators: [withKnobs],
};

export const Default = () => {
  const title = text('Title', 'The Matrix');
  const subtitle = text('Subheader', 'Action, Sci-fi (1999)');
  const size = select('Size', ['xs', 'sm', 'md', 'lg', 'xl'], 'sm');
  const description = text(
    'Description',
    'Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination.'
  );
  const ellipsis = boolean('Ellipsis', false);
  const link = boolean('Link', false);
  const content = boolean('Content', false);
  const avatarIcon = boolean('Avatar Icon', false);
  const avatarImage = boolean('Avatar Image', false);
  const avatarBorder = boolean('Avatar Border', true);
  const avatarText = text('Avatar Text', '');
  const avatarBg = select('Avatar Bg', ['', 'White', 'LightGrey', 'HotPink', 'YellowGreen', 'LightSkyBlue'], '');

  const btnContent = (
    <Box mt={1} display="flex" alignItems="center">
      <Box mr={1}>
        <Button text="Red Pill" size="xsmall" danger />
      </Box>
      <Box mr={1}>
        <Button text="Blue Pill" size="xsmall" color="primary" />
      </Box>
    </Box>
  );

  return (
    <Info
      title={title}
      subtitle={subtitle}
      description={description}
      content={content ? btnContent : undefined}
      size={size}
      avatarIcon={avatarIcon ? Theaters : undefined}
      avatarText={!avatarIcon && !avatarImage && avatarText ? avatarText : undefined}
      avatarImage={!avatarIcon && avatarImage ? 'https://i.pravatar.cc/150?img=7&u=a042581f4e29026704d' : undefined}
      avatarBg={avatarBg}
      avatarBorder={avatarBorder}
      ellipsis={ellipsis}
      link={link ? '?path=/story/info--default&link=clicked' : undefined}
    />
  );
};
