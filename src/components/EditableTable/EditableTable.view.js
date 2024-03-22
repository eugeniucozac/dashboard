import React, { Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import NumberFormat from 'react-number-format';

//app
import styles from './EditableTable.styles';
import { TableHead, TableCell, Button, Overflow, Translate } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';

//mui
import {
  makeStyles,
  Box,
  Typography,
  Table,
  TableBody,
  MenuItem,
  TableRow,
  Select,
  Checkbox,
  TextField,
  TableContainer,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import UndoIcon from '@material-ui/icons/Undo';
import { KeyboardDatePicker } from '@material-ui/pickers';
import TodayIcon from '@material-ui/icons/Today';
import EventIcon from '@material-ui/icons/Event';

EditableTableView.propTypes = {
  fields: PropTypes.shape({
    arrayItemDef: PropTypes.array,
    fieldData: PropTypes.array,
  }),
  tableRows: PropTypes.array,
  isTableEditable: PropTypes.bool,
  handlers: PropTypes.shape({
    handleTableTextboxChange: PropTypes.func,
    handleTableRowClick: PropTypes.func,
    handleTableDatePickerChange: PropTypes.func,
    handleTableCopyRowData: PropTypes.func,
    handleTableSelectChange: PropTypes.func,
    handleTableUndoRowData: PropTypes.func,
  }),
};

export function EditableTableView({ fields, tableRows, isTableEditable, handlers }) {
  const classes = makeStyles(styles, { name: 'EditableTable' })();
  const copyIcon = (index) => {
    return (
      <Button
        icon={FileCopyIcon}
        onClick={() => isTableEditable && handlers.handleTableCopyRowData(index)}
        size="xsmall"
        variant="text"
        color="default"
        tooltip={{ title: utils.string.t('app.copyButtonToolTip') }}
      />
    );
  };
  const cancelIcon = (row) => {
    return (
      <Button
        icon={UndoIcon}
        onClick={() => isTableEditable && handlers.handleTableUndoRowData(row)}
        size="xsmall"
        variant="text"
        color="default"
        tooltip={{ title: utils.string.t('app.undoButtonToolTip') }}
      />
    );
  };
  const retainBrokerAmountDetails = (row) => {
    return (
      <>
        <Translate
          label="format.currency"
          options={{
            value: {
              number: row?.retainedBrokerageAmount,
              currency: row.retainedBrokerageCurrencyCodeName || constants.CURRENCY_USD,
            },
          }}
        />
        {row?.convertedBrokerage && (
          <>
            <br />
            <Translate label="format.currency" options={{ value: { number: row?.convertedBrokerage.value, currency: 'GBP' } }} /> @
            <Translate
              label="format.number"
              options={{
                value: { number: row?.convertedBrokerage.rate, format: { trimMantissa: false } },
              }}
            />
          </>
        )}
      </>
    );
  };
  return (
    <Box display="inline-block" width="100%">
      <Overflow>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.dataTable} size="small">
            <TableHead nestedClasses={{ tableHead: classes.tableHead }} columns={fields?.arrayItemDef} />
            <TableBody className={classes.tableBody}>
              {utils.generic.isValidArray(tableRows, true) ? (
                tableRows?.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      className={classnames({
                        [classes.tableRowNonClickable]: !isTableEditable,
                        [classes.tableRow]: isTableEditable,
                        [classes.selectedRow]: row.isRowSelected,
                      })}
                    >
                      {fields.arrayItemDef.map((column, defIndex) => {
                        const ppwOrPpcDateValue =
                          column.type === 'datepicker' || column.type === 'customDatepicker'
                            ? row.ppwOrPpcDate
                              ? moment(row.ppwOrPpcDate).format(column.format)
                              : '-'
                            : '';
                        return (
                          column.visible &&
                          (row.isRowSelected ? (
                            <TableCell
                              onClick={(e) => isTableEditable && column?.type !== 'actions' && handlers.handleTableRowClick(e, row)}
                              {...row[column]}
                              key={defIndex}
                              width={row[column?.width]}
                            >
                              {column.type === 'numericText' && (
                                <NumberFormat
                                  value={row[column?.id]}
                                  customInput={TextField}
                                  variant={'outlined'}
                                  fullWidth={true}
                                  isNumericString
                                  thousandSeparator={false}
                                  onValueChange={(v) => {
                                    handlers.handleTableTextboxChange(v, column, row);
                                  }}
                                />
                              )}
                              {column.type === 'text' && (
                                <TextField
                                  width={row[column?.width]}
                                  name="fieldText"
                                  type="text"
                                  fullWidth
                                  error={row[column?.error]}
                                  disabled={column?.disabled}
                                  size="small"
                                  inputProps={{ inputMode: 'text' }}
                                  value={row[column?.id]}
                                  variant="outlined"
                                  onChange={(e) => handlers.handleTableTextboxChange(e, column, row)}
                                />
                              )}
                              {column.type === 'customText' && (
                                <>
                                  {column.id === 'thirdPartyName' && (
                                    <TextField
                                      width={row[column?.width]}
                                      name="fieldText"
                                      type="text"
                                      fullWidth
                                      error={row[column?.error]}
                                      disabled={column?.disabled || !row.thirdPartyCommissionSharing}
                                      title={column?.disabled || (!row.thirdPartyCommissionSharing && column.tooltip)}
                                      size="small"
                                      inputProps={{ inputMode: 'text' }}
                                      value={row[column?.id]}
                                      variant="outlined"
                                      onChange={(e) => handlers.handleTableTextboxChange(e, column, row)}
                                    />
                                  )}
                                  {column.id === 'pfInternalDepartment' && (
                                    <TextField
                                      width={row[column?.width]}
                                      name="fieldText"
                                      type="numeric"
                                      fullWidth
                                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                      error={row[column?.error]}
                                      disabled={column?.disabled || !row.pfInternalCommissionSharing}
                                      title={column?.disabled || (!row.pfInternalCommissionSharing && column.tooltip)}
                                      size="small"
                                      value={row[column?.id]}
                                      variant="outlined"
                                      onChange={(e) => handlers.handleTableTextboxChange(e, column, row)}
                                    />
                                  )}
                                </>
                              )}
                              {column.type === 'datepicker' && (
                                <KeyboardDatePicker
                                  value={row[column?.id]}
                                  inputVariant="outlined"
                                  disabled={column?.disabled}
                                  name={column?.id}
                                  format={column.format}
                                  renderInput={(params) => <TextField {...params} />}
                                  placeholder={utils.string.t('app.selectDate')}
                                  onChange={(newValue) => {
                                    if (utils.generic.isFunction(handlers.handleTableDatePickerChange)) {
                                      handlers.handleTableDatePickerChange(column?.id, newValue?.format('YYYY-MM-DD'), row);
                                    }
                                  }}
                                  keyboardIcon={
                                    false ? <TodayIcon className={classes.dateIcon} /> : <EventIcon className={classes.dateIcon} />
                                  }
                                />
                              )}
                              {column.type === 'customDatepicker' && (
                                <KeyboardDatePicker
                                  value={row[column?.id]}
                                  inputVariant="outlined"
                                  disabled={!row.ppwOrPpcName || row.ppwOrPpcName === 'N/A'}
                                  title={!row.ppwOrPpcName || row.ppwOrPpcName === 'N/A' ? column.tooltip : ''}
                                  name={column?.id}
                                  format={column.format}
                                  renderInput={(params) => <TextField {...params} />}
                                  placeholder={utils.string.t('app.selectDate')}
                                  onChange={(newValue) => {
                                    if (utils.generic.isFunction(handlers.handleTableDatePickerChange)) {
                                      handlers.handleTableDatePickerChange(column?.id, newValue?.format('YYYY-MM-DD'), row);
                                    }
                                  }}
                                  keyboardIcon={
                                    false ? <TodayIcon className={classes.dateIcon} /> : <EventIcon className={classes.dateIcon} />
                                  }
                                />
                              )}
                              {column?.type === 'select' && (
                                <Select
                                  fullWidth
                                  variant="outlined"
                                  onChange={(e, data) => {
                                    handlers.handleTableSelectChange(
                                      e,
                                      {
                                        name: data?.props.name,
                                        value: data?.props.value,
                                      },
                                      column,
                                      row
                                    );
                                  }}
                                  value={row[column?.id]}
                                >
                                  {utils.generic.isValidArray(column?.options, true) &&
                                    column.options.map((option) => {
                                      return (
                                        <MenuItem
                                          key={`${option[column?.optionLabel]}-${option[column?.optionKey]}`}
                                          disabled={option.disabled}
                                          name={option[column?.optionLabel]}
                                          value={option[column?.optionKey]}
                                        >
                                          {option[column?.optionLabel]}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              {column?.type === 'checkbox' && <Checkbox checked={row[column?.id]} size="small" />}
                              {column?.type === 'label' && <Box>{row[column?.id]}</Box>}
                              {column?.type === 'retainedBrokeragelabel' && (
                                <Box pl={1} className={classes.brokerageLabel}>
                                  {retainBrokerAmountDetails(row)}
                                </Box>
                              )}
                              {column?.type === 'actions' && (
                                <Box pl={1} display={'flex'}>
                                  {row.id > 0 && column?.actions?.includes('copy') && copyIcon(row.id)}
                                  {column?.actions?.includes('cancel') && cancelIcon(row)}
                                </Box>
                              )}
                            </TableCell>
                          ) : (
                            <TableCell
                              title={isTableEditable && column?.type !== 'actions' && utils.string.t('app.editRowTooltip')}
                              onClick={(e) => isTableEditable && column?.type !== 'actions' && handlers.handleTableRowClick(e, row)}
                              key={defIndex}
                              {...row[column]}
                              width={row[column?.width]}
                              className={classes.tableCellLabel}
                            >
                              {column?.type === 'checkbox' && <Checkbox checked={row[column?.id]} size="small" />}
                              {column?.type !== 'checkbox' &&
                                column?.type !== 'actions' &&
                                column?.type !== 'datepicker' &&
                                column?.type !== 'customDatepicker' &&
                                column?.type !== 'select' &&
                                column?.type !== 'retainedBrokeragelabel' &&
                                (row[column?.id] || '-')}
                              {column?.type === 'retainedBrokeragelabel' && (
                                <Box className={classes.brokerageLabel}>{retainBrokerAmountDetails(row)}</Box>
                              )}
                              {column?.type === 'select' && (row[column?.id]?.value || row[column?.displayName] || '-')}
                              {column?.type === 'datepicker' && (row[column?.id] || '-')}
                              {column?.type === 'customDatepicker' &&
                                (column.id === 'ppwOrPpcDate' ? ppwOrPpcDateValue || '-' : row[column?.id] || '-')}
                              {column?.type === 'actions' && row.id > 0 && copyIcon(row.id)}
                            </TableCell>
                          ))
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell colSpan={fields?.arrayItemDef?.length || 5}>
                    <Box display={'flex'} justifyContent={'center'}>
                      <Typography className={classes.tableCellLabel}>{utils.string.t('app.editableTableNoData')}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Overflow>
    </Box>
  );
}
