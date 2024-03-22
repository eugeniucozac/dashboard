import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

//app
import styles from './LinkClaimPolicy.styles';
import { Accordion, FormLegend, FormAutocompleteMui, FormDate, FormText, Skeleton, FormCheckbox } from 'components';
import { ClaimsUnderwritingGroups, ClaimsMovementType } from 'modules';
import * as utils from 'utils';

import { makeStyles, Grid, Box, Typography } from '@material-ui/core';

LinkClaimPolicyView.propTypes = {
  fields: PropTypes.array.isRequired,
  policyData: PropTypes.object.isRequired,
  allClaimDetails: PropTypes.object,
  originalCurrencyValue: PropTypes.func,
  settlementCurrencyValue: PropTypes.func,
  uwResetKey: PropTypes.number,
  hasClaimRef: PropTypes.bool.isRequired,
  underWritingGroups: PropTypes.object,
  isBordereauFlag: PropTypes.bool,
  validation: PropTypes.bool.isRequired,
  setValidation: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isFormsEdited: PropTypes.array.isRequired,
  setFormEditedStatus: PropTypes.func.isRequired,
  postSaveHandler: PropTypes.func.isRequired,
  postEditSaveHandler: PropTypes.func.isRequired,
  saveStatus: PropTypes.number,
  selectedPolicyRender: PropTypes.number,
  handleFormStatus: PropTypes.func,
  selectNextPolicy: PropTypes.bool,
  postSaveNextHanlder: PropTypes.func,
  fieldsLoader: PropTypes.object.isRequired,
};

export function LinkClaimPolicyView({
  fields,
  policyData,
  allClaimDetails,
  originalCurrencyValue,
  settlementCurrencyValue,
  uwResetKey,
  hasClaimRef,
  underWritingGroups,
  isBordereauFlag,
  validation,
  setValidation,
  index,
  isFormsEdited,
  setFormEditedStatus,
  postSaveHandler,
  postEditSaveHandler,
  saveStatus,
  selectedPolicyRender,
  handleFormStatus,
  selectNextPolicy,
  postSaveNextHanlder,
  fieldsLoader,
}) {
  const classes = makeStyles(styles, { name: 'LinkClaimPolicy' })();

  const focusInputRef = useRef();

  const [isEdit, setIsEdit] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [accExpandStatus, setAccExpandStatus] = useState(true);

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const claimForm = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema), context: { validation } }),
  });

  const { handleSubmit, setValue, control, errors, watch } = claimForm;

  const insuredWatch = Boolean(watch('insured'));
  const clientWatch = Boolean(watch('client'));
  const countryCodeWatch = Boolean(watch('countryCode'));
  const certificateNumberWatch = Boolean(watch('certificateNumber'));
  const certificateInceptionDateWatch = Boolean(watch('certificateInceptionDate'));
  const certificateExpiryDateWatch = Boolean(watch('certificateExpiryDate'));
  const originalCurrencyCodeWatch = Boolean(watch('originalCurrencyCode'));
  const settlementCurrencyCodeWatch = Boolean(watch('settlementCurrencyCode'));
  const interestWatch = Boolean(watch('interest'));
  const underWritingGroupsWatch = Boolean(watch('underWritingGroups'));

  const formWatcher = () => {
    return (
      insuredWatch ||
      clientWatch ||
      countryCodeWatch ||
      certificateNumberWatch ||
      certificateInceptionDateWatch ||
      certificateExpiryDateWatch ||
      originalCurrencyCodeWatch ||
      settlementCurrencyCodeWatch ||
      interestWatch ||
      underWritingGroupsWatch
    );
  };

  const saveHandler = () => {
    if ((selectedPolicyRender !== '' && initialLoad) || (initialLoad && validation)) {
      handleFormStatus();
    }
  };

  if (formWatcher() !== isEdit) {
    if (formWatcher()) setIsEdit(true);
  }

  useEffect(() => {
    if (isEdit && initialLoad) {
      saveHandler();
    } else {
      const formState = isFormsEdited?.map((form) => ({ ...form }));
      if (formState[index]['formEditedStatus']) {
        formState[index]['formEditedStatus'] = false;
        formState[index]['isSubmitted'] = true;
        setFormEditedStatus(formState);
      }
      setInitialLoad(true);
    }
  }, [isEdit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (saveStatus && !isFormsEdited[index]?.formEditedStatus && initialLoad) {
      handleSubmit(postSaveHandler)();
    } else if (saveStatus && isFormsEdited[index]?.formEditedStatus && validation) {
      handleSubmit(postEditSaveHandler)();
    } else if (selectNextPolicy && initialLoad) {
      handleSubmit(postSaveNextHanlder)();
    }
    setValidation(true);
  }, [saveStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (underWritingGroups) {
      if (underWritingGroups.percentageOfSelected) {
        setValue('orderPercentage', underWritingGroups.percentageOfSelected);
        if (selectedPolicyRender !== '') saveHandler();
      }
    }
  }, [underWritingGroups]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (Object.keys(errors)?.length > 0) {
      focusInputRef?.current?.scrollIntoView();
    }
  }, [errors]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (allClaimDetails?.originalCurrency || allClaimDetails?.settlementCurrencyCode) {
      setValue('originalCurrencyCode', originalCurrencyValue());
      setValue('settlementCurrencyCode', settlementCurrencyValue());
    }

    if (isBordereauFlag && !Object.keys(errors).length > 0) {
      setValue('certificateNumber', fields[9].value);
      setValue('certificateInceptionDate', fields[10].value);
      setValue('certificateExpiryDate', fields[11].value);
    }
  }, [allClaimDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <FormLegend text={policyData?.policyNumber} />
      <Box mt={-2} ref={focusInputRef}>
        {isBordereauFlag && (
          <Grid container spacing={3}>
            <Grid item xs={6} sm={4}>
              <FormCheckbox
                label={utils.string.t('claims.claimInformation.bordereauClaim')}
                {...utils.form.getFieldProps(fields, 'bordereauClaim', control)}
                error={errors.bordereauClaim}
              />
            </Grid>
          </Grid>
        )}
        <Grid container spacing={3}>
          <Grid item xs={6} sm={4}>
            <div key={uwResetKey}>
              {fieldsLoader.isInsuredLoading ? (
                <>
                  <Skeleton height={15} animation="wave" displayNumber={1} />
                  <Skeleton height={55} animation="wave" displayNumber={1} />
                </>
              ) : (
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'insured', control)}
                  error={errors.insured}
                  callback={initialLoad && saveHandler}
                  handleUpdate={(id, value) => {
                    setValue(id, value);
                  }}
                />
              )}
            </div>
          </Grid>

          <Grid item xs={6} sm={4}>
            <div key={uwResetKey || isEdit}>
              {fieldsLoader.isPoliciesClientsLoading ? (
                <>
                  <Skeleton height={15} animation="wave" displayNumber={1} />
                  <Skeleton height={55} animation="wave" displayNumber={1} />
                </>
              ) : (
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'client', control)}
                  error={errors.client}
                  callback={initialLoad && saveHandler}
                  handleUpdate={(id, value) => {
                    setValue(id, value);
                  }}
                />
              )}
            </div>
          </Grid>

          <Grid item xs={6} sm={4}>
            <div key={uwResetKey || isEdit}>
              <FormAutocompleteMui
                {...utils.form.getFieldProps(fields, 'countryCode', control)}
                error={errors.countryCode}
                callback={initialLoad && saveHandler}
                handleUpdate={(id, value) => {
                  setValue(id, value);
                }}
              />
            </div>
          </Grid>

          <Grid item xs={6} sm={4}>
            <div key={uwResetKey}>
              <FormAutocompleteMui
                {...utils.form.getFieldProps(fields, 'originalCurrencyCode', control)}
                error={errors.originalCurrencyCode}
                callback={initialLoad && saveHandler}
                handleUpdate={(id, value) => {
                  setValue(id, value);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={6} sm={4}>
            <div key={uwResetKey}>
              <FormAutocompleteMui
                {...utils.form.getFieldProps(fields, 'settlementCurrencyCode', control)}
                error={errors.settlementCurrencyCode}
                callback={initialLoad && saveHandler}
                handleUpdate={(id, value) => {
                  setValue(id, value);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={6} sm={4}>
            <div key={uwResetKey}>
              {fieldsLoader.isInterestLoading ? (
                <>
                  {' '}
                  <Skeleton height={15} animation="wave" displayNumber={1} />
                  <Skeleton height={55} animation="wave" displayNumber={1} />
                </>
              ) : (
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'interest', control)}
                  error={errors.interest}
                  callback={initialLoad && saveHandler}
                  handleUpdate={(id, value) => {
                    setValue(id, value);
                  }}
                />
              )}
            </div>
          </Grid>
          {isBordereauFlag && (
            <>
              <Grid item xs={6} sm={4}>
                <FormText {...utils.form.getFieldProps(fields, 'certificateNumber', control)} error={errors.certificateNumber} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormDate
                  {...utils.form.getFieldProps(fields, 'certificateInceptionDate', control)}
                  error={errors.certificateInceptionDate}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormDate {...utils.form.getFieldProps(fields, 'certificateExpiryDate', control)} error={errors.certificateExpiryDate} />
              </Grid>
              <Grid item xs={6} sm={4}>
                {fieldsLoader?.isBordereauPeriodsLoading ? (
                  <>
                    <Skeleton height={15} animation="wave" displayNumber={1} />
                    <Skeleton height={55} animation="wave" displayNumber={1} />
                  </>
                ) : (
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'bordereauPeriod', control)} error={errors.bordereauPeriod} />
                )}
              </Grid>
            </>
          )}
        </Grid>

        <Box mt={5}>
          <Accordion
            expanded={accExpandStatus}
            onChange={() => setAccExpandStatus(!accExpandStatus)}
            title={
              <Typography className={classes.accordionTitle} variant="body2">
                {utils.string.t('claims.underWritingGroups.title')}
              </Typography>
            }
          >
            <Box className={classes.accordionContent}>
              <ClaimsUnderwritingGroups
                fields={fields}
                claimForm={claimForm}
                uwResetKey={uwResetKey}
                hasClaimRef={hasClaimRef}
                selectedPolicyRender={selectedPolicyRender}
              />
              <Box mt={4}>
                <ClaimsMovementType fields={fields} claimForm={claimForm} underWritingGroups={underWritingGroups} enforceValueSet={true} />
              </Box>
            </Box>
          </Accordion>
        </Box>
      </Box>
    </>
  );
}
