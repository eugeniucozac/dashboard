import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector } from 'react-redux';

// app
import styles from './OpeningMemoInfo.styles';
import { FormAutocomplete, FormDate, FormLegend, FormRadio, FormSelect, FormText, Info } from 'components';
import { selectRefDataDepartmentBrokers } from 'stores';
import { PLACEMENT_DECLARATION } from 'consts';
import * as utils from 'utils';

// mui
import { Box, Grid, Collapse, Fade, makeStyles } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

OpeningMemoInfoView.propTypes = {
  fields: PropTypes.array.isRequired,
  formProps: PropTypes.object.isRequired,
};

export function OpeningMemoInfoView({ fields, formProps }) {
  const { control, setValue, trigger, watch, errors } = formProps;
  const classes = makeStyles(styles, { name: 'OpeningMemoInfo' })();

  const users = useSelector(selectRefDataDepartmentBrokers);

  const uniqueMarketReference = utils.form.getFieldProps(fields, 'uniqueMarketReference');

  const inceptionDate = {
    ...utils.form.getFieldProps(fields, 'inceptionDate'),
  };
  if (inceptionDate.name === 'inceptionDate') {
    inceptionDate.handleUpdate = (id, value) => {
      const values = control.getValues();

      if (Object.keys(values).includes('expiryDate') && !values.expiryDate) {
        setValue('expiryDate', moment(value).add(1, 'y').toISOString());
        trigger('expiryDate');
      }
    };
  }
  const autocompleteProps = {
    options: users || [],
    handleUpdate: (id, changes) => setValue(id, changes[0], { shouldDirty: true }),
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} sm={4} md={3}>
          <Info
            title={uniqueMarketReference.label}
            description={uniqueMarketReference.value && uniqueMarketReference.value.toString().replace(/,/g, ', ')}
            avatarIcon={DescriptionIcon}
            nestedClasses={{
              root: classes.infoRoot,
              details: classes.infoContent,
            }}
          />
          <FormRadio
            {...utils.form.getFieldProps(fields, 'placementType', control, errors)}
            muiFormGroupProps={{ className: classes.formRadio }}
          />
          <Fade in={watch('placementType') === PLACEMENT_DECLARATION}>
            <Collapse in={watch('placementType') === PLACEMENT_DECLARATION}>
              <Box mt={1}>
                <FormText {...utils.form.getFieldProps(fields, 'attachedTo', control)} />
              </Box>
            </Collapse>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Box ml={5}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormLegend
                  text={utils.string.t('placement.openingMemo.summary.legends.policy')}
                  nestedClasses={{
                    root: classes.legend,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormSelect {...utils.form.getFieldProps(fields, 'newRenewalBusinessId', control)} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormSelect {...utils.form.getFieldProps(fields, 'departmentId', control)} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormText {...utils.form.getFieldProps(fields, 'reInsured', control)} />
              </Grid>
              <Grid item xs={12} md={6} xl={4}>
                <FormDate control={control} {...inceptionDate} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormDate {...utils.form.getFieldProps(fields, 'expiryDate', control)} />
              </Grid>

              <Grid item xs={12}>
                <FormLegend
                  text={utils.string.t('placement.openingMemo.summary.legends.client')}
                  nestedClasses={{
                    root: classes.legendMargin,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormText {...utils.form.getFieldProps(fields, 'invoicingClient', control)} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormText {...utils.form.getFieldProps(fields, 'clientContactName', control)} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormText {...utils.form.getFieldProps(fields, 'clientEmail', control)} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormText {...utils.form.getFieldProps(fields, 'eocInvoiceContactName', control)} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormText {...utils.form.getFieldProps(fields, 'eocInvoiceEmail', control)} />
              </Grid>

              <Grid item xs={12}>
                <FormLegend
                  text={utils.string.t('placement.openingMemo.summary.legends.broking')}
                  nestedClasses={{
                    root: classes.legendMargin,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormAutocomplete {...utils.form.getFieldProps(fields, 'producingBroker', control)} {...autocompleteProps} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormAutocomplete {...utils.form.getFieldProps(fields, 'accountExecutive', control)} {...autocompleteProps} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormAutocomplete {...utils.form.getFieldProps(fields, 'placingBroker', control)} {...autocompleteProps} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormAutocomplete {...utils.form.getFieldProps(fields, 'originator', control)} {...autocompleteProps} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
