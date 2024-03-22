import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

// app
import styles from './Ratio.styles';

// mui
import { withStyles } from '@material-ui/core';

export class Ratio extends PureComponent {
  static propTypes = {
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
  };

  static defaultProps = {
    w: 2,
    h: 1,
  };

  render() {
    const { w, h, children, classes } = this.props;

    const paddingTop = !w || !h ? 100 : 100 / w / h;

    return (
      <div className={classes.root} style={{ paddingTop: `${paddingTop}%` }}>
        <div className={classes.content}>{children}</div>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Ratio);
