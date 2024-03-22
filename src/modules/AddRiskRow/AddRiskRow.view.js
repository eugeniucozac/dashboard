import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFieldArray } from 'react-hook-form';
import classnames from 'classnames';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import get from 'lodash/get';

// app
import styles from './AddRiskRow.styles';
import { Button, Overflow, TableCell, TableHead } from 'components';
import { AddRiskFormField } from 'modules';
import { selectRiskCountries } from 'stores';
import { useMedia } from 'hooks';
import * as utils from 'utils';
import { COUNTRY_RATES } from 'consts';

// mui
import { Box, Divider, Table, TableBody, TableRow, makeStyles } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddIcon from '@material-ui/icons/Add';

AddRiskRowView.propTypes = {
  field: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  validFields: PropTypes.array.isRequired,
  formProps: PropTypes.object.isRequired,
  overflow: PropTypes.bool,
  formatData: PropTypes.string,
  removeLastField: PropTypes.bool,
  handlers: PropTypes.shape({
    launchPasteFromExcelModal: PropTypes.func.isRequired,
    closePasteFromExcelModal: PropTypes.func.isRequired,
  }),
};

export function AddRiskRowView({ field, cols, validFields, formProps, overflow, handlers, formatData, removeLastField }) {
  const classes = makeStyles(styles, { name: 'AddRiskRow' })();
  const media = useMedia();
  const countries = useSelector(selectRiskCountries);

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: field.name,
    defaultValue: [],
  });

  const getEmptyObject = () => {
    return mapValues(omit(fields[0], ['id']), (value, key) => {
      const defaultValue = get(
        field.arrayItemDef.find((def) => def.name === key),
        'defaultValue'
      );

      return typeof defaultValue !== 'undefined' ? defaultValue : null;
    });
  };

  const referValue = (value) => {
    return value === true || value.toUpperCase() === 'TRUE' || value === '1' || value.toUpperCase() === 'YES' ? true : false;
  };

  const formatCountryAndRates = (obj) => {
    return obj
      ? obj.map((item) => {
          const country = utils.risk.countryDetail(countries, item.countryCode) || null;
          const refer = referValue(item.refer);
          return {
            countryCode: country ? { ...country } : null,
            rate: item.rate ? parseFloat(item.rate) : 0,
            refer,
          };
        })
      : null;
  };

  const appendHandler = (obj) => {
    let formattedObj;
    switch (formatData) {
      case COUNTRY_RATES:
        formattedObj = formatCountryAndRates(obj);
        break;
      default:
        formattedObj = obj?.map((item) => utils.generic.formatFields(item, field?.arrayItemDef));
    }
    append(formattedObj || getEmptyObject());
  };

  const removeHandler = (idx) => {
    if (fields && fields.length === 1 && idx === 0 && !removeLastField) {
      formProps.setValue(field.name, [getEmptyObject()]);
    } else {
      remove(idx);
    }
  };

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

        <TableBody data-testid="risk-array-table" className={classes.tableBody}>
          {fields.map((item, index) => {
            const visibleDefs = field.arrayItemDef.filter((f) => f.type !== 'hidden');
            const hiddenDefs = field.arrayItemDef.filter((f) => f.type === 'hidden');

            return (
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
                    const conditionValue = condition && formProps.watch(`${field.name}[${index}].${condition.name}`);
                    const isValid = !condition || (condition && utils.risk.isConditionValid(condition, conditionValue));
                    const isDisabled = condition && !isValid;

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
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      {overflow && <Overflow style={media.mobile ? undefined : { marginTop: -24 }}>{renderTable()}</Overflow>}

      {!overflow && renderTable()}

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
              headers: field.arrayItemDef.reduce((acc, def) => {
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
    </>
  );
}
