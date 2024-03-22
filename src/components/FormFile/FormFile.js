import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

// app
import styles from './FormFile.styles';

// mui
import { withStyles } from '@material-ui/core';

export class FormFile extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    muiComponentProps: PropTypes.object,
  };

  static defaultProps = {
    muiComponentProps: {},
  };

  render() {
    const { name, label, handleUpdate, value, placeholder, classes } = this.props;

    const fileName = value && value.name ? value.name : '' || placeholder || '';

    const id = 'fileInput';
    const type = 'file';
    const onChange = (e) => {
      handleUpdate(e.target.files[0]);
    };
    return (
      <div>
        <label className={classes.formLabel}>{label}</label>
        <div className={classes.inputContainer}>
          <label className={classes.inputLabel} htmlFor={id}>
            {fileName}
          </label>
          <input className={classes.input} id={id} name={name} type={type} onChange={onChange} />
        </div>
      </div>
    );
  }
}

export default compose(withStyles(styles))(FormFile);
