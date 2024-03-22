import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import omit from 'lodash/omit';

// app
import styles from './Empty.styles';
import { Button } from 'components';

// mui
import { makeStyles, Box, Typography } from '@material-ui/core';

EmptyView.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  errorText: PropTypes.string,
  icon: PropTypes.node,
  link: PropTypes.shape({
    text: PropTypes.string,
    url: PropTypes.string,
  }),
  padding: PropTypes.bool,
  bg: PropTypes.bool,
  width: PropTypes.number,
  button: PropTypes.object,
};

EmptyView.defaultProps = {
  bg: true,
};

export function EmptyView({ title, text, icon, link, button, padding, bg, width, children, errorText }) {
  const classes = makeStyles(styles, { name: 'Empty' })({ padding, bg, width });

  // abort
  if (!title && !text && !icon && !children && !errorText) return null;

  return (
    <div className={classes.root} data-testid="empty-placeholder">
      {icon && (
        <div className={classes.iconContainer}>
          <div className={classes.icon}>{icon}</div>
        </div>
      )}

      {title && (
        <Typography variant="h2" className={classes.title}>
          {title}
        </Typography>
      )}
      {text && (
        <Typography variant="body2" className={classes.text}>
          {text}
        </Typography>
      )}

      {errorText && (
        <Typography variant="body2" className={classes.errorText}>
          {errorText}
        </Typography>
      )}

      {link && link.url && link.text && (
        <Typography variant="body2" component={Link} to={link.url} className={classes.link}>
          {link.text}
        </Typography>
      )}

      {button && (button.text || button.icon) && button.action && (
        <Button
          size="small"
          color="primary"
          variant="outlined"
          {...omit(button, ['action'])}
          nestedClasses={{ btn: classes.button }}
          onClick={button.action}
        />
      )}

      {children && <Box my={2}>{children}</Box>}
    </div>
  );
}
