import React, { PureComponent } from 'react';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './Overflow.styles';

// mui
import { withStyles } from '@material-ui/core';

export class Overflow extends PureComponent {
  render() {
    const { children, classes, x, y, width, height, style = {} } = this.props;

    const overflowClasses = {
      [classes.root]: !x && !y,
      [classes.overflowX]: !!x,
      [classes.overflowY]: !!y,
    };

    const styles = {
      ...(width && { width: Number.isInteger(width) ? `${width}px` : width }),
      ...(height && { height: Number.isInteger(height) ? `${height}px` : height }),
      ...style,
    };

    return (
      <div style={styles} className={classnames(overflowClasses)}>
        {children}
      </div>
    );
  }
}

export default compose(withStyles(styles))(Overflow);
