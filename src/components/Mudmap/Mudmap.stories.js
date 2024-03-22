import React from 'react';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import { Mudmap } from 'components';

export default {
  title: 'Mudmap',
  component: Mudmap,
  decorators: [withKnobs],
};

export const Default = () => {
  const quotes = [
    { id: 1, order: 1, market: 'AXA', amount: 100, xs: 0, written: 0.1, signed: 0.2, premium: 1000 },
    { id: 2, order: 2, market: 'Brit', amount: 20, xs: 0, written: 0.2, signed: 0.3, premium: 1000, leads: [] },
    {
      id: 3,
      order: 3,
      market: 'Fisk',
      amount: 20,
      xs: 20,
      written: 0.3,
      signed: 0.4,
      premium: 1000,
      capacityId: 1,
      leads: [{ id: '3a', name: '3a Fisk Market' }],
    },
    {
      id: 4,
      order: 4,
      market: 'AIG',
      amount: 40,
      xs: 0,
      written: 0.4,
      signed: 0.5,
      premium: 1000,
      capacityId: 1,
      leads: [{ id: '4a', name: '4a AIG Market', notes: 'foo' }],
    },
    {
      id: 5,
      order: 5,
      market: 'Swiss',
      amount: 60,
      xs: 40,
      written: 0.5,
      signed: 0.6,
      premium: 1000,
      capacityId: 2,
      leads: [
        { id: '5a', name: '5a Swiss Market A', notes: 'foo' },
        { id: '5b', name: '5b Swiss Market B', notes: 'bar' },
      ],
    },
    { id: 6, order: 6, market: 'Hiscox', amount: 30, xs: 40, written: 0.6, signed: 0.7, premium: 1000, capacityId: 4 },
    { id: 7, order: 7, market: 'Munich', amount: 30, xs: 70, written: 0.7, signed: 0.8, premium: 1000, capacityId: 4 },
    { id: 8, order: 8, market: 'Talbot', amount: 30, xs: 70, written: 0.8, signed: 0.9, premium: 1000, capacityId: 3 },
  ];
  return <Mudmap title={text('Title', 'The Matrix')} items={object('Quotes', quotes)} />;
};
