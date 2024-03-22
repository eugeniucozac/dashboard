import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './PopoverMenu.styles';
import { Button, Tooltip, Translate } from 'components';

// mui
import { makeStyles, Menu, MenuItem, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

PopoverMenuView.propTypes = {
  active: PropTypes.bool,
  refs: PropTypes.shape({
    btn: PropTypes.object.isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    open: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    click: PropTypes.func.isRequired,
  }).isRequired,
};

export function PopoverMenuView({
  id,
  text,
  size,
  variant,
  color,
  icon,
  iconPosition,
  isButton,
  active,
  disabled,
  offset,
  placeholder,
  items,
  anchorOrigin,
  transformOrigin,
  nestedClasses,
  refs,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'PopoverMenu' })({ size });

  const iconText = (item) => {
    const Icon = item.icon;
    return (
      <>
        <ListItemIcon classes={{ root: classes.listItemIcon }}>
          <Icon color="primary" />
        </ListItemIcon>
        <ListItemText disableTypography primary={item.label} />
      </>
    );
  };

  const linkItem = (item) => {
    const Icon = item.icon;
    return (
      <ListItem button component={RouterLink} to={item.linkTo}>
        {Icon && (
          <ListItemIcon classes={{ root: classes.listItemIcon }}>
            <Icon fontSize="small" color="primary" />
          </ListItemIcon>
        )}
        <ListItemText disableTypography primary={item.label} />
      </ListItem>
    );
  };

  const isPopoverDisabled = !items || items.length <= 0;

  const classesContainer = {
    [classes.root]: true,
    [classes.btnOffset]: text && offset,
    [nestedClasses.root]: Boolean(nestedClasses.root),
  };

  const classesButton = {
    btn: classnames({
      [classes.btn]: Boolean(text),
      [nestedClasses.btn]: Boolean(nestedClasses.btn),
    }),
    icon: classnames({
      [nestedClasses.icon]: Boolean(nestedClasses.icon),
    }),
    label: classnames({
      [classes.label]: !isButton && Boolean(text),
      [nestedClasses.label]: Boolean(nestedClasses.label),
    }),
  };

  return (
    <span className={classnames(classesContainer)}>
      <Button
        refProp={refs.btn}
        icon={icon}
        iconPosition={iconPosition}
        text={text || placeholder}
        size={size}
        variant={variant}
        color={color}
        light
        title={text}
        aria-owns={active ? `${id}-popover` : null}
        aria-haspopup="true"
        disabled={disabled || isPopoverDisabled}
        onClick={handlers.open}
        nestedClasses={classesButton}
        data-testid={`${id}-popover-ellipsis`}
      />

      {!isPopoverDisabled && (
        <Menu
          id={`${id}-popover`}
          anchorEl={get(refs, 'btn.current')}
          getContentAnchorEl={null}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          open={Boolean(active && get(refs, 'btn.current'))}
          onClose={handlers.close}
        >
          {items?.map((item) => {
            if (item.hidden) return null;

            if (item.linkTo) {
              return (
                <MenuItem disableGutters onClick={handlers.click(item.callback)} disabled={item.disabled} key={item.id}>
                  {linkItem(item)}
                </MenuItem>
              );
            }

            if (item.tooltip) {
              return (
                <Tooltip flex title={item.tooltip} placement="top" nestedClasses={{ tooltip: classes.tooltip }} key={item.id}>
                  <MenuItem onClick={handlers.click(item.callback)} disabled={item.disabled}>
                    {item.icon ? iconText(item) : <Translate label={item.label} variant="inherit" />}
                  </MenuItem>
                </Tooltip>
              );
            }

            return (
              <MenuItem onClick={handlers.click(item.callback)} disabled={item.disabled} key={item.id}>
                {item.icon ? iconText(item) : <Translate label={item.label} variant="inherit" />}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </span>
  );
}
