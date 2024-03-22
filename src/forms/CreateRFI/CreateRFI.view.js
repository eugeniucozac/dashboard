import React from 'react';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import { FormContainer, FormFields, FormGrid, FormText, FormDate, Info, FormAutocompleteMui, FormSelect } from 'components';
import { CreateTaskStepperActions } from 'forms';
import { RFI_ON_CLAIMS, RFI_ON_TASKS, RFI_ON_LOSS } from 'consts';
import styles from './CreateRFI.styles';

//mui
import { makeStyles, Typography, Box } from '@material-ui/core';

CreateRFIView.propTypes = {
  claimRef: PropTypes.string.isRequired,
  rfiType: PropTypes.string.isRequired,

  // TODO Stepper props as undefined. Need to pass properly
  activeStep: PropTypes.number,
  handleBack: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleNextSubmit: PropTypes.func.isRequired,
  handleSkip: PropTypes.func.isRequired,
  isAllStepsCompleted: PropTypes.bool.isRequired,
  fields: PropTypes.array.isRequired,
  formProps: PropTypes.shape({
    control: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    isDirty: PropTypes.bool.isRequired,
    watch: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }),
  maxDescLimit: PropTypes.number.isRequired,
  handlers: PropTypes.shape({
    submitForm: PropTypes.func.isRequired,
    skipSubmit: PropTypes.func.isRequired,
  }),
};

export function CreateRFIView({
  fields,
  claimRef,
  rfiType,

  activeStep,
  isAllStepsCompleted,
  handleBack,
  handleSave,
  handleCancel,
  handleNextSubmit,
  handleSkip,

  formProps,
  maxDescLimit,
  handlers,
  ...props
}) {
  const classes = makeStyles(styles, { name: 'CreateRFI' })();

  const { submitForm, skipSubmit } = handlers;
  const { control, errors, handleSubmit, watch } = formProps;
  const descriptionWatcher = watch('description') || '';

  const rfiTypeTitle =
    rfiType === RFI_ON_CLAIMS
      ? utils.string.t('claims.processing.taskDetailsLabels.claimRef')
      : rfiType === RFI_ON_TASKS
      ? utils.string.t('claims.processing.taskDetailsLabels.taskRef')
      : rfiType === RFI_ON_LOSS
      ? utils.string.t('claims.columns.claimsManagement.lossRef')
      : '';

  return (
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box className={classes.root} flex="1 1 auto">
        <FormContainer type="dialog" onSubmit={handleSubmit} data-testid="form-create-RFI">
          <FormFields type="dialog">
            <Typography variant="h5" className={classes.sectionheader}>
              {utils.string.t('claims.processing.taskFunction.RfiDetails')}
            </Typography>
            <FormGrid container spacing={2}>
              <FormGrid item xs={12}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={4}>
                    <Info title={rfiTypeTitle} description={claimRef} />
                  </FormGrid>
                  <FormGrid item xs={4}>
                    <FormAutocompleteMui
                      {...utils.form.getFieldProps(fields, 'queryCode', control)}
                      error={errors?.queryCode}
                      nestedClasses={{ root: classes.codeSelect }}
                    />
                  </FormGrid>
                  <FormGrid item xs={4}>
                    <FormSelect
                      {...utils.form.getFieldProps(fields, 'priority', control)}
                      error={errors?.priority}
                      nestedClasses={{ root: classes.codeSelect }}
                    />
                  </FormGrid>
                </FormGrid>
              </FormGrid>
              <FormGrid item xs={12}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={4}>
                    <FormSelect
                      {...utils.form.getFieldProps(fields, 'teams', control)}
                      error={errors?.teams}
                      nestedClasses={{ root: classes.codeSelect }}
                    />
                  </FormGrid>
                  <FormGrid item xs={4}>
                    <FormAutocompleteMui
                      {...utils.form.getFieldProps(fields, 'sendTo', control)}
                      error={errors?.sendTo}
                      nestedClasses={{ root: classes.codeSelect }}
                    />
                  </FormGrid>
                </FormGrid>
              </FormGrid>
              <FormGrid item xs={12}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={12}>
                    <FormText
                      {...utils.form.getFieldProps(fields, 'description', control)}
                      error={errors?.description}
                      hint={`${descriptionWatcher?.length}/${maxDescLimit}`}
                    />
                  </FormGrid>
                </FormGrid>
              </FormGrid>
              <Typography variant="h5" className={classes.dueDateheader}>
                {utils.string.t('claims.processing.taskFunction.diarise')}
              </Typography>
              <FormGrid item xs={12} nestedClasses={{ root: classes.greyGrid }}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={6}>
                    <FormDate {...utils.form.getFieldProps(fields, 'targetDueDate', control)} error={errors?.targetDueDate} />
                  </FormGrid>
                  <FormGrid item xs={6}>
                    <FormAutocompleteMui
                      {...utils.form.getFieldProps(fields, 'reminder', control)}
                      nestedClasses={{ root: classes.catCodeSelect }}
                    />
                  </FormGrid>
                </FormGrid>
              </FormGrid>
            </FormGrid>
          </FormFields>
        </FormContainer>
      </Box>
      <Box flex="0 1 auto">
        <CreateTaskStepperActions
          {...props}
          activeStep={activeStep}
          onSave={() => {}}
          isAllStepsCompleted={isAllStepsCompleted}
          handleBack={() => {
            handleBack(0);
          }}
          handleCancel={handleCancel}
          handleSkip={handleSubmit(skipSubmit)}
          handleNextSubmit={handleSubmit(submitForm)}
          save={true}
        />
      </Box>
    </Box>
  );
}
