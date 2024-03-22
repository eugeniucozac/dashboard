import round from 'lodash/round';
import isEqual from 'lodash/isEqual';
import xor from 'lodash/xor';

// app
import * as utils from 'utils';
import config from 'config';

const utilsGeneric = {
  isInvalidOrEmptyArray: (arr) => {
    const isArray = arr && Array.isArray(arr);
    const hasItems = isArray && arr.length > 0;

    return !isArray || !hasItems;
  },

  isValidArray: (arr, checkIfArrayHasItems) => {
    const isArray = arr && Array.isArray(arr);
    const hasItems = checkIfArrayHasItems ? isArray && arr.length > 0 : true;

    return Boolean(isArray && hasItems);
  },

  isValidObject: (obj, checkIfObjectHasProperty) => {
    const isObject = obj && typeof obj === 'object' && !Array.isArray(obj);
    const hasProperty = checkIfObjectHasProperty !== undefined ? isObject && obj.hasOwnProperty(checkIfObjectHasProperty) : true;

    return isObject && hasProperty;
  },

  isFunction: (method) => {
    return method && typeof method === 'function';
  },

  isBoolean: (val) => 'boolean' === typeof val,

  /**
   * Check if 2 ids are the same, whether they are string or number
   * This is useful to avoid false negative when comparing id integer (from entities) with id string (from url params)
   *
   * @param {string|number} id1 The 1st id to compare.
   * @param {string|number} id2 The 2nd id to compare.
   * @returns {Boolean} Returns a boolean if all object properties are identical to the array strings.
   */
  isSameId: (id1, id2) => {
    return Boolean(id1 && id2 && id1.toString() === id2.toString());
  },

  /**
   * Check if an object has all/only the same object properties as the array of strings provided
   *
   * @example
   * // returns true - no difference
   * isObjectKeysIdentical([a, b], { a:1, b:2 });
   *
   * @example
   * // returns false - b is NOT in the array
   * isObjectKeysIdentical([a], { a:1, b:2 });
   *
   * @example
   * // returns false - c is NOT in the object
   * isObjectKeysIdentical([a, b, c], { a:1, b:2 });
   *
   * @param {array} base The array of properties to check.
   * @param {object} obj The object in which to check the properties.
   * @returns {Boolean} Returns a boolean if all object properties are identical to the array strings.
   */
  isObjectKeysIdentical: (base, obj) => {
    // abort
    if (!base || !obj || !utilsGeneric.isValidArray(base) || !utilsGeneric.isValidObject(obj)) return false;

    const comparison = obj && xor(base, Object.keys(obj));

    return Array.isArray(comparison) && comparison.length === 0;
  },

  /**
   * Transforms an array of value into an array of value pairs
   *
   * @example
   * // returns [[1,2], [1,3], [2,3]]
   * tuples(1,2,3);
   *
   * @example
   * // returns [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
   * tuples(1,2,3,4);
   *
   * @returns {Number} Returns an array of all possible value pairs.
   */
  tuples: (arr, current = []) => {
    // abort
    if (!utilsGeneric.isValidArray(arr, true)) return [];

    const [first, ...rest] = arr;

    const arrayOfTuples = rest.reduce((acc, cur) => {
      return [...acc, [first, cur]];
    }, current);

    if (rest && rest.length) {
      return utilsGeneric.tuples(rest, arrayOfTuples);
    }

    return arrayOfTuples;
  },

  getLabels: (arr, path, key = 'id') => {
    if (!utilsGeneric.isValidArray(arr)) return;
    if (!path) return arr;
    return arr.map((item) => {
      const label = utils.string.replaceLowerCase(item[key], 'withDash');
      return {
        ...item,
        label: label ? utils.string.t(`${path}.${label}`) : label,
      };
    });
  },

  getSumOfArray: (values, decimal) => {
    if (!utilsGeneric.isValidArray(values)) return;

    const sum = values
      .filter((val) => !!val)
      .map((value) => Number(utils.string.stripNonNumeric(value)))
      .reduce((acc, num) => acc + num, 0);

    return decimal ? round(sum, decimal) : sum;
  },

  getWithDynamicOperator: (a, operator, b) => {
    if (!operator) return;

    const operators = {
      '<=': (a, b) => a <= b,
      '!==': (a, b) => a !== b,
      '===': (a, b) => a === b,
      '>=': (a, b) => a >= b,
    };

    if (!operators[operator]) return;

    return operators[operator](a, b);
  },

  getDifferences: (previous, current) => {
    if (!utilsGeneric.isValidObject(previous) || !utilsGeneric.isValidObject(current)) return {};

    const obj = {};

    Object.keys(current).forEach((key) => {
      if (!isEqual(current[key], previous[key])) {
        obj[key] = current[key];
      }
    });

    return obj;
  },

  getPagination: (obj = {}) => {
    if (!utilsGeneric.isValidObject(obj))
      return {
        page: 0,
        rowsTotal: 0,
        rowsPerPage: config.ui.pagination.default,
      };

    return {
      page: obj.page ? obj.page - 1 : 0,
      rowsTotal: obj.itemsTotal || 0,
      rowsPerPage: obj.pageSize || config.ui.pagination.default,
    };
  },

  getAutocompleteValue: (value, options, optionKey) => {
    if (!value || !utilsGeneric.isValidArray(options, true) || !optionKey) return null;

    const result = options.find((option) => option[optionKey] === value);

    return result ? result : null;
  },

  getAutocompleteMultipleValues: (values, options, optionKey) => {
    if (!utilsGeneric.isValidArray(values, true) || !utilsGeneric.isValidArray(options, true) || !optionKey) return [];

    const result = values
      ?.map((value) => options.find((option) => option[optionKey] === value))
      .filter((value) => utils.generic.isValidObject(value, optionKey));

    return result ? result : [];
  },
  getValueFromOptions: (value, options) => {
    const result = options.find(
      (option) => option?.label?.toUpperCase() === value?.toUpperCase() || option?.value?.toUpperCase() === value?.toUpperCase()
    );

    return result?.value ? result?.value : null;
  },

  getObjectFromOptions: (value, options) => {
    const result = options.find(
      (option) => option?.label?.toUpperCase() === value?.toUpperCase() || option?.value?.toUpperCase() === value?.toUpperCase()
    );

    return result?.value ? result : null;
  },

  formatFields: (obj, field) => {
    let formattedObj = {};
    Object.keys(obj).forEach((item) => {
      const selectedField = field.find((fieldItem) => fieldItem.name === item);
      if (selectedField?.type === 'select') {
        formattedObj[item] = utils.generic.getValueFromOptions(obj[item], selectedField?.options || []);
      }
      if (selectedField?.type === 'autocompletemui') {
        formattedObj[item] = utils.generic.getObjectFromOptions(obj[item], selectedField?.options || []);
      }
      if (selectedField?.type === 'toggle') {
        formattedObj[item] = obj[item]
          ? obj[item] === true || obj[item].toUpperCase() === 'TRUE' || obj[item] === '1' || obj[item].toUpperCase() === 'YES'
            ? true
            : false
          : null;
      }
    });

    const result = { ...obj, ...formattedObj };

    return result;
  },
};

export default utilsGeneric;
