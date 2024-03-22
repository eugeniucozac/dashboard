import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DmsUploadFilesRow.styles';
import { TableCell, PopoverMenu, Button, FormText, Warning, Loader, FormGrid, FormDate, FormSelect } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { makeStyles, TableRow, Box, Collapse, InputAdornment } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

DmsUploadFilesRowView.propTypes = {
  index: PropTypes.number,
  file: PropTypes.any,
  getFileKey: PropTypes.func,
  docTypesActions: PropTypes.array,
  docClassificationTypesActions: PropTypes.array,
  currencies: PropTypes.array,
  fileRowForm: PropTypes.any,
  errors: PropTypes.shape({
    isDuplicateFileName: PropTypes.bool,
    isInvalidFileName: PropTypes.bool,
  }),
  filesSubmitted: PropTypes.bool,
  showDocTypeRequired: PropTypes.bool,
  isUploading: PropTypes.bool,
  uploadStatus: PropTypes.bool,
  handlers: PropTypes.shape({
    removeFiles: PropTypes.func,
    fileNameChange: PropTypes.func,
    retrySingleFile: PropTypes.func,
    paymentDateInput: PropTypes.func,
    paymentRefInput: PropTypes.func,
    lossPayeeInput: PropTypes.func,
    paymentAmountInput: PropTypes.func,
    paymentCurrencyInput: PropTypes.func,
  }),
};

export function DmsUploadFilesRowView({
  index,
  file,
  getFileKey,
  docTypesActions,
  docClassificationTypesActions,
  currencies,
  fileRowForm,
  errors,
  filesSubmitted,
  showDocTypeRequired,
  isUploading,
  uploadStatus,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'DmsUploadFilesRow' })();

  const { fileNameChange, paymentDateInput, paymentRefInput, lossPayeeInput, paymentAmountInput, paymentCurrencyInput } = handlers;
  const { isDuplicateFileName, isInvalidFileName } = errors;

  const isPaymentType = fileRowForm?.formDocType?.label === constants.DMS_DOCUMENT_TYPE_PAYMENT;
  const fileNameWithoutExtension = fileRowForm?.formFileName?.substr(0, fileRowForm?.formFileName?.lastIndexOf('.'));
  const fileExtension = fileRowForm?.formFileName?.substr(fileRowForm?.formFileName?.lastIndexOf('.'));

  return (
    <>
      <TableRow key={getFileKey(file)} className={classes.root}>
        <TableCell className={classes.cellWidth}>
          <FormText
            type="textarea"
            name={`files${index}name`}
            value={fileNameWithoutExtension}
            muiComponentProps={{
              onChange: fileNameChange(),
              size: 'small',
              multiline: true,
              rows: 1,
              rowsMax: 6,
              InputProps: {
                endAdornment: <InputAdornment position="end">{fileExtension}</InputAdornment>,
              },
            }}
            compact={true}
          />

          {isDuplicateFileName && (
            <Warning
              type="alert"
              size="small"
              align="left"
              icon={ErrorOutlineIcon}
              text={utils.string.t('dms.upload.warning.duplicateDocumentWarning')}
            />
          )}
          {isInvalidFileName && (
            <Warning
              type="error"
              size="small"
              align="left"
              icon={ErrorOutlineIcon}
              text={utils.string.t('dms.upload.warning.invalidInputWarning')}
            />
          )}
        </TableCell>

        <TableCell className={classes.cellWidth}>
          <PopoverMenu
            text={
              docTypesActions.length === 1
                ? docTypesActions[0].label
                : fileRowForm?.formDocType?.label || utils.string.t('dms.upload.modalItems.selectDocumentType')
            }
            size="small"
            id={`files${index}`}
            icon={ArrowDropDownIcon}
            iconPosition="right"
            disabled={false}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            items={docTypesActions}
          />

          {showDocTypeRequired && !fileRowForm?.formDocType?.label && (
            <Warning
              type="error"
              size="small"
              align="left"
              icon={ErrorOutlineIcon}
              text={utils.string.t('dms.upload.warning.emptyDocumentType')}
            />
          )}
        </TableCell>

        <TableCell className={classes.cellWidth}>
          <PopoverMenu
            id={`files${index}`}
            text={fileRowForm?.formDocClassificationType?.label || docClassificationTypesActions[2]?.label}
            icon={ArrowDropDownIcon}
            iconPosition="right"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            items={docClassificationTypesActions}
          />
        </TableCell>

        <TableCell className={classes.cellWidth}>
          {isUploading && !filesSubmitted && <Loader visible={isUploading} inline />}

          {!isUploading && !filesSubmitted && (
            <Button icon={HighlightOffIcon} variant="text" danger={false} size="small" onClick={() => handlers.removeFiles(index)} />
          )}

          {!isUploading && uploadStatus && filesSubmitted && (
            <Button icon={CheckCircleIcon} variant="text" danger={false} size="small" nestedClasses={{ btn: classes.iconSuccess }} />
          )}

          {!isUploading && !uploadStatus && filesSubmitted && (
            <>
              <Button icon={ErrorOutlineIcon} variant="text" danger={true} size="small" />
              <Button
                text={utils.string.t('dms.upload.modalItems.retryUpload')}
                onClick={() => handlers.retrySingleFile(index)}
                variant="text"
                size="small"
                color="secondary"
                nestedClasses={{ btn: classes.btnRetry }}
              />
            </>
          )}
        </TableCell>
      </TableRow>

      {/* PAYMENT ROW */}

      {isPaymentType && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isPaymentType} timeout="auto">
              <Box my={2}>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormDate
                      label={utils.string.t('dms.upload.paymentDetails.paymentDate')}
                      name={`${constants.DMS_DOCUMENT_TYPE_PAYMENT}[${index}].paymentDate`}
                      type="date"
                      outputFormat="iso"
                      muiComponentProps={{
                        classes: {
                          root: classes.datepicker,
                        },
                        onChange: paymentDateInput(),
                      }}
                    />
                  </FormGrid>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormText
                      label={utils.string.t('dms.upload.paymentDetails.enterReference')}
                      name={`${constants.DMS_DOCUMENT_TYPE_PAYMENT}[${index}].paymentReference`}
                      defaultValue=""
                      muiComponentProps={{
                        onChange: paymentRefInput(),
                      }}
                    />
                  </FormGrid>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormText
                      name={`${constants.DMS_DOCUMENT_TYPE_PAYMENT}[${index}].lossPayee`}
                      label={utils.string.t('dms.upload.paymentDetails.enterName')}
                      defaultValue=""
                      muiComponentProps={{
                        onChange: lossPayeeInput(),
                      }}
                    />
                  </FormGrid>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormText
                      type="number"
                      name={`${constants.DMS_DOCUMENT_TYPE_PAYMENT}[${index}].amount`}
                      label={utils.string.t('dms.upload.paymentDetails.enterAmount')}
                      defaultValue=""
                      muiComponentProps={{
                        onChange: paymentAmountInput(),
                      }}
                    />
                  </FormGrid>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormSelect
                      label={utils.string.t('dms.upload.paymentDetails.selectCurrency')}
                      name={`${constants.DMS_DOCUMENT_TYPE_PAYMENT}[${index}].currency`}
                      options={currencies}
                      optionKey="id"
                      optionLabel="name"
                      value={fileRowForm?.paymentFields?.currency || ''}
                      handleUpdate={(name, value) => paymentCurrencyInput(name, value)}
                    />
                  </FormGrid>
                </FormGrid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
