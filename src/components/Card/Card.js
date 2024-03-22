import React from 'react';
import PropTypes from 'prop-types';

// app
import { CardView } from './Card.view';
import * as utils from 'utils';

Card.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  text: PropTypes.string,
  compact: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  fullwidth: PropTypes.bool,
  onClick: PropTypes.func,
  nestedClasses: PropTypes.object,
  cardRef: PropTypes.func,
};

Card.defaultProps = {
  spacing: 0,
  nestedClasses: {},
};

export default function Card({
  title,
  subheader,
  text,
  compact,
  active,
  disabled,
  fullwidth,
  onClick,
  children,
  nestedClasses,
  cardRef,
  ...rest
}) {
  const isClickable = !disabled && utils.generic.isFunction(onClick);

  const handleClick = (event) => {
    if (isClickable) {
      onClick(event);
    }
  };

  // abort
  if (!title && !subheader && !text && !children) return null;

  return (
    <CardView
      cardRef={cardRef}
      nestedClasses={nestedClasses}
      title={title}
      subheader={subheader}
      text={text}
      compact={compact}
      active={active}
      disabled={disabled}
      fullwidth={fullwidth}
      clickable={isClickable}
      muiCardProps={rest}
      handleClick={handleClick}
      children={children}
    />
  );
}
