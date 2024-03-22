import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

//app
import styles from './TaskCheckList.styles';
import { Overflow, Layout, Warning, PopoverMenu, Button, TableHead, TableCell, FormCheckbox, FormContainer } from 'components';
import * as utils from 'utils';
import { ADVICE_AND_SETTLEMENT, AWAITING_MOVEMENT, TASK_TAB_INPROGRESS_STATUS, FIRST_ADVICE_FEEDBACK } from 'consts';

//mui
import {
  makeStyles,
  Typography,
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableContainer,
  TableBody,
  TableRow,
} from '@material-ui/core';

TaskCheckListView.propTypes = {
  isCompletedTask: PropTypes.bool.isRequired,
  allSelectionFlag: PropTypes.bool.isRequired,
  nextActionFlag: PropTypes.bool.isRequired,
  isMphasisUser: PropTypes.bool.isRequired,
  isCheckListChanged: PropTypes.bool.isRequired,
  hasCheckList: PropTypes.bool.isRequired,
  hasNextActions: PropTypes.bool.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  formControls: PropTypes.object.isRequired,
  popoverActions: PropTypes.array.isRequired,
  isCurrencyChanged: PropTypes.bool.isRequired,
  task: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    checkListChangeSave: PropTypes.func.isRequired,
    checkListChangeReset: PropTypes.func.isRequired,
    completeTask: PropTypes.func.isRequired,
    checklistDirtyCheck: PropTypes.func.isRequired,
  }).isRequired,
};

export function TaskCheckListView({
  isCompletedTask,
  allSelectionFlag,
  nextActionFlag,
  isMphasisUser,
  isCheckListChanged,
  hasCheckList,
  hasNextActions,
  columns,
  rows,
  fields,
  formControls,
  popoverActions,
  isCurrencyChanged,
  task,
  sanctionCheckStatus,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'TaskCheckList' })();
  const { control, register, watch, setValue } = formControls;

  useEffect(() => {
    if (utils.generic.isValidArray(fields, true)) {
      fields.forEach((eachField) => {
        setValue(eachField.name, allSelectionFlag);
      });
    }
  }, [allSelectionFlag]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rows) {
      rows.forEach((eachCheck) => {
        setValue(eachCheck?.actionListID.toString(), Boolean(eachCheck?.isActioned) || false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  return (
    <div className={classes.wrapper}>
      <Layout main padding>
        <Card className={classes.root}>
          <CardHeader
            className={classes.cardHeader}
            title={
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="body2" className={classes.title} data-testid="task-checklist">
                    {utils.string.t('claims.processing.taskDetailsCheckList.checkList')}
                  </Typography>
                </Grid>
                <Grid item className={classes.nextActionBtn}>
                  {hasNextActions && (
                    <PopoverMenu
                      variant="outlined"
                      id="task-functions"
                      size="small"
                      color="primary"
                      iconPosition="right"
                      disabled={
                        isCompletedTask
                          ? true
                          : task?.taskDefKey === ADVICE_AND_SETTLEMENT
                          ? !nextActionFlag || !isCurrencyChanged
                          : task?.taskDefKey === AWAITING_MOVEMENT
                          ? false
                          : !nextActionFlag
                      }
                      text={utils.string.t('claims.processing.taskDetailsCheckList.nextTask')}
                      isButton
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      items={popoverActions}
                    />
                  )}
                  {!hasNextActions && (
                    <Button
                      text={utils.string.t('app.complete')}
                      disabled={
                        isMphasisUser
                          ? hasCheckList && !nextActionFlag
                          : task?.taskDefKey === FIRST_ADVICE_FEEDBACK &&
                            sanctionCheckStatus !== '' &&
                            sanctionCheckStatus?.value === TASK_TAB_INPROGRESS_STATUS
                          ? true
                          : isCompletedTask
                      }
                      onClick={() => handlers.completeTask()}
                      size="medium"
                      color="primary"
                      variant="text"
                      data-testid="complete-button"
                    />
                  )}
                </Grid>
              </Grid>
            }
          />
          {!hasCheckList ? (
            <CardContent variant="body2" className={classes.cardContent}>
              <Box p={5} className={classes.noCheckListWarning}>
                <Warning
                  type="info"
                  align="center"
                  size="large"
                  icon
                  text={utils.string.t('claims.processing.taskDetailsCheckList.noCheckListFound')}
                  data-testid="task-noCheckList"
                />
              </Box>
            </CardContent>
          ) : (
            <CardContent variant="body2" className={classes.cardContent}>
              {isMphasisUser && (
                <Box p={5} className={classes.mandatoryHint}>
                  <Warning
                    type="info"
                    align="left"
                    size="small"
                    icon
                    text={utils.string.t('claims.processing.taskDetailsCheckList.mandatoryTasksHint')}
                  />
                </Box>
              )}
              <Box>
                <Grid container>
                  <Grid item xs={12}>
                    <FormContainer nestedClasses={{ root: classes.formContainer }}>
                      <Overflow>
                        <TableContainer className={classes.tableContainer} data-testid="task-checklist-table">
                          <Table stickyHeader aria-label="task checklist">
                            <TableHead columns={columns} nestedClasses={{ tableHead: classes.tableHead }} />

                            <TableBody>
                              {rows.map((eachRow, ind) => {
                                const actionDescId = eachRow?.actionListID.toString();
                                return (
                                  <TableRow key={ind} hover>
                                    <TableCell compact className={classes.checkBoxCell}>
                                      <FormCheckbox
                                        name={actionDescId}
                                        {...utils.form.getFieldProps(fields, actionDescId)}
                                        control={control}
                                        register={register}
                                        watch={watch}
                                      />
                                    </TableCell>

                                    <TableCell compact className={classes.actionDescCell}>
                                      {eachRow?.actionListDescription + (eachRow?.isMandatory ? ' *' : '')}
                                    </TableCell>

                                    <TableCell compact className={classes.tableCell}>
                                      {eachRow?.updatedBy}
                                    </TableCell>
                                    <TableCell compact className={classes.tableCell}>
                                      {eachRow?.updatedDate}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Overflow>
                    </FormContainer>
                  </Grid>

                  <Grid item xs={12}>
                    <Box mt={3} pr={2} display="flex" justifyContent="flex-end">
                      <Button
                        text={utils.string.t('app.cancel')}
                        onClick={() => handlers.checklistDirtyCheck()}
                        size="medium"
                        nestedClasses={{ btn: classes.checklistActionBtns }}
                        data-testid="cancel-button"
                      />
                      <Button
                        text={utils.string.t('app.reset')}
                        disabled={isCompletedTask}
                        onClick={() => handlers.checkListChangeReset()}
                        size="medium"
                        nestedClasses={{ btn: classes.checklistActionBtns }}
                        data-testid="reset-button"
                      />
                      <Button
                        text={utils.string.t('app.save')}
                        disabled={
                          isCompletedTask
                            ? true
                            : task?.taskDefKey === ADVICE_AND_SETTLEMENT
                            ? !isCheckListChanged || !isCurrencyChanged
                            : !isCheckListChanged
                        }
                        onClick={() => handlers.checkListChangeSave()}
                        size="medium"
                        color="primary"
                        nestedClasses={{ btn: classes.checklistActionBtns }}
                        data-testid="save-button"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          )}
        </Card>
      </Layout>
    </div>
  );
}
