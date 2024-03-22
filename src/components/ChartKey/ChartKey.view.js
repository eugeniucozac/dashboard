import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './ChartKey.styles';
import { Avatar, Button } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Collapse, Switch } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

ChartKeyView.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
      avatarText: PropTypes.string,
      checked: PropTypes.bool,
    })
  ).isRequired,
  hint: PropTypes.string,
  title: PropTypes.string,
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
  handleToggle: PropTypes.func,
  handleToggleAll: PropTypes.func,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
  colorMode: PropTypes.oneOf(['light', 'dark']).isRequired,
  size: PropTypes.oneOf(['xsmall', 'small']).isRequired,
  avatarSize: PropTypes.number,
  allowCollapse: PropTypes.bool.isRequired,
  handleAvatarClick: PropTypes.func,
  testid: PropTypes.string,
  noBorder: PropTypes.bool,
};

export function ChartKeyView({
  items,
  hint,
  title,
  collapsed,
  setCollapsed,
  handleToggle,
  handleToggleAll,
  colorMode,
  size,
  avatarSize,
  nestedClasses,
  allowCollapse,
  onAvatarClick,
  testid,
  noBorder,
}) {
  const classes = makeStyles(styles, { name: 'ChartKey' })({
    noBorder,
    colorMode,
    collapsed,
    size,
    avatarSize,
    hasSwitch: utils.generic.isFunction(handleToggle),
    hasAvatar: items.filter((item) => item.color || item.avatarText).length,
  });

  return (
    <div className={classnames(classes.root, nestedClasses.root)} data-testid={`chartkey${testid ? `-${testid}` : ''}`}>
      {title &&
        (allowCollapse ? (
          <Button
            text={title}
            size={size}
            iconPosition="right"
            nestedClasses={{ btn: classes.button, icon: classes.buttonIcon, label: classes.buttonTitle }}
            variant="text"
            icon={KeyboardArrowDownIcon}
            onClick={() => setCollapsed(!collapsed)}
          />
        ) : (
          <div className={classes.title}>{title}</div>
        ))}

      <Collapse in={!collapsed}>
        <ul className={classes.list}>
          {utils.generic.isFunction(handleToggleAll) && items.length > 1 && (
            <li className={classes.selectAllLi}>
              <span className={classes.selectAll}>{utils.string.t('app.selectAll')}</span>
              <Switch
                color={colorMode === 'light' ? 'primary' : 'secondary'}
                size="small"
                checked={items.length === items.filter((item) => item.checked).length}
                className={classes.switch}
                onClick={(e) => handleToggleAll(e.target.checked)}
              />
            </li>
          )}
          {items.map((listItem, index) => (
            <li key={index}>
              {(listItem.color || listItem.avatarText) && (
                <Avatar
                  onAvatarClick={utils.generic.isFunction(onAvatarClick) ? (e) => onAvatarClick(e, listItem) : undefined}
                  avatarClasses={classes.avatar}
                  text={listItem.avatarText || ' '}
                  size={avatarSize}
                  bg={listItem.color}
                />
              )}
              <span className={classes.itemName}>{listItem.label}</span>
              {utils.generic.isFunction(handleToggle) && (
                <Switch
                  color={colorMode === 'light' ? 'primary' : 'secondary'}
                  size="small"
                  checked={listItem.checked}
                  className={classes.switch}
                  onClick={(e) => handleToggle(listItem.id, e.target.checked, listItem)}
                />
              )}
            </li>
          ))}
        </ul>
      </Collapse>

      {hint && !collapsed && <p className={classes.hint}>{hint}</p>}
    </div>
  );
}
