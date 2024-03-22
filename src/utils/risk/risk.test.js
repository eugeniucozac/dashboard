import * as Yup from 'yup';
import * as utils from 'utils';
import { _getValidation, _validationType, _validationMinMax, _validationFormatting, _validationRequired } from './risk';

describe('UTILS › risk', () => {
  const placeholderOption = { label: utils.string.t('risks.select'), value: '__placeholder__', placeholder: true };
  const placeholderValue = '__placeholder__';

  const fields = {
    date: [
      {
        name: 'date1',
        type: 'DATE',
        label: 'Date Field',
      },
      {
        name: 'date2',
        type: 'DATE',
        label: 'Date Picker with value',
        value: '2020-12-31',
        placeholder: 'Lorem ipsum...',
        datepicker: true,
        foo: 'extra unused property',
      },
    ],
    number: [
      {
        name: 'integer1',
        type: 'INTEGER',
        label: 'Integer Field',
      },
      {
        name: 'integer2',
        type: 'INTEGER',
        label: 'Integer Field with value',
        value: '1000',
      },
      {
        name: 'double1',
        type: 'DOUBLE',
        label: 'Double Field',
      },
      {
        name: 'double2',
        type: 'DOUBLE',
        label: 'Double Field with value',
        value: '1000.1234',
        step: 20,
      },
    ],
    checkbox: [
      {
        name: 'checkbox1',
        type: 'CHECKBOX',
        label: 'Checkbox Options',
        options: [
          { label: 'One', name: '1', value: false },
          { label: 'Two', name: '2', value: false },
        ],
      },
      {
        name: 'checkbox2',
        type: 'CHECKBOX',
        label: 'Checkbox Options with value',

        options: [{ label: 'One', name: '1', value: true }],
      },
    ],
    radio: [
      {
        name: 'radio1',
        type: 'RADIO',
        label: 'Radio Options',
        options: [
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
        ],
      },
      {
        name: 'radio2',
        type: 'RADIO',
        label: 'Radio Options with value',
        value: '1',
        options: [{ label: 'One', value: '1' }],
      },
    ],
    boolean: [
      {
        name: 'boolean1',
        type: 'BOOLEAN',
        label: 'Boolean Options',
      },
      {
        name: 'boolean2',
        type: 'BOOLEAN',
        label: 'Boolean Options with value true',
        value: true,
      },
      {
        name: 'boolean3',
        type: 'BOOLEAN',
        label: 'Boolean Options with value false',
        value: false,
      },
    ],
    select: [
      {
        name: 'select1',
        type: 'SELECT',
        label: 'Select Field',
        options: [
          { label: 'France', value: 'FR' },
          { label: 'Spain', value: 'ES', disabled: true },
        ],
      },
      {
        name: 'select2',
        type: 'SELECT',
        label: 'Select Field with value',
        value: 'FR',
        options: [
          { label: 'France', value: 'FR' },
          { label: 'Spain', value: 'ES', disabled: true },
        ],
      },
      {
        name: 'select3',
        type: 'SELECT',
        label: 'Select Field with multiple values',
        value: ['FR', 'ES'],
        options: [
          { label: 'France', value: 'FR' },
          { label: 'Spain', value: 'ES', disabled: true },
        ],
      },
    ],
    autocomplete: [
      {
        name: 'autocomplete1',
        type: 'SELECT',
        label: 'Autocomplete Field',
        autocomplete: true,
        options: [
          { label: 'France', value: 'FR' },
          { label: 'Spain', value: 'ES', disabled: true },
        ],
      },
      {
        name: 'autocomplete2',
        type: 'SELECT',
        label: 'Autocomplete Field with value',
        autocomplete: true,
        value: 'FR',
        options: [
          { label: 'France', value: 'FR' },
          { label: 'Spain', value: 'ES', disabled: true },
        ],
      },
      {
        name: 'autocomplete3',
        type: 'SELECT',
        label: 'Autocomplete Field with multiple values',
        autocomplete: true,
        multi: true,
        value: ['FR', 'ES'],
        options: [
          { label: 'France', value: 'FR' },
          { label: 'Spain', value: 'ES', disabled: true },
          { label: 'Germany', value: 'DE' },
        ],
      },
      {
        name: 'autocomplete4',
        type: 'SELECT',
        label: 'Autocomplete Field with multiple values (multi not explicitly declared)',
        autocomplete: true,
        value: ['FR', 'ES'],
        options: [
          { label: 'France', value: 'FR' },
          { label: 'Spain', value: 'ES', disabled: true },
        ],
      },
    ],
    text: [
      {
        name: 'text1',
        type: 'TEXT',
        label: 'Text Field',
      },
      {
        name: 'text2',
        type: 'TEXT',
        display: 'MULTI',
        label: 'Text Field Multiline',
      },
    ],
    country: [
      {
        name: 'country1',
        type: 'COUNTRY',
        label: 'Country 1',
      },
      {
        name: 'country2',
        type: 'COUNTRY',
        label: 'Country 2',
        multi: true,
      },
    ],
  };

  describe('isArray', () => {
    it('returns true if the object is of type "array" and display is "COLUMN"', () => {
      // assert
      expect(utils.risk.isArray()).toBeFalsy();
      expect(utils.risk.isArray(null)).toBeFalsy();
      expect(utils.risk.isArray(false)).toBeFalsy();
      expect(utils.risk.isArray([])).toBeFalsy();
      expect(utils.risk.isArray({})).toBeFalsy();
      expect(utils.risk.isArray({ type: 'foo' })).toBeFalsy();
      expect(utils.risk.isArray({ type: 'array' })).toBeFalsy();
      expect(utils.risk.isArray({ type: 'array', arrayItemDef: [] })).toBeFalsy();
      expect(utils.risk.isArray({ arrayItemDef: [1] })).toBeFalsy();

      expect(utils.risk.isArray({ type: 'array', arrayItemDef: [1] })).toBeTruthy();
    });
  });

  describe('isArrayColumn', () => {
    it('returns true if the object is of type "array" and display is "COLUMN"', () => {
      // assert
      expect(utils.risk.isArrayColumn()).toBeFalsy();
      expect(utils.risk.isArrayColumn(null)).toBeFalsy();
      expect(utils.risk.isArrayColumn(false)).toBeFalsy();
      expect(utils.risk.isArrayColumn([])).toBeFalsy();
      expect(utils.risk.isArrayColumn({})).toBeFalsy();
      expect(utils.risk.isArrayColumn({ type: 'foo' })).toBeFalsy();
      expect(utils.risk.isArrayColumn({ type: 'array' })).toBeFalsy();
      expect(utils.risk.isArrayColumn({ type: 'array', arrayItemDef: [] })).toBeFalsy();
      expect(utils.risk.isArrayColumn({ arrayItemDef: [1] })).toBeFalsy();
      expect(utils.risk.isArrayColumn({ type: 'array', arrayItemDef: [1] })).toBeFalsy();
      expect(utils.risk.isArrayColumn({ type: 'array', arrayItemDef: [1], display: 'ROW' })).toBeFalsy();
      expect(utils.risk.isArrayColumn({ type: 'array', arrayItemDef: [1], display: 'FOOBAR' })).toBeFalsy();

      expect(utils.risk.isArrayColumn({ type: 'array', arrayItemDef: [1], display: 'COLUMN' })).toBeTruthy();
    });
  });

  describe('isArrayTable', () => {
    it('returns true if the object is of type "array"', () => {
      // assert
      expect(utils.risk.isArrayTable()).toBeFalsy();
      expect(utils.risk.isArrayTable(null)).toBeFalsy();
      expect(utils.risk.isArrayTable(false)).toBeFalsy();
      expect(utils.risk.isArrayTable([])).toBeFalsy();
      expect(utils.risk.isArrayTable({})).toBeFalsy();
      expect(utils.risk.isArrayTable({ type: 'foo' })).toBeFalsy();
      expect(utils.risk.isArrayTable({ type: 'array' })).toBeFalsy();
      expect(utils.risk.isArrayTable({ type: 'array', arrayItemDef: [] })).toBeFalsy();
      expect(utils.risk.isArrayTable({ arrayItemDef: [1] })).toBeFalsy();
      expect(utils.risk.isArrayTable({ type: 'array', arrayItemDef: [1], display: 'COLUMN' })).toBeFalsy();

      expect(utils.risk.isArrayTable({ type: 'array', arrayItemDef: [1] })).toBeTruthy();
      expect(utils.risk.isArrayTable({ type: 'array', arrayItemDef: [1], display: 'ROW' })).toBeTruthy();
      expect(utils.risk.isArrayTable({ type: 'array', arrayItemDef: [1], display: 'FOOBAR' })).toBeTruthy();
    });
  });

  describe('isObject', () => {
    it('returns true if the object is of type "object"', () => {
      // assert
      expect(utils.risk.isObject()).toBeFalsy();
      expect(utils.risk.isObject(null)).toBeFalsy();
      expect(utils.risk.isObject(false)).toBeFalsy();
      expect(utils.risk.isObject([])).toBeFalsy();
      expect(utils.risk.isObject({})).toBeFalsy();
      expect(utils.risk.isObject({ type: 'foo' })).toBeFalsy();
      expect(utils.risk.isObject({ type: 'object' })).toBeFalsy();
      expect(utils.risk.isObject({ type: 'address' })).toBeFalsy();
      expect(utils.risk.isObject({ type: 'object', objectDef: [] })).toBeFalsy();
      expect(utils.risk.isObject({ type: 'address', objectDef: [] })).toBeFalsy();
      expect(utils.risk.isObject({ objectDef: [1] })).toBeFalsy();

      expect(utils.risk.isObject({ type: 'object', objectDef: [1] })).toBeTruthy();
      expect(utils.risk.isObject({ type: 'address', objectDef: [1] })).toBeTruthy();
    });
  });

  describe('isBoolean', () => {
    it('returns true if the object is of type "toggle"', () => {
      // assert
      expect(utils.risk.isBoolean()).toBeFalsy();
      expect(utils.risk.isBoolean(null)).toBeFalsy();
      expect(utils.risk.isBoolean(false)).toBeFalsy();
      expect(utils.risk.isBoolean([])).toBeFalsy();
      expect(utils.risk.isBoolean({})).toBeFalsy();
      expect(utils.risk.isBoolean({ type: 'foo' })).toBeFalsy();
      expect(utils.risk.isBoolean({ type: 'toggle' })).toBeTruthy();
    });
  });

  describe('isSelect', () => {
    it('returns true if the object is of type "toggle"', () => {
      // assert
      expect(utils.risk.isSelect()).toBeFalsy();
      expect(utils.risk.isSelect(null)).toBeFalsy();
      expect(utils.risk.isSelect(false)).toBeFalsy();
      expect(utils.risk.isSelect([])).toBeFalsy();
      expect(utils.risk.isSelect({})).toBeFalsy();
      expect(utils.risk.isSelect({ type: 'foo' })).toBeFalsy();
      expect(utils.risk.isSelect({ type: 'select' })).toBeTruthy();
    });
  });

  describe('isAutocomplete', () => {
    it('returns true if the object is of type "toggle"', () => {
      // assert
      expect(utils.risk.isAutocomplete()).toBeFalsy();
      expect(utils.risk.isAutocomplete(null)).toBeFalsy();
      expect(utils.risk.isAutocomplete(false)).toBeFalsy();
      expect(utils.risk.isAutocomplete([])).toBeFalsy();
      expect(utils.risk.isAutocomplete({})).toBeFalsy();
      expect(utils.risk.isAutocomplete({ type: 'foo' })).toBeFalsy();
      expect(utils.risk.isAutocomplete({ type: 'autocomplete' })).toBeTruthy();
    });
  });

  describe('isConditionValid', () => {
    it('returns undefined if not passed valid params', () => {
      // assert
      expect(utils.risk.isConditionValid()).toEqual(undefined);
      expect(utils.risk.isConditionValid(null)).toEqual(undefined);
      expect(utils.risk.isConditionValid(false)).toEqual(undefined);
      expect(utils.risk.isConditionValid([])).toEqual(undefined);
      expect(utils.risk.isConditionValid({})).toEqual(undefined);
      expect(utils.risk.isConditionValid({ type: 'foo' })).toEqual(undefined);
      expect(utils.risk.isConditionValid({ positive: true })).toEqual(undefined);
      expect(utils.risk.isConditionValid({ negative: true })).toEqual(undefined);
    });

    it('returns a Boolean of the value checked against the condition', () => {
      // positive comparison
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' })).toBeFalsy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, 0)).toBeFalsy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, '')).toBeFalsy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, true)).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, false)).toBeFalsy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, 1)).toBeFalsy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, 'true')).toBeTruthy(); // ok

      // negative comparison
      expect(utils.risk.isConditionValid({ positive: false, negative: true, value: 'false' })).toBeFalsy();
      expect(utils.risk.isConditionValid({ positive: false, negative: true, value: 'false' }, 0)).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: false, negative: true, value: 'false' }, '')).toBeFalsy();
      expect(utils.risk.isConditionValid({ positive: false, negative: true, value: 'false' }, 'false')).toBeFalsy();
      expect(utils.risk.isConditionValid({ positive: false, negative: true, value: 'false' }, false)).toBeFalsy();
      expect(utils.risk.isConditionValid({ positive: false, negative: true, value: 'false' }, true)).toBeTruthy(); // ok
      expect(utils.risk.isConditionValid({ positive: false, negative: true, value: 'false' }, 1)).toBeTruthy(); // ok
      expect(utils.risk.isConditionValid({ positive: false, negative: true, value: 'false' }, 'foo')).toBeTruthy(); // ok

      // case insensitive
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, 'true')).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, 'True')).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, 'TRUE')).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'true' }, 'TruE')).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'True' }, 'true')).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'TRUE' }, 'true')).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'TruE' }, 'true')).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'True' }, 'True')).toBeTruthy();
      expect(utils.risk.isConditionValid({ positive: true, negative: false, value: 'TRUE' }, 'TRUE')).toBeTruthy();
    });
  });

  describe('countryDetail', () => {
    it('returns null if not given correct data (array)', () => {
      // assert
      expect(utils.risk.countryDetail()).toEqual(null);
      expect(utils.risk.countryDetail([])).toEqual(null);
      expect(utils.risk.countryDetail({})).toEqual(null);
      expect(utils.risk.countryDetail(null)).toEqual(null);
      expect(utils.risk.countryDetail(true)).toEqual(null);
      expect(utils.risk.countryDetail(123)).toEqual(null);
      expect(utils.risk.countryDetail('string')).toEqual(null);
    });

    it('returns country object for country ID', () => {
      const countries = [
        { label: 'Andorra', value: 'AD' },
        { label: 'United Arab Emirates', value: 'AE' },
        { label: 'Afghanistan', value: 'AF' },
        { label: 'Antigua and Barbuda', value: 'AG' },
        { label: 'Anguilla', value: 'AI' },
      ];

      expect(utils.risk.countryDetail(countries, 'AD')).toEqual({ label: 'Andorra', value: 'AD' });
      expect(utils.risk.countryDetail(countries, 'Afghanistan')).toEqual({ label: 'Afghanistan', value: 'AF' });
      expect(utils.risk.countryDetail(countries, 'No name')).toEqual(null);
    });
  });

  describe('parseFields', () => {
    it('returns an empty array if not given correct data (array)', () => {
      // assert
      expect(utils.risk.parseFields()).toEqual([]);
      expect(utils.risk.parseFields([])).toEqual([]);
      expect(utils.risk.parseFields({})).toEqual([]);
      expect(utils.risk.parseFields(null)).toEqual([]);
      expect(utils.risk.parseFields(true)).toEqual([]);
      expect(utils.risk.parseFields(666)).toEqual([]);
      expect(utils.risk.parseFields('string')).toEqual([]);
    });

    it('returns modified properties for TEXT fields', () => {
      // assert
      expect(utils.risk.parseFields(fields.text)).toEqual([
        {
          name: 'text1',
          type: 'text',
          label: 'Text Field',
          value: '',
        },
        {
          name: 'text2',
          type: 'text',
          label: 'Text Field Multiline',
          value: '',
          muiComponentProps: {
            multiline: true,
            minRows: 3,
            maxRows: 6,
          },
        },
      ]);
    });

    it('returns modified properties for DATE fields', () => {
      // assert
      expect(utils.risk.parseFields(fields.date)).toEqual([
        {
          name: 'date1',
          type: 'datepicker',
          label: 'Date Field',
          value: null,
          outputFormat: 'iso',
          muiComponentProps: {
            fullWidth: true,
          },
          muiPickerProps: {
            clearable: true,
          },
        },
        {
          name: 'date2',
          type: 'datepicker',
          label: 'Date Picker with value',
          value: '2020-12-31',
          outputFormat: 'iso',
          placeholder: 'Lorem ipsum...',
          foo: 'extra unused property',
          muiComponentProps: {
            fullWidth: true,
          },
          muiPickerProps: {
            clearable: true,
          },
        },
      ]);
    });

    it('returns modified properties for NUMBER fields', () => {
      // assert
      expect(utils.risk.parseFields(fields.number)).toEqual([
        {
          name: 'integer1',
          type: 'number',
          label: 'Integer Field',
          value: '',
        },
        {
          name: 'integer2',
          type: 'number',
          label: 'Integer Field with value',
          value: '1000',
        },
        {
          name: 'double1',
          type: 'number',
          label: 'Double Field',
          value: '',
        },
        {
          name: 'double2',
          type: 'number',
          label: 'Double Field with value',
          value: '1000.1234',
          muiComponentProps: {
            inputProps: {
              step: 20,
            },
          },
        },
      ]);
    });

    it('returns modified properties for CHECKBOX fields', () => {
      // assert
      expect(utils.risk.parseFields(fields.checkbox)).toEqual([
        {
          name: 'checkbox1',
          type: 'checkbox',
          title: 'Checkbox Options',
          value: [],
          options: [
            { label: 'One', name: '1', value: false },
            { label: 'Two', name: '2', value: false },
          ],
        },
        {
          name: 'checkbox2',
          type: 'checkbox',
          title: 'Checkbox Options with value',
          value: [],
          options: [{ label: 'One', name: '1', value: true }],
        },
      ]);
    });

    it('returns modified properties for RADIO fields', () => {
      // assert
      expect(utils.risk.parseFields(fields.radio)).toEqual([
        {
          name: 'radio1',
          type: 'radio',
          title: 'Radio Options',
          options: [
            { label: 'One', value: '1' },
            { label: 'Two', value: '2' },
          ],
          value: '',
        },
        {
          name: 'radio2',
          type: 'radio',
          title: 'Radio Options with value',
          value: '1',
          options: [{ label: 'One', value: '1' }],
        },
      ]);
    });

    it('returns modified properties for BOOLEAN fields', () => {
      // assert
      expect(utils.risk.parseFields(fields.boolean)).toEqual([
        {
          name: 'boolean1',
          type: 'toggle',
          label: 'Boolean Options',
          value: null,
          options: [
            { label: 'app.yes', value: 'true' },
            { label: 'app.no', value: 'false' },
          ],
          buttonGroupProps: { exclusive: true },
        },
        {
          name: 'boolean2',
          type: 'toggle',
          label: 'Boolean Options with value true',
          value: 'true',
          options: [
            { label: 'app.yes', value: 'true' },
            { label: 'app.no', value: 'false' },
          ],
          buttonGroupProps: { exclusive: true },
        },
        {
          name: 'boolean3',
          type: 'toggle',
          label: 'Boolean Options with value false',
          value: 'false',
          options: [
            { label: 'app.yes', value: 'true' },
            { label: 'app.no', value: 'false' },
          ],
          buttonGroupProps: { exclusive: true },
        },
      ]);
    });

    it('returns modified properties for AUTOCOMPLETE fields', () => {
      // assert
      expect(utils.risk.parseFields(fields.autocomplete)).toEqual([
        {
          name: 'autocomplete1',
          type: 'autocompletemui',
          label: 'Autocomplete Field',
          value: null,
          options: [
            { label: 'France', value: 'FR' },
            { label: 'Spain', value: 'ES', disabled: true },
          ],
          muiComponentProps: {
            multiple: false,
          },
        },
        {
          name: 'autocomplete2',
          type: 'autocompletemui',
          label: 'Autocomplete Field with value',
          value: [{ label: 'France', value: 'FR' }],
          options: [
            { label: 'France', value: 'FR' },
            { label: 'Spain', value: 'ES', disabled: true },
          ],
          muiComponentProps: {
            multiple: false,
          },
        },
        {
          name: 'autocomplete3',
          type: 'autocompletemui',
          label: 'Autocomplete Field with multiple values',
          value: [
            { label: 'France', value: 'FR' },
            { label: 'Spain', value: 'ES', disabled: true },
          ],
          options: [
            { label: 'France', value: 'FR' },
            { label: 'Spain', value: 'ES', disabled: true },
            { label: 'Germany', value: 'DE' },
          ],
          muiComponentProps: {
            multiple: true,
          },
        },
        {
          name: 'autocomplete4',
          type: 'autocompletemui',
          label: 'Autocomplete Field with multiple values (multi not explicitly declared)',
          value: [
            { label: 'France', value: 'FR' },
            { label: 'Spain', value: 'ES', disabled: true },
          ],
          options: [
            { label: 'France', value: 'FR' },
            { label: 'Spain', value: 'ES', disabled: true },
          ],
          muiComponentProps: {
            multiple: true,
          },
        },
      ]);
    });

    it('returns modified properties for SELECT fields', () => {
      // assert
      expect(utils.risk.parseFields(fields.select)).toEqual([
        {
          name: 'select1',
          type: 'select',
          label: 'Select Field',
          value: placeholderValue,
          options: [placeholderOption, { label: 'France', value: 'FR' }, { label: 'Spain', value: 'ES', disabled: true }],
        },
        {
          name: 'select2',
          type: 'select',
          label: 'Select Field with value',
          value: 'FR',
          options: [placeholderOption, { label: 'France', value: 'FR' }, { label: 'Spain', value: 'ES', disabled: true }],
        },
        {
          name: 'select3',
          type: 'select',
          label: 'Select Field with multiple values',
          value: ['FR', 'ES'],
          options: [placeholderOption, { label: 'France', value: 'FR' }, { label: 'Spain', value: 'ES', disabled: true }],
          muiComponentProps: {
            multiple: true,
          },
        },
      ]);
    });

    it('returns modified properties for intercepted SELECT fields', () => {
      // assert
      const dynamicOptions = {
        clients: [
          { id: '1', name: 'One' },
          { id: '2', name: 'Two' },
        ],
        insureds: [{ id: '3', name: 'Three' }],
        reinsureds: [{ id: '4', name: 'Re Insured' }],
      };

      const dynamicSelect = [
        {
          name: 'clientId',
          type: 'TEXT',
          label: 'Select Field',
        },
        {
          name: 'insuredId',
          type: 'TEXT',
          label: 'Select Field',
        },
        {
          name: 'reinsuredId',
          type: 'TEXT',
          label: 'Select Field',
        },
      ];
      expect(utils.risk.parseFields(dynamicSelect, dynamicOptions)).toEqual([
        {
          name: 'clientId',
          type: 'autocompletemui',
          showCreate: true,
          label: 'Select Field',
          value: null,
          validation: undefined,
          validationObj: undefined,
          muiComponentProps: {
            multiple: false,
          },
          options: [
            { id: '1', label: 'One', value: '1' },
            { id: '2', label: 'Two', value: '2' },
          ],
        },
        {
          name: 'insuredId',
          type: 'autocompletemui',
          showCreate: true,
          label: 'Select Field',
          value: null,
          validation: undefined,
          validationObj: undefined,
          muiComponentProps: {
            multiple: false,
          },
          options: [{ id: '3', label: 'Three', value: '3' }],
        },
        {
          name: 'reinsuredId',
          type: 'autocompletemui',
          showCreate: true,
          label: 'Select Field',
          value: null,
          validation: undefined,
          validationObj: undefined,
          muiComponentProps: {
            multiple: false,
          },
          options: [{ id: '4', label: 'Re Insured', value: '4' }],
        },
      ]);
    });
  });

  describe('getCondition', () => {
    const fields = [
      { name: 'one', type: 'foo' },
      { name: 'two', type: 'bar' },
      { name: 'three', type: 'baz' },
    ];

    it('returns undefined if not passed valid params', () => {
      // assert
      expect(utils.risk.getCondition()).toEqual(undefined);
      expect(utils.risk.getCondition('string')).toEqual(undefined);
      expect(utils.risk.getCondition('string', {})).toEqual(undefined);
      expect(utils.risk.getCondition({})).toEqual(undefined);
      expect(utils.risk.getCondition({}, [])).toEqual(undefined);
      expect(utils.risk.getCondition({ conditional: 'one' })).toEqual(undefined);
      expect(utils.risk.getCondition({ conditional: 'one' }, [])).toEqual(undefined);
    });

    it("returns undefined if it doesn't find a field that matches the conditional string", () => {
      // assert
      expect(utils.risk.getCondition({ conditional: 'one=1' }, [{ name: 'two' }, { name: 'three' }])).toEqual(undefined);
    });

    it('returns object with condition properties', () => {
      // assert
      expect(utils.risk.getCondition({ conditional: 'one=1' }, fields)).toEqual({
        positive: true,
        negative: false,
        name: 'one',
        value: '1',
      });
    });

    it('returns a positive conditional lookup if the condition is equal "="', () => {
      // assert
      expect(utils.risk.getCondition({ conditional: 'two=2' }, fields)).toEqual({
        positive: true,
        negative: false,
        name: 'two',
        value: '2',
      });
    });

    it('returns a negative conditional lookup if the condition is not equal "!="', () => {
      // assert
      expect(utils.risk.getCondition({ conditional: 'three!=3' }, fields)).toEqual({
        positive: false,
        negative: true,
        name: 'three',
        value: '3',
      });
    });
  });

  describe('getRiskName', () => {
    it('returns an risk product name by "id"', () => {
      // arrange
      const products = [
        {
          label: 'Nasco / Medical - General',
          value: 'NASCO_GENERAL',
        },
        {
          label: 'Hub International - Canadian Property',
          value: 'CAN_RES_PROP',
        },
        {
          label: 'EPIC - Terror Property',
          value: 'EPIC_TERROR_PROP',
        },
        {
          label: 'MarketScout - US Residential',
          value: 'US_RES_PROP',
        },
        {
          label: 'Chubb - Aviation v1',
          value: 'AVIATION',
        },
        {
          label: 'Chubb - Aviation v2',
          value: 'AVIATION_FIXED_WING',
        },
      ];

      // assert
      expect(utils.risk.getRiskName()).toEqual('');
      expect(utils.risk.getRiskName([])).toEqual('');
      expect(utils.risk.getRiskName({})).toEqual('');
      expect(utils.risk.getRiskName(null)).toEqual('');
      expect(utils.risk.getRiskName(false)).toEqual('');

      expect(utils.risk.getRiskName('AVIATION_FIXED_WING')).toEqual('');
      expect(utils.risk.getRiskName('AVIATION_FIXED_WING', [])).toEqual('');

      expect(utils.risk.getRiskName('AVIATION_FIXED_WING', products)).toEqual('Chubb - Aviation v2');
    });
  });

  describe('getGroups', () => {
    it('returns an object with items grouped by "group" key', () => {
      // arrange
      const fields = [
        { id: 1, group: 'A' },
        { id: 2, group: 'B' },
        { id: 3, group: 'C' },
        { id: 4, group: 'C' },
        { id: 5, group: 'B' },
        { id: 6, group: 'C' },
        { id: 7, group: '' },
        { id: 8 },
        { id: 9, group: true },
        { id: 10, group: false },
        { id: 11, group: null },
        { id: 12, group: [] },
        { id: 13, group: {} },
        { id: 14, group: 0 },
      ];

      // assert
      expect(utils.risk.getGroups()).toEqual({});
      expect(utils.risk.getGroups([])).toEqual({});
      expect(utils.risk.getGroups({})).toEqual({});
      expect(utils.risk.getGroups(null)).toEqual({});
      expect(utils.risk.getGroups(false)).toEqual({});

      expect(utils.risk.getGroups(fields)).toEqual({
        A: [{ id: 1, group: 'A' }],
        B: [
          { id: 2, group: 'B' },
          { id: 5, group: 'B' },
        ],
        C: [
          { id: 3, group: 'C' },
          { id: 4, group: 'C' },
          { id: 6, group: 'C' },
        ],
      });
    });
  });

  describe('getFieldsByGroup', () => {
    it('returns an array of items for specific "group"', () => {
      // arrange
      const fields = [
        { id: 1, group: 'A' },
        { id: 2, group: 'B' },
        { id: 3, group: 'C' },
        { id: 4, group: 'C' },
        { id: 5, group: 'B' },
        { id: 6, group: 'C' },
      ];

      // assert
      expect(utils.risk.getFieldsByGroup()).toEqual([]);
      expect(utils.risk.getFieldsByGroup([])).toEqual([]);
      expect(utils.risk.getFieldsByGroup({})).toEqual([]);
      expect(utils.risk.getFieldsByGroup(null)).toEqual([]);
      expect(utils.risk.getFieldsByGroup(false)).toEqual([]);
      expect(utils.risk.getFieldsByGroup(fields)).toEqual([]);
      expect(utils.risk.getFieldsByGroup(fields, [])).toEqual([]);
      expect(utils.risk.getFieldsByGroup(fields, {})).toEqual([]);
      expect(utils.risk.getFieldsByGroup(fields, true)).toEqual([]);
      expect(utils.risk.getFieldsByGroup(fields, false)).toEqual([]);
      expect(utils.risk.getFieldsByGroup(fields, '')).toEqual([]);
      expect(utils.risk.getFieldsByGroup(fields, 0)).toEqual([]);

      expect(utils.risk.getFieldsByGroup(fields, 'A')).toEqual([{ id: 1, group: 'A' }]);
      expect(utils.risk.getFieldsByGroup(fields, 'B')).toEqual([
        { id: 2, group: 'B' },
        { id: 5, group: 'B' },
      ]);
      expect(utils.risk.getFieldsByGroup(fields, 'C')).toEqual([
        { id: 3, group: 'C' },
        { id: 4, group: 'C' },
        { id: 6, group: 'C' },
      ]);
      expect(utils.risk.getFieldsByGroup(fields, 'Foo')).toEqual([]);
    });
  });

  describe('getPartyValues', () => {
    it('returns hydrated value from option', () => {
      // arrange
      const options = {
        clients: [
          { id: '1', name: 'One' },
          { id: '2', name: 'Two' },
        ],
        insureds: [{ id: '3', name: 'Three' }],
      };
      // assert
      expect(utils.risk.getPartyValues()).toEqual(undefined);
      expect(utils.risk.getPartyValues('string')).toEqual(undefined);
      expect(utils.risk.getPartyValues('string', {})).toEqual(undefined);
      expect(utils.risk.getPartyValues('string', {}, '1')).toEqual([{ id: '1', name: '' }]);
      expect(utils.risk.getPartyValues('string', options, '1')).toEqual([{ id: '1', name: '' }]);
      expect(utils.risk.getPartyValues('clients', options, '2')).toEqual([{ id: '2', name: 'Two' }]);
      expect(utils.risk.getPartyValues('insureds', options, '1')).toEqual([{ id: '1', name: '' }]);
      expect(utils.risk.getPartyValues('insureds', options, '3')).toEqual([{ id: '3', name: 'Three' }]);
    });
  });

  describe('getInsuredCountry', () => {
    it('returns the label for a given address object', () => {
      const countries = [
        { value: 'CA', label: 'Canada' },
        { value: 'US', label: 'United States' },
        { value: 'DE', label: 'Germany' },
        { value: 'FR', label: 'France' },
        { value: 'IT', label: 'Italy' },
      ];

      // assert
      expect(utils.risk.getInsuredCountry()).toBe('');
      expect(utils.risk.getInsuredCountry(null)).toBe('');
      expect(utils.risk.getInsuredCountry('')).toBe('');
      expect(utils.risk.getInsuredCountry('UK')).toBe('');
      expect(utils.risk.getInsuredCountry(null, countries)).toBe('');
      expect(utils.risk.getInsuredCountry('', countries)).toBe('');
      expect(utils.risk.getInsuredCountry('FOO', countries)).toBe('');
      expect(utils.risk.getInsuredCountry('US', countries)).toBe('');
      expect(utils.risk.getInsuredCountry({}, countries)).toBe('');
      expect(utils.risk.getInsuredCountry({ country: '' }, countries)).toBe('');
      expect(utils.risk.getInsuredCountry({ country: 'US' }, countries)).toBe('United States');
    });
  });

  describe('getInsuredAddress', () => {
    it('returns the stringified address for a given insured object', () => {
      const countries = [
        { value: 'CA', label: 'Canada' },
        { value: 'US', label: 'United States' },
        { value: 'DE', label: 'Germany' },
        { value: 'FR', label: 'France' },
        { value: 'IT', label: 'Italy' },
      ];

      // assert
      expect(utils.risk.getInsuredAddress()).toBe('');
      expect(utils.risk.getInsuredAddress(null)).toBe('');
      expect(utils.risk.getInsuredAddress('')).toBe('');
      expect(utils.risk.getInsuredAddress('UK')).toBe('');
      expect(utils.risk.getInsuredAddress(null, countries)).toBe('');
      expect(utils.risk.getInsuredAddress('', countries)).toBe('');
      expect(utils.risk.getInsuredAddress('FOO', countries)).toBe('');
      expect(utils.risk.getInsuredAddress('US', countries)).toBe('');
      expect(utils.risk.getInsuredAddress({}, countries)).toBe('');

      expect(
        utils.risk.getInsuredAddress(
          {
            address: {
              street: '123 Street',
            },
          },
          countries
        )
      ).toBe('123 Street');

      expect(
        utils.risk.getInsuredAddress(
          {
            address: {
              street: '123 Street',
              city: 'NYC',
            },
          },
          countries
        )
      ).toBe('123 Street, NYC');

      expect(
        utils.risk.getInsuredAddress(
          {
            address: {
              street: '123 Street',
              city: 'NYC',
              country: '',
            },
          },
          countries
        )
      ).toBe('123 Street, NYC');

      expect(
        utils.risk.getInsuredAddress(
          {
            address: {
              street: '123 Street',
              city: 'NYC',
              country: 'US',
            },
          },
          countries
        )
      ).toBe('123 Street, NYC, United States');

      expect(
        utils.risk.getInsuredAddress(
          {
            address: {
              id: 10000,
              name: 'Foo Bar',
              street: '123 Street',
              city: 'NYC',
              zipCode: '10007',
              county: 'Bronx',
              state: 'NY',
              country: 'US',
            },
          },
          countries
        )
      ).toBe('123 Street, NYC, 10007, Bronx, NY, United States');
    });
  });

  describe('private methods', () => {
    describe('_getValidation', () => {
      it("doesn't return a validation object if prop is not defined", () => {
        // assert
        expect(_getValidation()).toBeUndefined();
        expect(_getValidation([])).toBeUndefined();
        expect(_getValidation({})).toBeUndefined();
        expect(_getValidation(null)).toBeUndefined();
        expect(_getValidation(false)).toBeUndefined();
      });

      it('returns a validation object if prop is defined', () => {
        // assert
        expect(_getValidation({ validation: {} })).toHaveProperty('_type', 'mixed');
      });

      it('returns correct validation type for DATE fields', () => {
        // arrange
        const field1 = { type: 'date', validation: {} };
        const field2 = { type: 'date', validation: {}, datepicker: true };

        // assert
        expect(_getValidation(field1)).toHaveProperty('_type', 'string');
        expect(_getValidation(field2)).toHaveProperty('_type', 'string');
      });

      it('returns correct validation type for TEXT fields', () => {
        // arrange
        const field = { type: 'text', validation: {} };

        // assert
        expect(_getValidation(field)).toHaveProperty('_type', 'string');
      });

      it('returns correct validation type for TEXTAREA fields', () => {
        // arrange
        const field = { type: 'textarea', validation: {} };

        // assert
        expect(_getValidation(field)).toHaveProperty('_type', 'string');
      });

      it('returns correct validation type for NUMBER fields', () => {
        // assert
        expect(_getValidation({ type: 'integer', validation: {} })).toHaveProperty('_type', 'number');
        expect(_getValidation({ type: 'double', validation: {} })).toHaveProperty('_type', 'number');
      });

      it('returns correct validation type for SELECT fields', () => {
        // arrange
        const field1 = { type: 'select', validation: {} };
        const field2 = { type: 'select', validation: {}, multi: true };

        // assert
        expect(_getValidation(field1)).toHaveProperty('_type', 'string');
        expect(_getValidation(field2)).toHaveProperty('_type', 'array');
      });

      it('returns correct validation type for AUTOCOMPLETE fields', () => {
        // arrange
        const field1 = { type: 'select', autocomplete: true, validation: {} };
        const field2 = { type: 'select', autocomplete: true, validation: {}, multi: true };

        // assert
        expect(_getValidation(field1)).toHaveProperty('_type', 'object');
        expect(_getValidation(field2)).toHaveProperty('_type', 'array');
      });

      it('returns correct validation type for CHECKBOX fields with single option', () => {
        // arrange
        const field = { type: 'checkbox', validation: {} };

        // assert
        expect(_getValidation(field)).toHaveProperty('_type', 'mixed');
      });

      it('returns correct validation type for CHECKBOX fields with multiple options', () => {
        // arrange
        const field = {
          type: 'checkbox',
          validation: {},
          options: [
            { label: 'a', value: 'a' },
            { label: 'b', value: 'b' },
          ],
        };

        // assert
        expect(_getValidation(field)).toHaveProperty('_type', 'array');
      });

      it('returns correct validation type for RADIO fields', () => {
        // arrange
        const field = { type: 'radio', validation: {} };

        // assert
        expect(_getValidation(field)).toHaveProperty('_type', 'string');
      });

      it('returns correct validation type for TOGGLE fields', () => {
        // arrange
        const field = { type: 'toggle', validation: {} };

        // assert
        expect(_getValidation(field)).toHaveProperty('_type', 'boolean');
      });

      it('returns correct validation type for ARRAY fields', () => {
        // arrange
        const field = { type: 'array', arrayItemDef: [], validation: {} };

        // assert
        expect(_getValidation(field)).toHaveProperty('_type', 'array');
      });

      it('returns correct validation type for OBJECT fields', () => {
        // arrange
        const fieldWithDef = { type: 'object', objectDef: [1], validation: {} };
        const fieldWithoutDef = { type: 'object', validation: {} };

        // assert
        expect(_getValidation(fieldWithDef)).toHaveProperty('_type', 'object');
        expect(_getValidation(fieldWithoutDef)).toHaveProperty('_type', 'mixed');
      });

      it('returns correct validation type for ADDRESS fields', () => {
        // arrange
        const fieldWithDef = { type: 'object', objectDef: [1], validation: {} };
        const fieldWithoutDef = { type: 'object', validation: {} };

        // assert
        expect(_getValidation(fieldWithDef)).toHaveProperty('_type', 'object');
        expect(_getValidation(fieldWithoutDef)).toHaveProperty('_type', 'mixed');
      });
    });

    describe('_validationMinMax', () => {
      it("doesn't set min/max if params are not valid", () => {
        // assert
        // obj is invalid
        expect(_validationMinMax()).toBeUndefined();
        expect(_validationMinMax([])).toBeUndefined();
        expect(_validationMinMax('')).toBeUndefined();
        expect(_validationMinMax(null)).toBeUndefined();
        expect(_validationMinMax(true)).toBeUndefined();
        expect(_validationMinMax(false)).toBeUndefined();

        // obj is valid BUT validation isn't
        expect(_validationMinMax({})).toEqual({});
        expect(_validationMinMax({}, {})).toEqual({});
        expect(_validationMinMax({}, { type: 'text' })).toEqual({});
        expect(_validationMinMax({}, { type: 'text', validation: {} })).toEqual({});
        expect(_validationMinMax({}, { validation: { min: 1 } })).toEqual({});
      });

      it("returns original object if Yup type doesn't support min/max", () => {
        // arrange
        const field = { type: 'text', validation: { min: 1 } };
        const yupMixed = Yup.mixed();
        const yupBoolean = Yup.mixed();
        const yupObject = Yup.mixed();

        // assert
        expect(_validationMinMax(yupMixed, field)).toEqual(yupMixed);
        expect(_validationMinMax(yupBoolean, field)).toEqual(yupBoolean);
        expect(_validationMinMax(yupObject, field)).toEqual(yupObject);
      });

      it('returns yup object with min/max for text fields', () => {
        // arrange
        const yup = Yup.string();
        const fieldMin = { type: 'text', validation: { min: 20 } };
        const fieldMax = { type: 'text', validation: { max: 140 } };
        const fieldBoth = { type: 'text', validation: { min: 20, max: 140 } };
        // assert
        expect(_validationMinMax(yup, fieldMin)).toHaveProperty('exclusiveTests.min', true);
        expect(_validationMinMax(yup, fieldMax)).toHaveProperty('exclusiveTests.max', true);
        expect(_validationMinMax(yup, fieldBoth)).toHaveProperty('exclusiveTests.min', true);
        expect(_validationMinMax(yup, fieldBoth)).toHaveProperty('exclusiveTests.max', true);
      });

      it('returns yup object with min/max for number fields', () => {
        // arrange
        const yup = Yup.string();
        const fieldMin = { type: 'number', validation: { min: 10 } };
        const fieldMax = { type: 'number', validation: { max: 200 } };
        const fieldBoth = { type: 'number', validation: { min: 10, max: 200 } };

        // assert
        expect(_validationMinMax(yup, fieldMin)).toHaveProperty('exclusiveTests.min', true);
        expect(_validationMinMax(yup, fieldMax)).toHaveProperty('exclusiveTests.max', true);
        expect(_validationMinMax(yup, fieldBoth)).toHaveProperty('exclusiveTests.min', true);
        expect(_validationMinMax(yup, fieldBoth)).toHaveProperty('exclusiveTests.max', true);
      });

      it('returns yup object with min/max for select fields', () => {
        // arrange
        const yup = Yup.string();
        const fieldSelectNotMulti = { type: 'select', validation: { min: 2 } };
        const fieldSelectMin = { type: 'select', multi: true, validation: { min: 2 } };
        const fieldSelectMax = { type: 'select', multi: true, validation: { max: 5 } };
        const fieldSelectBoth = { type: 'select', multi: true, validation: { min: 2, max: 5 } };

        // assert
        expect(_validationMinMax(yup, fieldSelectNotMulti)).not.toHaveProperty('exclusiveTests.min');
        expect(_validationMinMax(yup, fieldSelectMin)).toHaveProperty('exclusiveTests.min', true);
        expect(_validationMinMax(yup, fieldSelectMax)).toHaveProperty('exclusiveTests.max', true);
        expect(_validationMinMax(yup, fieldSelectBoth)).toHaveProperty('exclusiveTests.min', true);
        expect(_validationMinMax(yup, fieldSelectBoth)).toHaveProperty('exclusiveTests.max', true);
      });

      it('returns yup object with min/max for autocomplete fields', () => {
        // arrange
        const yup = Yup.string();
        const fieldAutocompleteNotMulti = { type: 'select', autocomplete: true, validation: { min: 2 } };
        const fieldAutocompleteMin = { type: 'select', autocomplete: true, multi: true, validation: { min: 2 } };
        const fieldAutocompleteMax = { type: 'select', autocomplete: true, multi: true, validation: { max: 5 } };
        const fieldAutocompleteBoth = { type: 'select', autocomplete: true, multi: true, validation: { min: 2, max: 5 } };

        // assert
        expect(_validationMinMax(yup, fieldAutocompleteNotMulti)).not.toHaveProperty('exclusiveTests.min');
        expect(_validationMinMax(yup, fieldAutocompleteMin)).toHaveProperty('exclusiveTests.min', true);
        expect(_validationMinMax(yup, fieldAutocompleteMax)).toHaveProperty('exclusiveTests.max', true);
        expect(_validationMinMax(yup, fieldAutocompleteBoth)).toHaveProperty('exclusiveTests.min', true);
        expect(_validationMinMax(yup, fieldAutocompleteBoth)).toHaveProperty('exclusiveTests.max', true);
      });

      it("doesn't return min/max for radio fields", () => {
        // arrange
        const yup = Yup.string();
        const fieldMin = { type: 'radio', validation: { min: 10 } };
        const fieldMax = { type: 'radio', validation: { max: 200 } };

        // assert
        expect(_validationMinMax(yup, fieldMin)).not.toHaveProperty('exclusiveTests.min');
        expect(_validationMinMax(yup, fieldMax)).not.toHaveProperty('exclusiveTests.max');
      });
    });

    describe('_validationType', () => {
      let yup;

      beforeEach(() => {
        yup = Yup.mixed();
      });

      it('returns an empty object if params are not valid', () => {
        // assert
        expect(_validationType()).toEqual({});
        expect(_validationType([])).toEqual({});
        expect(_validationType({})).toEqual({});
        expect(_validationType(null)).toEqual({});
        expect(_validationType(true)).toEqual({});
        expect(_validationType(false)).toEqual({});
        expect(_validationType(0)).toEqual({});
        expect(_validationType('')).toEqual({});
        expect(_validationType('foo')).toEqual({});
      });

      it('returns original obj if field type is not found/valid', () => {
        // assert
        expect(_validationType(yup)).toEqual(yup);
        expect(_validationType(yup, {})).toEqual(yup);
        expect(_validationType(yup, { type: false })).toEqual(yup);
        expect(_validationType(yup, { type: '' })).toEqual(yup);
      });

      it('returns Yup object with string validation for TEXT/TEXTAREA fields', () => {
        // assert
        expect(_validationType(yup, { type: 'text' })).toHaveProperty('_type', 'string');
        expect(_validationType(yup, { type: 'textarea' })).toHaveProperty('_type', 'string');
      });

      it('returns Yup object with string validation for DATE/DATEPICKER fields', () => {
        // assert
        expect(_validationType(yup, { type: 'date' })).toHaveProperty('_type', 'string');
        expect(_validationType(yup, { type: 'date', datepicker: true })).toHaveProperty('_type', 'string');
      });

      it('returns Yup object with number validation for INTEGER/DOUBLE fields', () => {
        // assert
        expect(_validationType(yup, { type: 'integer' })).toHaveProperty('_type', 'number');
        expect(_validationType(yup, { type: 'double' })).toHaveProperty('_type', 'number');
      });

      it('returns Yup object with mixed validation for CHECKBOX fields with single option', () => {
        // assert
        expect(_validationType(yup, { type: 'checkbox' })).toHaveProperty('_type', 'mixed');
      });

      it('returns Yup object with array validation for CHECKBOX fields with multiple options', () => {
        // assert
        expect(
          _validationType(yup, {
            type: 'checkbox',
            options: [
              { label: 'a', value: 'a' },
              { label: 'b', value: 'b' },
            ],
          })
        ).toHaveProperty('_type', 'array');
      });

      it('returns Yup object with string validation for RADIO fields', () => {
        // assert
        expect(_validationType(yup, { type: 'radio' })).toHaveProperty('_type', 'string');
      });

      it('returns Yup object with string validation for BOOLEAN fields', () => {
        // assert
        expect(_validationType(yup, { type: 'toggle' })).toHaveProperty('_type', 'boolean');
      });

      it('returns Yup object with string validation for SELECT fields', () => {
        // assert
        expect(_validationType(yup, { type: 'select' })).toHaveProperty('_type', 'string');
      });

      it('returns Yup object with string validation for SELECT fields with multi options', () => {
        // assert
        expect(_validationType(yup, { type: 'select', multi: true })).toHaveProperty('_type', 'array');
      });

      it('returns Yup object with string validation for AUTOCOMPLETE fields', () => {
        // assert
        expect(_validationType(yup, { type: 'select', autocomplete: true })).toHaveProperty('_type', 'object');
        expect(_validationType(yup, { type: 'select', autocomplete: true, multi: true })).toHaveProperty('_type', 'array');
      });

      it('returns Yup object with string validation for ARRAY fields', () => {
        const arrayItemDef = [
          { name: 'text', type: 'TEXT', validation: { min: 5 } },
          { name: 'textarea', type: 'TEXTAREA', validation: { min: 5 } },
          { name: 'date', type: 'DATE', validation: { min: 5 } },
          { name: 'datepicker', type: 'DATEPICKER', validation: { min: 5 } },
          { name: 'select', type: 'SELECT', validation: { min: 5 } },
          { name: 'autocomplete', type: 'AUTOCOMPLETE', validation: { min: 5 } },
          { name: 'integer', type: 'INTEGER', validation: { min: 5 } },
          { name: 'double', type: 'DOUBLE', validation: { min: 5 } },
          { name: 'checkbox', type: 'CHECKBOX', validation: { min: 5 } },
          { name: 'radio', type: 'RADIO', validation: { min: 5 } },
          { name: 'boolean', type: 'BOOLEAN', validation: { min: 5 } },
          { name: 'foo', type: 'FOO', validation: { min: 5 } },
        ];

        const arrayItemDefWithoutValidation = [
          { name: 'text', type: 'TEXT' },
          { name: 'textarea', type: 'TEXTAREA' },
          { name: 'date', type: 'DATE' },
          { name: 'datepicker', type: 'DATEPICKER' },
          { name: 'select', type: 'SELECT' },
          { name: 'autocomplete', type: 'AUTOCOMPLETE' },
          { name: 'integer', type: 'INTEGER' },
          { name: 'double', type: 'DOUBLE' },
          { name: 'checkbox', type: 'CHECKBOX' },
          { name: 'radio', type: 'RADIO' },
          { name: 'boolean', type: 'BOOLEAN' },
          { name: 'foo', type: 'FOO' },
        ];

        // assert
        expect(_validationType(yup, { type: 'array' })).toHaveProperty('_type', 'array');
        expect(_validationType(yup, { type: 'array' })).toHaveProperty('_subType', undefined);
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })).toHaveProperty('_type', 'array');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })).toHaveProperty('_subType.fields');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('text');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('textarea');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('date');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('datepicker');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('select');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('autocomplete');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('integer');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('double');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('checkbox');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('radio');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).toHaveProperty('boolean');
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef })._subType.fields).not.toHaveProperty('foo');

        // without validation
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })).toHaveProperty(
          '_type',
          'array'
        );
        expect(_validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })).toHaveProperty(
          '_subType.fields'
        );
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('text');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('textarea');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('date');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('datepicker');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('select');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('autocomplete');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('integer');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('double');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('checkbox');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('radio');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('boolean');
        expect(
          _validationType(yup, { type: 'array', validation: {}, arrayItemDef: arrayItemDefWithoutValidation })._subType.fields
        ).not.toHaveProperty('foo');
      });

      it('returns Yup object with string validation for OBJECT fields', () => {
        const objectDef = [
          { name: 'text', type: 'TEXT', validation: { min: 5 } },
          { name: 'datepicker', type: 'DATEPICKER', validation: { min: 5 } },
          { name: 'select', type: 'SELECT', validation: { min: 5 } },
          { name: 'integer', type: 'INTEGER', validation: { min: 5 } },
          { name: 'foo', type: 'FOO', validation: { min: 5 } },
        ];

        const objectDefWithoutValidation = [
          { name: 'text', type: 'TEXT' },
          { name: 'datepicker', type: 'DATEPICKER' },
          { name: 'select', type: 'SELECT' },
          { name: 'integer', type: 'INTEGER' },
          { name: 'foo', type: 'FOO' },
        ];

        // assert
        expect(_validationType(yup, { type: 'object' })).toHaveProperty('_type', 'mixed');
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef })).toHaveProperty('_type', 'object');
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef })).toHaveProperty('fields');
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef }).fields).toHaveProperty('text');
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef }).fields).toHaveProperty('datepicker');
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef }).fields).toHaveProperty('select');
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef }).fields).toHaveProperty('integer');
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef }).fields).not.toHaveProperty('foo');

        // without validation
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef: objectDefWithoutValidation })).toHaveProperty(
          '_type',
          'object'
        );
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef: objectDefWithoutValidation })).toHaveProperty('fields');
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef: objectDefWithoutValidation }).fields).not.toHaveProperty(
          'text'
        );
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef: objectDefWithoutValidation }).fields).not.toHaveProperty(
          'datepicker'
        );
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef: objectDefWithoutValidation }).fields).not.toHaveProperty(
          'select'
        );
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef: objectDefWithoutValidation }).fields).not.toHaveProperty(
          'integer'
        );
        expect(_validationType(yup, { type: 'object', validation: {}, objectDef: objectDefWithoutValidation }).fields).not.toHaveProperty(
          'foo'
        );
      });

      it('returns Yup object with string validation for ADDRESS fields', () => {
        const objectDef = [
          { name: 'text', type: 'TEXT', validation: { min: 5 } },
          { name: 'distanceToCoast', type: 'TEXT', validation: { min: 5 } },
          { name: 'foo', type: 'FOO', validation: { min: 5 } },
        ];

        const objectDefWithoutValidation = [
          { name: 'text', type: 'TEXT' },
          { name: 'distanceToCoast', type: 'TEXT' },
          { name: 'foo', type: 'FOO' },
        ];

        // assert
        expect(_validationType(yup, { type: 'address' })).toHaveProperty('_type', 'mixed');
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef })).toHaveProperty('_type', 'object');
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef })).toHaveProperty('fields');
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef }).fields).toHaveProperty('text');
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef }).fields).toHaveProperty('distanceToCoast');
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef }).fields).not.toHaveProperty('foo');

        // without validation
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef: objectDefWithoutValidation })).toHaveProperty(
          '_type',
          'object'
        );
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef: objectDefWithoutValidation })).toHaveProperty('fields');
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef: objectDefWithoutValidation }).fields).not.toHaveProperty(
          'text'
        );
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef: objectDefWithoutValidation }).fields).not.toHaveProperty(
          'distanceToCoast'
        );
        expect(_validationType(yup, { type: 'address', validation: {}, objectDef: objectDefWithoutValidation }).fields).not.toHaveProperty(
          'foo'
        );
      });
    });

    describe('_validationFormatting', () => {
      it('returns an empty object if params are not valid', () => {
        // assert
        expect(_validationFormatting()).toEqual({});
        expect(_validationFormatting([])).toEqual({});
        expect(_validationFormatting({})).toEqual({});
        expect(_validationFormatting(null)).toEqual({});
        expect(_validationFormatting(true)).toEqual({});
        expect(_validationFormatting(false)).toEqual({});
        expect(_validationFormatting(0)).toEqual({});
        expect(_validationFormatting('')).toEqual({});
        expect(_validationFormatting('foo')).toEqual({});
      });

      it('returns original obj if field type is not found/valid', () => {
        const yup = Yup.mixed();

        // assert
        expect(_validationFormatting(yup)).toEqual(yup);
        expect(_validationFormatting(yup, {})).toEqual(yup);
        expect(_validationFormatting(yup, { type: false })).toEqual(yup);
        expect(_validationFormatting(yup, { type: '' })).toEqual(yup);
      });

      it('returns Yup object with string validation for INTEGER fields', () => {
        // assert
        expect(_validationType(Yup.number(), { type: 'INTEGER' }).tests).toBeTruthy();

        expect(_validationFormatting(Yup.number(), { type: 'INTEGER' }).tests[0].OPTIONS).toMatchObject({
          name: 'integer',
          message: '${path} must be an integer', // eslint-disable-line no-template-curly-in-string
        });
      });

      it('returns Yup object with validation for fields with multiple', () => {
        // assert
        expect(_validationFormatting(Yup.number().multiple(10)).tests[0].OPTIONS).toMatchObject({
          name: 'test-number-multipleOf',
          message: 'validation.number.multiple', // eslint-disable-line no-template-curly-in-string
          params: { multipleOf: 10 },
        });
      });
    });

    describe('_validationRequired', () => {
      it('returns an empty object if params are not valid', () => {
        // assert
        expect(_validationRequired()).toEqual({});
        expect(_validationRequired([])).toEqual({});
        expect(_validationRequired({})).toEqual({});
        expect(_validationRequired(null)).toEqual({});
        expect(_validationRequired(true)).toEqual({});
        expect(_validationRequired(false)).toEqual({});
        expect(_validationRequired(0)).toEqual({});
        expect(_validationRequired('')).toEqual({});
        expect(_validationRequired('foo')).toEqual({});
      });

      it('returns original obj if field type is not found/valid', () => {
        const yup = Yup.mixed();

        // assert
        expect(_validationRequired(yup)).toEqual(yup);
        expect(_validationRequired(yup, {})).toEqual(yup);
        expect(_validationRequired(yup, { type: false })).toEqual(yup);
        expect(_validationRequired(yup, { type: '' })).toEqual(yup);
      });

      it('returns original obj if field validation is not found/valid', () => {
        const yup = Yup.mixed();

        // assert
        expect(_validationRequired(yup, { type: 'TEXT' }, [1])).toEqual(yup);
        expect(_validationRequired(yup, { type: 'TEXT', validation: false }, [1])).toEqual(yup);
        expect(_validationRequired(yup, { type: 'TEXT', validation: {} }, [1])).toEqual(yup);
      });

      it('returns Yup object with required validation', () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'question',
            type: 'TEXT',
            label: 'Question',
            validation: {
              required: true,
            },
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests[0].OPTIONS).toMatchObject({
          message: 'validation.required',
          name: 'required',
        });
      });

      it('returns Yup object with special required validation for distanceToCoast definition', () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'distanceToCoast',
            type: 'TEXT',
            label: 'Distance',
            validation: {
              required: true,
            },
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests[0].OPTIONS).toMatchObject({
          message: 'risks.address.distanceToCoastRequired',
          name: 'required',
        });
      });

      it('returns Yup object with required validation for dependant conditional field', () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'where',
            type: 'TEXT',
            label: 'Where?',
          },
          {
            name: 'when',
            type: 'TEXT',
            label: 'When?',
            validation: {
              required: 'where',
            },
          },
          {
            name: 'why',
            type: 'TEXT',
            label: 'Why?',
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests).toHaveLength(0);
        expect(_validationRequired(yup, fields[1], fields).tests[0].OPTIONS).toMatchObject({
          message: 'validation.required',
          name: 'is-conditional-field',
        });
        expect(_validationRequired(yup, fields[2], fields).tests).toHaveLength(0);
      });

      it('returns Yup object with required validation for groups', () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'where',
            type: 'TEXT',
            label: 'Where?',
            validation: {
              group: {
                name: 'questions',
                min: 1,
              },
            },
          },
          {
            name: 'when',
            type: 'TEXT',
            label: 'When?',
            validation: {
              group: {
                name: 'questions',
                min: 1,
              },
            },
          },
          {
            name: 'why',
            type: 'TEXT',
            label: 'Why?',
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests[0].OPTIONS).toMatchObject({
          message: 'risks.validation.group.min',
          name: 'is-conditional-group',
        });
        expect(_validationRequired(yup, fields[1], fields).tests[0].OPTIONS).toMatchObject({
          message: 'risks.validation.group.min',
          name: 'is-conditional-group',
        });
        expect(_validationRequired(yup, fields[2], fields).tests).toHaveLength(0);
      });

      it('returns Yup object with MIN required validation for groups', () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'where',
            type: 'TEXT',
            label: 'Where?',
            validation: {
              group: {
                name: 'questions',
                min: 1,
              },
            },
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests[0].OPTIONS).toMatchObject({
          message: 'risks.validation.group.min',
          name: 'is-conditional-group',
        });
      });

      it('returns Yup object with MAX required validation for groups', () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'where',
            type: 'TEXT',
            label: 'Where?',
            validation: {
              group: {
                name: 'questions',
                max: 1,
              },
            },
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests[0].OPTIONS).toMatchObject({
          message: 'risks.validation.group.max',
          name: 'is-conditional-group',
        });
      });

      it('returns Yup object with RANGE required validation for groups', () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'where',
            type: 'TEXT',
            label: 'Where?',
            validation: {
              group: {
                name: 'questions',
                min: 1,
                max: 2,
              },
            },
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests[0].OPTIONS).toMatchObject({
          message: 'risks.validation.group.range',
          name: 'is-conditional-group',
        });
      });

      it('returns Yup object with ONLY required validation for groups', () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'where',
            type: 'TEXT',
            label: 'Where?',
            validation: {
              group: {
                name: 'questions',
                min: 1,
                max: 1,
              },
            },
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests[0].OPTIONS).toMatchObject({
          message: 'risks.validation.group.only',
          name: 'is-conditional-group',
        });
      });

      it("doesn't return Yup group validation if missing min/max params", () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'where',
            type: 'TEXT',
            label: 'Where?',
            validation: {
              group: {
                name: 'questions',
              },
            },
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests).toHaveLength(0);
      });

      it("doesn't return Yup group validation if missing group name", () => {
        // arrange
        const yup = Yup.mixed();
        const fields = [
          {
            name: 'where',
            type: 'TEXT',
            label: 'Where?',
            validation: {
              group: {
                min: 1,
              },
            },
          },
        ];

        // assert
        expect(_validationRequired(yup, fields[0], fields).tests).toHaveLength(0);
      });
    });
  });
});
