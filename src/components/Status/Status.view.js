import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './Status.styles';
import { Chip } from 'components';

// mui
import { makeStyles } from '@material-ui/core';

StatusView.propTypes = {
  text: PropTypes.node,
  type: PropTypes.string,
  size: PropTypes.oneOf(['xxs', 'xs', 'sm', 'md', 'lg', 'xl']),
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

export function StatusView({ text, type, size, nestedClasses, ...rest }) {
  const classes = makeStyles(styles, { name: 'Status' })();

  const rootClasses = {
    [classes.root]: true,
    [classes.rootXxs]: size === 'xxs',
    [classes.rootXs]: size === 'xs',
    [classes.rootSm]: size === 'sm',
    [classes.rootMd]: size === 'md',
    [classes.rootLg]: size === 'lg',
    [classes.rootXl]: size === 'xl',
    [nestedClasses.root]: Boolean(nestedClasses.root),
  };

  const labelClasses = {
    [classes.labelXxs]: size === 'xxs',
    [classes.labelXs]: size === 'xs',
    [classes.labelSm]: size === 'sm',
    [classes.labelMd]: size === 'md',
    [classes.labelLg]: size === 'lg',
    [classes.labelXl]: size === 'xl',
  };

  return (
    <Chip
      {...rest}
      label={text}
      type={type}
      nestedClasses={{
        root: classnames(rootClasses),
        label: classnames(labelClasses),
      }}
      testid={`status-${type}`}
    />
  );
}
