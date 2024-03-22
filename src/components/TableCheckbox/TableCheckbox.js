import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import { Tooltip } from 'components';
import styles from './TableCheckbox.styles';

// mui
import { withStyles, Checkbox } from '@material-ui/core';

export class TableCheckbox extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    indeterminate: PropTypes.bool,
    handleClick: PropTypes.func.isRequired,
    tooltip: PropTypes.object,
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
    }),
  };

  static defaultProps = {
    color: 'primary',
    tooltip: {},
    value: true,
    nestedClasses: {},
  };

  render() {
    const { color, value, checked, disabled, indeterminate, handleClick, tooltip, nestedClasses, classes } = this.props;

    const classesCheckbox = {
      [classes.checkbox]: true,
      [classes.disabled]: disabled,
      [nestedClasses.root]: Boolean(nestedClasses.root),
    };

    const CheckboxComponent = (
      <Checkbox
        color={color}
        value={value.toString()}
        checked={checked}
        indeterminate={indeterminate}
        onClick={handleClick}
        className={classnames(classesCheckbox)}
        data-testid="row-checkbox"
      />
    );

    if (tooltip.title) {
      return <Tooltip {...tooltip}>{CheckboxComponent}</Tooltip>;
    } else {
      return CheckboxComponent;
    }
  }
}

export default compose(withStyles(styles))(TableCheckbox);
