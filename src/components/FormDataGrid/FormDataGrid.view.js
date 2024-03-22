import React, { Fragment } from 'react';
import classnames from 'classnames';
import merge from 'lodash/merge';

import styles from './FormDataGrid.style';
import { Button, Overflow, TableCell, TableHead } from 'components';
import { AddRiskFormField } from 'modules';
import StringDisplay from './StringDisplay';
import SumTotalValues from './SumTotalValues';
import * as utils from 'utils';

// mui
import { makeStyles, Table, TableRow, TableBody } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const FormDataGridView = ({ cols, field, formProps, validFields, customFields, handlers, fields, showCopyIconFirst }) => {
  const classes = makeStyles(styles, { name: 'FormDataGrid' })();

  const copyIcon = (index) => {
    return (
      <TableCell className={classnames([classes.deleteCell, classes.tableRowCell])}>
        {index ? (
          <Button
            tooltip={{ title: utils.string.t('form.formDataGrid.copyHelp'), placement: 'top' }}
            size="small"
            icon={FileCopyIcon}
            variant="outlined"
            nestedClasses={{ btn: classes.copyBtn }}
            onClick={() => handlers.copyRowData(index)}
            data-testid={`btn-row-copy-${index}`}
          />
        ) : null}
      </TableCell>
    );
  };

  const CustomComponent = ({ field, item, index, formProps }) => {
    switch (item.type) {
      case 'stringDisplay':
        return <StringDisplay field={field.name} item={item} index={index} formProps={formProps} />;
      case 'sumOfValues':
        return <SumTotalValues field={field.name} item={item} index={index} formProps={formProps} />;

      default:
        return null;
    }
  };

  return (
    <Overflow>
      <Table size="small" className={classes.table} data-testid={`form-data-grid`}>
        <TableHead columns={cols} nestedClasses={{ tableHead: classes.tableHead }} />
        <TableBody data-testid="risk-array-table" className={classes.tableBody}>
          {fields.map((item, index) => {
            const visibleDefs = field.arrayItemDef.filter((f) => f.type !== 'hidden');
            const hiddenDefs = field.arrayItemDef.filter((f) => f.type === 'hidden');

            return (
              <Fragment key={item.id}>
                <TableRow className={classes.tableRow}>
                  {hiddenDefs.map((def) => {
                    return (
                      <AddRiskFormField
                        key={def.name}
                        field={{
                          ...def,
                          name: `${field.name}[${index}].${def.name}`,
                          defaultValue: item[def.name],
                        }}
                        formProps={formProps}
                      />
                    );
                  })}

                  {showCopyIconFirst ? copyIcon(index) : null}

                  {visibleDefs.map((def, defIndex) => {
                    if (![...validFields, ...customFields].includes(def.type)) return null;

                    const { label, ...fieldProps } = def;
                    const condition = utils.risk.getCondition(def, field.arrayItemDef);
                    const conditionValue = condition && formProps.watch(`${field.name}[${index}].${condition.name}`);
                    const isValid = !condition || (condition && utils.risk.isConditionValid(condition, conditionValue));
                    const isDisabled = def?.disabled || (condition && !isValid);

                    return (
                      <TableCell
                        key={def.name}
                        className={classnames([
                          classes.sizeSmall,
                          {
                            [classes.tableRowCell]: true,
                            [classes.minimal]: true,
                            [classes.tableRowCellDisabled]: isDisabled,
                            [classes.tableRowCellFirst]: defIndex === 0,
                            [classes.tableRowCellMiddle]: defIndex > 0 && defIndex < visibleDefs.length - 1,
                            [classes.tableRowCellLast]: defIndex === visibleDefs.length - 1,
                            [classes.tableRowAlignCenter]: fieldProps?.alignCenter,
                          },
                        ])}
                        style={{ ...(fieldProps.width && { width: `${fieldProps.width}px` }) }}
                      >
                        {customFields.includes(def.type) ? (
                          <CustomComponent field={field} index={index} item={def} formProps={formProps} />
                        ) : (
                          <AddRiskFormField
                            field={{
                              ...fieldProps,
                              name: `${field.name}[${index}].${def.name}`,
                              defaultValue: item[def.name],
                              muiComponentProps: merge(fieldProps.muiComponentProps || {}, {
                                ...(['text', 'number'].includes(def.type) && { InputProps: { disabled: isDisabled } }),
                              }),
                            }}
                            formProps={formProps}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                  {showCopyIconFirst ? null : copyIcon(index)}
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </Overflow>
  );
};

export default FormDataGridView;
