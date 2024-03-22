import React, { useState } from 'react';
import { withKnobs, text, number, boolean } from '@storybook/addon-knobs';
import { CardList } from 'components';
import xor from 'lodash/xor';
import { CardHeader, CardContent, CardMedia, Typography } from '@material-ui/core';

export default {
  title: 'CardList',
  component: CardList,
  decorators: [withKnobs],
};

const short = [
  'Lorem ipsum dolor sit amet',
  'Consectetu reit',
  'Nullam luctus turpis',
  'Aae turpis',
  'Ali uam et',
  'Proin tiunt',
  'Fex quis luctus malesuada',
  'Est in sapien',
  'Proin tri sti que elit',
  'Sed rum diam ex',
  'Ginl it ma',
  'Donec or nare eu lectus',
];

const long = [
  'Lorps um dolem ipsor em ips t amet',
  'Consecpst',
  'Nullam luctisci ngng el it turpis',
  'Aae turpiiss',
  'Ali uam am es um dc et',
  'Proin tiups umius dolnt',
  'Fex quis lu el it riusesuada',
  'Est in sien',
  'Proin tricons ecdoli que elit',
  'Sed rum diam ex',
  'Ginl iit rius',
  'Don am et cosisci ng el it rius',
];

export const Default = () => {
  const [active, setActive] = useState([]);

  const onClick = (id) => (event) => {
    setActive(xor(active, [id]));
  };

  const title = text('Title', 'Lorem ipsum');
  const cards = number('Cards', 3, { range: true, min: 0, max: 12, step: 1 });
  const scrollable = boolean('Scrollable', false);
  const subheader = boolean('Subheader', false);
  const content = boolean('Content', false);
  const media = boolean('Media', false);

  const getCards = (num) => {
    return [...Array(num)].map((_, i) => {
      const isDisabled = i > num - 3;

      return {
        id: i,
        onClick: onClick(i),
        active: active.includes(i),
        disabled: isDisabled,
        children: (
          <>
            {(title || subheader) && <CardHeader title={`Card ${i + 1}`} subheader={subheader ? short[i] : undefined} />}
            {media && (
              <CardMedia
                image="http://placekitten.com/600/600"
                style={{
                  height: 100,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  opacity: isDisabled ? 0.4 : 1,
                }}
              />
            )}
            {content && (
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  {long[i]}
                </Typography>
              </CardContent>
            )}
          </>
        ),
      };
    });
  };

  return <CardList title={title} scrollable={scrollable} data={getCards(cards)} />;
};
