import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

// app
import styles from './StylePicker.styles';
import { Button } from 'components';

// mui
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles, Popover } from '@material-ui/core';

StylePickerView.propTypes = {
  presetColors: PropTypes.array.isRequired,
  onStyleChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  colorType: PropTypes.string.isRequired,
  el: PropTypes.object,
};

export function StylePickerView({ styleConfig, onCancel, onSave, onStyleChange, colorType, el, presetColors }) {
  const classes = makeStyles(styles, { name: 'StylePicker' })();

  return (
    <div className={classes.root}>
      <Popover
        id="menu"
        anchorEl={el}
        open={Boolean(el)}
        onClose={onCancel}
        classes={{ paper: classes.popover }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <SketchPicker
          data-testid="sketch-picker"
          className={classes.picker}
          presetColors={presetColors}
          disableAlpha={true}
          color={styleConfig.color}
          onChange={(newColor) => onStyleChange({ color: newColor[colorType] })}
        />
        <div className={classes.actions}>
          <Button icon={CloseIcon} variant="text" onClick={onCancel} nestedClasses={{ icon: classes.iconClear }} />
          <Button
            icon={CheckIcon}
            variant="text"
            type="submit"
            color="primary"
            onClick={onSave}
            nestedClasses={{ icon: classes.iconSave }}
          />
        </div>
      </Popover>
    </div>
  );
}
