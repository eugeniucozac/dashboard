import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './RegisterClaimCardInformation.styles';
import * as utils from 'utils';
import {
  FormContainer,
  FormText,
  FormGrid,
  FormDate,
  FormLabel,
  FormAutocompleteMui,
  FormSelect,
  FormRadio,
  FormFields,
  FormLegend,
  ErrorMessage,
  Tooltip,
} from 'components';
import { ClaimsUploadViewSearchDocs, RegisterNewLossFixedBottomBar } from 'modules';
import { postEditClaimDetailsInformation, linkLossDocuments } from 'stores';
import { CLAIM_LOSS_DATE_DISABLED_QUALIFIERS, DMS_CONTEXT_CLAIM, DMS_DOCUMENT_TYPE_SECTION_KEYS } from 'consts';

// mui
import { makeStyles, Box, Typography } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
RegisterClaimCardInformationView.prototype = {
  claimantNames: PropTypes.array.isRequired,
  referralValues: PropTypes.array.isRequired,
  lossQualifiers: PropTypes.object,
  resetKey: PropTypes.number,
  hasClaimRef: PropTypes.bool.isRequired,
  claimsDocsList: PropTypes.array,
  parentLossRef: PropTypes.string,
  savedClaimInfo: PropTypes.object,
};

export function RegisterClaimCardInformationView({
  fields,
  referralValues,
  claimsDocsList,
  claimRefId,
  claimData,
  policyInformation,
  complexityValues,
  index,
  handleNext,
  handleSave,
  handleBack,
  activeStep,
  isAllStepsCompleted,
  lossQualifiers,
  handleFormStatus,
  lossInformation,
  parentLossRef,
  savedClaimInfo,
}) {
  const classes = makeStyles(styles, { name: 'RegisterClaimCardInformation' })();

  const dispatch = useDispatch();
  const claimCardRef = useRef();

  const [dateValidation, setDateValidation] = useState(false);
  const [refResponseDisable, setRefResponseDisable] = useState(true);
  const [refValuesDisable, setRefValueDisable] = useState(false);

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const {
    control,
    errors,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const lossQualifierID = watch('lossQualifierID');
  const complexValues = watch('complexity');
  const refValues = watch('referral');
  const firstUpdate = useRef(true);
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

  const submitLinkLossDocuments = () => {
    const lossRef = lossInformation?.lossRef;
    const activeClaimRefList = [];
    activeClaimRefList.push(claimRefId?.claimRef);
    dispatch(linkLossDocuments({ lossRef, activeClaimRefList }));
  };

  const handleSubmitForm = (values) => {
    submitLinkLossDocuments();
    dispatch(postEditClaimDetailsInformation(values)).then((response) => {
      if (response) {
        typeof response?.claimReference === 'string' && handleNext(index);
      }
    });
  };

  const handleSaveForm = () => {
    const values = getValues();
    dispatch(postEditClaimDetailsInformation(values)).then((response) => {
      if (response) handleSave();
    });
  };

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      // do things after first render
      if (!utils.generic.isInvalidOrEmptyArray(claimsDocsList)) {
        handleFormStatus();
      }
    }
  }, [claimsDocsList?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isDirty) {
      handleFormStatus();
    }
    if (Object.keys(errors)?.length > 0) claimCardRef?.current?.scrollIntoView();
  }, [isDirty, errors]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const dateDisabledLossQualifiers = lossQualifiers
      .filter((item) => CLAIM_LOSS_DATE_DISABLED_QUALIFIERS.find((itr) => itr === item.name))
      .map((item) => item.id);
    const isRequired = !dateDisabledLossQualifiers.includes(lossQualifierID);
    setDateValidation(!isRequired);
    if (!dateDisabledLossQualifiers.includes(lossQualifierID)) {
      const fromDate = lossInformation?.fromDate || savedClaimInfo?.lossFromDate;
      const toDate = lossInformation?.toDate || savedClaimInfo?.lossToDate;
      fromDate ? setValue('fromDate', fromDate) : setValue('fromDate', null);
      toDate ? setValue('toDate', toDate) : setValue('toDate', null);
    } else {
      setValue('fromDate', null);
      setValue('toDate', null);
    }
  }, [lossQualifierID]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (complexValues) {
      const getComplexityStatus =
        complexityValues.find((item) => item.complexityRulesID === complexValues?.complexityRulesID)?.complexityRulesValue ===
        'Referral Required';
      setRefValueDisable(getComplexityStatus);
      getRefValues(refValues);
    } else if (complexValues === null) {
      setRefValueDisable(false);
    }
  }, [complexValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const claimReceivedDate = errors?.claimReceivedDate ? { ...errors?.claimReceivedDate, message: '' } : null;
  const claimReceivedTime = errors?.claimReceivedTime ? { ...errors?.claimReceivedTime, message: '' } : null;

  return (
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box mb={4} flex="1 1 auto" className={classes.container} data-testid="register-claim-card-information" ref={claimCardRef}>
        <Box mt={4} mb={4}>
          <FormLegend text={utils.string.t('claims.claimInformation.title')} />

          <Box mt={-2.5}>
            <Typography variant="h5">{`${claimRefId?.claimReference || claimRefId?.claimRef} | ${policyInformation.policyRef} | ${
              policyInformation.insured
            }`}</Typography>
          </Box>
        </Box>

        <FormContainer data-testid="form-claimsCardInformation">
          <FormFields type="blank">
            <FormGrid container spacing={3}>
              <FormGrid item xs={12} sm={4}>
                <FormText
                  name="claimRefReadonly"
                  label={utils.string.t('claims.claimInformation.claimRef')}
                  value={(claimRefId?.claimReference || claimRefId?.claimRef) ?? utils.string.t('claims.claimInformation.autoGenerated')}
                  muiComponentProps={{
                    disabled: true,
                    readOnly: true,
                  }}
                />
              </FormGrid>

              <FormGrid item xs={12} sm={4}>
                <FormLabel
                  label={utils.string.t('claims.claimInformation.claimReceivedDateTime')}
                  nestedClasses={{ root: classes.dateTimeLabel }}
                />
                <FormGrid container spacing={2} alignItems="center">
                  <FormGrid item xs={7} sm={12} md={7}>
                    <FormDate {...utils.form.getFieldProps(fields, 'claimReceivedDate', control)} error={claimReceivedDate} />
                  </FormGrid>
                  <FormGrid item xs={5} sm={12} md={5} alignItems="center">
                    <Box className={classes.timeField}>
                      <Box className={classes.time}>
                        <FormText {...utils.form.getFieldProps(fields, 'claimReceivedTime', control)} error={claimReceivedTime} />
                      </Box>
                      <Tooltip title={utils.string.t('claims.claimInformation.receivedDateTooltipMessage')} block placement="bottom">
                        <InfoOutlinedIcon classes={{ root: classes.timeIcon }} />
                      </Tooltip>
                    </Box>
                  </FormGrid>
                  <ErrorMessage
                    error={errors?.claimReceivedDate || errors?.claimReceivedTime}
                    nestedClasses={{ root: classes.warningMessageDate }}
                  />
                </FormGrid>
              </FormGrid>

              <FormGrid item xs={12} sm={4}>
                <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'claimantName', control)} error={errors.claimantName} />
              </FormGrid>

              <FormGrid item xs={12} sm={4}>
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

              <FormGrid item xs={12} sm={4}>
                <FormDate
                  {...utils.form.getFieldProps(fields, 'toDate', control)}
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

              <FormGrid item xs={12} sm={4}>
                <FormSelect {...utils.form.getFieldProps(fields, 'lossQualifierID', control)} error={errors.lossQualifierID} />
              </FormGrid>

              <FormGrid item xs={12} sm={4}>
                <FormText {...utils.form.getFieldProps(fields, 'location', control)} error={errors.location} />
              </FormGrid>

              <FormGrid item xs={12} sm={4}>
                <FormText {...utils.form.getFieldProps(fields, 'fgunarrative', control)} error={errors.fgunarrative} />
              </FormGrid>

              <FormGrid item xs={12} sm={4}>
                <FormSelect {...utils.form.getFieldProps(fields, 'priority', control)} error={errors.priority} />
              </FormGrid>

              <FormGrid item xs={12} sm={4}>
                <FormRadio {...utils.form.getFieldProps(fields, 'adjuster', control)} />
              </FormGrid>

              {watch('adjuster') === 'beAdjuster' ? (
                <FormGrid item xs={12} sm={4}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'beAdjuster', control)} />
                </FormGrid>
              ) : (
                <FormGrid item xs={12} sm={4}>
                  <FormText {...utils.form.getFieldProps(fields, 'nonBeAdjuster', control)} error={errors.nonBeAdjuster} />
                </FormGrid>
              )}

              <FormGrid item xs={12} sm={4}>
                <FormText {...utils.form.getFieldProps(fields, 'adjusterReference', control)} error={errors.adjusterReference} />
              </FormGrid>

              <FormGrid item xs={12} sm={4}>
                <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'complexity', control)} error={errors.complexity} />
              </FormGrid>
              <FormGrid item xs={12} sm={4}>
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

              <FormGrid item xs={12} sm={4}>
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'rfiResponse', control)}
                  error={errors.rfiResponse}
                  muiComponentProps={{
                    disabled: refResponseDisable,
                  }}
                />
              </FormGrid>
            </FormGrid>
          </FormFields>
        </FormContainer>

        <Box mt={6}>
          <ClaimsUploadViewSearchDocs
            refData={claimData}
            refIdName={claimData?.claimRef ? 'claimRef' : 'claimReference'} //added temp condition as claimRef and claimReference keys are inconsistent, need to be fixed permanently later
            dmsContext={DMS_CONTEXT_CLAIM}
            documentTypeKey={DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
            isTabView={false}
            fnolViewOptions={{
              isClaimsFNOL: true,
              isClaimsUploadDisabled: !claimRefId?.claimRef && !claimRefId?.claimReference,
              claimsUploadWarningMsg:
                !claimRefId?.claimRef && !claimRefId?.claimReference ? utils.string.t('claims.claimInformation.dms.fileUploadWarning') : '',
              claimsSearchDocumentsTxt: utils.string.t('claims.claimInformation.dms.searchDocuments'),
              uploadDocumentsTitle: utils.string.t('claims.claimInformation.dms.uploadDocuments'),
            }}
            docList={claimsDocsList}
            parentLossRef={parentLossRef}
          />
        </Box>
      </Box>

      <Box flex="0 1 auto">
        <RegisterNewLossFixedBottomBar
          activeStep={activeStep}
          isAllStepsCompleted={isAllStepsCompleted}
          handleBack={() => {
            handleBack(index);
          }}
          handleSave={handleSaveForm}
          handleNextSubmit={handleSubmit(handleSubmitForm)}
          save={true}
        />
      </Box>
    </Box>
  );
}
