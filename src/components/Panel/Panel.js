import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './Panel.styles';

// mui
import { withStyles, Paper } from '@material-ui/core';

export class Panel extends PureComponent {
  static propTypes = {
    sidebar: PropTypes.bool,
    borderTop: PropTypes.bool,
    borderRight: PropTypes.bool,
    borderBottom: PropTypes.bool,
    borderLeft: PropTypes.bool,
    margin: PropTypes.bool,
    padding: PropTypes.bool,
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
    }),
  };

  static defaultProps = {
    nestedClasses: {},
    margin: true,
    padding: true,
  };

  render() {
    const { sidebar, borderTop, borderRight, borderBottom, borderLeft, margin, padding, nestedClasses, classes, children } = this.props;

    const classesPanel = {
      [classes.root]: classes.root,
      [classes.sidebar]: sidebar,
      [classes.borderTop]: borderTop,
      [classes.borderRight]: borderRight,
      [classes.borderBottom]: borderBottom,
      [classes.borderLeft]: borderLeft,
      [classes.noMargin]: !margin,
      [classes.noPadding]: !padding,
      [nestedClasses.root]: Boolean(nestedClasses.root),
    };

    return <Paper className={classnames(classesPanel)}>{children}</Paper>;
  }
}

export default compose(withStyles(styles))(Panel);
