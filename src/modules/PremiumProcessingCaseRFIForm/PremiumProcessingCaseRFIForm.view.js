import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import {
  Button,
  ContentHeader,
  DmsTable,
  FormContainer,
  FormFields,
  FormGrid,
  FormText,
  FormActions,
  FormRadio,
  FormAutocompleteMui,
  Info,
  PreventNavigation,
  Tabs,
  Warning,
} from 'components';
import { useFormActions } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { Box, Grid } from '@material-ui/core';

PremiumProcessingCaseRFIFormView.prototype = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  caseDetails: PropTypes.object,
  dms: PropTypes.shape({
    context: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired,
  }).isRequired,
  dmsTabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  documents: PropTypes.array.isRequired,
  selectedDmsTab: PropTypes.string.isRequired,
  isCheckSigning: PropTypes.bool,
  isEditable: PropTypes.bool,
  isPageDirty: PropTypes.bool.isRequired,
  tabDetails: PropTypes.bool,
  isNotResolvedOrSendToFECValue: PropTypes.bool,
  isSeniorManager: PropTypes.bool,
  isRejectPendingActionStage: PropTypes.bool,
  handlers: PropTypes.shape({
    getResponseDate: PropTypes.func.isRequired,
    stayOnTab: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired,
    setIsPageDirty: PropTypes.func.isRequired,
    selectTab: PropTypes.func.isRequired,
    selectDmsTab: PropTypes.func.isRequired,
    onSelectDmsFile: PropTypes.func.isRequired,
  }),
};

export default function PremiumProcessingCaseRFIFormView({
  fields,
  actions,
  caseDetails,
  dms,
  dmsTabs,
  documents,
  selectedDmsTab,
  isCheckSigning,
  isEditable,
  isPageDirty,
  tabDetails,
  isSeniorManager,
  isNotResolvedOrSendToFECValue,
  isRejectPendingActionStage,
  handlers,
}) {
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, errors, handleSubmit, watch, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions);

  const values = watch();
  const isReadyToSubmit = values.queryDescription && values.sendTo && values.queryCode;
  const isReadyToSubmitCheckSigning =
    values.bureauQueryDescription &&
    values.queryCodeBureau &&
    ((values.sendTo && values.resolutionNotesFEC) || (values.resolutionCode && values.resolutionNotes));

  const bureauDetails = caseDetails?.bureauRfiDetails;

  useEffect(() => {
    handlers.setIsPageDirty(formState.isDirty);
  }, [formState.isDirty]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <FormContainer>
        <FormFields>
          <FormGrid item xs={6} md={3}>
            <FormRadio {...utils.form.getFieldProps(fields, 'rfiType', control)} muiFormGroupProps={{ row: true }} />
          </FormGrid>

          {isCheckSigning && (
            <>
              <ContentHeader title={utils.string.t('premiumProcessing.rfi.details')} />
              <>
                {bureauDetails && (
                  <Box pt={2} pb={4}>
                    <FormGrid container spacing={4}>
                      <Grid item xs={3}>
                        <Info title={utils.string.t('premiumProcessing.caseDetailsSection.workPackageRef')} />
                        {bureauDetails?.workPackageReference}
                      </Grid>
                      <Grid item xs={3}>
                        <Info title={utils.string.t('premiumProcessing.checkSigningCase.bureauList')} />
                        {bureauDetails?.bureauName}
                      </Grid>
                      <Grid item xs={3}>
                        <Info title={utils.string.t('processingInstructions.riskReference')} />
                        {bureauDetails?.policyRef}
                      </Grid>
                    </FormGrid>
                  </Box>
                )}
              </>
              <FormGrid item xs={12} md={6}>
                <FormText {...utils.form.getFieldProps(fields, 'bureauQueryDescription', control, errors)} />
              </FormGrid>

              <FormGrid item xs={6} md={3}>
                <FormRadio {...utils.form.getFieldProps(fields, 'chooseAction', control, errors)} muiFormGroupProps={{ row: true }} />
              </FormGrid>
              <FormGrid container spacing={4}>
                {values.chooseAction === constants.SEND_TO_FEC && (
                  <FormGrid item xs={12} sm={6}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'sendTo', control, errors)} />
                  </FormGrid>
                )}
                {values.chooseAction === constants.RESOLVE && (
                  <FormGrid item xs={12} sm={6}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'resolutionCode', control, errors)} />
                  </FormGrid>
                )}
                <FormGrid item xs={8} sm={4}>
                  <FormAutocompleteMui
                    {...utils.form.getFieldProps(fields, 'queryCodeBureau', control, errors)}
                    callback={(event, option) => {
                      handlers.getResponseDate(option);
                    }}
                  />
                </FormGrid>
                <FormGrid item xs={4} sm={2}>
                   <FormText {...utils.form.getFieldProps(fields, 'responseDate')} />
                </FormGrid>
              </FormGrid>
              {values.chooseAction === constants.RESOLVE && (
                <FormGrid item xs={12} md={6}>
                  <FormText {...utils.form.getFieldProps(fields, 'resolutionNotes', control, errors)} />
                </FormGrid>
              )}
              {values.chooseAction === constants.SEND_TO_FEC && (
                <FormGrid item xs={12} md={6}>
                  <FormText {...utils.form.getFieldProps(fields, 'resolutionNotesFEC', control, errors)} />
                </FormGrid>
              )}
            </>
          )}

          {!isCheckSigning && (
            <>
              <FormGrid container spacing={4}>
                <FormGrid item xs={12} sm={6}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'sendTo', control, errors)} />
                </FormGrid>
                <FormGrid item xs={8} sm={4}>
                  <FormAutocompleteMui
                    {...utils.form.getFieldProps(fields, 'queryCode', control, errors)}
                    callback={(event, option) => {
                      handlers.getResponseDate(option);
                    }}
                  />
                </FormGrid>
                <FormGrid item xs={4} sm={2}>
                  <FormText {...utils.form.getFieldProps(fields, 'responseDate')} />
                </FormGrid>
              </FormGrid>
              <FormGrid item xs={12} md={8}>
                <FormText {...utils.form.getFieldProps(fields, 'queryDescription', control, errors)} />
              </FormGrid>
            </>
          )}
        </FormFields>
      </FormContainer>

      <>
        <ContentHeader title={utils.string.t('app.attachDocuments')} subtitle={`(${utils.string.t('app.optional')})`} marginBottom={3} />
        <Tabs tabs={dmsTabs} value={selectedDmsTab} onChange={(tabName) => handlers.selectDmsTab(tabName)} />
        {selectedDmsTab === constants.DMS_VIEW_TAB_VIEW && (
          <>
            {((isEditable && utils.generic.isValidArray(documents, true) && !tabDetails) || (isNotResolvedOrSendToFECValue && !isSeniorManager && !isRejectPendingActionStage)) && (
              <Box display="flex" justifyContent="center" mt={3} mb={1}>
                <Warning type="info" icon border text={utils.string.t('premiumProcessing.rfi.linkToRfi')} />
              </Box>
            )}
            <DmsTable
              {...dms}
              showHeader={false}
              canSearch={false}
              canUpload={(isNotResolvedOrSendToFECValue && !isSeniorManager && !isRejectPendingActionStage) ?  true : isEditable}
              canUnlink={false}
              canDelete={false}
              columnsData={documents}
              handlers={{
                onSelectFile: handlers.onSelectDmsFile,
              }}
            />
          </>
        )}
      </>
      {(isEditable || (isNotResolvedOrSendToFECValue && !isSeniorManager)) && (
        <>
          <FormActions>
            {cancel && (
              <Button
                text={cancel.label}
                variant="text"
                disabled={!formState.isDirty || formState.isSubmitting}
                onClick={() => cancel.handler(reset)}
              />
            )}
            {submit && (
              <Button
                text={values.chooseAction === constants.SEND_TO_FEC ? utils.string.t('premiumProcessing.rfi.sendRFI') : submit.label}
                type="submit"
                color="primary"
                disabled={isCheckSigning ? !isReadyToSubmitCheckSigning : !isReadyToSubmit}
                onClick={handleSubmit(submit.handler(reset))}
              />
            )}
          </FormActions>
          <PreventNavigation dirty={isPageDirty} cancelLabel="app.cancel" confirmLabel="app.yes" />
        </>
      )}
    </>
  );
}
