import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './FormLegend.styles';

// mui
import { withStyles, Typography } from '@material-ui/core';

export class FormLegend extends PureComponent {
  static propTypes = {
    text: PropTypes.node,
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
    }),
  };

  static defaultProps = {
    nestedClasses: {},
  };

  render() {
    const { text, nestedClasses, classes } = this.props;

    const classesLegend = {
      [classes.legend]: true,
      [nestedClasses.root]: Boolean(nestedClasses.root),
    };

    return (
      <Typography variant="body2" component="legend" className={classnames(classesLegend)}>
        {text}
      </Typography>
    );
  }
}

export default compose(withStyles(styles))(FormLegend);
