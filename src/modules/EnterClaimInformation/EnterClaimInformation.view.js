import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

//app
import { Layout } from 'components';
import {
  ClaimsFixedBottomBar,
  ClaimsUnderwritingGroups,
  ClaimsMovementType,
  EnterClaimCardInformation,
  ClaimsUploadViewSearchDocs,
} from 'modules';
import styles from './EnterClaimInformation.styles';
import * as utils from 'utils';
import * as constants from 'consts';

//mui
import { makeStyles, Grid, Box } from '@material-ui/core';

EnterClaimInformationView.propTypes = {
  policyInformation: PropTypes.object.isRequired,
  claimantNames: PropTypes.array.isRequired,
  interest: PropTypes.object.isRequired,
  underWritingGroups: PropTypes.object.isRequired,
  complexityValues: PropTypes.array.isRequired,
  referralValues: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  isBordereauFlag: PropTypes.bool.isRequired,
  isComplexFlag: PropTypes.bool.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  existingClaimInfo: PropTypes.object.isRequired,
  claimData: PropTypes.object.isRequired,
  hasClaimRef: PropTypes.bool.isRequired,
  currencies: PropTypes.array.isRequired,
  resetKey: PropTypes.number,
  uwResetKey: PropTypes.number,
  isBordereauChecked: PropTypes.bool.isRequired,
  claimsDocsList: PropTypes.array,
};

export function EnterClaimInformationView(props) {
  const {
    policyInformation,
    claimantNames,
    interest,
    underWritingGroups,
    complexityValues,
    referralValues,
    fields,
    isBordereauFlag,
    isComplexFlag,
    handleNext,
    handleSave,
    handleCancel,
    handleBack,
    validation,
    setValidation,
    existingClaimInfo,
    hasClaimRef,
    currencies,
    resetKey,
    uwResetKey,
    isBordereauChecked,
    claimData,
    claimsDocsList,
  } = props;

  const classes = makeStyles(styles, { name: 'EnterClaimInformation' })();
  const [isSaving, setIsSaving] = useState(false);
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const claimForm = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema), context: { validation } }),
  });
  const { handleSubmit, setValue } = claimForm;
  const onHandleSave = () => {
    setIsSaving(true);
    setValidation(false);
  };

  useEffect(() => {
    if (validation) {
      handleSubmit(handleNext)();
    }
    setValidation(false);
  }, [validation]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isSaving) {
      handleSubmit(handleSave)();
      setIsSaving(false);
    }
    if (underWritingGroups.percentageOfSelected) {
      setValue('orderPercentage', underWritingGroups.percentageOfSelected);
    } else {
      setValue('order', '100');
    }
  }, [isSaving, underWritingGroups]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className={classes.wrapper}>
        <Layout main padding>
          <Box className={classes.claimsContainer}>
            <Grid container spacing={2}>
              <>
                <Grid item xs={12}>
                  <EnterClaimCardInformation
                    resetKey={resetKey}
                    policyInformation={policyInformation}
                    claimantNames={claimantNames}
                    interest={interest}
                    fields={fields}
                    claimForm={claimForm}
                    complexityValues={complexityValues}
                    referralValues={referralValues}
                    isBordereauFlag={isBordereauFlag}
                    isComplexFlag={isComplexFlag}
                    existingClaimInfo={existingClaimInfo}
                    currencies={currencies}
                    isBordereauChecked={isBordereauChecked}
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <ClaimsUnderwritingGroups fields={fields} claimForm={claimForm} uwResetKey={uwResetKey} hasClaimRef={hasClaimRef} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <ClaimsMovementType
                    fields={fields}
                    claimForm={claimForm}
                    underWritingGroups={underWritingGroups}
                    enforceValueSet={true}
                  />
                </Grid>
              </>
            </Grid>
          </Box>
          <Box className={classes.claimsContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {hasClaimRef && (
                  <ClaimsUploadViewSearchDocs
                    refData={claimData}
                    refIdName={claimData?.claimRef ? 'claimRef' : 'claimReference'} //added temp condition as claimRef and claimReference keys are inconsistent, need to be fixed permanently later
                    dmsContext={constants.DMS_CONTEXT_CLAIM}
                    documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
                    isTabView={false}
                    fnolViewOptions={{
                      isClaimsFNOL: true,
                      isClaimsUploadDisabled: !hasClaimRef,
                      claimsUploadWarningMsg: !hasClaimRef ? utils.string.t('claims.claimInformation.dms.fileUploadWarning') : '',
                      claimsSearchDocumentsTxt: utils.string.t('claims.claimInformation.dms.searchDocuments'),
                      uploadDocumentsTitle: utils.string.t('claims.claimInformation.dms.uploadDocuments'),
                    }}
                    docList={claimsDocsList}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </Layout>
      </div>
      <ClaimsFixedBottomBar
        {...props}
        onSave={onHandleSave}
        handleNextSubmit={() => setValidation(true)}
        handleBack={handleBack}
        handleCancel={handleCancel}
        save={true}
        next={true}
      />
    </>
  );
}
