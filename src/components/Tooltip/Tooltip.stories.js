import React, { useState } from 'react';
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs';
import { Tooltip } from 'components';
import { Box, ClickAwayListener, Typography } from '@material-ui/core';

export default {
  title: 'Tooltip',
  component: Tooltip,
  decorators: [withKnobs],
};

const htmlContent = (
  <div style={{ textAlign: 'left' }}>
    <Typography variant="h4" color="inherit">
      Tooltip with HTML
    </Typography>
    <div style={{ display: 'flex' }}>
      <img src="https://placekitten.com/64/64" alt="kitten placeholder" style={{ flex: 'none', marginRight: 8, width: 64, height: 64 }} />
      <Typography variant="body2" color="inherit">
        Cat ipsum dolor sit amet, mark territory for pose purrfectly to show my beauty...
      </Typography>
    </div>
    <p>
      <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>
      <br />
      {"It's very engaging. Right?"}
    </p>
    <p>
      {'If yes, '}
      <a
        href="/?path=/story/tooltip--on-click"
        onClick={() => {
          alert('You clicked inside a rich HTML tooltip');
        }}
      >
        click here
      </a>
      {'.'}
    </p>
  </div>
);

export const Default = () => {
  return (
    <Box m={4}>
      <Tooltip
        title={text('Text', 'Lorem ipsum sit dolor amet')}
        placement={select('Placement', ['top', 'right', 'bottom', 'left'], 'top')}
        arrow={boolean('Arrow', true)}
      >
        hover me
      </Tooltip>
    </Box>
  );
};

export const RichHTML = () => {
  return (
    <Box m={4}>
      <Tooltip
        title={htmlContent}
        placement={select('Placement', ['top', 'right', 'bottom', 'left'], 'top')}
        arrow={boolean('Arrow', true)}
        rich
        interactive
      >
        hover me
      </Tooltip>
    </Box>
  );
};

export const OnClick = () => {
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box m={4}>
        <Tooltip
          title={htmlContent}
          placement={select('Placement', ['top', 'right', 'bottom', 'left'], 'top')}
          arrow={boolean('Arrow', true)}
          rich
          open={open}
          interactive
          onClose={() => setOpen(false)}
          PopperProps={{ disablePortal: true }}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <div onClick={() => setOpen(true)}>click me</div>
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
};
