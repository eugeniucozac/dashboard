import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './MarketSelection.styles';
import { Form } from 'components';

// mui
import { makeStyles } from '@material-ui/core';

MarketSelectionView.propTypes = {
  fields: PropTypes.array,
  nestedClasses: PropTypes.object,
};

MarketSelectionView.defaultProps = {
  nestedClasses: {},
};

export function MarketSelectionView({ fields, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'MarketSelection' })();

  const classesForm = {
    [classes.root]: true,
    [nestedClasses.form]: Boolean(nestedClasses.form),
  };

  return <Form id="marketSelection" type="blank" fullwidth={false} fields={fields} nestedClasses={{ form: classnames(classesForm) }} />;
}
