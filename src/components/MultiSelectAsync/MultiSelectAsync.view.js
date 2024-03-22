import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './MultiSelectAsync.styles';
import { Button, FormContainer, FormText, Translate, Warning } from 'components';
import * as utils from 'utils';

// mui
import {
  Box,
  Checkbox,
  CircularProgress,
  Collapse,
  Fade,
  FormHelperText,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

MultiSelectAsyncView.propTypes = {
  id: PropTypes.string.isRequired,
  field: PropTypes.object.isRequired,
  query: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  values: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  fetching: PropTypes.bool,
  max: PropTypes.number,
  searchMinChars: PropTypes.number,
  placeholder: PropTypes.string,
  labels: PropTypes.shape({
    minChars: PropTypes.string,
    hint: PropTypes.string,
    noResults: PropTypes.string,
  }),
  handlers: PropTypes.shape({
    onClear: PropTypes.func.isRequired,
    onToggleOption: PropTypes.func,
  }),
};

MultiSelectAsyncView.defaultProps = {
  labels: {},
};

export function MultiSelectAsyncView({ id, field, query, options, values, labels, fetching, max, searchMinChars, handlers }) {
  const classes = makeStyles(styles, { name: 'MultiSelectAsync' })({ fetching });

  const validationSchema = utils.form.getValidationSchema([field]);

  const { control, reset, handleSubmit } = useForm({
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const optionsFiltered = options.filter((o) => {
    return !values.some((v) => v.id === o.id);
  });

  const valuesIds = values.map((v) => v.id);

  const ClearBtn = (
    <Button
      size="small"
      variant="text"
      icon={CloseIcon}
      onClick={handlers.onClear(reset)}
      nestedClasses={{ btn: classes.clearBtn }}
      data-testid={`multi-select-async-clear-${id}`}
    />
  );

  const renderOption = (option, type) => {
    const isOption = type === 'option';
    const labelId = `multi-select-async-checkbox-list-${type}-label-${option.id}`;

    return (
      <ListItem
        key={option.id}
        button
        onClick={() => {
          if (utils.generic.isFunction(handlers.onToggleOption)) {
            handlers.onToggleOption(option);
          }
        }}
        disabled={isOption && isMaxReached}
        classes={{ root: classes.listItem }}
      >
        <ListItemIcon classes={{ root: classes.listItemIcon }}>
          <Checkbox
            checked={valuesIds.includes(option.id)}
            color="primary"
            tabIndex={-1}
            disableRipple
            disabled={isOption && isMaxReached}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={option.name} />
      </ListItem>
    );
  };

  const isHintVisible = Boolean(query && query.length < searchMinChars);
  const isMaxReached = Boolean(values && values.length >= max);
  const isNoResults = Boolean(query && !fetching && !isHintVisible && utils.generic.isInvalidOrEmptyArray(options));

  return (
    <Box className={classes.root}>
      <FormContainer
        onSubmit={handleSubmit(handlers.onSearch)}
        nestedClasses={{ root: classes.form }}
        data-testid="form-multi-select-async-search"
      >
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
                <InputAdornment position="end">
                  {fetching && <CircularProgress color="inherit" size={20} />}
                  {query ? ClearBtn : <span />}
                </InputAdornment>
              ),
            },
          }}
        />
        {isHintVisible && (
          <Collapse in={isHintVisible}>
            <Fade in={isHintVisible}>
              <FormHelperText>
                {labels.minChars || utils.string.t('filters.multiSelectAsync.minChars', { min: searchMinChars })}
              </FormHelperText>
            </Fade>
          </Collapse>
        )}
      </FormContainer>

      <Collapse in={isNoResults}>
        <Fade in={isNoResults}>
          <Box mt={1} mb={1}>
            <Warning type="alert" icon text={labels.noResults || utils.string.t('filters.multiSelectAsync.noResults')} />
          </Box>
        </Fade>
      </Collapse>

      {(!query || (query && query.length < searchMinChars)) && !utils.generic.isValidArray(values, true) && (
        <Typography variant="body1" classes={{ root: classes.hint }}>
          {labels.hint || utils.string.t('filters.multiSelectAsync.hint')}
        </Typography>
      )}

      <List
        dense
        className={classnames({
          [classes.list]: true,
          [classes.listMargin]: utils.generic.isValidArray(optionsFiltered, true),
        })}
      >
        {optionsFiltered.map((option) => renderOption(option, 'option'))}
      </List>

      {utils.generic.isValidArray(values, true) && (
        <Box className={classes.selected}>
          <Translate
            label="processingInstructions.filters.selectedMax"
            options={{ count: max }}
            variant="body1"
            classes={{ root: classes.selectedMax }}
          />
          <List dense className={classnames({ [classes.list]: true, [classes.listFetching]: fetching })}>
            {values.map((value) => renderOption(value, 'value'))}
          </List>
        </Box>
      )}
    </Box>
  );
}
