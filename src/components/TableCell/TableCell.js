import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';
import omit from 'lodash/omit';

// app
import styles from './TableCell.styles';

// mui
import { withStyles, TableCell as MuiTableCell } from '@material-ui/core';

export class TableCell extends PureComponent {
  static propTypes = {
    bold: PropTypes.bool,
    borderless: PropTypes.bool,
    center: PropTypes.bool,
    compact: PropTypes.bool,
    ellipsis: PropTypes.bool,
    hidden: PropTypes.bool,
    left: PropTypes.bool,
    menu: PropTypes.bool,
    minimal: PropTypes.bool,
    narrow: PropTypes.bool,
    nowrap: PropTypes.bool,
    relative: PropTypes.bool,
    right: PropTypes.bool,
    className: PropTypes.string,
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
    }),
    'data-testid': PropTypes.string,
  };

  static defaultProps = {
    nestedClasses: {},
  };

  render() {
    const {
      bold,
      borderless,
      center,
      compact,
      ellipsis,
      hidden,
      left,
      menu,
      minimal,
      narrow,
      nowrap,
      relative,
      right,
      children,
      'data-testid': testid,
      className,
      nestedClasses,
      classes,
    } = this.props;

    const classesCell = {
      [classes.bold]: Boolean(bold),
      [classes.borderless]: Boolean(borderless),
      [classes.center]: Boolean(center),
      [classes.compact]: Boolean(compact),
      [classes.ellipsis]: Boolean(ellipsis),
      [classes.hidden]: Boolean(hidden),
      [classes.left]: Boolean(left),
      [classes.menu]: Boolean(menu),
      [classes.minimal]: Boolean(minimal),
      [classes.nowrap]: Boolean(nowrap),
      [classes.narrow]: Boolean(narrow),
      [classes.relative]: Boolean(relative),
      [classes.right]: Boolean(right),
      [className]: Boolean(className),
      [nestedClasses.root]: Boolean(nestedClasses.root),
    };

    const newProps = {
      ...omit(this.props, [
        'bold',
        'borderless',
        'center',
        'compact',
        'ellipsis',
        'left',
        'menu',
        'minimal',
        'narrow',
        'nowrap',
        'relative',
        'right',
        'children',
        'nestedClasses',
        'classes',
      ]),
    };

    return (
      <MuiTableCell {...newProps} className={classnames(classesCell)} data-testid={testid || 'table-cell'}>
        {children}
      </MuiTableCell>
    );
  }
}

export default compose(withStyles(styles))(TableCell);
