import React from 'react';
import { Badge } from 'components';
import { withKnobs, boolean, number, select } from '@storybook/addon-knobs';

export default {
  title: 'Badge',
  component: Badge,
  decorators: [withKnobs],
};

export const Default = () => {
  const type = select('Type', ['info', 'success', 'alert', 'unknown', 'error'], 'info');
  const count = number('Count', 1, { range: true, min: 0, max: 100, step: 1 });
  const compact = boolean('Compact', false);
  const standalone = boolean('Standalone', true);
  const showZero = boolean('Show Zero', true);
  const dot = boolean('Dot', false);

  return (
    <Badge type={type} compact={compact} standalone={standalone} showZero={showZero} badgeContent={count} variant={dot ? 'dot' : undefined}>
      {!standalone && (
        <div
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#fafafa',
            borderRadius: 3,
            border: '1px solid #eee',
          }}
        />
      )}
    </Badge>
  );
};
