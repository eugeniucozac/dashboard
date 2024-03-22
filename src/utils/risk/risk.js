import * as utils from 'utils';
import * as Yup from 'yup';
import get from 'lodash/get';
import has from 'lodash/has';
import xor from 'lodash/xor';
import groupBy from 'lodash/groupBy';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

// private
export const _getValidation = (field, allFields, validateRequired = true) => {
  // abort
  if (!field || !field.validation) return;

  let yupValidation = Yup.mixed();

  yupValidation = _validationType(yupValidation, field);
  yupValidation = _validationMinMax(yupValidation, field);
  yupValidation = _validationFormatting(yupValidation, field);

  if (validateRequired) {
    yupValidation = _validationRequired(yupValidation, field, allFields);
  }

  return yupValidation;
};

export const _validationType = (obj, field) => {
  const type = field && field.type ? field.type.toLowerCase() : '';

  const allowedTypes = [
    'text',
    'textarea',
    'date',
    'datepicker',
    'select',
    'autocomplete',
    'integer',
    'double',
    'checkbox',
    'radio',
    'boolean',
  ];

  // abort
  if (!utils.generic.isValidObject(obj)) return {};

  if (['date'].includes(type)) {
    obj = Yup.string().nullable();
  }

  if (['text', 'textarea'].includes(type)) {
    obj = Yup.string().nullable();

    // prevent the min/max validation to appear if field is NOT dirty
    if (field.validation && (field.validation.min || field.validation.max)) {
      obj = obj.transform((value) => (value === '' ? undefined : value));
    }
  }

  if (['select'].includes(type)) {
    if (field.autocomplete) {
      obj = field.multi ? Yup.array().of(Yup.object()) : Yup.object().nullable();
    } else {
      obj = field.multi ? Yup.array().of(Yup.mixed()) : Yup.string().nullable();
      obj = obj.notOneOf(['__placeholder__'], utils.string.t('validation.required'));
    }
  }

  if (['integer', 'double'].includes(type)) {
    obj = field.step
      ? Yup.number()
          .nullable()
          .multiple(field.step)
          .transform(function (value, originalvalue) {
            return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
          })
      : Yup.number()
          .nullable()
          .transform(function (value, originalvalue) {
            return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
          });
  }

  if (['checkbox'].includes(type)) {
    if (utils.generic.isValidArray(field.options) && field.options.length >= 2) {
      obj = Yup.array();
    } else {
      obj = Yup.mixed();
    }
  }

  if (['radio'].includes(type)) {
    obj = Yup.string();
  }

  if (['toggle'].includes(type)) {
    obj = Yup.boolean();
  }

  if (['object', 'address'].includes(type)) {
    if (!utils.generic.isValidArray(field.objectDef, true)) return obj;

    const fieldsWithValidation = field.objectDef.reduce((acc, def) => {
      return def.validation && !isEmpty(def.validation) ? [...acc, def] : acc;
    }, []);

    obj = Yup.object().shape(
      fieldsWithValidation.reduce((acc, def) => {
        const type = def.type ? def.type.toLowerCase() : '';

        // skip if type isn't allowed
        if (!allowedTypes.includes(type)) return acc;

        return Object.assign(acc, {
          [def.name]: _getValidation(def),
        });
      }, {})
    );
  }

  if (['array'].includes(type)) {
    if (!utils.generic.isValidArray(field.arrayItemDef, true)) return Yup.array();

    const fieldsWithValidation = field.arrayItemDef.reduce((acc, def) => {
      return def.validation && !isEmpty(def.validation) ? [...acc, def] : acc;
    }, []);

    const fieldsName = fieldsWithValidation.map((def) => def.name);

    obj = Yup.array().of(
      Yup.object().shape(
        fieldsWithValidation.reduce((acc, def) => {
          const type = def.type ? def.type.toLowerCase() : '';

          // skip if type isn't allowed
          if (!allowedTypes.includes(type)) return acc;

          return Object.assign(acc, {
            [def.name]: Yup.mixed().when(xor(fieldsName, [def.name]), {
              is: (...rest) => rest.some(Boolean),
              then: _getValidation(def),
              otherwise: _getValidation(def, null, false),
            }),
          });
        }, {}),
        utils.generic.tuples(fieldsName)
      )
    );
  }

  return obj;
};

export const _validationMinMax = (obj, field) => {
  const type = field && field.type && field.type.toLowerCase();

  // abort
  if (!obj || !utils.generic.isValidObject(obj)) return;
  if (!field || !type || !field.validation || !(field.validation.min || field.validation.max)) return obj;

  // abort for Yup types that don't support min/max
  if (!['string', 'date', 'number', 'array'].includes(obj._type)) return obj;

  // abort if field type is radio (only 1 option selectable)
  if (type === 'radio') return obj;

  const hasMin = has(field, 'validation.min');
  const hasMax = has(field, 'validation.max');
  const min = get(field, 'validation.min');
  const max = get(field, 'validation.max');

  const map = {
    date: 'date',
    integer: 'number',
    double: 'number',
    text: 'string',
    textarea: 'string',
    select: 'options',
    radio: 'options',
    checkbox: 'options',
  };

  // we prevent min/max validation if select/autocomplete field isn't supporting multiple options
  if (['select'].includes(type)) {
    if (!field.multi) {
      return obj;
    }
  }

  // if min/max are the same value, show special error message
  if (hasMin && hasMax && min === max) {
    obj = obj
      .min(min, utils.string.t(`validation.${map[type]}.exactly`, { count: min }))
      .max(max, utils.string.t(`validation.${map[type]}.exactly`, { count: max }));
  } else {
    obj = hasMin ? obj.min(min, utils.string.t(`validation.${map[type]}.min`)) : obj;
    obj = hasMax ? obj.max(max, utils.string.t(`validation.${map[type]}.max`)) : obj;
  }

  return obj;
};

export const _validationFormatting = (obj, field) => {
  const type = field && field.type && field.type.toLowerCase();

  // abort
  if (!utils.generic.isValidObject(obj)) return {};
  if (!field || !type) return obj;

  if (type === 'integer') {
    return obj.integer();
  } else {
    return obj;
  }
};

export const _validationRequired = (obj, field, allFields) => {
  const type = field && field.type && field.type.toLowerCase();
  const validation = field && field.validation;

  // abort
  if (!utils.generic.isValidObject(obj)) return {};
  if (!field || !type || !validation || (allFields && !utils.generic.isValidArray(allFields, true))) return obj;

  const isRequired = get(field, 'validation.required');
  const group = get(field, 'validation.group.name');
  const min = get(field, 'validation.group.min');
  const max = get(field, 'validation.group.max');
  const isMin = min && min > 0;
  const isMax = max && max > 0;
  const isRange = isMin && isMax;
  const isOnly = isMin && isMax && min === max;

  // distance to coast
  if (field.name === 'distanceToCoast' && isRequired === true) {
    return obj.required(utils.string.t('risks.address.distanceToCoastRequired'));
  }

  // select multi required
  if (isRequired && type === 'select' && field.multi) {
    return obj.test({
      name: 'select-required-placeholder',
      message: utils.string.t('validation.required'),
      test: function () {
        const thisField = this.parent[field.name];

        if (utils.generic.isValidArray(thisField)) {
          return thisField.filter((v) => v !== '__placeholder__').length > 0;
        }

        return true;
      },
    });
  }

  // conditional field with validation
  if (isRequired === true && field.conditional) {
    const condition = utils.risk.getCondition(field, allFields);

    return obj.test({
      name: 'conditional-with-required',
      message: utils.string.t('validation.required'),
      test: function () {
        const thisField = this.parent[field.name];
        const dependantField = this.parent[condition.name];
        const isValid = utils.risk.isConditionValid(condition, dependantField);

        if (isValid) {
          return thisField;
        }

        return true;
      },
    });
  }

  // normal required
  if (isRequired === true) {
    return obj.required(field?.validation?.message ? field.validation.message : utils.string.t('validation.required'));
  }

  // required only if another field has a value
  if (isRequired && typeof isRequired === 'string') {
    return obj.test({
      name: 'is-conditional-field',
      message: utils.string.t('validation.required'),
      test: function () {
        const thisField = this.parent[field.name];
        const conditionalField = this.parent[isRequired];

        return !conditionalField || (conditionalField && thisField);
      },
    });
  }

  // required (min/max) for a group of related fields
  if (group && (isMin || isMax)) {
    const groupFields = allFields.filter((f) => get(f, 'validation.group.name') === group).map((f) => f.name);

    return obj.test({
      name: 'is-conditional-group',
      exclusive: false,
      params: {},
      message: isOnly
        ? utils.string.t('risks.validation.group.only', { min, group })
        : isRange
        ? utils.string.t('risks.validation.group.range', { min, max, group })
        : isMin
        ? utils.string.t('risks.validation.group.min', { min, group })
        : utils.string.t('risks.validation.group.max', { max, group }),
      test: function () {
        const values = Object.entries(this.parent).reduce((acc, f) => {
          return groupFields.includes(f[0]) ? [...acc, f[1]] : acc;
        }, []);

        const count = values.filter(Boolean).length;
        const isMinOk = count >= min;
        const isMaxOk = count <= max;
        const isRangeOk = count >= min && count <= max;
        const isOnlyOk = count >= min && count <= max;

        return isOnly ? isOnlyOk : isRange ? isRangeOk : isMin ? isMinOk : isMaxOk;
      },
    });
  }

  return obj;
};

const _interceptAddField = (field) => {
  const fieldsToIntercept = ['clientId', 'insuredId', 'reinsuredId'];

  // intercept by field ID
  if (fieldsToIntercept.includes(field.name)) {
    const fields = {
      clientId: {
        name: field.targetField,
        type: 'HIDDEN_OBJECT',
        group: 'GENERAL',
        validation: {},
        value: null,
      },
      insuredId: {
        name: field.targetField,
        type: 'HIDDEN_OBJECT',
        group: 'GENERAL',
        validation: {},
        value: null,
      },
      reinsuredId: {
        name: field.targetField,
        type: 'HIDDEN_OBJECT',
        group: 'GENERAL',
        validation: {},
        value: null,
        ...(field?.conditional && { conditional: field.conditional }),
      },
    };

    return { ...fields[field.name] };
  }
};
const _interceptField = (field, dynamicOptions) => {
  const fieldsToIntercept = ['clientId', 'insuredId', 'reinsuredId'];

  // intercept by field ID
  if (fieldsToIntercept.includes(field.name)) {
    const fields = {
      clientId: {
        type: 'SELECT',
        autocomplete: true,
        showCreate: true,
        options: [...utils.form.getSelectOptions('clients', dynamicOptions)],
      },
      insuredId: {
        type: 'SELECT',
        autocomplete: true,
        showCreate: true,
        options: [...utils.form.getSelectOptions('insureds', dynamicOptions)],
      },
      reinsuredId: {
        type: 'SELECT',
        autocomplete: true,
        showCreate: true,
        options: [...utils.form.getSelectOptions('reinsureds', dynamicOptions)],
      },
    };

    return { ...field, ...fields[field.name] };
  }

  // intercept field if has values in fieldOptions
  if (dynamicOptions[field.name]) {
    const options = utils.form.getSelectOptions(field.name, dynamicOptions);
    const type = {
      type: 'SELECT',
      options: options?.length > 0 ? options : dynamicOptions[field.name],
    };

    return { ...field, ...type };
  }

  return field;
};

// public
const utilsRisk = {
  isArray: (field) => {
    const type = ((field && field.type) || '').toLowerCase();
    return field && type === 'array' && utils.generic.isValidArray(field.arrayItemDef, true);
  },

  isArrayColumn: (field) => {
    return field && utilsRisk.isArray(field) && field.display === 'COLUMN';
  },

  isArrayTable: (field) => {
    return field && utilsRisk.isArray(field) && field.display !== 'COLUMN';
  },

  isObject: (field) => {
    const type = ((field && field.type) || '').toLowerCase();
    return field && ['object', 'address'].includes(type) && utils.generic.isValidArray(field.objectDef, true);
  },

  isBoolean: (field) => {
    const type = ((field && field.type) || '').toLowerCase();
    return field && type === 'toggle';
  },

  isSelect: (field) => {
    const type = ((field && field.type) || '').toLowerCase();
    return field && type === 'select';
  },

  isAutocomplete: (field) => {
    const type = ((field && field.type) || '').toLowerCase();
    return field && type === 'autocomplete';
  },

  isAutocompleteMui: (field) => {
    const type = ((field && field.type) || '').toLowerCase();
    return field && type === 'autocompletemui';
  },

  isAutocompleteMuiAsync: (field) => {
    const type = ((field && field.type) || '').toLowerCase();
    return field && type === 'autocompletemuiasync';
  },

  isGridSpacer: (field) => {
    const type = ((field && field.type) || '').toLowerCase();
    return field && type === 'spacer';
  },

  isHiddenField: (field) => {
    const type = ((field && field.type) || '').toLowerCase();
    return field && type === 'hidden';
  },

  isTitleField: (field) => {
    const name = ((field && field.name) || '').toLowerCase();
    return field && name === 'buildingtitle';
  },

  isConditionValid: (condition = {}, fieldValue) => {
    if (!condition || !has(condition, 'positive') || !has(condition, 'negative')) return;

    const value = utils.generic.isValidObject(fieldValue) ? fieldValue?.value : fieldValue;

    const { positive, negative } = condition;
    const valueLowerCase = isString(value) || isString(condition.value) ? value?.toString().toLowerCase() : value;
    const conditionValueLowerCase =
      isString(value) || isString(condition.value) ? condition.value?.toString().toLowerCase() : condition.value;

    return Boolean(
      (positive && valueLowerCase === conditionValueLowerCase) || (negative && valueLowerCase && valueLowerCase !== conditionValueLowerCase)
    );
  },

  getCondition: (field, fields) => {
    const condition = (field && field.conditional) || '';
    const isNegative = isString(condition) && condition.includes('!=');
    const isPositive = isString(condition) && !isNegative && condition.includes('=');
    const conditionalField = isPositive ? condition.split('=')[0] : isNegative ? condition.split('!=')[0] : '';
    const conditionalValue = isPositive ? condition.split('=')[1] : isNegative ? condition.split('!=')[1] : '';

    if (!field || !condition || !conditionalField || !conditionalValue || !utils.generic.isValidArray(fields, true)) return;

    const dependantField = fields.find((field) => field.name === conditionalField);

    return (
      dependantField && {
        negative: isNegative,
        positive: isPositive,
        name: dependantField.name,
        value: conditionalValue,
      }
    );
  },

  countryDetail: (countries, country) => {
    if (!country || !utils.generic.isValidArray(countries, true)) return null;

    return countries.find((c) => c.value === country || c.label === country) || null;
  },

  parseFacilityLimits: (fieldLimits, facilityLimitFields) => {
    let newTestResult = [];

    fieldLimits?.forEach((limitsObj) => {
      limitsObj?.valueLimits?.forEach((element) => {
        const selectedObj = facilityLimitFields.find((item) => item.name === limitsObj.fieldName);
        const res = {
          fieldName: limitsObj.fieldName,
          label: limitsObj?.label,
          limitFieldOptions: selectedObj?.options?.find((obj) => obj.value === element['fieldValue']),
          qualifier: limitsObj?.qualifier,
          limit: element['limit'],
          alert: element['alertRate'],
        };
        newTestResult.push(res);
      });
    });
    return newTestResult;
  },

  parseFields: (fields, dynamicOptions = {}) => {
    if (!fields || !utils.generic.isValidArray(fields, true)) return [];

    const targetFields = fields.filter((field) => field?.targetField).map((field) => Object.assign({}, _interceptAddField(field)));

    const updatedFields = [...targetFields, ...fields];

    return updatedFields
      .filter((field) => field.type)
      .map((oldField) => {
        const field = Object.assign({}, _interceptField(oldField, dynamicOptions));

        field.type = field.type.toLowerCase();
        field.validationObj = field.validation;
        field.validation = _getValidation(field, fields);

        switch (field.type) {
          case 'array':
            field.display = field.display || 'ROW';
            field.arrayItemDef = utilsRisk.parseFields(field.arrayItemDef, dynamicOptions);
            break;

          case 'object':
          case 'address':
            field.objectDef = utilsRisk.parseFields(field.objectDef, dynamicOptions);
            break;

          case 'checkbox':
            field.value = field.value === undefined ? [] : field.value;
            field.title = field.label === undefined ? '' : field.label;
            delete field.label;
            break;

          case 'radio':
            field.value = field.value === undefined ? '' : field.value;
            field.title = field.label === undefined ? '' : field.label;
            delete field.label;
            break;

          case 'boolean':
            field.type = 'toggle';
            field.value = field.value === true ? 'true' : field.value === false ? 'false' : null;
            field.options = [
              { label: utils.string.t('app.yes'), value: 'true' },
              { label: utils.string.t('app.no'), value: 'false' },
            ];
            field.buttonGroupProps = { exclusive: true };
            break;

          case 'select':
            const isMulti = field.multi || Array.isArray(field.value);
            field.options = [...(field.options || [])];
            if (field?.dataSource) {
              field.type = 'selectAsync';
            }
            // autocomplete (MUI by default)
            if (field.autocomplete) {
              field.type = 'autocompletemui';
              if (field?.dataSource) {
                field.type = 'autocompletemuiAsync';
              }
              field.value =
                field.value === undefined
                  ? isMulti
                    ? []
                    : null
                  : field.options.filter((option) => {
                      const value = Array.isArray(field.value) ? field.value : [field.value];

                      return value.includes(option.value);
                    });

              field.muiComponentProps = {
                multiple: isMulti,
              };

              if (field?.optionsCreatable) {
                field.muiComponentProps = {
                  multiple: isMulti,
                  filterOptions: (options, params) => {
                    const filtered = createFilterOptions({
                      stringify: (option) => `${option.label}`,
                    })(options, params);

                    // Suggest the creation of a new value
                    if (field.optionsIsNumber) {
                      if (params.inputValue !== '' && parseFloat(params.inputValue)) {
                        const valueFormatted = utils.number.formatNumber(parseFloat(params.inputValue));
                        filtered.push({
                          value: parseFloat(params.inputValue),
                          label: valueFormatted,
                        });
                      }
                    } else {
                      if (params.inputValue !== '') {
                        filtered.push({
                          value: params.inputValue,
                          label: `${utils.string.t('app.add')} "${params.inputValue}"`,
                        });
                      }
                    }

                    return filtered;
                  },
                  renderOption: (option) => (field.optionsIsNumber ? utils.number.formatNumber(option.label) : option.label),
                  getOptionLabel: (option) => (field.optionsIsNumber ? utils.number.formatNumber(option.label) : option.label),
                };
              }

              // select
            } else {
              field.multi = isMulti;
              field.value = field.value === undefined ? (isMulti ? ['__placeholder__'] : '__placeholder__') : field.value;

              if (!field.options.some((o) => o.value === '__placeholder__')) {
                field.options.unshift({
                  label: utils.string.t('risks.select'),
                  value: '__placeholder__',
                  placeholder: true,
                });
              }

              if (isMulti) {
                field.muiComponentProps = {
                  ...field.muiComponentProp,
                  multiple: true,
                };
              }
            }

            delete field.autocomplete;
            delete field.multi;
            break;

          case 'date':
          case 'datepicker':
            field.value = field.value === undefined ? null : field.value;
            field.type = 'datepicker';
            field.outputFormat = 'iso';
            field.muiComponentProps = {
              fullWidth: true,
            };
            field.muiPickerProps = {
              clearable: true,
            };
            delete field.datepicker;
            break;

          case 'integer':
          case 'double':
            field.type = 'number';
            field.value = field.value === undefined ? '' : field.value;
            if (field.step) {
              field.muiComponentProps = {
                inputProps: {
                  step: field.step,
                },
              };
              delete field.step;
            }
            break;

          case 'text':
            field.value = field.value === undefined ? '' : field.value;
            if (field.display === 'MULTI') {
              field.muiComponentProps = {
                multiline: true,
                minRows: 3,
                maxRows: 6,
              };
              delete field.display;
            }
            break;

          default:
            field.value = field.value === undefined ? '' : field.value;
        }

        return field;
      });
  },

  getRiskName: (riskType, products) => {
    // abort
    if (!riskType || !utils.generic.isValidArray(products)) return '';

    const risk = products.find((p) => p.value === riskType);
    return risk?.label ? risk.label : '';
  },

  getGroups: (fields) => {
    // abort
    if (!utils.generic.isValidArray(fields)) return {};

    return groupBy(
      fields.filter((field) => {
        return field.group && typeof field.group === 'string';
      }),
      'group'
    );
  },

  getGroupsTitle: (fields) => {
    // abort
    if (!utils.generic.isValidArray(fields)) return {};

    return [...new Set(fields.map((field) => (field.group && typeof field.group === 'string' ? field.group : null)))];
  },
  getFieldsByGroup: (fields, group) => {
    // abort
    if (!utils.generic.isValidArray(fields) || !group || typeof group !== 'string') return [];

    return fields.filter((field) => field.group === group);
  },

  getPartyValues: (key, options, value) => {
    // abort
    if (!key || !options || !value) return;

    if (Array.isArray(value)) {
      return value.map((val) => {
        const optionValue = utils.form.getSelectOption(key, options, val);
        return { id: val, name: optionValue };
      });
    } else {
      const optionValue = utils.form.getSelectOption(key, options, value);
      return [{ id: value, name: optionValue }];
    }
  },

  getInsuredCountry: (address, countries) => {
    // abort
    if (!address || !address.country) return '';

    const countryKey = get(address, 'country', '');
    const countryObj = countryKey && utils.generic.isValidArray(countries, true) && countries.find((c) => c.value === countryKey);
    return countryObj ? countryObj.label || '' : '';
  },

  getInsuredAddress: (insured, countries) => {
    // abort
    if (!insured) return '';

    const addressArray = [
      get(insured, 'address.street', ''),
      get(insured, 'address.city', ''),
      get(insured, 'address.zipCode', ''),
      get(insured, 'address.county', ''),
      get(insured, 'address.state', ''),
      utilsRisk.getInsuredCountry(insured.address, countries),
    ].filter(Boolean);

    return addressArray.join(', ');
  },
  getDefByName: (name, defs) => defs.find((d) => d.name === name),

  filterConditionalValues: (objValues, defs, isArr) => {
    return Object.keys(objValues).reduce((acc, key) => {
      const field = utilsRisk.getDefByName(key, defs);
      const isArray = utilsRisk.isArray(field);
      const isObject = utilsRisk.isObject(field);
      const condition = utilsRisk.getCondition(field, defs);
      const refValueCondition = condition && get(objValues, `${condition.name}`);
      const isConditionValid = condition && utilsRisk.isConditionValid(condition, refValueCondition);

      let returnedValue = objValues[key];

      if (isArray) {
        returnedValue = objValues[key]?.map((arrayValues) => {
          return utilsRisk.filterConditionalValues(arrayValues, utilsRisk.getDefByName(key, defs).arrayItemDef);
        });
      } else if (isObject) {
        returnedValue = utilsRisk.filterConditionalValues(objValues[key], utilsRisk.getDefByName(key, defs).objectDef);
      }

      return {
        ...acc,
        ...((!condition || isConditionValid) && { [key]: returnedValue }),
      };
    }, {});
  },

  parsedValues: (valueObj, defs) => {
    return Object.entries(valueObj).reduce((acc, item) => {
      const key = item[0];
      let value = item[1];
      const field = utilsRisk.getDefByName(key, defs);

      // select
      if (utils.risk.isSelect(field)) {
        if (utils.generic.isValidArray(value)) {
          value = value.filter((v) => v !== '__placeholder__');
        } else {
          value = value === '__placeholder__' ? null : value;
        }
      }

      // autocomplete
      if (utils.risk.isAutocomplete(field) || utils.risk.isAutocompleteMui(field) || utils.risk.isAutocompleteMuiAsync(field)) {
        if (utils.generic.isValidArray(value)) {
          // this changes the autocomplete multiple values from array of objects to an array of string
          // before --> [{ label:'SPAIN', value:'ES' }, { label:'France', value:'FR' }]
          // after  --> [ 'ES', 'FR' ]
          value = value.map((obj) => {
            return utils.generic.isObjectKeysIdentical(['label', 'value'], obj) ? obj.value : obj;
          });
        } else if (utils.generic.isValidObject(value, 'value')) {
          // this changes the autocomplete single option from an object to a string
          // before --> { label:'SPAIN', value:'ES' }
          // after  --> 'ES'
          value = value.value;
        }
      }

      // array
      else if (utilsRisk.isArray(field) && utils.generic.isValidArray(value)) {
        value = value.map((obj, index) => {
          const defTitle = field?.itemTitle && field.itemTitleField ? `${field.itemTitle} ${index + 1}` : null;
          return {
            ...utilsRisk.parsedValues(obj, field.arrayItemDef),
            ...(defTitle && { [field?.itemTitleField]: defTitle }),
          };
        });
      }

      // object
      else if (utilsRisk.isObject(field) && utils.generic.isValidObject(value)) {
        value = utilsRisk.parsedValues(value, field.objectDef);
      }

      // boolean
      else if (utilsRisk.isBoolean(field)) {
        value = value === 'true' || value === true;
      }

      return { ...acc, [key]: value };
    }, {});
  },

  parsedGraphValues: (valueLimits) => {
    if (valueLimits?.length > 0) {
      const validLimits = valueLimits
        ?.filter((item) => item.facilityLimit !== null)
        .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
      const invalidLimits = valueLimits
        ?.filter((item) => item.facilityLimit === null)
        .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
      return [...validLimits, ...invalidLimits];
    }
    return [];
  },

  renderRiskValue: (field, value, valuesByID = [], countryOfOrigin = []) => {
    let prefix = '';
    let suffix = '';
    let newValue = value;

    switch (field.type) {
      case 'DOUBLE':
        const isPercent = field && field.validation && field.validation.percent;
        newValue = utils.string.t(`format.${isPercent ? 'percent' : 'currency'}`, { value: { number: value } });
        break;
      case 'BOOLEAN':
        newValue =
          value === 'true' || value === true
            ? utils.string.t('app.yes')
            : value === 'false' || value === false
            ? utils.string.t('app.no')
            : '';
        break;

      case 'DATE':
        newValue = utils.string.t(`format.date`, { value: { date: value } });
        break;
      case 'ID':
        newValue = valuesByID[field.name]?.id === value ? valuesByID[field.name]?.name : '';
        break;

      case 'SELECT': {
        if (field.autocomplete) {
          if (utils.generic.isValidArray(value)) {
            newValue = '';
            for (const singleValue of value) {
              newValue = newValue + `${singleValue?.label || singleValue},`;
            }
            newValue = newValue.slice(0, -1);
          } else newValue = value?.label || value;
        } else {
          const options =
            field.name === 'countryOfOrigin' ? countryOfOrigin : utils.generic.isValidArray(field.options, true) ? field.options : [];
          const option = options.find((o) => String(o.value) === String(value)) || {};

          newValue = option?.label !== 'Select...' ? option.label : value ? value : '';
        }
        break;
      }
      case 'RADIO': {
        newValue = value || '';
        break;
      }

      default:
        break;
    }

    // add prefix/suffix for specific fields
    if (field.name === 'distanceToCoast' && value) {
      suffix = ` ${utils.string.t('map.unit.miles')}`;
    }
    // the extra <span /> is used to prevent Material-UI complaining about not receiving a ReactNode
    // this happens if the value is true/false/undefined/null...
    // this workaround prevents errors in case some invalid values fall through the cracks
    return utils.generic.isValidObject(newValue) ? null : (
      <span>
        {prefix}
        {newValue}
        {suffix}
      </span>
    );
  },
};

export default utilsRisk;
