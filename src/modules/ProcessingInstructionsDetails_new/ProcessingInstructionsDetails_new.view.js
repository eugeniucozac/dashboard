import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import config from 'config';
import isEqual from 'lodash/isEqual';

// app
import styles from './ProcessingInstructionsDetails_new.styles';
import stylesParent from '../../pages/ProcessingInstructionsSteps/ProcessingInstructionsSteps.styles';
import {
  Button,
  FormFields,
  FormGrid,
  FormText,
  FormLabel,
  FormCheckbox,
  FormContainer,
  FormToggle,
  SaveBar,
  Link,
  PreventNavigation,
  FormFileDrop,
  EditableTable,
} from 'components';
import * as utils from 'utils';
import { useMedia } from 'hooks';
import * as constants from 'consts';

// mui
import { Box, Divider, Typography, makeStyles } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const ProcessingInstructionsDetailsView = forwardRef(
  (
    { documents, fields, defaultValues, isTableGridEdited, tableRows, tableFields, isEditable, instructionId, isReadOnly, handlers },
    ref
  ) => {
    const classes = makeStyles(styles, { name: 'ProcessingInstructionsDetails' })();
    const classesParent = makeStyles(stylesParent)();

    const { mobile, tablet, desktop, wide, extraWide, desktopUp } = useMedia();

    const { watch, reset, control, register } = useForm({ defaultValues });
    const formValues = watch();

    const defaultValuesToString = Object.entries(defaultValues).reduce((acc, [key, value]) => {
      return { ...acc, [key]: value?.toString() || '' };
    }, {});

    const formValuesToString = Object.entries(formValues).reduce((acc, [key, value]) => {
      return { ...acc, [key]: value?.toString() || '' };
    }, {});

    // we have to force values toString otherwise we can't compare
    // string values returned from API with numeric values from form, or vice-versa
    const isPageEdited = !isEqual(defaultValuesToString, formValuesToString) || isTableGridEdited;

    const premiumTaxDocument = documents?.premiumTaxDocument;
    const signedLinesDocument = documents?.signedLinesDocument;
    const premiumTaxCalculationSheetAttached = formValues?.premiumTaxCalculationSheetAttachedNumber;
    const signedLinesCalculationSheetAttached = formValues?.signedLinesCalculationSheetAttachedNumber;

    const documentTitleLength = mobile ? 10 : tablet ? 15 : desktop ? 25 : wide ? 30 : extraWide ? 35 : 40;
    const getEllipsisDocName = (docName) => {
      if (docName.length > documentTitleLength) return `${docName && docName.slice(0, documentTitleLength).trim()}...`;
      else return docName;
    };

    return (
      <Box width={1} mt={5} data-testid="processing-instruction-details">
        <FormContainer ref={ref} resetFunc={reset} values={formValues} data-testid="form-processing-instructions-details">
          <FormFields>
            <Box py={1.5}>
              <FormGrid container direction="row">
                <FormGrid item xs={8} sm={9} md={10}>
                  <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.details.piAllRiskRefs')}</Typography>
                </FormGrid>
                <FormGrid item xs={4} sm={3} md={2}>
                  <Typography className={classes.subTitle}>
                    {utils.string.t('processingInstructions.details.authorisedSignatory')}
                  </Typography>
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container>
                <FormGrid item>
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'highPriority', control)} />
                </FormGrid>
                <FormGrid item>
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'frontEndSendDocs', control)} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center" direction="row">
                    <FormGrid item xs={12} md={6}>
                      <FormGrid container alignItems="center">
                        <FormGrid item xs={12} md={6}>
                          <FormLabel
                            label={utils.string.t('processingInstructions.details.premiumTaxCalculationSheetAttached')}
                            align={desktopUp ? 'right' : 'left'}
                          />
                        </FormGrid>
                        <FormGrid item xs={12} md={6}>
                          <FormToggle {...utils.form.getFieldProps(fields, 'premiumTaxCalculationSheetAttachedNumber', control)} />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                      <FormGrid container alignItems="center" spacing={1}>
                        <FormGrid item>
                          {isEditable && premiumTaxCalculationSheetAttached === 1 && !premiumTaxDocument && (
                            <FormGrid item>
                              <FormFileDrop
                                name="file"
                                attachedFiles=""
                                showUploadPreview={false}
                                showButton={false}
                                componentProps={{
                                  multiple: false,
                                }}
                                dragLabel={utils.string.t('dms.upload.fileUploadTitleCombine')}
                                onChange={handlers.uploadPremiumTaxSignedLinesModal(
                                  constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation
                                )}
                              />
                            </FormGrid>
                          )}
                          {premiumTaxDocument && premiumTaxCalculationSheetAttached === 1 && (
                            <FormGrid item>
                              <FormGrid container spacing={1} alignItems="center" direction="row">
                                <FormGrid item>
                                  <Link
                                    color="secondary"
                                    text={getEllipsisDocName(premiumTaxDocument?.name)}
                                    tooltip={
                                      premiumTaxDocument?.name.length > documentTitleLength ? { title: premiumTaxDocument?.name } : null
                                    }
                                    handleClick={() => {
                                      handlers.download(premiumTaxDocument);
                                    }}
                                  />
                                </FormGrid>
                                {isEditable && (
                                  <FormGrid item>
                                    <Button
                                      icon={HighlightOffIcon}
                                      variant="text"
                                      danger
                                      tooltip={{ title: utils.string.t('app.remove') }}
                                      size="small"
                                      onClick={() => {
                                        handlers.confirmRemoveDocumentModal(
                                          premiumTaxDocument,
                                          constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation
                                        );
                                      }}
                                    />
                                  </FormGrid>
                                )}
                              </FormGrid>
                            </FormGrid>
                          )}
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox
                    {...utils.form.getFieldProps(fields, 'premiumTaxCalculationSheetAttachedCheckbox', control)}
                    register={register}
                  />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center" direction="row">
                    <FormGrid item xs={12} md={6}>
                      <FormGrid container alignItems="center">
                        <FormGrid item xs={12} md={6}>
                          <FormLabel
                            label={utils.string.t('processingInstructions.details.signedLinesCalculationAttached')}
                            align={desktopUp ? 'right' : 'left'}
                          />
                        </FormGrid>
                        <FormGrid item xs={12} md={6}>
                          <FormToggle {...utils.form.getFieldProps(fields, 'signedLinesCalculationSheetAttachedNumber', control)} />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                      <FormGrid container alignItems="center" spacing={1}>
                        <FormGrid item>
                          {isEditable && signedLinesCalculationSheetAttached === 1 && !signedLinesDocument && (
                            <FormGrid item>
                              <FormFileDrop
                                name="file"
                                attachedFiles=""
                                showUploadPreview={false}
                                showButton={false}
                                componentProps={{
                                  multiple: false,
                                }}
                                dragLabel={utils.string.t('dms.upload.fileUploadTitleCombine')}
                                onChange={handlers.uploadPremiumTaxSignedLinesModal(
                                  constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned
                                )}
                              />
                            </FormGrid>
                          )}
                          {signedLinesDocument && signedLinesCalculationSheetAttached === 1 && (
                            <FormGrid item>
                              <FormGrid container spacing={1} alignItems="center" direction="row">
                                <FormGrid item>
                                  <Link
                                    color="secondary"
                                    text={getEllipsisDocName(signedLinesDocument?.name)}
                                    tooltip={
                                      signedLinesDocument?.name.length > documentTitleLength ? { title: signedLinesDocument?.name } : null
                                    }
                                    handleClick={() => {
                                      handlers.download(signedLinesDocument);
                                    }}
                                  />
                                </FormGrid>
                                {isEditable && (
                                  <FormGrid item>
                                    <Button
                                      icon={HighlightOffIcon}
                                      variant="text"
                                      danger
                                      tooltip={{ title: utils.string.t('app.remove') }}
                                      size="small"
                                      onClick={() => {
                                        handlers.confirmRemoveDocumentModal(
                                          signedLinesDocument,
                                          constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned
                                        );
                                      }}
                                    />
                                  </FormGrid>
                                )}
                              </FormGrid>
                            </FormGrid>
                          )}
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>

                <FormGrid item xs={2} align="center">
                  <FormCheckbox
                    {...utils.form.getFieldProps(fields, 'signedLinesCalculationSheetAttachedCheckbox', control)}
                    register={register}
                  />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={2}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={5}>
                  <Typography className={classes.subTitle}>
                    {utils.string.t('processingInstructions.details.piDetailsAllRiskFacilityRef')}
                  </Typography>
                </FormGrid>
                <FormGrid item align="center" xs={5}>
                  {isEditable && (
                    <Link
                      color="secondary"
                      text={utils.string.t('processingInstructions.details.uploadFinancialGridData')}
                      handleClick={() => handlers.uploadExcelData()}
                    />
                  )}
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'financialGridCheckbox', control)} register={register} />
                </FormGrid>
              </FormGrid>
            </Box>
            <Box py={1.5}>
              <EditableTable
                tableRows={tableRows}
                fields={tableFields}
                isTableEditable={!isReadOnly}
                handlers={{
                  handleTableTextboxChange: handlers.handleTableTextboxChange,
                  handleTableRowClick: handlers.handleTableRowClick,
                  handleTableSelectChange: handlers.handleTableSelectChange,
                  handleTableDatePickerChange: handlers.handleTableDatePickerChange,
                  handleTableCopyRowData: handlers.handleTableCopyRowData,
                  handleTableUndoRowData: handlers.handleTableUndoRowData,
                }}
              />
            </Box>
            <Divider />

            <Box pt={4} pb={1}>
              <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.details.specialInstructions')}</Typography>
            </Box>

            <Divider />
            <Box pt={4}>
              <FormGrid container>
                <FormGrid item xs={12} md={5}>
                  <Box mb={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'notes', control)} />
                  </Box>
                </FormGrid>
              </FormGrid>
            </Box>
          </FormFields>
        </FormContainer>

        <SaveBar show nestedClasses={{ root: classesParent.saveBar }}>
          <Box display="flex" justifyContent="space-between">
            <Box flex="1 1 auto" textAlign="left">
              <Button
                text={utils.string.t('app.back')}
                onClick={handlers.back}
                disabled={isPageEdited}
                color="primary"
                size="small"
                variant="outlined"
                icon={NavigateBeforeIcon}
                iconPosition="left"
                nestedClasses={{ btn: classesParent.button }}
              />
            </Box>
            <Box flex="1 1 auto" textAlign="right">
              {isPageEdited && (
                <>
                  <Button
                    text={utils.string.t('app.cancel')}
                    onClick={handlers.cancel}
                    color="primary"
                    size="small"
                    variant="text"
                    nestedClasses={{ btn: classesParent.button }}
                  />
                  <Button
                    text={utils.string.t('app.save')}
                    onClick={handlers.save}
                    color="secondary"
                    size="small"
                    variant="outlined"
                    nestedClasses={{ btn: classesParent.button }}
                  />
                </>
              )}
              <Button
                text={utils.string.t('app.next')}
                onClick={handlers.next}
                disabled={isPageEdited}
                color="primary"
                size="small"
                icon={NavigateNextIcon}
                iconPosition="right"
                nestedClasses={{ btn: classesParent.button }}
              />
            </Box>
          </Box>
        </SaveBar>
        <PreventNavigation dirty={isPageEdited} allowedUrls={[`${config.routes.processingInstructions.steps}/${instructionId}/`]} />
      </Box>
    );
  }
);

ProcessingInstructionsDetailsView.propTypes = {
  documents: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  defaultValues: PropTypes.object.isRequired,
  isTableGridEdited: PropTypes.object.isRequired,
  tableRows: PropTypes.array.isRequired,
  tableFields: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  instructionId: PropTypes.number.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    getRetainedBrokerageAmount: PropTypes.func.isRequired,
    getTotalAmount: PropTypes.func.isRequired,
    uploadPremiumTaxSignedLinesModal: PropTypes.func.isRequired,
    confirmRemoveDocumentModal: PropTypes.func.isRequired,
    download: PropTypes.func.isRequired,
    uploadExcelData: PropTypes.func.isRequired,
  }).isRequired,
};

export default ProcessingInstructionsDetailsView;
