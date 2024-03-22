import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as classnames from 'classnames';
//app
import styles from './PremiumProcessingCaseBureau.styles';
import { useFlexiColumns } from 'hooks';
import { TableCell, TableHead, FormDate, FormText, MultiSelect, SelectPopover, Button, PreventNavigation } from 'components';
import * as utils from 'utils';
import config from 'config';
import { hideModal, deleteBureauInsurerDetails } from 'stores';
import * as constants from 'consts';

//mui
import { makeStyles, Table, TableBody, TableRow, TableContainer, Box, Grid } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

PremiumProcessingCaseBureauView.propTypes = {
  columnsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  handlers: PropTypes.shape({
    handleInputChange: PropTypes.func.isRequired,
    handleDatePickerUpdate: PropTypes.func.isRequired,
    toggleMultiSelectOption: PropTypes.func.isRequired,
    getSelectedBureauLabel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleRemoveRow: PropTypes.func.isRequired,
  }).isRequired,
  bureauInsurersDetails: PropTypes.object.isRequired,
  bureauList: PropTypes.array.isRequired,
  hasEditPermission: PropTypes.bool.isRequired,
  isCompletedStage: PropTypes.bool,
  isRejectedStage: PropTypes.bool,
  taskId: PropTypes.string.isRequired,
  isEdited: PropTypes.bool.isRequired,
  isDuplicateWorkRefNo: PropTypes.string,
  isDuplicateWorkRefNoInDb: PropTypes.array,
  isNotMyTaskView: PropTypes.bool.isRequired,
};

export default function PremiumProcessingCaseBureauView({
  columnsData,
  bureauInsurersDetails,
  hasEditPermission,
  bureauList,
  handlers,
  taskId,
  isEdited,
  isDuplicateWorkRefNo,
  isDuplicateWorkRefNoInDb,
  isCompletedStage,
  isRejectedStage,
  isNotMyTaskView,
}) {
  const dispatch = useDispatch();
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseBureau' })();
  const { columns: columnsArray, columnProps } = useFlexiColumns(columnsData);
  const defaultValues = utils.form.getInitialValues([]);
  const { control } = useForm({ defaultValues });
  const [allowedUrls, setAllowedUrls] = useState([]);

  useEffect(() => {
    if (taskId) {
      setAllowedUrls([
        `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_CASE_DETAILS}`,
        `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_DOCUMENTS}`,
        `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_NOTES}`,
        `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS}`,
        `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_RFI}`,
        `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_HISTORY}`,
        `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS}/${constants.PREMIUM_PROCESSING_TAB_BUREAU}`,
        `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS}/${constants.PREMIUM_PROCESSING_TAB_NON_BUREAU}`,
        `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS}/${constants.PREMIUM_PROCESSING_TAB_CLIENT}`,
      ]);
    }
  }, [taskId]);

  const addRow = (insurer, index) => {
    if (index === 'increment') {
      index = Object.keys(bureauInsurersDetails).length - 1;
    }
    const isDuplicateEnteredWorkPackageRef = bureauInsurersDetails?.[index]?.workPackageRefNumber === isDuplicateWorkRefNo;
    const isDuplicateInDbWorkPackageRef = isDuplicateWorkRefNoInDb?.find((workPackage) => {
      return workPackage.toLowerCase() === bureauInsurersDetails?.[index]?.workPackageRefNumber.toLowerCase();
    });
    const date = bureauInsurersDetails?.[index]?.date || null;
    return (
      <TableRow key={index}>
        <TableCell {...columnProps('workPackageRefNumber')}>
          <FormText
            id={index}
            name={index}
            value={bureauInsurersDetails?.[index]?.workPackageRefNumber || ''}
            muiComponentProps={{
              onChange: handlers.handleInputChange,
              fullWidth: false,
              value: insurer.workPackageRefNumber,
              InputProps: {
                readOnly: !hasEditPermission || isCompletedStage || isRejectedStage,
              },
              inputProps: {
                maxLength: 30,
              },
            }}
            error={
              bureauInsurersDetails?.[index]?.error && !bureauInsurersDetails?.[index]?.workPackageRefNumber
                ? {}
                : undefined || isDuplicateEnteredWorkPackageRef || isDuplicateInDbWorkPackageRef
            }
          />
        </TableCell>
        <TableCell {...columnProps('status')}>
          <CheckCircleOutlineIcon className={insurer.status ? classes.enabled : classes.disabled} />
        </TableCell>
        <TableCell {...columnProps('date')}>
          <FormDate
            control={control}
            type="datepicker"
            id={index}
            name={index}
            placeholder={utils.string.t('premiumProcessing.bureauColumns.selectDate')}
            value={date}
            plainText
            defaultValue={date}
            muiComponentProps={{
              fullWidth: false,
              disabled: !hasEditPermission || isCompletedStage || isRejectedStage || isNotMyTaskView,
            }}
            handlers={{
              toggelDatePicker: handlers.handleDatePickerUpdate,
            }}
            muiPickerProps={{
              disableToolbar: true,
              variant: 'inline',
              format: config.ui.format.date.slashNumeric,
            }}
            nestedClasses={{
              input: bureauInsurersDetails?.[index]?.error && bureauInsurersDetails?.[index]?.date === '' ? classnames(classes.error) : {},
            }}
          />
        </TableCell>
        <TableCell {...columnProps('bureau')}>
          <Box display="flex">
            <SelectPopover
              id={index}
              buttonDisabled={!hasEditPermission || isCompletedStage || isRejectedStage || isNotMyTaskView}
              text={handlers.getSelectedBureauLabel(index) || utils.string.t('premiumProcessing.bureauColumns.selectBureau')}
              buttonText={utils.string.t('premiumProcessing.bureauColumns.selectBureau')}
              showSubmitButton={false}
              buttonVariant={'text'}
              handlers={{
                onTogglePopOver: () => {},
                onToggleOption: () => {},
              }}
              error={
                bureauInsurersDetails?.[index]?.error && !bureauInsurersDetails?.[index]?.selectedBureau.length ? { message: '' } : null
              }
            >
              <MultiSelect
                options={bureauList}
                id={index}
                handlers={{
                  toggleOption: handlers.toggleMultiSelectOption(index),
                }}
                selectedItems={bureauInsurersDetails?.[index]?.selectedBureau || []}
              />
            </SelectPopover>
          </Box>
        </TableCell>
        <TableCell>
          {(bureauInsurersDetails?.[index]?.selectedBureau && bureauInsurersDetails?.[index]?.selectedBureau.length) ||
          bureauInsurersDetails?.[index]?.workPackageRefNumber ||
          (bureauInsurersDetails?.[index]?.date && bureauInsurersDetails?.[index]?.date.length) ? (
            <Button
              danger
              disabled={!hasEditPermission || isCompletedStage || isRejectedStage || isNotMyTaskView}
              icon={HighlightOffIcon}
              variant="text"
              size="small"
              tooltip={{ title: utils.string.t('app.remove') }}
              onClick={() => {
                handlers.showAlert(
                  () => {
                    if (bureauInsurersDetails[index]?.caseIncidentIssueDocsId) {
                      dispatch(deleteBureauInsurerDetails(bureauInsurersDetails[index].caseIncidentIssueDocsId)).then((response) => {
                        if (response.status === constants.API_RESPONSE_OK) {
                          handlers.handleRemoveRow(index);
                        }
                        dispatch(hideModal());
                      });
                    } else {
                      handlers.handleRemoveRow(index);
                      dispatch(hideModal());
                    }
                  },
                  () => {},
                  utils.string.t('premiumProcessing.bureauColumns.alertPopupOnRemove')
                );
              }}
            />
          ) : null}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead columns={columnsArray} />
          <TableBody>
            {Object.keys(bureauInsurersDetails).map((key) => {
              return addRow(bureauInsurersDetails[key], key);
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {(Object.keys(bureauInsurersDetails).length > 1 || isEdited) && hasEditPermission && (
        <Grid className={classes.cancelSaveButton}>
          <Box display="flex" justifyContent="space-between">
            <Box flex="1  auto" textAlign="right">
              <Button
                text={utils.string.t('app.cancel')}
                color="primary"
                size="small"
                variant="text"
                onClick={handlers.handleCancel}
                disabled={isCompletedStage || isRejectedStage || isNotMyTaskView}
              />
            </Box>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              text={utils.string.t('app.save')}
              onClick={handlers.handleSubmit}
              disabled={isCompletedStage || isRejectedStage || isNotMyTaskView}
            />
          </Box>
          <PreventNavigation dirty={isEdited} allowedUrls={allowedUrls} />
        </Grid>
      )}
    </>
  );
}
