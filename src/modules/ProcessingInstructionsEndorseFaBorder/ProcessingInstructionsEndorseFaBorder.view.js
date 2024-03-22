import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import isEqual from 'lodash/isEqual';
import config from 'config';

//app
import styles from './ProcessingInstructionsEndorseFaBorder.styles';
import stylesParent from '../../pages/ProcessingInstructionsSteps/ProcessingInstructionsSteps.styles';
import {
  Button,
  FormContainer,
  FormGrid,
  FormFields,
  FormSelect,
  FormRadio,
  FormCheckbox,
  FormText,
  FormDate,
  Info,
  SaveBar,
  Tabs,
  PreventNavigation,
  Sticky,
} from 'components';
import { ProcessingInstructionsRiskRefTabTable } from 'modules';
import * as utils from 'utils';
import * as constants from 'consts';
import { useMedia } from 'hooks';

// mui
import { Box, Typography, makeStyles, Divider, useTheme } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const ProcessingInstructionsEndorseFaBorderView = forwardRef(
  (
    {
      instruction,
      leadRef,
      tabs,
      selectedTab,
      fields,
      defaultValues,
      isEndorsement,
      isBordereau,
      isFeeAndAmendment,
      isReadOnly,
      isSubmittedProcessing,
      isRiskReferenceDocumentCountLoading,
      handlers,
    },
    ref
  ) => {
    const classes = makeStyles(styles, { name: 'ProcessingInstructionsEndorseFaBorder' })();
    const classesParent = makeStyles(stylesParent)();
    const media = useMedia();
    const theme = useTheme();

    const validationSchema = utils.form.getValidationSchema(fields);
    const { control, errors, reset, watch, setValue } = useForm({
      defaultValues,
      ...(validationSchema && { resolver: yupResolver(validationSchema) }),
    });

    const notesField = utils.form.getFieldProps(fields, 'notes', control);
    const ppwOrPpcField = utils.form.getFieldProps(fields, 'ppwOrPpc', control);

    const formValues = watch();
    const isPageEdited = !isEqual(defaultValues, formValues);

    const documentTypeKey = isEndorsement
      ? constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement
      : isBordereau || isFeeAndAmendment
      ? constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piFABorder
      : '';

    const stickyParent = media.tabletUp ? utils.app.getElement('#content') : null;
    const stickyOffset = media.tabletUp ? 0 : theme.mixins.header.height;

    return (
      <Box width={1} mt={5} data-testid="processing-instructions-endore-fa-border">
        <Sticky parent={stickyParent} top={stickyOffset} nestedClasses={{ root: classes.sticky, rootSticky: classes.stickyActive }}>
          <Tabs tabs={tabs} defaultTab={selectedTab} onChange={handlers.toggleTab} />
        </Sticky>
        <FormContainer ref={ref} resetFunc={reset} values={formValues} data-testid="form-processing-instructions-endore-fa-border">
          <FormFields>
            <div style={{ display: selectedTab === 'processing-instruction' ? 'block' : 'none' }}>
              <Box pt={2} pb={4}>
                <FormGrid container spacing={4}>
                  <FormGrid item xs={6} md={3}>
                    <Info title={utils.string.t('processingInstructions.leadRiskRef')} description={leadRef ? leadRef.riskRefId : '-'} />
                  </FormGrid>
                  <FormGrid item xs={6} md={3}>
                    <Info title={utils.string.t('app.department')} description={leadRef ? leadRef.departmentName : '-'} />
                  </FormGrid>
                  <FormGrid item xs={6} md={3}>
                    <Info
                      title={utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.reInsuredOrCoverHolder')}
                      description={leadRef ? leadRef.assuredName : '-'}
                    />
                  </FormGrid>
                  <FormGrid item xs={6} md={3}>
                    <Info title={utils.string.t('app.yearOfAccounts')} description={leadRef ? leadRef.yoa : '-'} />
                  </FormGrid>
                  {!isBordereau && (
                    <>
                      <FormGrid item xs={6} md={3}>
                        <Info title={utils.string.t('app.inceptionDate')} description={leadRef ? leadRef.inceptionDate : '-'} />
                      </FormGrid>
                      <FormGrid item xs={6} md={3}>
                        <Info title={utils.string.t('app.expiryDate')} description={leadRef ? leadRef.expiryDate : '-'} />
                      </FormGrid>
                    </>
                  )}
                  {(isEndorsement || isFeeAndAmendment) && (
                    <FormGrid item xs={6} md={3}>
                      <Info
                        title={utils.string.t('processingInstructions.endorsementReference')}
                        description={leadRef ? leadRef.endorsementNumber : '-'}
                      />
                    </FormGrid>
                  )}
                </FormGrid>
              </Box>

              <Divider />

              <Box py={4}>
                <FormGrid container>
                  <FormGrid item xs={12} sm={6}>
                    <FormSelect {...utils.form.getFieldProps(fields, 'frontEndContactId', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={12} sm={6}>
                    {isFeeAndAmendment ? (
                      <FormSelect {...utils.form.getFieldProps(fields, 'producingBrokerId', control, errors)} />
                    ) : (
                      <FormSelect {...utils.form.getFieldProps(fields, 'accountExecutiveId', control, errors)} />
                    )}
                  </FormGrid>
                  {isBordereau && (
                    <>
                      <FormGrid item xs={12} sm={6}>
                        <FormSelect {...utils.form.getFieldProps(fields, 'bordereauPolicyTypeId', control, errors)} />
                      </FormGrid>
                      <FormGrid item xs={12} sm={6}>
                        <FormDate
                          {...utils.form.getFieldProps(fields, 'bordereauPeriod', control, errors)}
                          nestedClasses={{ rootDatepicker: classes.datepicker }}
                        />
                      </FormGrid>
                    </>
                  )}
                </FormGrid>
              </Box>

              <Divider />

              <Box py={4}>
                <FormGrid container spacing={4}>
                  {isFeeAndAmendment && (
                    <FormGrid item xs={6} md={3}>
                      <Box display="flex" direction="column">
                        <FormRadio
                          {...utils.form.getFieldProps(fields, 'feeOrAmendment', control)}
                          muiFormGroupProps={{ nestedClasses: classes.radioGroup }}
                        />
                      </Box>
                    </FormGrid>
                  )}
                  {isBordereau && (
                    <FormGrid item xs={6} md={3}>
                      <Box>
                        <FormRadio
                          {...utils.form.getFieldProps(fields, 'bordereauTypeId', control)}
                          muiFormGroupProps={{ nestedClasses: classes.radioGroup }}
                        />
                      </Box>
                    </FormGrid>
                  )}
                  <FormGrid item xs={6} md={isFeeAndAmendment || isBordereau ? 3 : 6}>
                    {(isEndorsement || isFeeAndAmendment) && (
                      <FormCheckbox
                        {...utils.form.getFieldProps(fields, 'isNonPremium', control)}
                        nestedClasses={{ root: classes.checkboxGroup }}
                      />
                    )}
                    <FormCheckbox
                      {...utils.form.getFieldProps(fields, 'frontEndSendDocs', control)}
                      nestedClasses={{ root: classes.checkboxGroup }}
                    />
                    <FormCheckbox
                      {...utils.form.getFieldProps(fields, 'highPriority', control)}
                      nestedClasses={{ root: classes.checkboxGroup }}
                    />
                    {isEndorsement && (
                      <>
                        <FormCheckbox
                          {...ppwOrPpcField}
                          nestedClasses={{ root: classes.checkboxGroup }}
                          muiComponentProps={{
                            ...ppwOrPpcField.muiComponentProps,
                            onChange: (name, value) => {
                              setValue('highPriority', value);
                            },
                          }}
                        />
                        {ppwOrPpcField?.displayError && (
                          <Typography className={classes.errorMessage}>
                            {utils.string.t('processingInstructions.details.warrantyErrorMessage')}
                          </Typography>
                        )}
                      </>
                    )}
                  </FormGrid>
                  <FormGrid item xs={12} md={6}>
                    <FormText
                      {...notesField}
                      muiComponentProps={{
                        ...notesField.muiComponentProps,
                        InputProps: {
                          classes: {
                            root: classes.textarea,
                          },
                        },
                      }}
                    />
                  </FormGrid>
                </FormGrid>
              </Box>
            </div>
            {selectedTab === 'documents' && (
              <Box>
                <ProcessingInstructionsRiskRefTabTable instruction={instruction} documentTypeKey={documentTypeKey} />
              </Box>
            )}
          </FormFields>
        </FormContainer>

        <SaveBar show nestedClasses={{ root: classesParent.saveBar }}>
          <Box display="flex" justifyContent="space-between">
            <Box flex="1 1 auto" textAlign="left">
              <Button
                text={utils.string.t('app.back')}
                onClick={handlers.back}
                disabled={isPageEdited}
                size="small"
                color="primary"
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
                text={utils.string.t('app.submit')}
                onClick={handlers.submit}
                disabled={isSubmittedProcessing || isReadOnly || isRiskReferenceDocumentCountLoading}
                color="primary"
                size="small"
                nestedClasses={{ btn: classesParent.button }}
              />
            </Box>
          </Box>
        </SaveBar>
        <PreventNavigation
          dirty={isPageEdited}
          allowedUrls={[
            `${config.routes.processingInstructions.steps}/${instruction?.id}/`,
            `${config.routes.processingInstructions.steps}/${instruction?.id}/processing-instruction/processing-instruction`,
            `${config.routes.processingInstructions.steps}/${instruction?.id}/processing-instruction/documents`,
          ]}
        />
      </Box>
    );
  }
);

ProcessingInstructionsEndorseFaBorderView.propTypes = {
  instruction: PropTypes.object.isRequired,
  leadRef: PropTypes.object.isRequired,
  tabs: PropTypes.array,
  selectedTab: PropTypes.string,
  fields: PropTypes.array,
  defaultValues: PropTypes.object.isRequired,
  isEndorsement: PropTypes.bool,
  isBordereau: PropTypes.bool,
  isFeeAndAmendment: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isSubmittedProcessing: PropTypes.bool,
  isRiskReferenceDocumentCountLoading: PropTypes.bool,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    toggleTab: PropTypes.func.isRequired,
  }).isRequired,
};

export default ProcessingInstructionsEndorseFaBorderView;
