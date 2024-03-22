import React from 'react';
import { withKnobs, text, object, number } from '@storybook/addon-knobs';
import { MudmapLayer } from 'components';

export default {
  title: 'MudmapLayer',
  component: MudmapLayer,
  decorators: [withKnobs],
};

export const Default = () => {
  const layer = {
    amount: 400000000,
    capacityId: NaN,
    currency: '---',
    id: '22745-129272',
    lead: [
      {
        id: 166,
        name: 'PICC Property and Casualty Company Limited Suzhou Branch',
        notes: '',
      },
    ],
    left: 0,
    market: '400M xs 100M',
    order: null,
    premium: 1000000,
    signed: 0,
    written: 0.1,
    xs: 100000000,
  };
  return (
    <MudmapLayer
      key={layer?.id}
      layer={object('Layer', layer)}
      maxAmount={number('MaxAmount', 500000000)}
      maxPercentage={text('MaxPercentage', 1)}
      type={text('Type', 'written')}
      isDragging={null}
      zIndex={number('ZIndex', 2)}
      currency={layer.currency}
      color={text('Color', 'rgb(211, 211, 211)')}
      startDragging={() => console.log('')}
      setDragging={() => console.log('')}
      stopDragging={() => console.log('')}
    />
  );
};
