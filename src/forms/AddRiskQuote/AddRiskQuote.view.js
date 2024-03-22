import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AddRiskQuote.styles';
import { Form } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

AddRiskQuoteView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
};

export function AddRiskQuoteView({ fields, actions, loading }) {
  const classes = makeStyles(styles, { name: 'AddRiskQuote' })();

  return (
    <div className={classes.root}>
      <div>
        <Form
          id="add-risk-quote"
          type="dialog"
          fields={fields}
          actions={actions}
          validationSchema={utils.form.getValidationSchema(fields)}
          defaultValues={utils.form.getInitialValues(fields)}
        />
      </div>
    </div>
  );
}
