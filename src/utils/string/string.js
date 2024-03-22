import React from 'react';
import * as utils from 'utils';
import startCase from 'lodash/startCase';
import compact from 'lodash/compact';
import isNumber from 'lodash/isNumber';

const utilsString = {
  t: (label, options) => {
    return utils.i18n.t(label, options);
  },

  html: (label, options) => {
    return <span dangerouslySetInnerHTML={{ __html: utils.i18n.t(label, options) }} />;
  },

  capitalise: (str) => {
    if (!str || typeof str !== 'string') return '';

    return startCase(str.toLowerCase());
  },

  replaceLowerCase: (str, pattern = 'default') => {
    const regex = {
      default: /[ _]/g,
      withDash: /[ _-]/g,
    };
    const selectedRegex = regex[pattern] ? regex[pattern] : pattern;
    return str ? str.replace(selectedRegex, '').toLowerCase() : str;
  },

  startCase: (str, keepForwardSlash = true) => {
    if (!str || typeof str !== 'string') return '';

    const regex = /(\s)*(\/)+(\s)*/g;
    const isUppercase = str === str.toUpperCase();
    const parse = (strToParse) => startCase(isUppercase ? strToParse.toLowerCase() : strToParse);

    if (keepForwardSlash && str.includes('/')) {
      str = str.replace(regex, '/');
      return compact(str.split('/'))
        .map((part) => parse(part))
        .join(' / ');
    }

    return parse(str);
  },

  stripNonNumeric: (value) => {
    if (isNumber(value)) return value;
    if (!value || typeof value !== 'string') return;
    return value.replace(/[^\d.-]/g, '');
  },

  stripNonAlphaNumeric: (value) => {
    if (!value) return '';
    return value.replace(/[^a-z0-9]+/gi, '');
  },

  isEqual: (a, b, options = {}) => {
    // by default it is case sensitive
    const caseSensitive = typeof options?.caseSensitive === 'undefined' ? true : options.caseSensitive;

    if (a === '' && b === '') return true;
    if (!a || !b) return false;
    if (typeof a !== 'string' || typeof b !== 'string') return false;

    if (caseSensitive) {
      return a === b;
    } else {
      return a.toLowerCase() === b.toLowerCase();
    }
  },
};

export default utilsString;
