import React from 'react';
import PropTypes from 'prop-types';

// app
import { FormLegend, FormText } from 'components';
import * as utils from 'utils';

// mui
import { Grid } from '@material-ui/core';

OpeningMemoSpecialInstructionsView.propTypes = {
  fields: PropTypes.array.isRequired,
  formProps: PropTypes.object.isRequired,
};

export function OpeningMemoSpecialInstructionsView({ fields, formProps }) {
  const { control } = formProps;

  return (
    <>
      <FormLegend text={utils.string.t('placement.openingMemo.specialInstructions.header')} />

      <Grid container spacing={3}>
        <Grid xs={12} lg={8} item>
          <FormText control={control} {...utils.form.getFieldProps(fields, 'notes')} />
        </Grid>

        <Grid xs={12} sm={8} md={6} lg={4} item>
          <FormText control={control} {...utils.form.getFieldProps(fields, 'listOfRisks')} />
        </Grid>
      </Grid>
    </>
  );
}
