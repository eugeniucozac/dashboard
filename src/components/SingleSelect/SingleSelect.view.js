import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import isEqual from 'lodash/isEqual';

// app
import styles from './SingleSelect.styles';
import { Button, FormContainer, FormText } from 'components';
import * as utils from 'utils';

// mui
import { Box, InputAdornment, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

SingleSelectView.propTypes = {
  id: PropTypes.string.isRequired,
  field: PropTypes.object.isRequired,
  query: PropTypes.string,
  selectedValue: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      toolTipTitle: PropTypes.string,
    })
  ).isRequired,
  search: PropTypes.bool,
  handlers: PropTypes.shape({
    onClear: PropTypes.func.isRequired,
    onToggleOption: PropTypes.func.isRequired,
  }),
};

export function SingleSelectView({ id, field, query, options, selectedValue, search, handlers }) {
  const classes = makeStyles(styles, { name: 'SingleSelect' })();
  const validationSchema = utils.form.getValidationSchema([field]);

  const [selectedListItem, setSelectedListItem] = useState(selectedValue ? selectedValue : null);

  const { control, reset, handleSubmit } = useForm({
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const ClearBtn = (
    <Button
      size="small"
      variant="text"
      icon={CloseIcon}
      onClick={handlers.onClear(reset)}
      nestedClasses={{ btn: classes.clearBtn }}
      data-testid={`single-select-clear-${id}`}
    />
  );

  /** Get the selected Item from the List on click */
  const handleListItemClick = (event, option) => {
    if (isEqual(option, selectedListItem)) {
      handlers.onToggleOption(null);
      setSelectedListItem(null);
    } else {
      handlers.onToggleOption(option);
      setSelectedListItem(option);
    }
  };

  return (
    <Box className={classes.root}>
      {search && (
        <FormContainer onSubmit={handleSubmit(handlers.onSearch)} nestedClasses={{ root: classes.form }} data-testid="form-search">
          <FormText
            {...field}
            control={control}
            muiComponentProps={{
              ...field.muiComponentProps,
              fullWidth: true,
              classes: {
                root: classnames({
                  [classes.input]: true,
                }),
              },
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start" classes={{ root: classes.adornmentStart }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end" classes={{ root: classes.adornmentEnd }}>
                    {query ? ClearBtn : <span />}
                  </InputAdornment>
                ),
              },
            }}
          />
        </FormContainer>
      )}

      <List dense className={classes.list}>
        {options.map((option) => {
          return (
            <ListItem
              key={option.id}
              button
              title={option.toolTipTitle || option.name}
              selected={selectedListItem?.id === option.id}
              onClick={(event) => handleListItemClick(event, option)}
            >
              <ListItemText primary={option.name} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
