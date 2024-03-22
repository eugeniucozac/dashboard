import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './FilterBar.style';
import { Button, FormAutocompleteMui, FormContainer, FormFields, FormActions, FormText } from 'components';
import * as utils from 'utils';
import { useMedia } from 'hooks';

// mui
import { makeStyles, Box, InputAdornment } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

export function FilterBarView({ fields, actions }) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'FilterBar' })({ isMobile: media.mobile });
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const resetAction = actions && actions.find((action) => action.name === 'reset');
  const filterAction = actions && actions.find((action) => action.name === 'filter');

  const onReset = () => {
    resetAction && utils.generic.isFunction(resetAction.handler) && resetAction.handler();
    reset();
  };

  const onFilter = (formData) => {
    filterAction && utils.generic.isFunction(filterAction.handler) && filterAction.handler(formData);
  };

  const fieldMap = {
    text: FormText,
    autocompletemui: FormAutocompleteMui,
  };

  const filteredFields = fields.filter((field) => field.type !== fieldMap[field.type]);

  const renderField = (field) => {
    switch (field.type) {
      case 'autocomplete':
        return (
          <FormAutocompleteMui
            control={control}
            {...field}
            muiComponentProps={{
              size: 'small',
              ...field.muiComponentProps,
            }}
          />
        );
      case 'text':
        return (
          <FormText
            control={control}
            {...field}
            error={errors[field.name]}
            muiComponentProps={{
              InputProps: {
                ...get(field, 'muiComponentProps.InputProps', {}),
                classes: {
                  root: classnames(classes.filledRoot),
                  input: classes.filledInput,
                },
                endAdornment: (
                  <InputAdornment position="end" classes={{ root: classes.adornmentEnd }}>
                    {resetAction && formState.isDirty ? (
                      <Button
                        size="small"
                        variant="text"
                        icon={CloseIcon}
                        onClick={onReset}
                        nestedClasses={{ btn: classes.resetButton }}
                        data-testid="search-button-clear"
                      />
                    ) : (
                      <span />
                    )}
                  </InputAdornment>
                ),
              },
              ...field.muiComponentProps,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <FormContainer nestedClasses={{ root: classes.formContainer }} onSubmit={handleSubmit(onFilter)} data-testid="filter-bar">
        <FormFields nestedClasses={{ root: classes.formFields }}>
          <Box className={classes.fieldsContainer}>
            {filteredFields.map((field) => {
              return (
                <Box key={field.name} className={classes.fields}>
                  {renderField(field)}
                </Box>
              );
            })}
          </Box>
        </FormFields>
        <FormActions nestedClasses={{ actions: classes.actions }}>
          {filterAction ? (
            <IconButton disableRipple type="submit" disabled={formState.isSubmitting} color="primary" className={classes.filterButton}>
              <SearchIcon />
            </IconButton>
          ) : null}
        </FormActions>
      </FormContainer>
    </div>
  );
}
