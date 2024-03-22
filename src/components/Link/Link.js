import React from 'react';
import PropTypes from 'prop-types';

// app
import { LinkView } from './Link.view';
import * as utils from 'utils';

Link.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.object,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  color: PropTypes.oneOf(['primary', 'secondary', 'neutral']),
  disabled: PropTypes.bool,
  tooltip: PropTypes.object,
  handleClick: PropTypes.func,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    link: PropTypes.string,
    icon: PropTypes.string,
  }),
};

Link.defaultProps = {
  color: 'neutral',
  nestedClasses: {},
  iconPosition: 'left',
};

export default function Link({ text, disabled, tooltip, handleClick, ...rest }) {
  const onClick = (e) => {
    if (!disabled && utils.generic.isFunction(handleClick)) {
      handleClick(e);
    }
  };

  // abort
  if (!text) return null;

  return <LinkView text={text} disabled={disabled} tooltip={tooltip} onClick={onClick} {...rest} />;
}
