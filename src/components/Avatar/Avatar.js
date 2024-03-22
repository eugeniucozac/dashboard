import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import { AvatarView } from './Avatar.view';

Avatar.propTypes = {
  text: PropTypes.node,
  size: PropTypes.number,
  icon: PropTypes.object,
  src: PropTypes.string,
  bg: PropTypes.string,
  border: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  avatarClasses: PropTypes.string,
  onAvatarClick: PropTypes.func,
};

Avatar.defaultProps = {
  size: 24,
};

export default function Avatar({ size, text, icon, src, bg, border, avatarClasses, onAvatarClick, ...rest }) {
  if (!text && !icon && !src) return null;

  return (
    <AvatarView
      {...rest}
      text={text}
      size={size}
      icon={icon}
      src={src}
      bg={bg}
      border={border}
      onAvatarClick={onAvatarClick}
      avatarClasses={classnames(avatarClasses)}
    />
  );
}
