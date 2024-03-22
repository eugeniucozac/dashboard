import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './EnterClaimCardInformation.styles';
import * as utils from 'utils';
import {
  FormContainer,
  FormText,
  FormGrid,
  FormLabel,
  Link,
  FormDate,
  FormAutocompleteMui,
  FormRadio,
  FormCheckbox,
  FormFields,
} from 'components';
import { RowDetails } from 'modules';
import { selectClaimData } from 'stores';
import { CLAIM_LOSS_DATE_DISABLED_QUALIFIERS } from 'consts';

// mui
import { makeStyles, Card, CardHeader, CardContent, Typography, Box } from '@material-ui/core';
EnterClaimCardInformationView.prototype = {
  fields: PropTypes.object.isRequired,
  claimForm: PropTypes.object,
  interest: PropTypes.object.isRequired,
  policyInformation: PropTypes.object.isRequired,
  claimantNames: PropTypes.array.isRequired,
  complexityValues: PropTypes.array.isRequired,
  referralValues: PropTypes.array.isRequired,
  isBordereauFlag: PropTypes.bool.isRequired,
  isComplexFlag: PropTypes.bool.isRequired,
  handleSelectInterestLink: PropTypes.func.isRequired,
  existingClaimInfo: PropTypes.object,
  currencies: PropTypes.array.isRequired,
  lossQualifiers: PropTypes.object,
  resetKey: PropTypes.number,
  isBordereauChecked: PropTypes.bool.isRequired,
};
export function EnterClaimCardInformationView({
  fields,
  claimForm,
  handleSelectInterestLink,
  interest,
  policyInformation,
  claimantNames,
  complexityValues,
  referralValues,
  isBordereauFlag,
  isComplexFlag,
  existingClaimInfo,
  currencies = [],
  lossQualifiers,
  resetKey,
  isBordereauChecked,
}) {
  const classes = makeStyles(styles, { name: 'EnterClaimCardInformation' })();

  const { control, errors, watch, setValue } = claimForm;
  const claimRefId = useSelector(selectClaimData);

  const [dateValidation, setDateValidation] = useState(false);
  const [refResponseDisable, setRefResponseDisable] = useState(true);
  const [refValuesDisable, setRefValueDisable] = useState(false);

  const lossQualifierID = watch('lossQualifierID')?.id;
  const watchComplexValues = watch('complexity');
  const watchRefValues = watch('referral');

  let lossFromDate = utils.form.getFieldProps(fields, 'fromDate', control)?.value;
  let lossToDate = utils.form.getFieldProps(fields, 'toDate', control)?.value;

  useEffect(() => {
    if (lossQualifierID) {
      const dateDisabledLossQualifiers = lossQualifiers
        .filter((item) => {
          return CLAIM_LOSS_DATE_DISABLED_QUALIFIERS.find((itr) => itr === item.name);
        })
        .map((item) => item.id);
      const isRequired = !dateDisabledLossQualifiers.includes(lossQualifierID);
      setDateValidation(!isRequired);
      setValue('fromDate', isRequired ? lossFromDate : null);
      setValue('toDate', isRequired ? lossToDate : null);
    }
  }, [lossQualifierID]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (watchComplexValues) {
      const getComplexityStatus =
        complexityValues.find((item) => item.complexityRulesID === watchComplexValues?.complexityRulesID)?.complexityRulesValue ===
        'Referral Required';
      setRefValueDisable(getComplexityStatus);
      getRefValues(watchRefValues);
    } else if (watchComplexValues === null) {
      setRefValueDisable(false);
    }
  }, [watchComplexValues]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (interest?.selectedInterest) {
      setValue('interest', interest.selectedInterest);
    }

    if (existingClaimInfo?.settlementCurrencyCode) {
      setValue('settlementCurrencyCode', currencies.find((c) => c.id === existingClaimInfo?.settlementCurrencyCode) || null);
    } else {
      setValue('settlementCurrencyCode', currencies.find((c) => c.id === policyInformation?.originalCurrency) || null);
    }
  }, [interest, policyInformation]); // eslint-disable-line react-hooks/exhaustive-deps

  const getRefValues = (referralValue) => {
    if (referralValue) {
      const getReferralValue = referralValues.find(
        (item) => item.complexityRulesID === referralValue?.complexityRulesID
      )?.complexityRulesValue;
      const refValuesList = ['Referral Not Required', 'Referral Not Required: Assign to Myself', 'Unsure'];
      const refResponseState = refValuesList.includes(getReferralValue);
      setRefResponseDisable(refResponseState);
      if (refResponseState) {
        setValue('rfiResponse', null);
      }
    } else if (referralValue === null || !referralValue) {
      setRefResponseDisable(true);
      setValue('rfiResponse', null);
    }
  };

  const qualifierClasses = {
    root: classnames({
      [classes.formLabel]: true,
      [classes.longText]: true,
    }),
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.cardHeader}
        title={
          <Typography variant="body2" className={classes.title}>
            {utils.string.t('claims.claimInformation.title')}
          </Typography>
        }
      />
      <CardContent className={classes.cardContent}>
        <FormContainer className={classes.form} data-testid="form-claimcard-information">
          <div className={classes.detailsThree}>
            <Box>
              <RowDetails
                title={utils.string.t('claims.claimInformation.claimRef')}
                details={(claimRefId?.claimReference || claimRefId?.claimRef) ?? utils.string.t('claims.claimInformation.autoGenerated')}
                textAlign="right"
                nestedClasses={{ root: classes.rowDetails }}
              />
              <RowDetails
                title={utils.string.t('claims.claimInformation.status')}
                details="Details"
                textAlign="right"
                nestedClasses={{ root: classes.rowDetails }}
              />
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.claimReceivedDateTime')} *`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={8} nestedClasses={{ root: classes.autoFormSelectTxt }}>
                  <FormGrid container>
                    <FormGrid item xs={7}>
                      <FormDate {...utils.form.getFieldProps(fields, 'claimReceivedDate', control)} error={errors.claimReceivedDate} />
                    </FormGrid>
                    <FormGrid item xs={5} style={{ paddingLeft: 0 }}>
                      <FormText {...utils.form.getFieldProps(fields, 'claimReceivedTime', control)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={utils.string.t('claims.claimInformation.claimant')}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={6} nestedClasses={{ root: classes.autoFormSelectTxt }} key={claimantNames}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'claimantName', control)} error={errors.claimantName} />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.interest')}  ${interest?.items?.length > 0 ? ' *' : ''}`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={6} nestedClasses={{ root: classes.row }}>
                  <FormText {...utils.form.getFieldProps(fields, 'interest', control)} error={errors.interest} />
                  <Link
                    text="Show"
                    color="secondary"
                    nestedClasses={{ link: interest.items.length > 1 ? classes.link : classes.disableLink }}
                    handleClick={handleSelectInterestLink}
                  />
                </FormGrid>
              </FormGrid>
            </Box>
            <Box>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={qualifierClasses}
                    label={`${utils.string.t('claims.lossInformation.qualifier')} *`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={6}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'lossQualifierID', control)} error={errors.lossQualifierID} />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={qualifierClasses}
                    label={`${utils.string.t('claims.lossInformation.fromDate')} ${!dateValidation ? ' *' : ''}`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={6}>
                  <FormDate
                    {...utils.form.getFieldProps(fields, 'fromDate', control)}
                    error={errors.fromDate}
                    muiComponentProps={{
                      disabled: dateValidation,
                      fullWidth: true,
                      classes: {
                        root: classes.datepicker,
                      },
                    }}
                  />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.lossInformation.toDate')}`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={6}>
                  <FormDate
                    {...utils.form.getFieldProps(fields, 'toDate', control, errors)}
                    error={errors.toDate}
                    muiComponentProps={{
                      disabled: dateValidation,
                      fullWidth: true,
                      classes: {
                        root: classes.datepicker,
                      },
                    }}
                  />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.settlementCurrency')} *`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={6}>
                  <FormAutocompleteMui
                    {...utils.form.getFieldProps(fields, 'settlementCurrencyCode', control)}
                    error={errors.settlementCurrencyCode}
                  />
                </FormGrid>
              </FormGrid>
            </Box>
            <Box>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={5}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.adjustorType')}`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={6} key={resetKey}>
                  <FormRadio {...utils.form.getFieldProps(fields, 'adjuster', control)} />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={5}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.adjustorName')}`}
                    align="right"
                  />
                </FormGrid>
                {watch('adjuster') === 'beAdjuster' ? (
                  <FormGrid xs={6}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'beAdjuster')} control={control} />
                  </FormGrid>
                ) : (
                  <FormGrid item xs={6}>
                    <FormText {...utils.form.getFieldProps(fields, 'nonBeAdjuster', control)} error={errors.nonBeAdjuster} />
                  </FormGrid>
                )}
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={5}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={utils.string.t('claims.claimInformation.adjustorRef')}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={6}>
                  <FormText {...utils.form.getFieldProps(fields, 'adjusterReference', control)} error={errors.adjusterReference} />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={5}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.priority')}`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={6}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'priority', control)} />
                </FormGrid>
              </FormGrid>
            </Box>
          </div>
          <div className={classes.detailsTwo}>
            <Box className={classes.fgu}>
              <FormGrid container style={{ marginBottom: 15 }}>
                <FormGrid item xs={2}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.location')} *`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={10}>
                  <FormText {...utils.form.getFieldProps(fields, 'location', control, errors)} />
                </FormGrid>
              </FormGrid>
              <FormGrid container style={{ marginBottom: 15 }}>
                <FormGrid item xs={2}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.fguNarrative')} *`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={10}>
                  <FormText {...utils.form.getFieldProps(fields, 'fgunarrative', control, errors)} />
                </FormGrid>
              </FormGrid>
            </Box>
            <Box className={classes.risk}>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.complexityBasis')} ${!isComplexFlag ? '*' : ''}`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={7} key={resetKey}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'complexity', control, errors)} />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.referral')} ${!refValuesDisable ? '' : '*'}`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={7} key={resetKey}>
                  <FormAutocompleteMui
                    {...utils.form.getFieldProps(fields, 'referral', control)}
                    error={errors.referral}
                    muiComponentProps={{
                      disabled: !refValuesDisable,
                    }}
                    callback={(e, data) => {
                      getRefValues(data);
                    }}
                  />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center" style={{ marginBottom: 15 }}>
                <FormGrid item xs={4}>
                  <FormLabel
                    nestedClasses={{ root: classes.formLabel }}
                    label={`${utils.string.t('claims.claimInformation.rfiResponse')} ${refResponseDisable ? '' : '*'}`}
                    align="right"
                  />
                </FormGrid>
                <FormGrid item xs={7} key={resetKey}>
                  <FormAutocompleteMui
                    {...utils.form.getFieldProps(fields, 'rfiResponse', control)}
                    error={errors.rfiResponse}
                    muiComponentProps={{
                      disabled: refResponseDisable,
                    }}
                  />
                </FormGrid>
              </FormGrid>
            </Box>
          </div>
          {isBordereauFlag && (
            <>
              <div className={classes.detailsCertification}>
                <Box className={classes.certificationRow} style={{ marginLeft: -12 }}>
                  <FormGrid container alignItems="center">
                    <FormGrid item xs={5}>
                      <FormLabel
                        nestedClasses={{ root: classes.formLabel }}
                        label={`${utils.string.t('claims.claimInformation.certificateNumber')} *`}
                        align="right"
                      />
                    </FormGrid>
                    <FormGrid item xs={6}>
                      <FormText {...utils.form.getFieldProps(fields, 'certificateNumber', control)} error={errors.certificateNumber} />
                    </FormGrid>
                  </FormGrid>
                </Box>
                <Box className={classes.certificationRow} style={{ marginLeft: -24, paddingLeft: 3 }}>
                  <FormGrid container alignItems="center">
                    <FormGrid item xs={6}>
                      <FormLabel
                        nestedClasses={{ root: classes.formLabel }}
                        label={`${utils.string.t('claims.claimInformation.certificateInceptionDate')} *`}
                        align="right"
                      />
                    </FormGrid>
                    <FormGrid item xs={6}>
                      <FormDate
                        {...utils.form.getFieldProps(fields, 'certificateInceptionDate', control)}
                        error={errors.certificateInceptionDate}
                      />
                    </FormGrid>
                  </FormGrid>
                </Box>
                <Box className={classes.certificationRow} style={{ marginLeft: 50 }}>
                  <FormGrid container alignItems="center">
                    <FormGrid item xs={5} style={{ marginLeft: '4px' }}>
                      <FormLabel
                        nestedClasses={{ root: classes.formLabel }}
                        label={`${utils.string.t('claims.claimInformation.certificateExpiryDate')} *`}
                        align="right"
                      />
                    </FormGrid>
                    <FormGrid item xs={6}>
                      <FormDate
                        {...utils.form.getFieldProps(fields, 'certificateExpiryDate', control)}
                        error={errors.certificateExpiryDate}
                      />
                    </FormGrid>
                  </FormGrid>
                </Box>
              </div>
              <FormFields>
                <FormGrid container spacing={6}>
                  <FormGrid item sm={6}>
                    <FormGrid container alignItems="center">
                      <FormGrid item xs={6}>
                        <FormLabel
                          nestedClasses={{ root: classes.formLabel }}
                          label={utils.string.t('claims.claimInformation.bordereauClaim')}
                          align="right"
                        />
                      </FormGrid>
                      <FormGrid item xs={6}>
                        <FormCheckbox {...utils.form.getFieldProps(fields, 'bordereauClaim', control)} error={errors.bordereauClaim} />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  {isBordereauChecked && (
                    <FormGrid item sm={6}>
                      <FormGrid container alignItems="center">
                        <FormGrid item xs={6}>
                          <FormLabel
                            nestedClasses={{ root: classes.formLabel }}
                            label={`${utils.string.t('claims.claimInformation.bordereauPeriod')}*`}
                            align="right"
                          />
                        </FormGrid>
                        <FormGrid item xs={6}>
                          <FormAutocompleteMui
                            {...utils.form.getFieldProps(fields, 'bordereauPeriod', control)}
                            error={errors.bordereauPeriod}
                          />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  )}
                </FormGrid>
              </FormFields>
            </>
          )}
        </FormContainer>
      </CardContent>
    </Card>
  );
}
