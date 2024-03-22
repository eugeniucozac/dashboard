import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './FormGrid.styles';

// mui
import { makeStyles, Grid } from '@material-ui/core';

FormGridView.propTypes = {
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

FormGridView.defaultProps = {
  nestedClasses: {},
};

export function FormGridView({ nestedClasses, children, ...rest }) {
  const classes = makeStyles(styles, 'FormGrid')();

  const classesGrid = {
    [classes.container]: rest.container,
    [classes.item]: rest.item,
    [nestedClasses.root]: Boolean(nestedClasses.root),
  };

  return (
    <Grid {...rest} className={classnames(classesGrid)}>
      {children}
    </Grid>
  );
}
