import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './TableHead.styles';
import { TableCell } from 'components';
import * as utils from 'utils';

// mui
import { withStyles, TableHead as MuiTableHead, TableRow, TableSortLabel, Grid } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export class TableHead extends PureComponent {
  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.node,
        sort: PropTypes.shape({
          type: PropTypes.string,
          direction: PropTypes.oneOf([false, 'asc', 'desc']),
          handler: PropTypes.func,
        }),
        align: PropTypes.oneOf(['left', 'center', 'right']),
        compact: PropTypes.bool,
        narrow: PropTypes.bool,
        nowrap: PropTypes.bool,
        empty: PropTypes.bool,
        title: PropTypes.bool,
        visible: PropTypes.bool,
        hidden: PropTypes.bool,
        style: PropTypes.object,
      })
    ).isRequired,
    sorting: PropTypes.shape({
      by: PropTypes.string,
      direction: PropTypes.oneOf(['asc', 'desc']),
    }),
    bgColor: PropTypes.oneOf(['none', 'grey']),
    nestedClasses: PropTypes.shape({
      tableHead: PropTypes.string,
      tableCell: PropTypes.string,
    }),
  };

  static defaultProps = {
    nestedClasses: {},
    bgColor: 'none',
  };

  render() {
    const { columns, sorting, bgColor, nestedClasses, classes } = this.props;

    return (
      <MuiTableHead
        className={classnames({
          [classes.bgColorGrey]: Boolean(bgColor === 'grey'),
          [nestedClasses.tableHead]: Boolean(nestedClasses.tableHead),
        })}
      >
        <TableRow>
          {columns.map((column) => {
            const colHeaderStyle = {
              ...(column.align && { textAlign: column.align }),
              ...(column.compact && !column.width && { width: 5 }),
              ...(column.empty && { width: 0, padding: 0 }),
              ...(column.menu && { width: 24, padding: '4px 4px 8px' }),
              ...(column.width && { width: column.width }),
              ...column.style,
            };

            const sortBy = sorting && sorting.by;
            const sortDirection = sorting && sorting.direction;

            return (
              <TableCell
                key={column.id}
                className={classnames({
                  [classes.title]: column.title,
                  [nestedClasses.tableCell]: true,
                  [classes.stickyRightHeader]: column.stickyRight,
                  [classes.stickyLeftHeader]: column.stickyLeft,
                })}
                style={colHeaderStyle}
                sortDirection={sortDirection}
                narrow={column.narrow}
                nowrap={column.nowrap}
                hidden={column.visible !== undefined ? !column.visible : false}
                left={column.left || column.align === 'left'}
                center={column.center || column.align === 'center'}
                right={column.right || column.align === 'right'}
              >
                {sorting && utils.generic.isFunction(get(column, 'sort.handler')) && (
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortDirection}
                    onClick={column.sort.handler(column.id, column.sort.type, column.sort.direction)}
                    IconComponent={ArrowDropDownIcon}
                    classes={{ icon: classes.sortIcon }}
                    data-testid="sort-column"
                  >
                    {column.label}
                  </TableSortLabel>
                )}
                {(!sorting || !column.sort) &&
                  (column.icon ? (
                    <Grid container alignItems="flex-end">
                      <span>{column.label}</span>
                      {column.icon}
                    </Grid>
                  ) : (
                    <span>{column.label}</span>
                  ))}
              </TableCell>
            );
          })}
        </TableRow>
      </MuiTableHead>
    );
  }
}

export default compose(withStyles(styles))(TableHead);
