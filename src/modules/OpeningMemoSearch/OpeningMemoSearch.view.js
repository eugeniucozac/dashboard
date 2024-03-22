import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './OpeningMemoSearch.styles';
import { Form } from 'components';

// mui
import { makeStyles } from '@material-ui/core';

OpeningMemoSearchView.propTypes = {
  field: PropTypes.object.isRequired,
};

export function OpeningMemoSearchView({ field }) {
  const classes = makeStyles(styles, { name: 'OpeningMemoSearch' })();
  return (
    <div className={classes.root}>
      <Form id="openingMemoSearch" fields={[field]} nestedClasses={{ form: classes.form }} />
    </div>
  );
}
