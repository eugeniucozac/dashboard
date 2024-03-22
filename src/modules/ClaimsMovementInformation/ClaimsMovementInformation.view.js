import React from 'react';

//app
import * as utils from 'utils';
import styles from './ClaimsMovementInformation.styles';
import { FormContainer, FormFields, FormGrid, FormSelect } from 'components';

//mui
import { makeStyles, Typography, Card, CardHeader, CardContent } from '@material-ui/core';

export function ClaimsMovementInformationView({ movementInfoDetails, fields }) {
  const classes = makeStyles(styles, { name: 'ClaimsMovementInformation' })();

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          className={classes.cardHeader}
          title={<Typography variant="subtitle1">{utils.string.t('claims.movementInformation.title')}</Typography>}
        />
        <CardContent className={classes.cardContent}>
          <FormContainer>
            <FormFields>
              <FormGrid container direction="column" spacing={2}>
                <FormGrid item xs={12}>
                  <FormSelect {...utils.form.getFieldProps(fields, 'movementType')} />
                </FormGrid>
                <FormGrid item xs={12}>
                  <FormSelect {...utils.form.getFieldProps(fields, 'qualifier')} />
                </FormGrid>
                <FormGrid item xs={12}>
                  <label className={classes.cardLabel}>{utils.string.t('claims.movementInformation.dateOfAdvice')} </label>
                  <Typography variant="h5">{movementInfoDetails?.dateOfAdvice}</Typography>
                </FormGrid>
                <FormGrid item xs={12}>
                  <label className={classes.cardLabel}>{utils.string.t('claims.movementInformation.description')}</label>
                  <Typography variant="h5">{movementInfoDetails?.movementDesc}</Typography>
                </FormGrid>
                <FormGrid item xs={12}>
                  <label className={classes.cardLabel}>{utils.string.t('claims.movementInformation.brokerNarrative')}</label>
                  <Typography variant="h5">{movementInfoDetails?.brokerNarrative}</Typography>
                </FormGrid>
              </FormGrid>
            </FormFields>
          </FormContainer>
        </CardContent>
      </Card>
    </>
  );
}
