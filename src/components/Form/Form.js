import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDeepCompareEffect from 'use-deep-compare-effect';
import classnames from 'classnames';

// app
import styles from './Form.styles';
import {
  Button,
  FormContainer,
  FormFields,
  FormActions,
  FormGrid,
  FormHidden,
  FormLegend,
  FormAutocomplete,
  FormAutocompleteMui,
  FormCheckbox,
  FormDate,
  FormFileDrop,
  FormRadio,
  FormSelect,
  FormSwitch,
  FormText,
  FormToggle,
} from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Fade } from '@material-ui/core';

const fieldShape = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'hidden',
    'legend',
    'text',
    'textarea',
    'number',
    'select',
    'autocomplete',
    'autocompletemui',
    'date',
    'datepicker',
    'switch',
    'toggle',
    'checkbox',
    'radio',
    'file',
  ]).isRequired,
  title: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,
  validation: PropTypes.object,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object, PropTypes.bool]),
  options: PropTypes.arrayOf(PropTypes.object),
  optionKey: PropTypes.string,
  optionLabel: PropTypes.string,
  muiComponentProps: PropTypes.object,
  innerComponentProps: PropTypes.object,
};

Form.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['default', 'dialog', 'blank']),
  fields: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape(fieldShape)), PropTypes.shape(fieldShape)])),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      handler: PropTypes.func.isRequired,
    })
  ),
  align: PropTypes.oneOf(['left', 'right']),
  fullwidth: PropTypes.bool,
  noValidate: PropTypes.bool,
  defaultValues: PropTypes.object,
  validationSchema: PropTypes.object,
  nestedClasses: PropTypes.shape({
    fields: PropTypes.shape({
      root: PropTypes.string,
      inner: PropTypes.string,
    }),
    form: PropTypes.string,
    buttons: PropTypes.string,
    actions: PropTypes.string,
  }),
};

Form.defaultProps = {
  type: 'default',
  fullwidth: true,
  noValidate: true,
  nestedClasses: {},
};

export function Form({ id, fields, actions, type, align, fullwidth, noValidate, nestedClasses, defaultValues = {}, validationSchema }) {
  const classes = makeStyles(styles, { name: 'Form' })({ isDialog: type === 'dialog', fullwidth });

  const { control, register, watch, reset, errors, handleSubmit, formState, setValue, trigger } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const handleCancel = () => () => {
    const cancel = actions && actions.find((action) => action.name === 'cancel');
    cancel && utils.generic.isFunction(cancel.handler) && cancel.handler();
    reset();
  };

  const handleSecondary = (data) => {
    const secondary = actions && actions.find((action) => action.name === 'secondary');
    secondary && utils.generic.isFunction(secondary.handler) && secondary.handler(data);
  };

  const onSubmit = (data) => {
    const submit = actions && actions.find((action) => action.name === 'submit');

    return submit && utils.generic.isFunction(submit.handler) && submit.handler(data);
  };

  useDeepCompareEffect(
    () => {
      if (!formState.isDirty) return;
      reset(defaultValues);
    },
    [defaultValues] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const renderRows = () => {
    return fields.map((item, index) => {
      if (Array.isArray(item)) {
        return (
          <FormGrid container key={`row_${index}`}>
            {item.map((field, index) => {
              let sizes = {};
              const defaultValue = 12;
              const defaultSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
              const isConditionalField = field?.conditional?.conditional ? true : false;
              let showConditionalField;

              if (field.gridSize === 'number') {
                sizes = { xs: field.gridSize };
              } else {
                let lastDefinedValue = defaultValue;

                defaultSizes.forEach((size) => {
                  if (field.gridSize && field.gridSize[size]) {
                    sizes[size] = lastDefinedValue = field.gridSize[size];
                  } else {
                    sizes[size] = lastDefinedValue;
                  }
                });
              }

              if (isConditionalField) {
                const fieldValue = watch(field.conditional.conditionalField);

                showConditionalField =
                  fieldValue?.value === field.conditional.conditionValue || fieldValue === field.conditional.conditionValue || false;
              }

              return isConditionalField ? (
                showConditionalField ? (
                  <Fade in={showConditionalField} key={`${field.name}_${index}`}>
                    <FormGrid item {...sizes} key={`${field.name}_${index}`} style={field.style}>
                      {renderField(field, index)}
                    </FormGrid>
                  </Fade>
                ) : null
              ) : (
                <FormGrid item {...sizes} key={`${field.name}_${index}`} style={field.style}>
                  {renderField(field, index)}
                </FormGrid>
              );
            })}
          </FormGrid>
        );
      } else if (item.type === 'legend') {
        return <FormLegend text={item.label} key={`legend_${item.name}_${index}`} />;
      } else {
        return renderField(item, index);
      }
    });
  };

  const renderField = (field, index) => {
    // removing gridSize from props so it doesn't become an invalid attribute on the HTML element
    const { gridSize, ...props } = field;

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'number':
        return (
          <FormText
            {...props}
            control={control}
            key={`form_${id}_${index}_${field.name}`}
            type={field.type}
            name={field.name}
            error={errors[field.name]}
            label={field.label}
            placeholder={field.placeholder}
            hint={field.hint}
            muiComponentProps={field.muiComponentProps}
          />
        );
      case 'date':
      case 'datepicker':
        return (
          <FormDate
            {...props}
            control={control}
            key={`form_${id}_${index}_${field.name}`}
            type={field.type}
            name={field.name}
            label={field.label}
            error={errors[field.name]}
            hint={field.hint}
            nestedClasses={field.nestedClasses}
            muiComponentProps={field.muiComponentProps}
          />
        );

      case 'radio':
        return (
          <FormRadio
            {...props}
            control={control}
            key={`form_${id}_${index}_${field.name}`}
            name={field.name}
            options={field.options}
            title={field.title}
            label={field.label}
            hint={field.hint}
            error={errors[field.name]}
            disabled={formState.isSubmitting}
            muiComponentProps={field.muiComponentProps}
            muiFormGroupProps={field.muiFormGroupProps}
          />
        );

      case 'checkbox':
        return (
          <FormCheckbox
            {...props}
            control={control}
            register={register}
            watch={watch}
            key={`form_${id}_${index}_${field.name}`}
            error={errors[field.name]}
            name={field.name}
            options={field.options}
            title={field.title}
            label={field.label}
            hint={field.hint}
            muiComponentProps={field.muiComponentProps}
            muiFormGroupProps={field.muiFormGroupProps}
          />
        );

      case 'switch':
        return (
          <FormSwitch
            {...props}
            control={control}
            register={register}
            watch={watch}
            key={`form_${id}_${index}_${field.name}`}
            error={errors[field.name]}
            name={field.name}
            options={field.options}
            title={field.title}
            label={field.label}
            hint={field.hint}
            muiComponentProps={field.muiComponentProps}
            muiFormGroupProps={field.muiFormGroupProps}
          />
        );

      case 'toggle':
        return (
          <FormToggle
            {...props}
            key={`toggle-button-${field.name}`}
            control={control}
            name={field.name}
            label={field.label}
            options={field.options}
            error={errors[field.name]}
            hint={field.hint}
          />
        );

      case 'select':
        return (
          <FormSelect
            {...props}
            control={control}
            key={`form_${id}_${index}_${field.name}`}
            name={field.name}
            options={field.options}
            title={field.title}
            optionKey={field.optionKey}
            error={errors[field.name]}
            optionLabel={field.optionLabel}
            value={field.value}
            label={field.label}
            hint={field.hint}
            muiComponentProps={field.muiComponentProps}
          />
        );

      case 'autocomplete':
        return (
          <FormAutocomplete
            {...props}
            control={control}
            key={`form_${id}_${index}_${field.name}`}
            name={field.name}
            options={field.options}
            error={errors[field.name]}
            optionKey={field.optionKey}
            optionLabel={field.optionLabel}
            label={field.label}
            placeholder={field.placeholder}
            hint={field.hint}
            muiComponentProps={field.muiComponentProps}
            innerComponentProps={field.innerComponentProps}
            handleUpdate={(id, value) => {
              if (utils.generic.isFunction(field.handleUpdate)) {
                field.handleUpdate(id, value, setValue);
              } else {
                setValue(id, value, { shouldDirty: true });

                if (field.callback) {
                  field.callback(value, setValue, reset);
                }
              }

              trigger(id);
            }}
          />
        );

      case 'autocompletemui':
        return (
          <FormAutocompleteMui
            {...props}
            control={control}
            key={`form_${id}_${index}_${field.name}`}
            name={field.name}
            error={errors[field.name]}
            options={field.options}
            optionKey={field.optionKey}
            optionLabel={field.optionLabel}
            label={field.label}
            placeholder={field.placeholder}
            hint={field.hint}
            muiComponentProps={field.muiComponentProps}
          />
        );

      case 'file':
        return (
          <FormFileDrop
            {...props}
            control={control}
            onChange={(file) => setValue(field.name, file, { shouldDirty: true })}
            key={`form_${id}_${index}_${field.name}`}
            name={field.name}
            error={errors[field.name]}
            label={field.label}
            hint={field.hint}
          />
        );

      case 'hidden':
        return <FormHidden key={`form_${id}_${index}_${field.name}`} control={control} name={field.name} {...props} />;

      default:
        return null;
    }
  };

  const renderActions = () => {
    const cancel = actions && actions.find((action) => action.name === 'cancel');
    const secondary = actions && actions.find((action) => action.name === 'secondary');
    const submit = actions && actions.find((action) => action.name === 'submit');

    return (
      <>
        {cancel && (
          <Button
            text={cancel.label}
            variant="text"
            onClick={handleCancel()}
            disabled={formState.isSubmitting}
            nestedClasses={{ btn: classnames(classes.cancel, nestedClasses.buttons) }}
          />
        )}

        {secondary && (
          <Button
            text={secondary.label}
            onClick={handleSubmit(handleSecondary)}
            disabled={formState.isSubmitting}
            color="secondary"
            tooltip={{
              title: secondary?.tooltip?.title || null,
            }}
            nestedClasses={{ btn: classnames(nestedClasses.buttons) }}
          />
        )}

        {submit && (
          <Button
            text={submit.label}
            type="submit"
            disabled={formState.isSubmitting}
            color="primary"
            tooltip={{
              title: submit?.tooltip?.title || null,
            }}
            nestedClasses={{ btn: classnames(nestedClasses.buttons) }}
          />
        )}
      </>
    );
  };

  return (
    <div className={classes.root}>
      <FormContainer
        type={type}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        data-testid={`form-${id}`}
        nestedClasses={{ root: nestedClasses.form }}
      >
        <FormFields type={type} nestedClasses={nestedClasses.fields}>
          {renderRows()}
        </FormFields>

        {actions && actions.length > 0 && (
          <FormActions type={type} align={align} nestedClasses={{ actions: nestedClasses.actions }}>
            {renderActions()}
          </FormActions>
        )}
      </FormContainer>
    </div>
  );
}

export default Form;
