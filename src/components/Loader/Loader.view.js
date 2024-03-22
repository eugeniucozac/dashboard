import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './Loader.styles';

// mui
import { makeStyles, CircularProgress, Typography } from '@material-ui/core';

LoaderView.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  absolute: PropTypes.bool,
  panel: PropTypes.bool,
  navExpanded: PropTypes.bool,
  sidebarExpanded: PropTypes.bool,
  inline: PropTypes.bool,
};

export function LoaderView({ message, visible, absolute, panel, navExpanded, sidebarExpanded, inline }) {
  const classes = makeStyles(styles, { name: 'Loader' })({ visible, absolute, panel, navExpanded, sidebarExpanded, inline });

  return (
    <div className={classnames(classes.root)} data-testid="loader">
      <CircularProgress size={32} />
      {message && (
        <Typography variant="body2" className={classes.text}>
          {message}
        </Typography>
      )}
    </div>
  );
}
