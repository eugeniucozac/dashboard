import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import { TasksAdditionInfo } from './TasksAdditionInfo';
import * as utils from 'utils';
import { Layout, FormGrid, FormRadio, FormText, Button, FormLabel, TableToolbar } from 'components';
import styles from './TaskDetails.styles';
import { TaskCheckList } from 'modules';
import {
  ADVICE_AND_SETTLEMENT,
  CLAIM_ADHOC_TASK,
  FIRST_ADVICE_FEEDBACK,
  SANCTIONS_CHECK_KEY,
  SYNC_GXB_MANUAL,
  UPLOAD_DOCS_MANUAL,
} from 'consts';

// mui
import { makeStyles, Card } from '@material-ui/core';

TaskDetailsView.propTypes = {
  taskObj: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  taskInfo: PropTypes.array.isRequired,
  currencyPurchasedValue: PropTypes.string.isRequired,
  sanctionsCheckState: PropTypes.string,
  control: PropTypes.object,
  currencyValue: PropTypes.string.isRequired,
  handlers: PropTypes.shape({
    setCurrencyValue: PropTypes.func.isRequired,
    handleClose: PropTypes.func,
    setStatusType: PropTypes.func,
    handleCancel: PropTypes.func,
  }),
  isDirtyRef: PropTypes.bool.isRequired,
  setIsDirty: PropTypes.func.isRequired,
  handleDirtyCheck: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  handleEditLoss: PropTypes.func.isRequired,
};

export function TaskDetailsView({
  taskObj,
  taskInfo,
  fields,
  isTaskDetailsLoading,
  currencyPurchasedValue,
  control,
  currencyValue,
  handlers,
  lossInfo,
  policyInfo,
  claimInfo,
  underWritingInfo,
  underWritingGroupColumns,
  isDirtyRef,
  setIsDirty,
  handleDirtyCheck,
  handleSubmit,
  errors,
  getValues,
  setValue,
  sanctionCheckStatus,
  handleEditLoss,
}) {
  const [isPurchasedCurrencyRequired, setIsPurchasedCurrencyRequired] = useState(false);
  const [isCurrencyChanged, setIsCurrencyChanged] = useState(false);
  const classes = makeStyles(styles, { name: 'TaskDetails' })();

  const isTaskSanctionsCheck = taskObj?.taskDefKey === SANCTIONS_CHECK_KEY;

  useEffect(() => {
    if (currencyPurchasedValue !== currencyValue) {
      if (taskObj?.taskDefKey === ADVICE_AND_SETTLEMENT) {
        setIsCurrencyChanged(true);
      }
      handlers.setCurrencyValue(currencyPurchasedValue);
    }
  }, [currencyPurchasedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsPurchasedCurrencyRequired(taskObj?.taskDefKey === ADVICE_AND_SETTLEMENT ? true : false);
  }, [taskObj]);

  return (
    <div className={classes.wrapper}>
      <Layout main padding>
        <Card className={classes.root}>
          <TasksAdditionInfo
            lossInfo={lossInfo}
            policyInfo={policyInfo}
            claimInfo={claimInfo}
            taskInfo={taskInfo}
            underWritingInfo={underWritingInfo}
            underWritingGroupColumns={underWritingGroupColumns}
            taskObj={taskObj}
            handleEditLoss={handleEditLoss}
            isTaskDetailsLoading={isTaskDetailsLoading}
          />
        </Card>

        {isPurchasedCurrencyRequired && (
          <TableToolbar nestedClasses={{ root: classes.tableToolbar }}>
            <FormGrid>
              <FormLabel
                label={`${utils.string.t('claims.processing.taskDetailsLabels.currencyWasPurchased')}${' '}${'? :'}${'   '}${'*'}`}
                nestedClasses={{ root: classes.viewLabel }}
              />
            </FormGrid>
            <FormGrid>
              <FormRadio {...utils.form.getFieldProps(fields, 'currencyPurchasedRadio', control)} />
            </FormGrid>
          </TableToolbar>
        )}
        {isTaskSanctionsCheck && (
          <div className={classes.sanctionCheckContainer}>
            <TableToolbar nestedClasses={{ root: classes.tableToolbar }}>
              <FormLabel
                label={`${utils.string.t('claims.processing.taskDetailsLabels.sanctionsCheckStatus')}: `}
                align="left"
                nestedClasses={{ root: classes.sanctionCheckLabel }}
              />
              <FormRadio {...utils.form.getFieldProps(fields, 'sanctionsCheckState')} control={control} />
            </TableToolbar>
            <div className={classes.commmentsContainer}>
              <FormGrid>
                <FormLabel
                  label={`${utils.string.t('claims.processing.taskDetailsLabels.comments')} `}
                  align="left"
                  nestedClasses={{ root: classes.commmentsLabel }}
                />
                <FormText {...utils.form.getFieldProps(fields, 'comments')} control={control} error={errors.comments} />
              </FormGrid>
            </div>
          </div>
        )}
        {(taskObj?.taskDefKey === FIRST_ADVICE_FEEDBACK ||
          taskObj?.taskDefKey === SYNC_GXB_MANUAL ||
          taskObj?.taskDefKey === UPLOAD_DOCS_MANUAL ||
          taskObj?.taskDefKey === CLAIM_ADHOC_TASK) && (
          <div className={classes.notesContainer}>
            <FormGrid>
              <FormLabel
                label={`${utils.string.t('claims.processing.taskDetailsLabels.notes')} `}
                align="left"
                nestedClasses={{ root: classes.commmentsLabel }}
              />
              <FormText {...utils.form.getFieldProps(fields, 'details')} control={control} error={errors.details} />
            </FormGrid>
          </div>
        )}

        {!isTaskSanctionsCheck && (
          <TaskCheckList
            task={taskObj}
            currencyPurchasedValue={currencyPurchasedValue}
            isCurrencyChanged={isCurrencyChanged}
            isDirtyRef={isDirtyRef}
            setIsDirty={setIsDirty}
            handleDirtyCheck={handleDirtyCheck}
            sanctionCheckStatus={sanctionCheckStatus || ''}
            {...(taskObj?.taskDefKey === FIRST_ADVICE_FEEDBACK ||
            taskObj?.taskDefKey === SYNC_GXB_MANUAL ||
            taskObj?.taskDefKey === UPLOAD_DOCS_MANUAL ||
            taskObj?.taskDefKey === CLAIM_ADHOC_TASK
              ? { formHandlers: { getValues: getValues, setValue: setValue } }
              : null)}
          />
        )}
        {isTaskSanctionsCheck && taskObj?.status !== utils.string.t('claims.claimRefTasks.status.completed') && (
          <div className={classes.fotterButtonGroup}>
            <Button
              text={utils.string.t('app.cancel')}
              onClick={handlers.handleCancel}
              variant="outlined"
              size="medium"
              nestedClasses={{ btn: classes.button }}
            />
            <Button
              text={utils.string.t('app.complete')}
              onClick={handleSubmit(handlers.handleClose)}
              color="primary"
              size="medium"
              nestedClasses={{ btn: classes.button }}
            />
          </div>
        )}
      </Layout>
    </div>
  );
}
