// react
import React, { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import config from 'config';

// app
import styles from './ProcessingInstructionsAuthorisation.styles';
import stylesParent from '../../pages/ProcessingInstructionsSteps/ProcessingInstructionsSteps.styles';
import {
  AccessControl,
  Button,
  FormSelect,
  FormCheckbox,
  FormContainer,
  FormFields,
  FormGrid,
  SaveBar,
  PreventNavigation,
  Warning,
} from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Typography, Divider } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import BlockIcon from '@material-ui/icons/Block';
import * as constants from 'consts';

const ProcessingInstructionsAuthorisationView = forwardRef(
  (
    {
      instruction,
      fields,
      defaultValues,
      isReadyToSubmit,
      isSubmittedAuthorisedSignatory,
      isReadOnly,
      handlers,
      checkListMandatoryDataStatus,
      processingInstructionMandatoryDataStatus,
    },
    ref
  ) => {
    const classes = makeStyles(styles)();
    const classesParent = makeStyles(stylesParent)();
    const validationSchema = utils.form.getValidationSchema(fields);
    const updatedDate = instruction?.updatedDate;
    const submittedDate = instruction?.submittedDate;
    const reopenedDate = instruction?.reopenedDate;
    const submittedStatus = instruction?.statusId === constants.PI_STATUS_SUBMITTED_PROCESSING;
    const { control, errors, reset, watch, formState } = useForm({
      defaultValues,
      ...(validationSchema && { resolver: yupResolver(validationSchema) }),
    });

    const formValues = watch();
    const isPageEdited = formState?.dirtyFields?.frontEndContact || formState?.dirtyFields?.authorisedSignatory ? true : false;
    const isReady = !isPageEdited && isReadyToSubmit && formValues?.authorisedSignatory && formValues?.frontEndContact;

    const gridProps = { xs: 12, sm: 6 };

    return (
      <div data-testid="processing-instructions-authorisation">
        {/* Download PDF reference
        <Button
          text={utils.string.t('Download PDF')}
          onClick={handlers.downloadPdf}
          color="secondary"
          variant="outlined"
          size="small"
          nestedClasses={{ btn: classesParent.button }}
        /> */}
        {(checkListMandatoryDataStatus || processingInstructionMandatoryDataStatus) && (
          <Box my={6} className={classes.formErrorMessage}>
            <Warning
              text={
                (checkListMandatoryDataStatus &&
                  processingInstructionMandatoryDataStatus &&
                  utils.string.t('processingInstructions.checklistAndProcessingInstructionMandatoryFieldErrorMessage')) ||
                (checkListMandatoryDataStatus && utils.string.t('processingInstructions.checklistMandatoryFieldErrorMessage')) ||
                (processingInstructionMandatoryDataStatus &&
                  utils.string.t('processingInstructions.processingInstructionMandatoryFieldErrorMessage'))
              }
              backGround={'white'}
              hasboxShadowColor
              type="error"
              align="center"
              size="large"
              border
              icon
            />
          </Box>
        )}
        <FormContainer data-testid="form-addUser" ref={ref} values={formValues} resetFunc={reset} nestedClasses={{ root: classes.root }}>
          <FormFields>
            <FormGrid container>
              <FormGrid item {...gridProps}>
                <FormSelect {...utils.form.getFieldProps(fields, 'frontEndContact', control, errors)} />
              </FormGrid>
              <FormGrid item {...gridProps}>
                <FormSelect {...utils.form.getFieldProps(fields, 'authorisedSignatory', control, errors)} />
              </FormGrid>
            </FormGrid>
            <AccessControl feature="processingInstructions.processingInstructions" permissions={['create', 'update']}>
              <FormGrid container>
                <FormGrid item {...gridProps}>
                  <Box mt={1} mb={5}>
                    <FormCheckbox {...utils.form.getFieldProps(fields, 'readyToSubmit')} />
                  </Box>
                </FormGrid>
                {isSubmittedAuthorisedSignatory && isReadOnly && (
                  <FormGrid item {...gridProps}>
                    <Box mt={1} mb={5}>
                      <Button
                        text={utils.string.t('processingInstructions.authorisations.resetAll')}
                        onClick={handlers.resetAll}
                        color="primary"
                        size="small"
                        variant="outlined"
                        nestedClasses={{ btn: classesParent.button }}
                      />
                    </Box>
                  </FormGrid>
                )}
              </FormGrid>
            </AccessControl>
          </FormFields>
        </FormContainer>
        <FormGrid container>
          <FormGrid item {...gridProps}>
            {instruction?.notes?.length > 0 && (
              <Box data-testid="notes">
                <Typography className={classes.subTitle}>
                  {utils.string.t('processingInstructions.authorisations.notes.heading')}
                </Typography>

                <Divider />
                {instruction.notes.map((note, idx) => {
                  return (
                    <Box key={note.id}>
                      <Box py={2}>
                        <Box mb={1} display="flex" alignItems="center">
                          <Typography className={classes.noteStatus}>
                            {utils.string.t('app.status')}: {note.type}
                          </Typography>
                          <Box display="flex" alignItems="center" ml={0.5}>
                            {note.type === 'Approved' && <CheckCircleIcon className={classes.approved} />}
                            {note.type === 'Rejected' && <BlockIcon className={classes.rejected} />}
                          </Box>
                        </Box>
                        <Box pb={2}>
                          <Typography className={classes.notes}>{note.notes}</Typography>
                        </Box>
                        <Typography className={classes.noteUpdatedBy}>
                          {utils.string.t('processingInstructions.authorisations.notes.updatedByInfo', {
                            user: note.userName,
                            date: utils.string.t('format.date', { value: { date: note.createdDate, format: 'D MMM YYYY, h:mm A' } }),
                          })}
                        </Typography>
                      </Box>

                      {idx !== instruction?.notes?.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </Box>
            )}
          </FormGrid>
          <FormGrid item {...gridProps}>
            {submittedStatus && reopenedDate && (
              <Box data-testid="updated-pi-details">
                <Typography className={classes.subTitle}>
                  {utils.string.t('processingInstructions.authorisations.updatedProcessingInstruction.heading')}
                </Typography>

                <Divider />

                <Box py={2}>
                  <Box pb={2.5}>
                    <Typography className={classes.noteStatus}>
                      {utils.string.t('processingInstructions.authorisations.updatedProcessingInstruction.updatedBy')}
                    </Typography>
                  </Box>
                  <Box pb={2}>
                    <Typography>{instruction.updatedByName}</Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.noteUpdatedBy}>
                      {utils.string.t(
                        'processingInstructions.authorisations.updatedProcessingInstruction.submittedAuthorisedSignatoryText',
                        {
                          date: utils.string.t('format.date', { value: { date: updatedDate, format: 'D MMM YYYY, h:mm A' } }),
                        }
                      )}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box py={2}>
                  <Box pb={2.5}>
                    <Typography className={classes.noteStatus}>
                      {utils.string.t('processingInstructions.authorisations.updatedProcessingInstruction.approvedBy')}
                    </Typography>
                  </Box>

                  <Box pb={2}>
                    <Typography>{instruction?.details?.authorisedSignatoryName}</Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.noteUpdatedBy}>
                      {utils.string.t(
                        'processingInstructions.authorisations.updatedProcessingInstruction.approvedAuthorisedSignatoryText',
                        {
                          date: utils.string.t('format.date', { value: { date: submittedDate, format: 'D MMM YYYY, h:mm A' } }),
                        }
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </FormGrid>
        </FormGrid>

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
              {isPageEdited && !isReady && (
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
                    variant="outlined"
                    size="small"
                    nestedClasses={{ btn: classesParent.button }}
                  />
                </>
              )}
              <AccessControl feature="processingInstructions.processingInstructions" permissions={['create', 'update']}>
                <Button
                  text={utils.string.t('processingInstructions.authorisations.submit')}
                  onClick={handlers.submit}
                  disabled={isReadOnly}
                  color="primary"
                  size="small"
                  nestedClasses={{ btn: classesParent.button }}
                />
              </AccessControl>
              <AccessControl feature="processingInstructions.approveRejectProcessingInstruction" permissions={['create', 'update']}>
                <>
                  <Button
                    text={utils.string.t('app.reject')}
                    onClick={handlers.reject}
                    color="primary"
                    size="small"
                    disabled={!isSubmittedAuthorisedSignatory}
                    nestedClasses={{ btn: classesParent.button }}
                  />
                  <Button
                    text={utils.string.t('app.approve')}
                    onClick={handlers.approve}
                    color="primary"
                    size="small"
                    disabled={!isSubmittedAuthorisedSignatory}
                    nestedClasses={{ btn: classesParent.button }}
                  />
                </>
              </AccessControl>
            </Box>
          </Box>
          <PreventNavigation dirty={isPageEdited} allowedUrls={[`${config.routes.processingInstructions.steps}/${instruction?.id}/`]} />
        </SaveBar>
      </div>
    );
  }
);

ProcessingInstructionsAuthorisationView.propTypes = {
  fields: PropTypes.array.isRequired,
  defaultValues: PropTypes.object.isRequired,
  isReadyToSubmit: PropTypes.bool,
  isSubmittedAuthorisedSignatory: PropTypes.bool,
  isReadOnly: PropTypes.bool.isRequired,
  checkListMandatoryDataStatus: PropTypes.bool.isRequired,
  processingInstructionMandatoryDataStatus: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    approve: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
  }).isRequired,
};

export default ProcessingInstructionsAuthorisationView;
