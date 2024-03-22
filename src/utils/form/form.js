import * as Yup from 'yup';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';
import config, { selectOptions } from 'config';

// numberCurrencyObject
export const numberCurrencyObject = (message) => {
  const params = {
    integer: config.ui.format.currency.integer,
    decimal: config.ui.format.currency.decimal,
  };

  return {
    name: 'test-number-currency',
    message: message || utils.string.t('validation.number.format', params),
    params,
    test: function (value) {
      const regex = new RegExp('^\\d{0,' + params.integer + '}(?:\\.\\d{0,' + params.decimal + '})?$');
      return value ? regex.test(value) : true;
    },
  };
};

Yup.addMethod(Yup.number, 'currency', function (message) {
  return this.test(numberCurrencyObject(message));
});

// Number to be multiple of 'multipleOf' number
export const numberMultipleOfNumber = (multipleOf, message) => {
  return {
    name: 'test-number-multipleOf',
    message: message || utils.string.t('validation.number.multiple', { multipleOf }),
    params: { multipleOf },
    test: function (value) {
      return value === 0 || value % multipleOf === 0 ? true : false;
    },
  };
};

Yup.addMethod(Yup.number, 'multiple', function (multipleOf, message) {
  return this.test(numberMultipleOfNumber(multipleOf, message));
});

// numberPercentObject
export const numberPercentObject = (message) => {
  const params = {
    integer: config.ui.format.percent.integer,
    decimal: config.ui.format.percent.decimal,
  };

  return {
    name: 'test-number-percent',
    message: message || utils.string.t('validation.number.format', params),
    params,
    test: function (value) {
      const regex = new RegExp('^\\d{0,' + params.integer + '}(?:\\.\\d{0,' + params.decimal + '})?$');
      return value ? regex.test(value) : true;
    },
  };
};

Yup.addMethod(Yup.number, 'percent', function (message) {
  return this.test(numberPercentObject(message));
});

// numberFormatObject
export const numberFormatObject = (message, integer = config.ui.format.number.integer, decimal = config.ui.format.number.decimal) => {
  return {
    name: 'test-number-format',
    message: message || utils.string.t('validation.number.format', { integer, decimal }),
    params: { integer, decimal },
    test: function (value) {
      const regex = new RegExp('^\\d{0,' + integer + '}(?:\\.\\d{0,' + decimal + '})?$');
      return value ? regex.test(value) : true;
    },
  };
};

Yup.addMethod(Yup.number, 'format', function (integer, decimal, message) {
  return this.test(numberFormatObject(message, integer, decimal));
});

// atLeastOneOfObject
export const atLeastOneOfObject = (message, list = []) => {
  return {
    name: 'atLeastOneOf',
    message: message || utils.string.t('validation.atLeastOneOf'),
    exclusive: true,
    params: { keys: list.join(', ') },
    test: function () {
      const { parent } = this;
      return list.some((f) => parent[f] === 0 || !!parent[f]);
    },
  };
};

Yup.addMethod(Yup.mixed, 'atLeastOneOf', function (list, message) {
  return this.test(atLeastOneOfObject(message, list));
});

const utilsForm = {
  getValidationSchema: (fields) => {
    const validation = {};

    const getValidationObj = (field) => {
      if (field.type === 'legend') return;

      validation[field.name] = field.validation;
    };

    if (fields) {
      fields.forEach((field) => {
        if (Array.isArray(field)) {
          field.forEach((item) => getValidationObj(item));
        } else {
          getValidationObj(field);
        }
      });
    }

    return Yup.object().shape(validation);
  },

  getNestedInitialValues: (rows = [], nameKey) => {
    if (!Array.isArray(rows)) return [];

    const values = {};
    rows.forEach((row) => (values[row.rowKey] = utilsForm.getInitialValues(row.cells, nameKey)));
    return values;
  },

  getInitialValues: (fields, key = 'name') => {
    if (!fields || !Array.isArray(fields) || isEmpty(fields)) return {};

    let values = {};

    const getValues = (field) => {
      if (!field[key] || field.type === 'legend') return;

      // if field type is array or object, we iterate over the array field/items
      if (field.type === 'array') {
        if (field.startEmpty) field.typevalues = null;
        else field.typevalues = utilsForm.getArrayValues(field, key, values);
      } else if (['object', 'address'].includes(field.type)) {
        values = utilsForm.getObjectValues(field, key, values);
      } else {
        values[field[key]] = field.value;
      }
    };

    if (fields) {
      fields.forEach((field) => {
        if (Array.isArray(field)) {
          field.forEach((innerField) => getValues(innerField));
        } else {
          getValues(field);
        }
      });
    }

    return values;
  },
  getFormattedValues: (values, fields) => {
    if (!fields || !Array.isArray(fields) || isEmpty(fields)) return {};

    let formattedValues = {};

    const getValues = (value, key, field) => {
      if (!field || field?.type === 'legend') return;

      if (field.type === 'array') {
        formattedValues[key] = value ? value : [];
      } else if (['object', 'address'].includes(field.type)) {
        formattedValues[key] = value ? value : null;
      } else {
        formattedValues[key] = value;
      }
    };

    Object.entries(values).forEach((singleValue) => {
      const [key, value] = singleValue;
      const field = fields.find((field) => field.name === key);

      getValues(value, key, field);
    });

    return formattedValues;
  },

  getArrayValues: (field, key, values) => {
    if (utils.generic.isValidArray(field.arrayDefaultValues, true)) {
      values[field[key]] = [...field.arrayDefaultValues];
    } else {
      values[field[key]] = [
        field.arrayItemDef.reduce((acc, def) => {
          return Object.assign(acc, { [def.name]: def.value });
        }, {}),
      ];
    }

    return values;
  },

  getObjectValues: (field, key, values) => {
    values[field[key]] = field.objectDef.reduce((acc, def) => {
      return Object.assign(acc, { [def.name]: def.value });
    }, {});

    return values;
  },

  getFieldProps: (fields, name, control, errors) => {
    if (!fields || !Array.isArray(fields) || isEmpty(fields) || !name) return {};

    const field = fields.find((field) => field.name === name) || {};

    return {
      ...field,
      ...(utils.generic.isValidObject(control) && { control }),
      ...(utils.generic.isValidObject(errors) && field.name && { error: errors[field.name] }),
    };
  },

  getLabelById: (fields, value) => {
    if (!utils.generic.isValidArray(fields) || !value) return value;
    const item = fields.find((field) => field.id && field.id.toString() === value.toString());
    return item && item.label ? item.label : value;
  },

  getSelectOptions: (id, obj) => {
    const options = selectOptions.options[id];

    if (!options) return [];

    const { dynamic, fixed } = options;

    if (dynamic) {
      const items = obj[dynamic.source] || [];
      if (dynamic.transform) {
        return items.map((item) => dynamic.transform(item));
      }
      return items.map((item) => ({
        id: item[dynamic.value],
        value: item[dynamic.value],
        label: item[dynamic.label],
      }));
    }

    if (fixed) {
      return fixed.options.map((option) => ({
        id: option,
        value: option,
        label: utils.string.t(`${fixed.labelPath}.${utils.string.replaceLowerCase(option)}`),
      }));
    }
  },

  getSelectOption: (id, obj, value) => {
    if (!value) return;
    const options = selectOptions.options[id];
    if (!options) return '';
    const { dynamic, fixed } = options;
    if (dynamic) {
      const items = obj[dynamic.source] || [];
      const item = items.find((item) => item[dynamic.value] && item[dynamic.value].toString() === value.toString());
      return item ? item[dynamic.label] : '';
    }
    if (fixed) {
      const option = fixed.options.find((option) => option === value);
      return utils.string.t(`${fixed.labelPath}.${utils.string.replaceLowerCase(option)}`);
    }
  },

  getValidationLabel: (label, type) => {
    switch (type) {
      case 'required':
        return `${utils.string.t(label)} ${utils.string.t('form.validation.isRequired')}`;
      default:
        return utils.string.t(label);
    }
  },
};

export default utilsForm;
