import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AddPlacementMarket.styles';
import { Form } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

AddPlacementMarketView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  isUnderwritersVisible: PropTypes.bool,
  handlers: PropTypes.shape({
    showUnderwriters: PropTypes.func.isRequired,
  }).isRequired,
};

export function AddPlacementMarketView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'AddPlacementMarket' })();

  return (
    <div className={classes.root}>
      <Form
        id="add-placement-market"
        type="dialog"
        fields={fields}
        actions={actions}
        validationSchema={utils.form.getValidationSchema(fields)}
        defaultValues={utils.form.getInitialValues(fields)}
      />
    </div>
  );
}
