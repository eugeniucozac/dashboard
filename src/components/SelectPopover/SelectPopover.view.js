import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// app
import styles from './SelectPopover.styles';
import { Button } from 'components';

// mui
import { Box, makeStyles, Popover } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

SelectPopoverView.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string,
  buttonText: PropTypes.string,
  buttonVariant: PropTypes.string,
  buttonDisabled: PropTypes.bool,
  showButtonTextOnly: PropTypes.bool,
  toolTip: PropTypes.string,
  displaySelectedText: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  handlers: PropTypes.shape({
    onToggleOption: PropTypes.func.isRequired,
    onTogglePopOver: PropTypes.func,
  }),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
};

export function SelectPopoverView({
  id,
  handlers,
  text,
  buttonText,
  showButtonTextOnly,
  displaySelectedText,
  buttonVariant,
  children,
  buttonDisabled,
  showSubmitButton,
  toolTip,
  error,
}) {
  const classes = makeStyles(styles, { name: 'SelectPopover' })();
  const [openPopover, setOpenPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverButtonRef = useRef(null);
  const [displayLabel, setDisplayLabel] = useState(null);

  const toggleOpenPopover = useCallback(
    (event) => {
      setOpenPopover(!openPopover);
      setAnchorEl(event?.currentTarget);
      handlers.onTogglePopOver(!openPopover);
    },
    [openPopover, setOpenPopover, setAnchorEl, handlers]
  );

  useEffect(() => {
    setDisplayLabel(text);
  }, [text]);

  const onButtonClick = useCallback(
    (event) => {
      handlers.onToggleOption(displaySelectedText);
      if (!showButtonTextOnly) {
        setDisplayLabel(displaySelectedText?.name);
      } else {
        setDisplayLabel(text);
      }
      setOpenPopover(!openPopover);
      setAnchorEl(event?.currentTarget);
    },
    [handlers, displaySelectedText, showButtonTextOnly, setDisplayLabel, text, openPopover, setOpenPopover, setAnchorEl]
  );

  return (
    <Box className={classes.root}>
      <Button
        refProp={popoverButtonRef}
        icon={ArrowDropDownIcon}
        iconPosition="right"
        text={displayLabel || text}
        disabled={buttonDisabled}
        size="xsmall"
        variant={buttonVariant}
        light
        color="primary"
        aria-owns={openPopover ? `${id}-popover` : null}
        aria-haspopup="true"
        onClick={toggleOpenPopover}
        title={toolTip || displayLabel}
        nestedClasses={{ btn: classes.selectButton }}
        classes={{ btnDangerText: !!error ? classes.error : null }}
        danger={!!error}
      />
      <Popover
        id={`select-popover-modal-${id}`}
        open={Boolean(openPopover)}
        anchorEl={anchorEl}
        onClose={toggleOpenPopover}
        classes={{ paper: classes.popoverFrame }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        {children}
        {showSubmitButton && (
          <Box justifyContent="flex-end" direction="row" alignItems="center" display="flex">
            <Button
              text={buttonText}
              disabled={!displaySelectedText}
              onClick={(e) => onButtonClick(e)}
              type="submit"
              color="primary"
              size="xsmall"
              data-testid={`popover-submit-button-${id}`}
            />
          </Box>
        )}
      </Popover>
    </Box>
  );
}
