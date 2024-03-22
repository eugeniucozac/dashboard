import React from 'react';
import CheckboxIcon from '../assets/icons/checkbox';
import CheckboxSelectedIcon from '../assets/icons/checkbox-selected';
import CheckboxIndeterminateIcon from '../assets/icons/checkbox-indeterminate';
import RadioIcon from '../assets/icons/radio';
import RadioSelectedIcon from '../assets/icons/radio-selected';

const themeProps = {
  MuiCheckbox: {
    icon: <CheckboxIcon />,
    checkedIcon: <CheckboxSelectedIcon />,
    indeterminateIcon: <CheckboxIndeterminateIcon />,
  },
  MuiRadio: {
    icon: <RadioIcon />,
    checkedIcon: <RadioSelectedIcon />,
  },
  MuiStepButton: {
    disableRipple: true,
  },
  MuiTabs: {
    indicatorColor: 'primary',
  },
  MuiInputLabel: {
    disableAnimation: true,
  },
  MuiWithWidth: {
    initialWidth: 'lg',
  },
};

export default themeProps;
