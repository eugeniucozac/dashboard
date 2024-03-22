import React from 'react';
import classnames from 'classnames';

// app
import styles from './Logo.styles';

// mui
import { makeStyles } from '@material-ui/core';

export function LogoView({ component, height, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'Logo' })();
  const LogoComponent = component;

  return <LogoComponent className={classnames(nestedClasses, classes.root)} height={height} data-testid="edge-logo" />;
}
