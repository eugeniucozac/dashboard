import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import styles from './ClaimsEditPolicyCardInformation.styles';
import { RowDetails } from 'modules';
import config from 'config';
import { FormGrid, FormLabel, FormAutocompleteMui } from 'components';

//mui
import { makeStyles, Card, CardHeader, CardContent, Typography, Box } from '@material-ui/core';

ClaimsEditPolicyCardInformationView.prototype = {
  data: PropTypes.object.isRequired,
  claimForm: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  resetKey: PropTypes.number,
};

export function ClaimsEditPolicyCardInformationView({ data, fields, claimForm, resetKey }) {
  const classes = makeStyles(styles, { name: 'ClaimsEditPolicyCardInformation' })();
  const { control, errors } = claimForm;
  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          className={classes.cardHeader}
          title={
            <Typography variant="body2" className={classes.title}>
              {utils.string.t('claims.claimInformation.policyTitle')}
            </Typography>
          }
        />
        <CardContent variant="body2" className={classes.cardContent}>
          <Box>
            <div className={classes.details}>
              <Box>
                <RowDetails title={utils.string.t('claims.claimInformation.policyRef')} details={data?.policyRef} textAlign="right" />
                <FormGrid container alignItems="center">
                  <FormGrid item xs={4}>
                    <FormLabel
                      nestedClasses={{ root: classes.formLabel }}
                      label={`${utils.string.t('claims.claimInformation.insured')} *`}
                      align="right"
                    />
                  </FormGrid>
                  <FormGrid item xs={6} nestedClasses={{ root: classes.autoFormSelectTxt }} key={resetKey}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'insured', control)} error={errors.insured} />
                  </FormGrid>
                </FormGrid>
                <FormGrid container alignItems="center">
                  <FormGrid item xs={4}>
                    <FormLabel
                      nestedClasses={{ root: classes.formLabel }}
                      label={`${utils.string.t('claims.claimInformation.client')} *`}
                      align="right"
                    />
                  </FormGrid>
                  <FormGrid item xs={6} nestedClasses={{ root: classes.autoFormSelectTxt }} key={resetKey}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'client', control)} error={errors.client} />
                  </FormGrid>
                </FormGrid>
                <RowDetails
                  title={utils.string.t('app.inceptionDate')}
                  details={data?.inceptionDate && moment(data?.inceptionDate).format(config.ui.format.date.text)}
                  textAlign="right"
                />
                <RowDetails
                  title={utils.string.t('app.expiryDate')}
                  details={data?.expiryDate && moment(data?.expiryDate).format(config.ui.format.date.text)}
                  textAlign="right"
                />{' '}
              </Box>
              <Box>
                <RowDetails title={utils.string.t('claims.claimInformation.policyType')} details={data?.policyType} textAlign="right" />
                <RowDetails title={utils.string.t('app.company')} details={data?.company} textAlign="right" />
                <RowDetails title={utils.string.t('claims.claimInformation.division')} details={data?.division} textAlign="right" />
                <RowDetails
                  title={utils.string.t('claims.claimInformation.originalCurrency')}
                  details={data?.originalCurrency}
                  textAlign="right"
                />
              </Box>
              <Box>
                <RowDetails title={utils.string.t('claims.claimInformation.riskDetails')} details={data?.policyNote} textAlign="right" />
              </Box>
            </div>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
