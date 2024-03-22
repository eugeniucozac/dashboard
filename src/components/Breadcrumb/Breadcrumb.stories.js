import React from 'react';
import { Breadcrumb } from 'components';
import { withKnobs, number, select } from '@storybook/addon-knobs';
import capitalize from 'lodash/capitalize';

export default {
  title: 'Breadcrumb',
  component: Breadcrumb,
  decorators: [withKnobs],
};

export const Default = () => {
  const links = ['home', 'departments', 'products', 'electronics', 'office', 'computers', 'monitors', '4k'];
  const count = number('Count', 3, { range: true, min: 0, max: 8, step: 1 });
  const active = select('Active', links, 'home');

  const isActive = (name) => {
    return active === name;
  };

  return (
    <Breadcrumb
      links={links
        .filter((l, index) => index < count)
        .map((l) => ({
          name: l,
          label: capitalize(l),
          link: '/iframe.html',
          active: isActive(l),
        }))}
    />
  );
};
