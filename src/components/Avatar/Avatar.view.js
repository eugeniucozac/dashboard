import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './Avatar.styles';
import * as utils from 'utils';

// mui
import { makeStyles, Avatar } from '@material-ui/core';

AvatarView.propTypes = {
  text: PropTypes.node,
  size: PropTypes.number,
  icon: PropTypes.object,
  src: PropTypes.string,
  bg: PropTypes.string,
  border: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  avatarClasses: PropTypes.string,
  onAvatarClick: PropTypes.func,
};

export function AvatarView({ text, size, icon, src, bg, border, avatarClasses, onAvatarClick, ...rest }) {
  const classes = makeStyles(styles, { name: 'Avatar' })({
    hasAction: utils.generic.isFunction(onAvatarClick),
    text,
    size,
    icon,
    src,
    bg,
    border,
    ...rest,
  });

  const IconComponent = icon
    ? React.createElement(icon, {
        fontSize: 'inherit',
        style: {
          width: '60%',
          height: '60%',
        },
      })
    : null;

  return (
    <Avatar
      onClick={utils.generic.isFunction(onAvatarClick) ? (e) => onAvatarClick(e) : undefined}
      src={src}
      {...rest}
      className={classnames(classes.root, avatarClasses)}
      data-testid="avatar"
    >
      {!icon && text}
      {icon && IconComponent}
    </Avatar>
  );
}
