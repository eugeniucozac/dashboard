import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AddPlacementLayerMarket.styles';
import { Form } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

AddPlacementLayerMarketView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  marketSelected: PropTypes.bool,
};

export function AddPlacementLayerMarketView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'AddPlacementLayerMarket' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  return (
    <div className={classes.root}>
      <Form
        id="add-placement-layer-market"
        type="dialog"
        fields={fields}
        actions={actions}
        defaultValues={defaultValues}
        validationSchema={validationSchema}
      />
    </div>
  );
}
