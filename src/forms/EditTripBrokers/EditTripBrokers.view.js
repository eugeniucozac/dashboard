import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './EditTripBrokers.styles';
import { Form } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

EditTripBrokersView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
};

export function EditTripBrokersView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'EditTripBrokers' })();

  return (
    <Form
      id="editTripBrokers"
      type="dialog"
      fields={fields}
      actions={actions}
      defaultValues={utils.form.getInitialValues(fields)}
      validationSchema={utils.form.getValidationSchema(fields)}
      nestedClasses={{
        fields: {
          inner: classes.fields,
        },
      }}
    />
  );
}
