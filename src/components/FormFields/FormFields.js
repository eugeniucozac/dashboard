import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './FormFields.styles';

// mui
import { withStyles } from '@material-ui/core';

export class FormFields extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['default', 'dialog', 'blank']),
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
      inner: PropTypes.string,
    }),
  };

  static defaultProps = {
    type: 'default',
    nestedClasses: {},
  };

  render() {
    const { type, children, nestedClasses, classes } = this.props;

    const classesFieldsRoot = {
      [nestedClasses.root]: Boolean(nestedClasses.root),
      [classes.fieldsDialog]: type === 'dialog',
    };

    const classesFieldsInner = {
      [nestedClasses.inner]: Boolean(nestedClasses.inner),
    };

    return (
      <div className={classnames(classesFieldsRoot)}>
        <div className={classnames(classesFieldsInner)}>{children}</div>
      </div>
    );
  }
}

export default compose(withStyles(styles))(FormFields);
