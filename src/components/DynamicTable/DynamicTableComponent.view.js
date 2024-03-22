import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import config from 'config';
import * as utils from 'utils';
import styles from './DynamicTableComponent.styles';
import { FormToggle, FormText, FormPopoverMenuRHF, FormCheckbox, FormDate, DynamicValue } from 'components';

// mui
import { makeStyles } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

DynamicTableComponentView.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
};

export function DynamicTableComponentView({ field, formProps }) {
  const { control, watch, setValue } = formProps;
  const classes = makeStyles(styles, { name: 'DynamicTableComponent' })();
  const referenceData = useSelector((state) => state.referenceData);
  let options = [];

  if (field.optionsKey) {
    // provide options for dynamic select components
    options = utils.form.getSelectOptions(field.optionsKey, {
      ...referenceData,
      premiumCurrency: utils.openingMemo.getRetainedBrokerageCurrencies(),
    });
  }

  const render = () => {
    switch (field.type) {
      case 'text':
        return <FormText control={control} name={field.name} type={field.type} compact />;

      case 'checkbox':
        return <FormCheckbox control={control} name={field.name} type={field.type} disabled={field.disabled} />;

      case 'select':
        const text = watch(field.name);
        return (
          <FormPopoverMenuRHF
            control={control}
            name={field.name}
            placeholder={utils.string.t('app.select')}
            text={utils.form.getLabelById(options, text)}
            size="small"
            icon={ArrowDropDownIcon}
            iconPosition="right"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            nestedClasses={{ btn: classes.popoverButton }}
            items={options.map(({ id, label }) => ({
              id,
              label,
              callback: () => setValue(field.name, id, { shouldDirty: true }),
            }))}
          />
        );

      case 'datepicker':
        return (
          <FormDate
            control={control}
            name={field.name}
            outputFormat={field.outputFormat}
            placeholder={utils.string.t('app.selectDate')}
            type={field.type}
            nestedClasses={{ root: classes.datePickerLabel }}
            plainText
            muiComponentProps={{
              margin: 'none',
              disabled: field.disabled,
            }}
            muiPickerProps={{
              format: config.ui.format.date.text,
            }}
          />
        );

      case 'toggle':
        return (
          <FormToggle
            name={field.name}
            control={control}
            buttonGroupProps={{
              disabled: field.disabled,
              exclusive: true,
              size: 'small',
            }}
            valueIfUnchecked={''}
            handleChange={(value) => value || field.defaultValue}
            options={options}
            margin="none"
          />
        );

      case 'dynamic':
        const { sourceRowIds } = field.dynamicValue;
        if (!sourceRowIds || !Array.isArray(sourceRowIds)) return;
        return <DynamicValue field={field} values={watch(field.dynamicValue.sourceRowIds)} />;

      default:
        return null;
    }
  };

  return render();
}
