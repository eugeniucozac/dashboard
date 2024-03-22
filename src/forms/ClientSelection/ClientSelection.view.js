import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './ClientSelection.styles';
import { Form } from 'components';

// mui
import { makeStyles } from '@material-ui/core';

ClientSelectionView.propTypes = {
  fields: PropTypes.array,
  nestedClasses: PropTypes.object,
};

ClientSelectionView.defaultProps = {
  nestedClasses: {},
};

export function ClientSelectionView({ fields, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'ClientSelection' })();

  const classesForm = {
    [classes.root]: true,
    [nestedClasses.form]: Boolean(nestedClasses.form),
  };

  return <Form id="clientSelection" type="blank" fullwidth={false} fields={fields} nestedClasses={{ form: classnames(classesForm) }} />;
}
