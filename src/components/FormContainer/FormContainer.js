import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './FormContainer.styles';

// mui
import { withStyles } from '@material-ui/core';

export class FormContainer extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['default', 'dialog', 'blank']),
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
    }),
  };

  static defaultProps = {
    type: 'default',
    nestedClasses: {},
  };

  render() {
    const { type, nestedClasses, children, classes, resetFunc, ...rest } = this.props;

    const classesForm = {
      [classes.default]: true,
      [classes.dialog]: type === 'dialog',
      [classes.blank]: type === 'blank',
      [nestedClasses.root]: Boolean(nestedClasses.root),
    };

    return (
      <form className={classnames(classesForm)} {...rest}>
        {children}
      </form>
    );
  }
}

export default compose(withStyles(styles))(FormContainer);
