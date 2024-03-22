import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './FormMultiSelect.styles';

// mui
import { Chip } from 'components';
import { makeStyles, Box, Checkbox, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

FormMultiSelectView.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  tagType: PropTypes.string,
  color: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  selectedOptions: PropTypes.array,
  onSelectOption: PropTypes.func,
  nestedClasses: PropTypes.object,
};

export function FormMultiSelectView({ label, placeholder, tagType, selectedOptions, options, setSelectOption, nestedClasses, color }) {
  const classes = makeStyles(styles, { name: 'FormMultiSelect' })();

  return (
    <Box className={nestedClasses.wrapper}>
      <Autocomplete
        value={selectedOptions}
        multiple
        classes={{
          option: classes.option,
          inputFocused: classes.inputFocused,
          inputRoot: classes.inputRoot,
          root: classnames(classes.actionsText),
        }}
        onChange={(event, newValue) => {
          setSelectOption([...newValue]);
        }}
        options={options}
        disableCloseOnSelect
        getOptionLabel={(option) => option.label}
        getOptionSelected={(option, value) => option.id === value.id}
        renderTags={(value, getTagProps) =>
          tagType === 'primary' ? (
            value.map((option, index) => (
              <Chip label={option.label} {...getTagProps({ index })} nestedClasses={{ root: classes.issueTypeChip }} />
            ))
          ) : (
            <span>{value.length} Selected</span>
          )
        }
        renderOption={(option, { selected }) => (
          <>
            <Checkbox color={color} className={classes.checkbox} checked={selected} />
            {option.label}
          </>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
            placeholder={!params.InputProps.startAdornment ? placeholder : undefined}
          />
        )}
      />
    </Box>
  );
}
