import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './TableRowGroup.styles';
import { PopoverMenu, Restricted, TableCell } from 'components';
import * as constants from 'consts';

// mui
import { withStyles, TableRow, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

export class TableRowGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    selection: PropTypes.string,
    isExpanded: PropTypes.bool.isRequired,
    isFirstParentExpanded: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    toggleOptions: PropTypes.object.isRequired,
    handleToggleGroup: PropTypes.func.isRequired,
    popover: PropTypes.object,
  };

  render() {
    const { name, selection, isExpanded, isFirstParentExpanded, columns, toggleOptions, handleToggleGroup, popover, classes } = this.props;

    const classesRow = {
      [classes.row]: true,
      [classes.rowSelected]: isExpanded,
    };

    const classesCell = {
      [classes.cell]: true,
      [classes.cellExpanded]: isFirstParentExpanded,
    };

    const classesIcon = {
      [classes.icon]: true,
      [classes.iconSelected]: isExpanded,
    };

    return (
      <TableRow hover className={classnames(classesRow)} onClick={handleToggleGroup(toggleOptions)} data-testid="business-row">
        <TableCell compact nowrap colSpan={columns.length - 1} nestedClasses={{ root: classnames(classesCell) }}>
          <KeyboardArrowDownIcon className={classnames(classesIcon)} data-testid="business-expand-collapse" />
          <Typography variant="h4" display="inline" className={classes.title}>
            {name}
            {selection && <span className={classes.selection}>{selection}</span>}
          </Typography>
        </TableCell>

        <TableCell menu nestedClasses={{ root: classnames(classesCell) }} data-testid="business-cell">
          {popover && (
            <Restricted include={[constants.ROLE_BROKER]}>
              <PopoverMenu id={popover.id} data={popover.data} items={popover.items} />
            </Restricted>
          )}
        </TableCell>
      </TableRow>
    );
  }
}

export default compose(withStyles(styles))(TableRowGroup);
