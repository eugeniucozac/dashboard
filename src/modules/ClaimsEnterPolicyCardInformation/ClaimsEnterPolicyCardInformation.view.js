import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import styles from './ClaimsEnterPolicyCardInformation.styles';
import { RowDetails } from 'modules';
import config from 'config';

//mui
import { makeStyles, Card, CardHeader, CardContent, Typography, Box } from '@material-ui/core';

ClaimsEnterPolicyCardInformationView.prototype = {
  data: PropTypes.object.isRequired,
};

export function ClaimsEnterPolicyCardInformationView({ data }) {
  const classes = makeStyles(styles, { name: 'ClaimsEnterPolicyCardInformation' })();
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
                <RowDetails title={utils.string.t('claims.claimInformation.insured')} details={data?.insured} textAlign="right" />
                <RowDetails title={utils.string.t('claims.claimInformation.client')} details={data?.client} textAlign="right" />
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
