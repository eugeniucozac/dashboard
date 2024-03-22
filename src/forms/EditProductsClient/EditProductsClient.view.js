import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './EditProductsClient.styles';
import { Form, Loader } from 'components';

// mui
import { makeStyles, Fade, Collapse } from '@material-ui/core';

EditProductsClientView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object.isRequired,
};

export function EditProductsClientView({ fields, actions, loading, defaultValues, validationSchema }) {
  const classes = makeStyles(styles, { name: 'EditProductsClient' })();

  return (
    <div className={classes.root}>
      <Fade in={!loading}>
        <div>
          <Collapse in={!loading}>
            <Form
              id="edit-products-client"
              type="dialog"
              fields={fields}
              actions={actions}
              defaultValues={defaultValues}
              validationSchema={validationSchema}
            />
          </Collapse>
        </div>
      </Fade>

      <Loader visible={loading} absolute />
    </div>
  );
}
