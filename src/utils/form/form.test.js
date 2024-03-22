import * as utils from 'utils';
import { numberCurrencyObject, numberPercentObject, numberMultipleOfNumber, numberFormatObject, atLeastOneOfObject } from './form';
import * as Yup from 'yup';
import config from 'config';

describe('UTILS › form', () => {
  const fields = [
    {
      type: 'autocomplete',
      value: 1,
    },
    {
      name: 'text',
      otherKey: 'otherText',
      type: 'text',
      value: 'foo',
      validation: Yup.string().required('zzzzzzzzzzzzzzzzz'),
    },
    {
      name: 'checkbox',
      otherKey: 'otherCheckbox',
      type: 'checkbox',
      value: ['aaa'],
      options: [
        { label: 'aaa', name: 'aaa', value: true },
        { label: 'bbb', name: 'bbb', value: false },
      ],
    },
    [
      {
        type: 'legend',
      },
      {
        name: 'qwerty',
        otherKey: 'otherQwerty',
        type: 'autocomplete',
        value: [],
        validation: Yup.array(),
      },
    ],
  ];

  describe('numberCurrencyObject', () => {
    it('should return number format validation object', () => {
      const currencyInteger = config.ui.format.currency.integer;
      const currencyDecimal = config.ui.format.currency.decimal;

      expect(numberCurrencyObject()).toHaveProperty('name', 'test-number-currency');
      expect(numberCurrencyObject()).toHaveProperty('message', 'validation.number.format');
      expect(numberCurrencyObject('foo')).toHaveProperty('message', 'foo');
      expect(numberCurrencyObject()).toHaveProperty('params', { integer: currencyInteger, decimal: currencyDecimal });
      expect(numberCurrencyObject()).toHaveProperty('test');
      expect(typeof numberCurrencyObject().test).toEqual('function');

      // test integer values
      expect(numberCurrencyObject().test('')).toBeTruthy();
      expect(numberCurrencyObject().test('0')).toBeTruthy();
      expect(numberCurrencyObject().test('1')).toBeTruthy();
      expect(numberCurrencyObject().test('10')).toBeTruthy();
      expect(numberCurrencyObject().test('100')).toBeTruthy();
      expect(numberCurrencyObject().test('1000')).toBeTruthy();
      expect(numberCurrencyObject().test('10000')).toBeTruthy();
      expect(numberCurrencyObject().test('100000')).toBeTruthy();
      expect(numberCurrencyObject().test('1000000')).toBeTruthy();
      expect(numberCurrencyObject().test('10000000')).toBeTruthy();
      expect(numberCurrencyObject().test('100000000')).toBeTruthy();
      expect(numberCurrencyObject().test('1000000000')).toBeTruthy();
      expect(numberCurrencyObject().test('10000000000')).toBeTruthy();
      expect(numberCurrencyObject().test('100000000000')).toBeTruthy();
      expect(numberCurrencyObject().test('1000000000000')).toBeTruthy();
      expect(numberCurrencyObject().test('10000000000000')).toBeTruthy();
      expect(numberCurrencyObject().test('100000000000000')).toBeFalsy(); // integral part too long

      // test decimal values
      expect(numberCurrencyObject().test('1')).toBeTruthy();
      expect(numberCurrencyObject().test('1.0')).toBeTruthy();
      expect(numberCurrencyObject().test('1.00')).toBeTruthy();
      expect(numberCurrencyObject().test('1.000')).toBeFalsy(); // decimal part too long

      // test falsy values
      expect(numberCurrencyObject().test('-1')).toBeFalsy();
      expect(numberCurrencyObject().test('-1000')).toBeFalsy();
      expect(numberCurrencyObject().test('-1000.00')).toBeFalsy();
      expect(numberCurrencyObject().test('1000$')).toBeFalsy();
      expect(numberCurrencyObject().test('1000 USD')).toBeFalsy();
      expect(numberCurrencyObject().test('$1000')).toBeFalsy();
      expect(numberCurrencyObject().test('USD 1000')).toBeFalsy();
      expect(numberCurrencyObject().test('1,000')).toBeFalsy();
      expect(numberCurrencyObject().test('1000.00.00')).toBeFalsy();
      expect(numberCurrencyObject().test(' ')).toBeFalsy();
      expect(numberCurrencyObject().test('aaaa')).toBeFalsy();
    });
  });

  describe('numberPercentObject', () => {
    it('should return number format validation object', () => {
      const percentInteger = config.ui.format.percent.integer;
      const percentDecimal = config.ui.format.percent.decimal;

      expect(numberPercentObject()).toHaveProperty('name', 'test-number-percent');
      expect(numberPercentObject()).toHaveProperty('message', 'validation.number.format');
      expect(numberPercentObject('foo')).toHaveProperty('message', 'foo');
      expect(numberPercentObject()).toHaveProperty('params', { integer: percentInteger, decimal: percentDecimal });
      expect(numberPercentObject()).toHaveProperty('test');
      expect(typeof numberPercentObject().test).toEqual('function');

      // test integer values
      expect(numberPercentObject().test('')).toBeTruthy();
      expect(numberPercentObject().test('0')).toBeTruthy();
      expect(numberPercentObject().test('1')).toBeTruthy();
      expect(numberPercentObject().test('10')).toBeTruthy();
      expect(numberPercentObject().test('100')).toBeTruthy();
      expect(numberPercentObject().test('1000')).toBeTruthy();
      expect(numberPercentObject().test('10000')).toBeTruthy();
      expect(numberPercentObject().test('100000')).toBeTruthy();
      expect(numberPercentObject().test('1000000')).toBeTruthy();
      expect(numberPercentObject().test('10000000')).toBeTruthy();
      expect(numberPercentObject().test('100000000')).toBeTruthy();
      expect(numberPercentObject().test('1000000000')).toBeTruthy();
      expect(numberPercentObject().test('10000000000')).toBeTruthy();
      expect(numberPercentObject().test('100000000000')).toBeTruthy();
      expect(numberPercentObject().test('1000000000000')).toBeFalsy(); // integral part too long

      // test decimal values
      expect(numberPercentObject().test('1')).toBeTruthy();
      expect(numberPercentObject().test('1.0')).toBeTruthy();
      expect(numberPercentObject().test('1.00')).toBeTruthy();
      expect(numberPercentObject().test('1.000')).toBeTruthy();
      expect(numberPercentObject().test('1.0000')).toBeTruthy();
      expect(numberPercentObject().test('1.00000')).toBeFalsy(); // decimal part too long

      // test falsy values
      expect(numberPercentObject().test('-1')).toBeFalsy();
      expect(numberPercentObject().test('-1000')).toBeFalsy();
      expect(numberPercentObject().test('-1000.00')).toBeFalsy();
      expect(numberPercentObject().test('1000$')).toBeFalsy();
      expect(numberPercentObject().test('1000 USD')).toBeFalsy();
      expect(numberPercentObject().test('$1000')).toBeFalsy();
      expect(numberPercentObject().test('USD 1000')).toBeFalsy();
      expect(numberPercentObject().test('1,000')).toBeFalsy();
      expect(numberPercentObject().test('1000.00.00')).toBeFalsy();
      expect(numberPercentObject().test(' ')).toBeFalsy();
      expect(numberPercentObject().test('aaaa')).toBeFalsy();
    });
  });

  // Test multiple
  describe('numberMultipleOfNumber', () => {
    it('should return number is multiple of parameter', () => {
      expect(numberMultipleOfNumber()).toHaveProperty('name', 'test-number-multipleOf');
      expect(numberMultipleOfNumber()).toHaveProperty('message', 'validation.number.multiple');
      expect(numberMultipleOfNumber(5, 'foo')).toHaveProperty('message', 'foo');
      expect(numberMultipleOfNumber()).toHaveProperty('test');
      expect(typeof numberMultipleOfNumber().test).toEqual('function');

      // DEFAULT

      // expect(numberMultipleOfNumber(10).test('')).toBeFalsy();
      expect(numberMultipleOfNumber(10).test('1')).toBeFalsy();
      expect(numberMultipleOfNumber(10).test('15')).toBeFalsy();
      expect(numberMultipleOfNumber(10).test('22')).toBeFalsy();

      expect(numberMultipleOfNumber(0).test(0)).toBeTruthy();
      expect(numberMultipleOfNumber(10).test('0')).toBeTruthy();
      expect(numberMultipleOfNumber(10).test(10)).toBeTruthy();
      expect(numberMultipleOfNumber(10).test(20)).toBeTruthy();
      expect(numberMultipleOfNumber(5).test(25)).toBeTruthy();
      expect(numberMultipleOfNumber(5.5).test(11)).toBeTruthy();
    });
  });

  describe('numberFormatObject', () => {
    it('should return number format validation object', () => {
      const defaultInteger = config.ui.format.number.integer;
      const defaultDecimal = config.ui.format.number.decimal;

      expect(numberFormatObject()).toHaveProperty('name', 'test-number-format');
      expect(numberFormatObject()).toHaveProperty('message', 'validation.number.format');
      expect(numberFormatObject('foo')).toHaveProperty('message', 'foo');
      expect(numberFormatObject()).toHaveProperty('params', { integer: defaultInteger, decimal: defaultDecimal });
      expect(numberFormatObject(null, 6)).toHaveProperty('params', { integer: 6, decimal: defaultDecimal });
      expect(numberFormatObject(null, 6, 4)).toHaveProperty('params', { integer: 6, decimal: 4 });
      expect(numberFormatObject()).toHaveProperty('test');
      expect(typeof numberFormatObject().test).toEqual('function');

      // DEFAULT
      // test integer values
      expect(numberFormatObject().test('')).toBeTruthy();
      expect(numberFormatObject().test('0')).toBeTruthy();
      expect(numberFormatObject().test('1')).toBeTruthy();
      expect(numberFormatObject().test('100')).toBeTruthy();
      expect(numberFormatObject().test('1000')).toBeTruthy();
      expect(numberFormatObject().test('10000')).toBeTruthy();
      expect(numberFormatObject().test('100000')).toBeTruthy();
      expect(numberFormatObject().test('1000000')).toBeTruthy();
      expect(numberFormatObject().test('10000000')).toBeTruthy();
      expect(numberFormatObject().test('100000000')).toBeTruthy();
      expect(numberFormatObject().test('1000000000')).toBeTruthy();
      expect(numberFormatObject().test('10000000000')).toBeTruthy();
      expect(numberFormatObject().test('100000000000')).toBeTruthy();
      expect(numberFormatObject().test('1000000000000')).toBeTruthy();
      expect(numberFormatObject().test('10000000000000')).toBeTruthy();
      expect(numberFormatObject().test('100000000000000')).toBeFalsy(); // integral part too long

      // test decimal values
      expect(numberFormatObject().test('1.0')).toBeTruthy();
      expect(numberFormatObject().test('1.00')).toBeTruthy();
      expect(numberFormatObject().test('1.000')).toBeFalsy(); // decimal part too long

      // test falsy values
      expect(numberFormatObject().test('-1')).toBeFalsy();
      expect(numberFormatObject().test('-1000')).toBeFalsy();
      expect(numberFormatObject().test('-1000.00')).toBeFalsy();
      expect(numberFormatObject().test('1000$')).toBeFalsy();
      expect(numberFormatObject().test('1000 USD')).toBeFalsy();
      expect(numberFormatObject().test('$1000')).toBeFalsy();
      expect(numberFormatObject().test('USD 1000')).toBeFalsy();
      expect(numberFormatObject().test('1,000')).toBeFalsy();
      expect(numberFormatObject().test('1000.00.00')).toBeFalsy();
      expect(numberFormatObject().test(' ')).toBeFalsy();
      expect(numberFormatObject().test('aaaa')).toBeFalsy();

      // CUSTOM FORMATTING
      // test integer values
      expect(numberFormatObject(null, 4, 1).test('')).toBeTruthy();
      expect(numberFormatObject(null, 4, 1).test('0')).toBeTruthy();
      expect(numberFormatObject(null, 4, 1).test('1')).toBeTruthy();
      expect(numberFormatObject(null, 4, 1).test('100')).toBeTruthy();
      expect(numberFormatObject(null, 4, 1).test('1000')).toBeTruthy();
      expect(numberFormatObject(null, 4, 1).test('10000')).toBeFalsy(); // integral part too long

      // test integer values
      expect(numberFormatObject(null, 4, 1).test('1.0')).toBeTruthy();
      expect(numberFormatObject(null, 4, 1).test('1.00')).toBeFalsy(); // decimal part too long

      // test falsy values
      expect(numberFormatObject(null, 4, 1).test('-1')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test('-1000')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test('-1000.00')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test('1000$')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test('1000 USD')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test('$1000')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test('USD 1000')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test('1,000')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test('1000.00.00')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test(' ')).toBeFalsy();
      expect(numberFormatObject(null, 4, 1).test('aaaa')).toBeFalsy();
    });
  });

  describe('atLeastOneOfObject', () => {
    it('should return number max validation object', () => {
      expect(atLeastOneOfObject()).toHaveProperty('name', 'atLeastOneOf');
      expect(atLeastOneOfObject()).toHaveProperty('message', 'validation.atLeastOneOf');
      expect(atLeastOneOfObject('foo')).toHaveProperty('message', 'foo');
      expect(atLeastOneOfObject()).toHaveProperty('exclusive', true);
      expect(atLeastOneOfObject()).toHaveProperty('params', { keys: '' });
      expect(atLeastOneOfObject(null, [])).toHaveProperty('params', { keys: '' });
      expect(atLeastOneOfObject(null, ['foo', 'bar', 1, 2, '3'])).toHaveProperty('params', { keys: 'foo, bar, 1, 2, 3' });
      expect(atLeastOneOfObject()).toHaveProperty('test');
      expect(typeof atLeastOneOfObject().test).toEqual('function');
    });
  });

  describe('getValidationSchema', () => {
    it('should return the Yup validation schema', () => {
      // missing fields param
      expect(typeof utils.form.getValidationSchema()).toEqual('object');
      expect(utils.form.getValidationSchema().fields.text).toBeUndefined();
      expect(utils.form.getValidationSchema().fields.bar).toBeUndefined();
      expect(utils.form.getValidationSchema().fields['checkbox-aaa']).toBeUndefined();
      expect(utils.form.getValidationSchema().fields['checkbox-bbb']).toBeUndefined();
      expect(utils.form.getValidationSchema().fields.qwerty).toBeUndefined();

      // null fields param
      expect(typeof utils.form.getValidationSchema(null)).toEqual('object');
      expect(utils.form.getValidationSchema(null).fields.text).toBeUndefined();
      expect(utils.form.getValidationSchema(null).fields.bar).toBeUndefined();
      expect(utils.form.getValidationSchema(null).fields['checkbox-aaa']).toBeUndefined();
      expect(utils.form.getValidationSchema(null).fields['checkbox-bbb']).toBeUndefined();
      expect(utils.form.getValidationSchema(null).fields.qwerty).toBeUndefined();

      // with valid fields array
      expect(typeof utils.form.getValidationSchema(fields)).toEqual('object');
      expect(utils.form.getValidationSchema(fields).fields.text).toBeDefined();
      expect(utils.form.getValidationSchema(fields).fields.text._type).toEqual('string');
      expect(utils.form.getValidationSchema(fields).fields.bar).toBeUndefined();
      expect(utils.form.getValidationSchema(fields).fields['checkbox-aaa']).toBeUndefined();
      expect(utils.form.getValidationSchema(fields).fields['checkbox-bbb']).toBeUndefined();
      expect(utils.form.getValidationSchema(fields).fields.qwerty).toBeDefined();
      expect(utils.form.getValidationSchema(fields).fields.qwerty._type).toEqual('array');
    });
  });

  describe('getInitialValues', () => {
    it('should return the initial values for all valid fields', () => {
      expect(utils.form.getInitialValues()).toEqual({});
      expect(utils.form.getInitialValues(null)).toEqual({});
      expect(utils.form.getInitialValues([])).toEqual({});
      expect(utils.form.getInitialValues(fields)).toEqual({
        text: 'foo',
        checkbox: ['aaa'],
        qwerty: [],
      });
      expect(utils.form.getInitialValues(fields, 'otherKey')).toEqual({
        otherText: 'foo',
        otherCheckbox: ['aaa'],
        otherQwerty: [],
      });
    });
  });

  describe('getFormattedValues', () => {
    it('should return the formatted values for all valid fields', () => {
      const values = {
        foo: 'fooValue',
        obj: null,
        qwerty: null,
        id: '123',
      };

      const fields = [
        {
          type: 'legend',
        },
        { name: 'foo', type: 'string' },
        { name: 'qwerty', type: 'array' },
        { name: 'obj', type: 'object' },
      ];
      expect(utils.form.getFormattedValues()).toEqual({});
      expect(utils.form.getFormattedValues(null)).toEqual({});
      expect(utils.form.getFormattedValues([])).toEqual({});
      expect(utils.form.getFormattedValues(values, fields)).toEqual({
        foo: 'fooValue',
        obj: null,
        qwerty: [],
      });
    });
  });

  describe('getFieldProps', () => {
    it('should return the form field properties for the provided field (name)', () => {
      expect(utils.form.getFieldProps()).toEqual({});
      expect(utils.form.getFieldProps(null)).toEqual({});
      expect(utils.form.getFieldProps(null, null)).toEqual({});
      expect(utils.form.getFieldProps([])).toEqual({});
      expect(utils.form.getFieldProps([], null)).toEqual({});
      expect(utils.form.getFieldProps(fields)).toEqual({});
      expect(utils.form.getFieldProps(fields, null)).toEqual({});
      expect(utils.form.getFieldProps(fields, '')).toEqual({});
      expect(utils.form.getFieldProps(fields, 'text')).toEqual(fields[1]);
      expect(utils.form.getFieldProps(fields, 'checkbox')).toEqual(fields[2]);
    });
  });

  describe('getLabelById', () => {
    it('should return the label if required properties are passed', () => {
      const fields = [
        {
          id: 'foo',
          label: 'fooLabel',
        },
        {
          id: 'bar',
          label: 'barLabel',
        },
      ];
      expect(utils.form.getLabelById(null)).toEqual(undefined);
      expect(utils.form.getLabelById(null, 'foo')).toEqual('foo');
      expect(utils.form.getLabelById([])).toEqual(undefined);
      expect(utils.form.getLabelById([{ label: 'foo' }], 'foo')).toEqual('foo');
      expect(utils.form.getLabelById([{ id: 'foo' }], 'foo')).toEqual('foo');
      expect(utils.form.getLabelById(fields)).toEqual(undefined);
      expect(utils.form.getLabelById(fields, 'foo')).toEqual('fooLabel');
    });
  });

  describe('getSelectOption', () => {
    it('should return options value for dynamic select', () => {
      // arrange
      const data = {
        currencies: [
          { id: 1, code: 'foo' },
          { id: 2, code: 'bar' },
          { id: 3, code: 'baz' },
        ],
      };

      // act
      const response = utils.form.getSelectOption('currency', data, 2);

      // assert
      expect(response).toBe('bar');
    });
    it('should return options value for static select', () => {
      // act
      const response = utils.form.getSelectOption('ppwPPC', {}, 'PPC');

      // assert
      expect(response).toBe('form.options.ppwPPC.ppc');
    });
  });

  describe('getSelectOptions', () => {
    it('should return options for dynamic data', () => {
      // arrange
      const data = {
        currencies: [
          { id: 1, code: 'foo' },
          { id: 2, code: 'bar' },
          { id: 3, code: 'baz' },
        ],
      };

      // act
      const response = utils.form.getSelectOptions('currency', data);

      // assert
      expect(response.length).toBe(3);
      expect(response[0]).toEqual({ id: 1, label: 'foo', value: 1 });
    });
    it('should return options for dynamic data, with transform', () => {
      // arrange
      const data = {
        products: [
          { label: 'Label Foo', value: 'FOO' },
          { label: 'Label Bar', value: 'BAR' },
        ],
      };

      // act
      const response = utils.form.getSelectOptions('products', data);

      // assert
      expect(response).toEqual([
        { id: 'FOO', label: 'Label Foo', value: 'FOO' },
        { id: 'BAR', label: 'Label Bar', value: 'BAR' },
      ]);
    });
    it('should return options for static data', () => {
      // act
      const response = utils.form.getSelectOptions('paymentBasis');

      // assert
      expect(response).toEqual([
        { id: 'CASH', label: 'form.options.paymentBasis.cash', value: 'CASH' },
        { id: 'QUARTERLY', label: 'form.options.paymentBasis.quarterly', value: 'QUARTERLY' },
        { id: 'OTHER_DEFERRED', label: 'form.options.paymentBasis.otherdeferred', value: 'OTHER_DEFERRED' },
      ]);
    });
  });

  describe('getValidationLabel', () => {
    it('should return correct `required` label', () => {
      // act
      const response = utils.form.getValidationLabel('field', 'required');

      // assert
      expect(response).toBe('field form.validation.isRequired');
    });
    it('should return label if validation type not found', () => {
      // act
      const response = utils.form.getValidationLabel('field', 'notFound');

      // assert
      expect(response).toBe('field');
    });
  });
});
