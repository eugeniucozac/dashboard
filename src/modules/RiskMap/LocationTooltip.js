import * as React from 'react';

import { Button, Tooltip } from 'components';
import { LocationTooltipCard } from './LocationTooltipCard';

import { ClickAwayListener } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles(() => ({
  tooltip: {
    padding: '0!important',
    borderRadius: 5,
    overflow: 'hidden',
  },
}));

export const LocationTooltip = ({ location, locationDefinitions, excludeColumns, handleOpen, disabled }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClick = (event) => {
    event.stopPropagation();

    setOpen((prevState) => {
      handleOpen(!prevState);
      return !prevState;
    });
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setOpen(false);
    handleOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Tooltip
        title={
          <LocationTooltipCard
            tooltip={location}
            locationDefinitions={locationDefinitions}
            excludeColumns={excludeColumns}
            handleClose={handleClose}
          />
        }
        placement="top"
        arrow
        rich
        open={open}
        interactive
        onClose={handleClose}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        nestedClasses={{ tooltip: classes.tooltip }}
      >
        <Button disabled={disabled} icon={InfoOutlinedIcon} onClick={handleClick} variant="text" />
      </Tooltip>
    </ClickAwayListener>
  );
};
