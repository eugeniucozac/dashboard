import React from 'react';
import { Empty } from 'components';
import { withKnobs, boolean, number, text, select } from '@storybook/addon-knobs';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { ReactComponent as EarthPinFile } from '../../assets/svg/line-icon-earth-pin.svg';

export default {
  title: 'Empty',
  component: Empty,
  decorators: [withKnobs],
};

const icons = {
  search: IconSearchFile,
  earth: EarthPinFile,
};

export const Default = () => {
  const iconName = select('Icon', Object.keys(icons), 'search');
  const Icon = icons[iconName];

  return (
    <Empty
      title={text('Title', 'Lorem ipsum')}
      text={text('Text', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus incidunt provident veniam! Aspernatur.')}
      icon={<Icon />}
      padding={boolean('Padding', true)}
      bg={boolean('Background', true)}
      width={number('Max Width', 0)}
      link={{
        text: text('Link Text', ''),
        url: '/',
      }}
      button={{
        text: text('Button Text', ''),
        action: () => {
          console.log('Button clicked!!!');
        },
      }}
    />
  );
};
