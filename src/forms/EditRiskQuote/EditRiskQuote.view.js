import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './EditRiskQuote.styles';
import { Form } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

EditRiskQuoteView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
};

export function EditRiskQuoteView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'EditRiskQuote' })();

  return (
    <div className={classes.root}>
      <div>
        <Form
          id="edit-risk-quote"
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
