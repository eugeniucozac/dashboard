import React from 'react';
import PropTypes from 'prop-types';
//app
import * as utils from 'utils';
import {
  Button,
  FormContainer,
  FormFields,
  FormGrid,
  FormAutocompleteMui,
  FormSelect,
  FormText,
  FormLabel,
  FormDate,
  FormActions,
} from 'components';
import { ClaimsUploadViewSearchDocs, DetailsCard } from 'modules';
import * as constants from 'consts';
import { useFormActions } from 'hooks';
import styles from './CreateAdHocTask.styles';

//mui
import { makeStyles, Typography } from '@material-ui/core';

CreateAdHocTaskView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  docsPromptActions: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.object.isRequired,
  reset: PropTypes.object.isRequired,
  claimRef: PropTypes.string.isRequired,
  taskDetails: PropTypes.string.isRequired,
  resetKey: PropTypes.number,
  additionalResetKey: PropTypes.number,
  isEditFlag: PropTypes.bool,
  adHocTaskData: PropTypes.object,
  isTaskSubmitted: PropTypes.bool,
  isUploadDocuments: PropTypes.bool,
  handlers: PropTypes.shape({
    onClosingUploadModal: PropTypes.func,
  }),
};

export function CreateAdHocTaskView({
  actions,
  fields,
  control,
  errors,
  formState,
  handleSubmit,
  reset,
  claimRef,
  taskDetails,
  resetKey,
  additionalResetKey,
  isEditFlag,
  adHocTaskData,
  isTaskSubmitted,
  docsPromptActions,
  isUploadDocuments,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'CreateAdHocTask' })();
  const { secondary, submit } = useFormActions(actions, reset);
  const { yes: uploadYes, no: uploadNo } = docsPromptActions;
  return (
    <div>
      <FormContainer onSubmit={handleSubmit} data-testid="form-edit-loss-information">
        <FormFields type="dialog">
          <Typography variant="h5" className={classes.sectionheader}>
            {utils.string.t('claims.processing.taskFunctionalityTabs.taskDetails')}
          </Typography>
          <FormGrid container spacing={2}>
            <FormGrid item xs={12}>
              <DetailsCard title={utils.string.t('claims.processing.taskDetailsLabels.claimRef')} details={claimRef} />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormText {...utils.form.getFieldProps(fields, 'taskName', control)} error={errors.taskName} />
            </FormGrid>
            <FormGrid item xs={6} nestedClasses={{ root: classes.assigneeItem }}>
              <FormSelect
                {...utils.form.getFieldProps(fields, 'priority', control)}
                error={errors.priority}
                nestedClasses={{ root: classes.catCodeSelect }}
              />
            </FormGrid>
            {utils.generic.isValidObject(taskDetails) && taskDetails !== null && (
              <FormGrid item xs={6} nestedClasses={{ root: classes.assigneeItem }}>
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'status', control)}
                  error={errors.status}
                  nestedClasses={{ root: classes.catCodeSelect }}
                />
              </FormGrid>
            )}
            <FormGrid item xs={6} key={resetKey} nestedClasses={{ root: classes.assigneeItem }}>
              {isEditFlag ? (
                <DetailsCard
                  title={utils.string.t('claims.processing.taskDetailsLabels.assignedTo')}
                  details={taskDetails?.assigneeFullName}
                />
              ) : (
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'assignedTo', control, errors)}
                  nestedClasses={{ root: classes.catCodeSelect }}
                />
              )}
            </FormGrid>
            <FormGrid item xs={12}>
              <FormText {...utils.form.getFieldProps(fields, 'description', control)} error={errors.description} />
            </FormGrid>
            <div className={classes.greyGrid}>
              <FormGrid item xs={5}>
                <FormDate {...utils.form.getFieldProps(fields, 'targetDueDate', control)} error={errors.targetDueDate} />
              </FormGrid>
              <FormGrid item xs={5}>
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'reminder', control)}
                  nestedClasses={{ root: classes.catCodeSelect }}
                />
              </FormGrid>
            </div>
          </FormGrid>
          <FormActions type="dialog">
            {secondary && (
              <Button
                text={secondary.label}
                variant="outlined"
                size="medium"
                disabled={formState.isSubmitting}
                onClick={secondary.handler}
              />
            )}
            {submit && (
              <Button
                text={submit.label}
                type="submit"
                disabled={formState.isSubmitting || isTaskSubmitted}
                onClick={handleSubmit(submit.handler)}
                color="primary"
              />
            )}
          </FormActions>

          {isTaskSubmitted && (
            <FormGrid container>
              <FormGrid item xs={6} container alignItems="center">
                <FormLabel variant="h5" label={utils.string.t('dms.wrapper.uploadDocsPrompt')} align="left" />
              </FormGrid>
              <FormGrid item xs={6}>
                {uploadNo && <Button text={uploadNo.label} variant="outlined" size="medium" onClick={uploadNo.handler} />}
                {uploadYes && (
                  <Button
                    text={uploadYes.label}
                    color="primary"
                    size="medium"
                    onClick={uploadYes.handler}
                    nestedClasses={{ btn: classes.uploadYesBtn }}
                  />
                )}
              </FormGrid>
            </FormGrid>
          )}
        </FormFields>
      </FormContainer>
      {isUploadDocuments && (
        <div className={classes.dmsView}>
          <ClaimsUploadViewSearchDocs
            refData={adHocTaskData}
            refIdName={constants.DMS_CONTEXT_TASK_ID}
            dmsContext={constants.DMS_CONTEXT_TASK}
            documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
            handlers={{ onClosingUploadModal: handlers.onClosingUploadModal }}
          />
        </div>
      )}
    </div>
  );
}
