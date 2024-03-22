import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './Search.styles';
import { Button, FormContainer, FormText, Translate } from 'components';

// mui
import { makeStyles, InputAdornment } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import * as utils from 'utils';

SearchView.propTypes = {
  query: PropTypes.string,
  fields: PropTypes.array,
  submitButton: PropTypes.bool,
  submitButtonProps: PropTypes.object,
  isSearchByNull: PropTypes.bool,
  isSearchByChanged: PropTypes.bool,
  handlers: PropTypes.shape({
    clear: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
  }).isRequired,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    btn: PropTypes.string,
  }),
};

SearchView.defaultProps = {
  nestedClasses: {},
};

export function SearchView({
  query,
  minChars,
  fields,
  submitButton,
  submitButtonProps,
  isSearchByNull,
  isSearchByChanged,
  handlers,
  nestedClasses,
}) {
  const classes = makeStyles(styles, { name: 'Search' })();
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, watch, reset, errors, handleSubmit, formState } = useForm({
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const watchQuery = watch('query')?.trim() || '';

  const ClearBtn = (
    <Button
      size="small"
      variant="text"
      icon={CloseIcon}
      onClick={handlers.clear(reset)}
      nestedClasses={{ btn: classes.inputBtn }}
      data-testid="search-button-clear"
    />
  );

  return (
    <FormContainer
      key={query}
      className={classnames(classes.root, nestedClasses.root)}
      onSubmit={handleSubmit(handlers.search)}
      data-testid="form-search"
    >
      <div className={classes.form}>
        <FormText
          {...fields[0]}
          control={control}
          error={errors[fields[0].name]}
          muiComponentProps={{
            ...fields[0].muiComponentProps,
            InputProps: {
              startAdornment: (
                <InputAdornment position="start" classes={{ root: classes.adornmentStart }}>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" classes={{ root: classes.adornmentEnd }}>
                  {watch('query') ? ClearBtn : <span />}
                </InputAdornment>
              ),
              ...fields[0].muiComponentProps.InputProps,
            },
          }}
        />
      </div>
      {submitButton && (
        <Button
          text={<Translate label="app.go" />}
          color="primary"
          type="submit"
          size={submitButtonProps?.size}
          disabled={
            formState.isSubmitting ||
            (formState.isSubmitted && !formState.isValid && !isSearchByChanged) ||
            watchQuery === (!isSearchByChanged ? query : '') ||
            watchQuery.length < minChars ||
            isSearchByNull
          }
          nestedClasses={{ btn: classnames(classes.btn, { [nestedClasses.btn]: nestedClasses.btn }) }}
          data-testid="search-button-go"
        />
      )}
    </FormContainer>
  );
}
