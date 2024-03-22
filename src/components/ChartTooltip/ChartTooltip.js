import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

// app
import styles from './ChartTooltip.styles';

// mui
import { withStyles } from '@material-ui/core';

export class ChartTooltip extends PureComponent {
  static propTypes = {
    title: PropTypes.node,
  };

  render() {
    const { title, children, classes } = this.props;

    if (!title && !children) return null;

    return (
      <Fragment>
        {title && <div className={classes.title}>{title}</div>}
        {children && <div>{children}</div>}
      </Fragment>
    );
  }
}

export default compose(withStyles(styles))(ChartTooltip);
