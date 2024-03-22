import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';

useFlexiColumns.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      visible: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onToggleColumn: PropTypes.func,
};

export default function useFlexiColumns(columns = [], onToggleColumn) {
  const [columnsArray, setColumnsArray] = useState(columns.map((c) => ({ ...c, visible: c.menu ? true : Boolean(c.visible) })));
  const [isTableHidden, setIsTableHidden] = useState(false);
  const hasColumns = utils.generic.isValidArray(columnsArray, true);
  const getColumnById = (id) => {
    return hasColumns ? columnsArray.find((c) => c.id === id) : {};
  };

  const toggleColumn = (column) => {
    if (utils.generic.isFunction(onToggleColumn)) {
      onToggleColumn(column);
    }

    setColumnsArray(
      columnsArray.map((c) => {
        return c.id === column.id ? { ...c, visible: !c.visible } : c;
      })
    );
  };

  useEffect(() => {
    // Update the value True/False based on the visable columns to hide entire Table
    setIsTableHidden(columnsArray.every((colVal) => colVal.visible === false));
  }, [columnsArray]);

  const isColumnVisible = (id) => {
    return Boolean(hasColumns ? Boolean(getColumnById(id)?.visible) : false);
  };

  const isColumnHidden = (id) => {
    return Boolean(hasColumns ? !Boolean(getColumnById(id)?.visible) : true);
  };

  const columnProps = (id) => {
    const column = hasColumns ? getColumnById(id) : null;

    return column
      ? {
          ...(column.bold && { bold: column.bold }),
          ...(column.borderless && { borderless: column.borderless }),
          ...(column.center && { center: column.center }),
          ...(column.compact && { compact: column.compact }),
          ...(column.ellipsis && { ellipsis: column.ellipsis }),
          ...(column.menu && { menu: column.menu }),
          ...(column.minimal && { minimal: column.minimal }),
          ...(column.narrow && { narrow: column.narrow }),
          ...(column.nowrap && { nowrap: column.nowrap }),
          ...(column.relative && { relative: column.relative }),
          ...(column.right && { right: column.right }),
          hidden: !column.visible,
        }
      : {};
  };

  return {
    columns: columnsArray,
    isColumnVisible,
    isColumnHidden,
    columnProps,
    toggleColumn,
    isTableHidden,
  };
}
