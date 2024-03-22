import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

//app
import * as utils from 'utils';
import styles from './PremiumProcessingCaseRhsAccordions.styles';
import { Button, FormText, FormCheckbox, FormRadio } from 'components';
import { PremiumProcessingCreateActionAccordion, PremiumProcessingPendingActionAccordion } from 'modules';
import {
  premiumProcessingNoteSave,
  enqueueNotification,
  showModal,
  getRejectCloseCase,
  postNewWorkflowStage,
  getPremiumProcessingTasksDetails,
  selectCaseRfiDetails,
} from 'stores';
import * as constants from 'consts';

//mui
import { makeStyles, Grid, Box, Typography, Link } from '@material-ui/core';

PremiumProcessingCaseRhsAccordionsView.propTypes = {
  currentUser: PropTypes.array.isRequired,
  selectedCases: PropTypes.array,
  fields: PropTypes.array.isRequired,
  caseType: PropTypes.string,
  notesTextFieldProps: PropTypes.object,
  isTransactionCommited: PropTypes.bool.isRequired,
  isWorkBasket: PropTypes.bool.isRequired,
  isAllCases: PropTypes.bool.isRequired,
  isUnassignedStage: PropTypes.bool.isRequired,
  isIssueDocumentStage: PropTypes.bool.isRequired,
  taskId: PropTypes.string.isRequired,
  isCheckSigningCase: PropTypes.bool.isRequired,
  caseTaskTypeView: PropTypes.string.isRequired,
  isRejectPendingActionStage: PropTypes.bool,
  handlers: PropTypes.shape({
    handleMoveToNextStage: PropTypes.func.isRequired,
    viewMoreNotesHandler: PropTypes.func.isRequired,
    qcSubmit: PropTypes.func.isRequired,
    checkSigningComplete: PropTypes.func,
    checkSigningCancel: PropTypes.func,
    checkSigningReject: PropTypes.func,
    caseRfiHandler: PropTypes.func.isRequired,
  }),
};

export default function PremiumProcessingCaseRhsAccordionsView({
  caseType,
  handlers,
  fields,
  notesTextFieldProps,
  isTransactionCommited,
  isWorkBasket,
  isAllCases,
  currentUser,
  selectedCases,
  taskId,
  isIssueDocumentStage,
  isUnassignedStage,
  isCheckSigningCase,
  caseTaskTypeView,
  isRejectPendingActionStage,
}) {
  const defaultValues = utils.form.getInitialValues(fields);
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseRhsAccordions' })();
  const dispatch = useDispatch();
  const { control, watch, reset, setValue } = useForm({ defaultValues });
  const transactionCommitedField = watch('transactionCommited');
  const [enableMoveToNext, setEnableMoveToNext] = useState(false);
  const notesFieldValue = watch('notesField');
  const enableSaveNotes = notesFieldValue ? true : false;
  const caseId = selectedCases?.[0]?.caseId;
  const caseFlagType = selectedCases?.[0]?.type;
  const policyRef = selectedCases?.[0]?.policyRef;
  const caseRfiDetails = useSelector(selectCaseRfiDetails);
  const caseRFIBureau =
    (caseRfiDetails?.rfiType === constants.BUREAU_RFITYPE || caseRfiDetails?.rfiType === constants.INTERNAL_RFITYPE) && caseRfiDetails?.status === constants.BUREAU_RESPONSE_RECEIVED;
  const fieldsValue = watch();
  useEffect(() => {
    setEnableMoveToNext(isTransactionCommited);
    reset('', 'notesField');
  }, [isTransactionCommited, caseId]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {}, [transactionCommitedField, notesFieldValue]); //eslint-disable-line react-hooks/exhaustive-deps

  const isRfiCase = utils.generic.isValidArray(selectedCases, true) && utils.premiumProcessing.isRfi(selectedCases?.[0]);
  const selectedCasesType = caseFlagType?.split(',');
  const isQcCase = Boolean(selectedCasesType?.some((flag) => flag === constants.QC_FLAG));
  const isRpCase = Boolean(selectedCasesType?.some((flag) => flag === constants.RP_FLAG));
  const isValidQCSection =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) =>
      [constants.ROLE_SENIOR_TECHNICIAN.toLowerCase(), constants.ROLE_TECHNICIAN_MANAGER.toLowerCase()].includes(item.name.toLowerCase())
    );
  const isWorkList = caseType === constants.WORKLIST;
  const isMyTask = caseTaskTypeView === constants.TASK_TEAM_TYPE.myTask;
  const isValidRPSection =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) =>
      [constants.FRONT_END_CONTACT.toLowerCase(), constants.OPERATIONS_LEAD.toLowerCase()].includes(item.name.toLowerCase())
    );

  const saveNotes = (noteComments) => {
    if (noteComments) {
      dispatch(premiumProcessingNoteSave({ comments: noteComments, taskId: taskId })).then((response) => {
        if (response?.status === constants.NOTES_API_SUCCESS_STATUS) {
          reset('', 'notesField');
          if (!enableMoveToNext) {
            setValue('transactionCommited', true);
          }
        }
      });
    } else {
      dispatch(enqueueNotification(utils.string.t('premiumProcessing.notes.notesMandatory'), 'warning'));
    }
  };

  const rejectStageModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.rejectingCase.rejectCase'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.rejectingCase.rejectClose'),
            cancelLabel: utils.string.t('premiumProcessing.rejectingCase.cancel'),
            confirmMessage: utils.string.t('premiumProcessing.rejectingCase.rejectPopUpMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              dispatch(getRejectCloseCase({ taskId, notesFieldValue, policyRef })).then((response) => {
                if (response?.status === constants.NOTES_API_SUCCESS_STATUS || response?.message?.toUpperCase() === null) {
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
                } else {
                  dispatch(enqueueNotification('premiumProcessing.checkSigningReject.rejectCloseErrorMessage', 'error'));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
                }
              });
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  const reSubmitStageModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.reSubmitCases.reSubmitCase'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.reSubmitCases.reSubmit'),
            cancelLabel: utils.string.t('premiumProcessing.reSubmitCases.cancel'),
            confirmMessage: utils.string.t('premiumProcessing.reSubmitCases.resubmitPopUpMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              const isReSubmitted = true;
              const notes = notesFieldValue;
              dispatch(postNewWorkflowStage({ taskId, notes, isReSubmitted, policyRef })).then((response) => {
                if (response?.message.toUpperCase() === constants.API_RESPONSE_SUCCESS || response?.message.toUpperCase() === null) {
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
                }
              });
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };
  const rejectStage = () => {
    if (isEmpty(fieldsValue?.notesField)) {
      dispatch(enqueueNotification('premiumProcessing.rejectingCase.rejectCloseNotes', 'warning'));
      return;
    }
    rejectStageModal();
  };
  const reSubmitStage = () => {
    if (isEmpty(fieldsValue?.notesField)) {
      dispatch(enqueueNotification('premiumProcessing.reSubmitCases.reSubmitNotes', 'warning'));
      return;
    }
    reSubmitStageModal();
  };

  return (
    <>
      <Box>
        {isWorkList && isMyTask && isValidQCSection && isQcCase && !isRfiCase && (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormRadio {...utils.form.getFieldProps(fields, 'qualityControl', control)} muiFormGroupProps={{ row: true }} />
            <Button
              text={utils.string.t('app.submit')}
              onClick={() => {
                handlers.qcSubmit(watch());
              }}
              color="primary"
              variant="outlined"
              size="xsmall"
              styles={{ paddingleft: '20px' }}
              nestedClasses={{ btn: classes.submitButton }}
            />
          </Box>
        )}
        {!isRfiCase && (
          <PremiumProcessingCreateActionAccordion
            taskId={taskId}
            currentUser={currentUser}
            selectedCases={selectedCases}
            isUnassignedStage={isUnassignedStage}
            fieldsValue={fieldsValue}
            isWorkBasket={isWorkBasket}
            isAllCases={isAllCases}
            isIssueDocumentStage={isIssueDocumentStage}
            isValidRPSection={isValidRPSection}
            isCheckSigningCase={isCheckSigningCase}
            isRejectPendingActionStage={isRejectPendingActionStage}
          />
        )}
        {!isRfiCase && (
          <PremiumProcessingPendingActionAccordion
            isCheckSigningCase={isCheckSigningCase}
            taskId={taskId}
            isValidRPSection={isValidRPSection}
            isWorkBasket={isWorkBasket}
            isAllCases={isAllCases}
            isUnassignedStage={isUnassignedStage}
            selectedCases={selectedCases}
            isIssueDocumentStage={isIssueDocumentStage}
          />
        )}
        {isTransactionCommited && !isRfiCase && (
          <FormCheckbox
            {...utils.form.getFieldProps(fields, 'transactionCommited', control)}
            nestedClasses={{ root: classes.checkboxAlignment }}
            muiComponentProps={{
              onChange: () => {
                if (isTransactionCommited) {
                  setEnableMoveToNext(!enableMoveToNext);
                }
              },
            }}
          />
        )}
        {!isRfiCase && (
          <Box className={classes.premiumNotes} data-testid={notesTextFieldProps.id}>
            <Grid container>
              <Grid item xs={12} sm={12}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography className={classes.notes} data-testid={`${notesTextFieldProps.id + '-label'}`}>
                      {utils.string.t('premiumProcessing.notes.notes')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      <Link
                        underline="always"
                        className={classes.notesHistory}
                        onClick={() => handlers.viewMoreNotesHandler()}
                        data-testid={`${notesTextFieldProps.id + '-history-link'}`}
                      >
                        {utils.string.t('premiumProcessing.notes.viewNotes')}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <FormText {...notesTextFieldProps} {...utils.form.getFieldProps(fields, 'notesField')} control={control} />
              </Grid>
              <Grid container justifyContent="flex-end" direction="column" alignItems="flex-end" className={classes.rejectSubmitButtons}>
                <Button
                  text={utils.string.t('premiumProcessing.caseSummary.saveNote')}
                  onClick={() => {
                    saveNotes(notesFieldValue);
                  }}
                  disabled={isWorkBasket || isAllCases || isUnassignedStage || !enableSaveNotes}
                  color={'default'}
                  variant={'outlined'}
                  size={'xsmall'}
                  data-testid="PremiumprocessingSummaryRejectButton"
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <Box>
          <Grid container justifyContent="flex-end" direction="column" alignItems="flex-end" spacing={2} className={classes.saveNotesButtons}>
            {!isCheckSigningCase && !isRfiCase && !isRpCase && (
              <Grid item>
                <Button
                  color="primary"
                  size="medium"
                  text={utils.string.t('premiumProcessing.caseSummary.moveToNextStage')}
                  onClick={() => handlers.handleMoveToNextStage()}
                  disabled={
                    isWorkBasket ||
                    isAllCases ||
                    enableMoveToNext ||
                    (isValidQCSection && isQcCase) ||
                    (isValidRPSection && !isIssueDocumentStage)
                  }
                  data-testid="PremiumprocessingSummarySubmitButton"
                />
              </Grid>
            )}
            {isRfiCase && (
              <Grid item>
                <Button
                  nestedClasses={{ btn: classes.button }}
                  color="primary"
                  size="medium"
                  text={
                    caseRFIBureau
                      ? utils.string.t('premiumProcessing.respondingCase.resolve')
                      : utils.string.t('premiumProcessing.respondingCase.respond')
                  }
                  onClick={() => handlers.caseRfiHandler()}
                  disabled={isWorkBasket || isAllCases}
                />
              </Grid>
            )}
            {isRpCase && !isCheckSigningCase && !isRfiCase && (
              <Grid item>
                <Button
                  nestedClasses={{ btn: classes.button }}
                  color="primary"
                  size="medium"
                  text={utils.string.t('premiumProcessing.rejectingCase.reject')}
                  onClick={() => rejectStage()}
                  disabled={isWorkBasket || isAllCases}
                />
                <Button
                  nestedClasses={{ btn: classes.button }}
                  color="primary"
                  size="medium"
                  text={utils.string.t('premiumProcessing.reSubmitCases.reSubmit')}
                  onClick={() => reSubmitStage()}
                  disabled={isWorkBasket || isAllCases}
                />
              </Grid>
            )}
            {isCheckSigningCase && !isRpCase && !isRfiCase && (
              <Grid item>
                <Button
                  nestedClasses={{ btn: classes.singleRowButton }}
                  color="primary"
                  size="medium"
                  text={utils.string.t('premiumProcessing.checkSigningCase.cancel')}
                  onClick={() => handlers.checkSigningCancel(fieldsValue)}
                  disabled={isWorkBasket || isAllCases || isRejectPendingActionStage}
                />
                <Button
                  nestedClasses={{ btn: classes.singleRowButton }}
                  color="primary"
                  size="medium"
                  text={utils.string.t('premiumProcessing.checkSigningCase.reject')}
                  onClick={() => handlers.checkSigningReject(fieldsValue)}
                  disabled={isWorkBasket || isAllCases}
                />
                <Button
                  nestedClasses={{ btn: classes.singleRowButton }}
                  color="primary"
                  size="medium"
                  text={utils.string.t('premiumProcessing.checkSigningCase.complete')}
                  onClick={() => handlers.checkSigningComplete(fieldsValue)}
                  disabled={isWorkBasket || isAllCases || isRejectPendingActionStage}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
