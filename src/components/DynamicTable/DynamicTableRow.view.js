import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import * as utils from 'utils';
import styles from './DynamicTableRow.styles';
import { DynamicTableComponent, TableCell } from 'components';
import utilsOpeningMemo from '../../utils/openingMemo/openingMemo';

// mui
import { makeStyles } from '@material-ui/core';
import { TableRow } from '@material-ui/core';

DynamicTableRowView.propTypes = {
  row: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
};

export function DynamicTableRowView({ row, formProps }) {
  const classes = makeStyles(styles, { name: 'DynamicTableRow' })();

  const tableRowClasses = {
    [classes.subCell]: row.rowStyles && Boolean(row.rowStyles?.subRow),
    [classes.subCellHeader]: row.rowStyles && Boolean(row.rowStyles?.subRowHeader),
  };
  const changedByValue = utils.generic.isFunction(formProps?.watch) && formProps.watch(row.rowStyles?.changeBy);

  const showRow = row.rowStyles?.changeBy
    ? !row.rowStyles?.isHidden || utilsOpeningMemo.displaySubRow(changedByValue)
    : !row.rowStyles?.isHidden;

  return (
    showRow && (
      <TableRow className={classnames(tableRowClasses)}>
        {row.cells?.map((cell, index) => {
          return (
            <TableCell key={`${row.tabKey}-${row.rowKey}-${index}`} compact nestedClasses={{ root: classes.cell }} {...cell.cellProps}>
              {cell.label ? (
                <p
                  className={classnames({
                    [classes.labelIndent]: index === 0,
                    [classes.labelIndentExtra]: row.rowStyles?.extraLeftPadding,
                    [classes.labelWithComponent]: cell.type,
                    [classes.errorLabel]: cell.isError,
                  })}
                >
                  {utils.string.t(cell.label)}
                </p>
              ) : (
                ''
              )}
              {cell.type ? (
                <div className={classnames({ [classes.labelIndent]: index === 0 })}>
                  <DynamicTableComponent formProps={formProps} field={utils.form.getFieldProps(row.cells, cell.name)} rowKey={row.rowKey} />
                </div>
              ) : null}
            </TableCell>
          );
        })}
      </TableRow>
    )
  );
}
