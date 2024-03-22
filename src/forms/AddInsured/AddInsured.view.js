import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AddInsured.styles';
import { Form } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

AddInsuredView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
};

export function AddInsuredView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'AddInsured' })();

  return (
    <div className={classes.root}>
      <Form
        id="add-insured"
        type="dialog"
        fields={fields}
        actions={actions}
        validationSchema={utils.form.getValidationSchema(fields)}
        defaultValues={utils.form.getInitialValues(fields)}
      />
    </div>
  );
}
