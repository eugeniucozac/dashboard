import React from 'react';
import { compose } from 'redux';
import classnames from 'classnames';
// app
import styles from './Autocomplete.styles';

// mui
import { withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export const AutocompleteClearIcon = (props) => {
  const { classes, isFocused } = props;
  const iconClasses = {
    [classes.iconFocused]: isFocused,
  };

  return <CloseIcon {...props.innerProps} className={classnames(classes.clearIcon, iconClasses)} />;
};

export default compose(withStyles(styles))(AutocompleteClearIcon);
