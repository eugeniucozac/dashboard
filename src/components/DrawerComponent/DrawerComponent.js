import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './DrawerComponent.styles';
import { setDmsWidgetExpand } from 'stores';

// mui
import { makeStyles, Drawer, Divider, IconButton } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DescriptionIcon from '@material-ui/icons/Description';

DrawerComponent.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  isFromDashboard: PropTypes.bool,
};

export default function DrawerComponent({ isDrawerOpen, children, isFromDashboard }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const classes = makeStyles(styles, { name: 'DrawerComponent' })({ isFromDashboard, isExpanded });

  const dispatch = useDispatch();

  const handleArrowClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    dispatch(setDmsWidgetExpand(isExpanded));
  }, [isExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Drawer variant="persistent" anchor="right" open={isDrawerOpen} classes={{ paper: classes.drawer }}>
      <IconButton
        color="inherit"
        aria-label="open"
        edge="start"
        disableRipple
        disableFocusRipple
        onClick={handleArrowClick}
        className={classnames({
          [classes.button]: true,
          [classes.buttonExpanded]: isExpanded,
        })}
      >
        {isExpanded ? (
          <ChevronRightIcon
            className={classnames({
              [classes.iconArrow]: true,
              [classes.iconArrowExpanded]: isExpanded,
            })}
          />
        ) : (
          <ChevronLeftIcon className={classes.iconArrow} />
        )}
        {isExpanded ? null : <DescriptionIcon className={classes.iconDocument} />}
      </IconButton>
      <Divider />
      {children}
    </Drawer>
  );
}
