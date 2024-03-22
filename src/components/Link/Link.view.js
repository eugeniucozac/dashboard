import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';

// app
import { Tooltip } from 'components';
import styles from './Link.styles';

// mui
import { makeStyles, Link as MuiLink } from '@material-ui/core';

LinkView.propTypes = {
  text: PropTypes.string.isRequired,
  to: PropTypes.string,
  icon: PropTypes.object,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  color: PropTypes.oneOf(['primary', 'secondary', 'neutral']),
  disabled: PropTypes.bool,
  tooltip: PropTypes.object,
  onClick: PropTypes.func,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    link: PropTypes.string,
    icon: PropTypes.string,
  }),
};

export function LinkView({ text, to, icon, iconPosition, color, disabled, tooltip, onClick, nestedClasses, ...rest }) {
  const classes = makeStyles(styles, { name: 'Link' })({ color, disabled, icon, iconPosition, isHref: !!rest.href });
  const IconComponent = icon;

  const classesLink = {
    [classes.root]: true,
    [nestedClasses.link]: Boolean(nestedClasses.link),
  };

  const LinkComponent = React.forwardRef((props, ref) => <RouterLink ref={ref} to={to} {...props} />);

  return (
    <MuiLink variant="body2" component={to ? LinkComponent : undefined} onClick={onClick} className={classnames(classesLink)} {...rest}>
      {iconPosition === 'right' && (
        <span className={classes.text}>
          {tooltip?.title ? (
            <Tooltip inlineBlock {...tooltip}>
              {text}
            </Tooltip>
          ) : (
            text
          )}
        </span>
      )}
      {icon && <IconComponent fontSize="inherit" className={classnames(classes.icon, nestedClasses.icon)} data-testid="link-icon" />}
      {iconPosition === 'left' && (
        <span className={classes.text}>
          {tooltip?.title ? (
            <Tooltip inlineBlock {...tooltip}>
              {text}
            </Tooltip>
          ) : (
            text
          )}
        </span>
      )}
    </MuiLink>
  );
}
