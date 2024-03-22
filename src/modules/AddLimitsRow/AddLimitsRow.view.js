import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import merge from 'lodash/merge';

// app
import styles from './AddLimitsRow.styles';
import { Button, Overflow, TableCell, TableHead, Pagination } from 'components';
import { AddRiskFormField } from 'modules';
import { useMedia } from 'hooks';
import * as utils from 'utils';

// mui
import { Box, Divider, Table, TableBody, TableRow, makeStyles } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddIcon from '@material-ui/icons/Add';

AddLimitsRowView.propTypes = {
  field: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  validFields: PropTypes.array.isRequired,
  formProps: PropTypes.object.isRequired,
  overflow: PropTypes.bool,
  removeLastField: PropTypes.bool,
  fields: PropTypes.array,

  handlers: PropTypes.shape({
    launchPasteFromExcelModal: PropTypes.func.isRequired,
    closePasteFromExcelModal: PropTypes.func.isRequired,
    append: PropTypes.func.isRequired,
  }),
};

export function AddLimitsRowView({
  field,
  limitFieldOptions,
  cols,
  validFields,
  fieldName,
  overflow,
  handlers,
  removeLastField,
  fields,
  formProps,
  pagination,
  label,
  qualifier,
}) {
  const classes = makeStyles(styles, { name: 'AddLimitsRow' })();
  const media = useMedia();
  const displayFields = fields.filter((field) => field.fieldName === fieldName);

  const getEmptyObject = useCallback(() => {
    return {
      fieldName,
      label: label,
      qualifier: qualifier,
      limit: '',
      limitFieldOptions: null,
      alert: '',
    };
  }, [fieldName, label, qualifier]);

  const setToLastPage = useCallback(
    (count) => {
      const length = displayFields.length + count;
      let newPage = Math.ceil(length / pagination.rowsPerPage);
      if (length <= pagination.rowsPerPage) {
        newPage = 1;
      }
      pagination.handleChangePage(null, newPage - 1);
    },
    [displayFields.length, pagination]
  );

  const appendHandler = useCallback(
    (obj) => {
      let formattedObj;
      // TODO pass all limit fields option and set formatName
      formattedObj = obj
        ?.map((item) => utils.generic.formatFields(item, field?.arrayItemDef))
        .map((item) => ({
          ...getEmptyObject(),
          ...item,
        }));
      handlers.append(formattedObj || getEmptyObject());
      setToLastPage(formattedObj ? formattedObj.length : 1);
    },
    [field, setToLastPage, getEmptyObject, handlers]
  );

  const removeHandler = (idx) => {
    if (fields && fields.length === 1 && idx === 0 && !removeLastField) {
      formProps.setValue(field.name, [getEmptyObject()]);
    } else {
      handlers.remove(idx);
    }
  };

  const sortedFields = displayFields.sort((item1, item2) => {
    const str1 =
      item1?.limitFieldOptions && typeof item1?.limitFieldOptions === 'object' ? item1?.limitFieldOptions.label : item1?.limitFieldOptions;
    const str2 =
      item2?.limitFieldOptions && typeof item2?.limitFieldOptions === 'object' ? item2?.limitFieldOptions.label : item2?.limitFieldOptions;

    if (str1 > str2) {
      return 1;
    } else if (str1 < str2) {
      return -1;
    } else {
      return 0;
    }
  });

  const renderTable = () => {
    return (
      <Table size="small" className={classes.table}>
        <TableHead
          columns={cols}
          nestedClasses={{
            tableHead: classes.tableHead,
            tableCell: classes.tableHeadCell,
          }}
        />

        <TableBody data-testid="limits-array-table" className={classes.tableBody}>
          {(pagination.rowsPerPage > 0
            ? sortedFields.slice(
                pagination.page * pagination.rowsPerPage,
                pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
              )
            : sortedFields
          ).map((item) => {
            const index = fields.findIndex((field) => field.id === item.id);

            const visibleDefs = field.arrayItemDef.filter((f) => f.type !== 'hidden');
            const hiddenDefs = field.arrayItemDef.filter((f) => f.type === 'hidden');

            return item.fieldName === fieldName ? (
              <Fragment key={item.id}>
                {fields.length > 1 && index > 0 && (
                  <TableRow className={classes.tableRowDivider}>
                    <TableCell colSpan={cols.length} className={classes.tableRowDividerCell}>
                      <Divider classes={{ root: classes.divider }} />
                    </TableCell>
                  </TableRow>
                )}

                <TableRow className={classes.tableRow}>
                  {hiddenDefs.map((def) => {
                    return (
                      <TableCell key={def.name} className={classes.tableRowCellHidden}>
                        <AddRiskFormField
                          field={{
                            ...def,
                            name: `${field.name}[${index}].${def.name}`,
                            defaultValue: item[def.name],
                          }}
                          formProps={formProps}
                        />
                      </TableCell>
                    );
                  })}

                  {visibleDefs.map((def, defIndex) => {
                    if (!validFields.includes(def.type)) return null;

                    const { label, ...fieldProps } = def;
                    const condition = utils.risk.getCondition(def, field.arrayItemDef);
                    const isDisabled = condition;

                    return (
                      <TableCell
                        key={def.name}
                        className={classnames({
                          [classes.tableRowCell]: true,
                          [classes.tableRowCellDisabled]: isDisabled,
                          [classes.tableRowCellFirst]: defIndex === 0,
                          [classes.tableRowCellMiddle]: defIndex > 0 && defIndex < visibleDefs.length - 1,
                          [classes.tableRowCellLast]: defIndex === visibleDefs.length - 1,
                          [classes.tableRowAlignCenter]: fieldProps?.alignCenter,
                        })}
                        style={{ ...(fieldProps.width && { width: `${fieldProps.width}%` }) }}
                      >
                        <AddRiskFormField
                          field={{
                            ...fieldProps,
                            label: media.mobile ? label : undefined,
                            name: `${field.name}[${index}].${def.name}`,
                            defaultValue: item[def.name],
                            options: limitFieldOptions || [],
                            muiComponentProps: merge(fieldProps.muiComponentProps || {}, {
                              ...(['text', 'number'].includes(def.type) && { InputProps: { disabled: isDisabled } }),
                            }),
                          }}
                          formProps={formProps}
                        />
                      </TableCell>
                    );
                  })}

                  <TableCell className={classnames([classes.deleteCell, classes.tableRowCell])}>
                    <Button
                      danger
                      size="small"
                      icon={HighlightOffIcon}
                      disabled={removeLastField ? false : fields.length === 1}
                      variant={media.mobile ? 'outlined' : 'text'}
                      text={media.mobile ? utils.string.t('app.delete') : undefined}
                      nestedClasses={{ btn: classes.deleteBtn }}
                      onClick={() => removeHandler(index)}
                      data-testid="btn-row-delete"
                    />
                  </TableCell>
                </TableRow>
              </Fragment>
            ) : null;
          })}
        </TableBody>
      </Table>
    );
  };
  return (
    <>
      {overflow && <Overflow style={media.mobile ? undefined : { marginTop: -24 }}>{renderTable()}</Overflow>}

      {!overflow && renderTable()}
      <Pagination
        page={pagination.page}
        count={pagination.count}
        rowsPerPage={pagination.rowsPerPage}
        onChangePage={pagination.handleChangePage}
        onChangeRowsPerPage={pagination.handleChangeRowsPerPage}
      />
      {limitFieldOptions?.length > 0 ? (
        <Box display="flex" mt={2}>
          <Box mr={1.5}>
            <Button color="secondary" size="small" icon={AddIcon} text={utils.string.t('app.add')} onClick={() => appendHandler()} />
          </Box>

          <Button
            color="secondary"
            size="small"
            variant="outlined"
            text={utils.string.t('app.pasteFromExcel')}
            onClick={() =>
              handlers.launchPasteFromExcelModal({
                name: field.name,
                headers: field.arrayItemDef
                  .filter((def) => def?.type !== 'hidden')
                  .reduce((acc, def) => {
                    return [...acc, { key: def.name, value: '' }];
                  }, []),
                handlers: {
                  submit: (data) => {
                    appendHandler(data);
                    handlers.closePasteFromExcelModal();
                  },
                },
              })
            }
          />
        </Box>
      ) : null}
    </>
  );
}
