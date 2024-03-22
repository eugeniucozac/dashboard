import React from 'react';
import { Accordion } from 'components';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';
import { Box, Typography } from '@material-ui/core';
import { Delete, Edit, Refresh } from '@material-ui/icons';

export default {
  title: 'Accordion',
  component: Accordion,
  decorators: [withKnobs],
};

export const Default = () => {
  const icon = boolean('Icon', true);
  const density = select('Density', ['compact', 'default', 'comfortable'], 'default');
  const boxed = boolean('Boxed', false);
  const actions = boolean('Actions', false);
  const color = select('Actions Color', ['primary', 'secondary', 'neutral'], 'secondary');

  const onClick = (e, text) => {
    e.stopPropagation();
    console.log(`[onClick] ${text}`);
  };

  const accordions = [
    {
      id: 1,
      title: 'Episode I – The Phantom Menace',
      text: "The Trade Federation upsets order in the Galactic Republic by blockading the planet Naboo in preparation for a full-scale invasion. The Republic's leader, Supreme Chancellor Finis Valorum, dispatches Jedi Knight Qui-Gon Jinn and his apprentice, Obi-Wan Kenobi, to negotiate with Trade Federation Viceroy Nute Gunray.",
      actions: [
        {
          id: 'expand',
          text: 'Expand',
          color,
          onClick: (e, id) => onClick(e, id),
        },
      ],
    },
    {
      id: 2,
      title: 'Episode II – Attack of the Clones',
      text: 'Ten years after the battle at Naboo, the Galactic Republic is threatened by a Separatist movement organized by former Jedi Master Count Dooku.',
      actions: [
        {
          id: 'up',
          text: 'Up',
          color,
          onClick: (e, id) => onClick(e, id),
        },
        {
          id: 'down',
          text: 'Down',
          color,
          onClick: (e, id) => onClick(e, id),
        },
      ],
    },
    {
      id: 3,
      title: 'Episode III – Revenge of the Sith',
      text: 'Above Coruscant, Obi-Wan Kenobi and Anakin Skywalker lead a mission to rescue the kidnapped Supreme Chancellor Palpatine from the cyborg Separatist commander General Grievous.',
      actions: [
        {
          id: 'up',
          text: 'Up',
          color,
          onClick: (e, id) => onClick(e, id),
        },
        {
          id: 'down',
          text: 'Down',
          color,
          onClick: (e, id) => onClick(e, id),
        },
        {
          id: 'delete',
          icon: Delete,
          color,
          onClick: (e, id) => onClick(e, id),
        },
      ],
    },
    {
      id: 4,
      title: 'Episode IV - A New Hope',
      text: "Amid a galactic civil war, Rebel Alliance spies have stolen plans to the Galactic Empire's Death Star, a massive space station capable of destroying an entire planet.",
      actions: [
        {
          id: 'edit',
          icon: Edit,
          color,
          onClick: (e, id) => onClick(e, id),
        },
      ],
    },
    {
      id: 5,
      title: 'Episode V – The Empire Strikes Back',
      text: 'Three years after the destruction of the Death Star, the Rebel Alliance, led by Princess Leia, have established a new base on the ice planet Hoth. The Imperial fleet, led by a merciless Darth Vader, hunts for the new Rebel base by dispatching probe droids across the galaxy.',
      actions: [
        {
          id: 'edit',
          icon: Edit,
          color,
          onClick: (e, id) => onClick(e, id),
        },
        {
          id: 'refresh',
          icon: Refresh,
          color,
          onClick: (e, id) => onClick(e, id),
        },
      ],
    },
    {
      id: 6,
      title: 'Episode VI – Return of the Jedi',
      text: "A year after Han Solo's capture, C-3PO and R2-D2 are sent to crime lord Jabba the Hutt's palace on Tatooine in a trade bargain made by Luke Skywalker to rescue Han.",
      actions: [
        {
          id: 'up',
          text: 'Up',
          color,
          onClick: (e, id) => onClick(e, id),
        },
        {
          id: 'down',
          text: 'Down',
          color,
          onClick: (e, id) => onClick(e, id),
        },
        {
          id: 'edit',
          icon: Edit,
          color,
          onClick: (e, id) => onClick(e, id),
        },
        {
          id: 'refresh',
          icon: Refresh,
          color,
          onClick: (e, id) => onClick(e, id),
        },
        {
          id: 'delete',
          icon: Delete,
          color,
          onClick: (e, id) => onClick(e, id),
        },
      ],
    },
  ];

  return (
    <Box maxWidth="100%">
      {accordions.map((accordion) => {
        return (
          <Accordion
            key={accordion.id}
            density={density}
            boxed={boxed}
            icon={icon}
            title={accordion.title}
            actions={actions ? accordion.actions : undefined}
          >
            <Typography variant="body2">{accordion.text}</Typography>
          </Accordion>
        );
      })}
    </Box>
  );
};
