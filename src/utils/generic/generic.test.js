import * as utils from 'utils';
import config from 'config';

describe('UTILS › generic', () => {
  it('should export the required methods', () => {
    // assert
    expect(utils.generic).toHaveProperty('isInvalidOrEmptyArray');
    expect(utils.generic).toHaveProperty('isValidArray');
    expect(utils.generic).toHaveProperty('isValidObject');
    expect(utils.generic).toHaveProperty('isFunction');
    expect(utils.generic).toHaveProperty('isObjectKeysIdentical');
    expect(utils.generic).toHaveProperty('tuples');
    expect(utils.generic).toHaveProperty('getLabels');
    expect(utils.generic).toHaveProperty('getSumOfArray');
    expect(utils.generic).toHaveProperty('getWithDynamicOperator');
    expect(utils.generic).toHaveProperty('getDifferences');
    expect(utils.generic).toHaveProperty('getPagination');
  });

  describe('isInvalidOrEmptyArray', () => {
    it('should return true when array is falsy or empty', () => {
      // assert
      expect(utils.generic.isInvalidOrEmptyArray()).toBeTruthy();
      expect(utils.generic.isInvalidOrEmptyArray(null)).toBeTruthy();
      expect(utils.generic.isInvalidOrEmptyArray(true)).toBeTruthy();
      expect(utils.generic.isInvalidOrEmptyArray(false)).toBeTruthy();
      expect(utils.generic.isInvalidOrEmptyArray({})).toBeTruthy();
      expect(utils.generic.isInvalidOrEmptyArray(0)).toBeTruthy();
      expect(utils.generic.isInvalidOrEmptyArray('')).toBeTruthy();
      expect(utils.generic.isInvalidOrEmptyArray('foo')).toBeTruthy();
      expect(utils.generic.isInvalidOrEmptyArray([])).toBeTruthy();

      expect(utils.generic.isInvalidOrEmptyArray([1])).toBeFalsy();
      expect(utils.generic.isInvalidOrEmptyArray([1, 2, 'three'])).toBeFalsy();
    });
  });

  describe('isValidArray', () => {
    it('should return true when array is valid', () => {
      // assert
      expect(utils.generic.isValidArray()).toBeFalsy();
      expect(utils.generic.isValidArray(null)).toBeFalsy();
      expect(utils.generic.isValidArray(true)).toBeFalsy();
      expect(utils.generic.isValidArray(false)).toBeFalsy();
      expect(utils.generic.isValidArray({})).toBeFalsy();
      expect(utils.generic.isValidArray(0)).toBeFalsy();
      expect(utils.generic.isValidArray('')).toBeFalsy();
      expect(utils.generic.isValidArray('foo')).toBeFalsy();

      expect(utils.generic.isValidArray([])).toBeTruthy();
      expect(utils.generic.isValidArray([1])).toBeTruthy();
      expect(utils.generic.isValidArray([1, 2, 'three'])).toBeTruthy();
    });

    it('should check if array has at least one item', () => {
      // assert
      expect(utils.generic.isValidArray(null, true)).toBeFalsy();
      expect(utils.generic.isValidArray([], true)).toBeFalsy();
      expect(utils.generic.isValidArray([1], true)).toBeTruthy();
      expect(utils.generic.isValidArray([1, 2, 'three'], true)).toBeTruthy();
    });
  });

  describe('isValidObject', () => {
    it('should return true when object is valid', () => {
      // assert
      expect(utils.generic.isValidObject()).toBeFalsy();
      expect(utils.generic.isValidObject(null)).toBeFalsy();
      expect(utils.generic.isValidObject(true)).toBeFalsy();
      expect(utils.generic.isValidObject(false)).toBeFalsy();
      expect(utils.generic.isValidObject([])).toBeFalsy();
      expect(utils.generic.isValidObject(0)).toBeFalsy();
      expect(utils.generic.isValidObject('')).toBeFalsy();
      expect(utils.generic.isValidObject('foo')).toBeFalsy();

      // valid
      expect(utils.generic.isValidObject({})).toBeTruthy();
      expect(utils.generic.isValidObject({ id: 0 })).toBeTruthy();
      expect(utils.generic.isValidObject({ id: 1, foo: 'bar' })).toBeTruthy();
    });

    it('should check if object has own property', () => {
      // assert
      expect(utils.generic.isValidObject({}, null)).toBeFalsy();
      expect(utils.generic.isValidObject({}, true)).toBeFalsy();
      expect(utils.generic.isValidObject({}, false)).toBeFalsy();
      expect(utils.generic.isValidObject({}, [])).toBeFalsy();
      expect(utils.generic.isValidObject({}, {})).toBeFalsy();
      expect(utils.generic.isValidObject({}, 0)).toBeFalsy();
      expect(utils.generic.isValidObject({}, '')).toBeFalsy();
      expect(utils.generic.isValidObject({}, 'hello')).toBeFalsy();

      expect(utils.generic.isValidObject({ id: 1, name: 'foo' }, null)).toBeFalsy();
      expect(utils.generic.isValidObject({ id: 1, name: 'foo' }, true)).toBeFalsy();
      expect(utils.generic.isValidObject({ id: 1, name: 'foo' }, false)).toBeFalsy();
      expect(utils.generic.isValidObject({ id: 1, name: 'foo' }, [])).toBeFalsy();
      expect(utils.generic.isValidObject({ id: 1, name: 'foo' }, {})).toBeFalsy();
      expect(utils.generic.isValidObject({ id: 1, name: 'foo' }, 0)).toBeFalsy();
      expect(utils.generic.isValidObject({ id: 1, name: 'foo' }, '')).toBeFalsy();
      expect(utils.generic.isValidObject({ id: 1, name: 'foo' }, 'hello')).toBeFalsy();

      // valid
      expect(utils.generic.isValidObject({ id: 1, name: 'foo' }, 'name')).toBeTruthy();
    });
  });

  describe('isFunction', () => {
    it('should return true when type is function', () => {
      // arrange
      function regularFunction() {}
      const expressionFunction = function () {};
      const arrowFunction = () => {};

      // assert
      expect(utils.generic.isFunction()).toBeFalsy();
      expect(utils.generic.isFunction(null)).toBeFalsy();
      expect(utils.generic.isFunction(true)).toBeFalsy();
      expect(utils.generic.isFunction(false)).toBeFalsy();
      expect(utils.generic.isFunction([])).toBeFalsy();
      expect(utils.generic.isFunction([1])).toBeFalsy();
      expect(utils.generic.isFunction({})).toBeFalsy();
      expect(utils.generic.isFunction({ id: 1 })).toBeFalsy();
      expect(utils.generic.isFunction(0)).toBeFalsy();
      expect(utils.generic.isFunction('')).toBeFalsy();
      expect(utils.generic.isFunction('foo')).toBeFalsy();

      expect(utils.generic.isFunction(() => {})).toBeTruthy();
      expect(utils.generic.isFunction(regularFunction)).toBeTruthy();
      expect(utils.generic.isFunction(expressionFunction)).toBeTruthy();
      expect(utils.generic.isFunction(arrowFunction)).toBeTruthy();
    });
  });

  describe('isSameId', () => {
    it('should return true when 2 IDs are the same (irrespective of type)', () => {
      // assert
      expect(utils.generic.isSameId()).toBeFalsy();
      expect(utils.generic.isSameId(null)).toBeFalsy();
      expect(utils.generic.isSameId(null, null)).toBeFalsy();
      expect(utils.generic.isSameId(true)).toBeFalsy();
      expect(utils.generic.isSameId(true, false)).toBeFalsy();
      expect(utils.generic.isSameId(false)).toBeFalsy();
      expect(utils.generic.isSameId(false, true)).toBeFalsy();
      expect(utils.generic.isSameId(1, true)).toBeFalsy();
      expect(utils.generic.isSameId(1, false)).toBeFalsy();
      expect(utils.generic.isSameId(1, null)).toBeFalsy();
      expect(utils.generic.isSameId(1, '')).toBeFalsy();
      expect(utils.generic.isSameId(true, 2)).toBeFalsy();
      expect(utils.generic.isSameId(false, 2)).toBeFalsy();
      expect(utils.generic.isSameId(null, 2)).toBeFalsy();
      expect(utils.generic.isSameId('', 2)).toBeFalsy();
      expect(utils.generic.isSameId(1, 2)).toBeFalsy();

      expect(utils.generic.isSameId(1, 1)).toBeTruthy();
      expect(utils.generic.isSameId('abc', 'abc')).toBeTruthy();
    });
  });

  describe('isObjectKeysIdentical', () => {
    it('should return true when array is falsy or empty', () => {
      // assert
      expect(utils.generic.isObjectKeysIdentical()).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(null)).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(true)).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(false)).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(0)).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical('')).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical('foo')).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical({})).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical([])).toBeFalsy();

      expect(utils.generic.isObjectKeysIdentical(null, null)).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(true, true)).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(false, false)).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(0, 0)).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical('', '')).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical('foo', 'foo')).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical({}, {})).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical([], [])).toBeFalsy();

      expect(utils.generic.isObjectKeysIdentical([], { a: 1 })).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical([], { a: 1, b: 2 })).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(['a'], {})).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(['a', 'b'], {})).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(['a', 'b'], { a: 1 })).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(['a', 'b'], { b: 2 })).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(['a'], { a: 1, b: 2 })).toBeFalsy();
      expect(utils.generic.isObjectKeysIdentical(['b'], { a: 1, b: 2 })).toBeFalsy();

      expect(utils.generic.isObjectKeysIdentical(['a', 'b'], { a: 1, b: 2 })).toBeTruthy();
      expect(utils.generic.isObjectKeysIdentical(['a'], { a: 1 })).toBeTruthy();
      expect(utils.generic.isObjectKeysIdentical([], {})).toBeTruthy();
    });
  });

  describe('tuples', () => {
    it('should return an array of value pairs', () => {
      // assert
      expect(utils.generic.tuples()).toEqual([]);
      expect(utils.generic.tuples(null)).toEqual([]);
      expect(utils.generic.tuples(true)).toEqual([]);
      expect(utils.generic.tuples(false)).toEqual([]);
      expect(utils.generic.tuples({})).toEqual([]);
      expect(utils.generic.tuples({ id: 1 })).toEqual([]);
      expect(utils.generic.tuples(0)).toEqual([]);
      expect(utils.generic.tuples('')).toEqual([]);
      expect(utils.generic.tuples('foo')).toEqual([]);

      expect(utils.generic.tuples([1])).toEqual([]);
      expect(utils.generic.tuples([1, 2])).toEqual([[1, 2]]);
      expect(utils.generic.tuples([1, 2, 3])).toEqual([
        [1, 2],
        [1, 3],
        [2, 3],
      ]);
      expect(utils.generic.tuples([1, 2, 3, 4])).toEqual([
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4],
      ]);
      expect(utils.generic.tuples(['x', 'y', 'z'])).toEqual([
        ['x', 'y'],
        ['x', 'z'],
        ['y', 'z'],
      ]);
    });
  });

  describe('getLabels', () => {
    it('returns undefined', () => {
      // arrange
      const path = 'app';

      // assert
      expect(utils.generic.getLabels({}, path)).toBeUndefined();
      expect(utils.generic.getLabels(undefined, path)).toBeUndefined();
      expect(utils.generic.getLabels('text', path)).toBeUndefined();
    });
    it('returns the original array', () => {
      // arrange
      const arr = [{ id: 'ALL', other: 'foo', label: 'All' }];
      const path = undefined;

      // assert
      expect(utils.generic.getLabels(arr, path)).toEqual(arr);
    });
    it('returns the translated array', () => {
      // arrange
      const arr = [{ id: 'ALL', other: 'foo' }, { id: 'Am_ount' }, { id: 'acc-ount' }];
      const path = 'app';
      const response = [
        { id: 'ALL', other: 'foo', label: 'app.all' },
        { id: 'Am_ount', label: 'app.amount' },
        { id: 'acc-ount', label: 'app.account' },
      ];

      // assert
      expect(utils.generic.getLabels(arr, path)).toEqual(response);
    });
  });

  describe('getSumOfArray', () => {
    it('should return sum of array', () => {
      // assert
      expect(utils.generic.getSumOfArray(['20', undefined, 34.0])).toBe(54);
      expect(utils.generic.getSumOfArray(['20', '3', '34.00'])).toBe(57);
      expect(utils.generic.getSumOfArray(['1.8', '2.4'])).toBe(4.2);
      expect(utils.generic.getSumOfArray(['1.8', '2.4', '0'])).toBe(4.2);
      expect(utils.generic.getSumOfArray(['1.2388', '2.4443'])).toBe(3.6831);
      expect(utils.generic.getSumOfArray(['1.2388', 2.4443, undefined])).toBe(3.6831);
      expect(utils.generic.getSumOfArray(['1.2342', '2.4443'])).toBe(3.6785);
      expect(utils.generic.getSumOfArray(['1.1234567', '2.4443'])).toBe(3.5677567000000003);

      expect(utils.generic.getSumOfArray(['20', '3', '34.00'], 4)).toBe(57);
      expect(utils.generic.getSumOfArray(['1.8', '2.4'], 4)).toBe(4.2);
      expect(utils.generic.getSumOfArray(['1.8', '2.4', '0'], 4)).toBe(4.2);
      expect(utils.generic.getSumOfArray(['1.2388', '2.4443'], 4)).toBe(3.6831);
      expect(utils.generic.getSumOfArray(['1.2342', '2.4443'], 4)).toBe(3.6785);
      expect(utils.generic.getSumOfArray(['1.1234567', '2.4443'], 4)).toBe(3.5678);
      expect(utils.generic.getSumOfArray(['7.5', '7.935'], 4)).toBe(15.435);
    });
  });

  describe('getWithDynamicOperator', () => {
    it('should return the correct value', () => {
      expect(utils.generic.getWithDynamicOperator()).toBe(undefined);
      expect(utils.generic.getWithDynamicOperator(1)).toBe(undefined);
      expect(utils.generic.getWithDynamicOperator(1, '<=')).toBe(false);
      expect(utils.generic.getWithDynamicOperator(1, '<=', 3)).toBe(true);
      expect(utils.generic.getWithDynamicOperator(3, '<=', 3)).toBe(true);
      expect(utils.generic.getWithDynamicOperator(3, '<=', 1)).toBe(false);
      expect(utils.generic.getWithDynamicOperator(1, '===', 3)).toBe(false);
      expect(utils.generic.getWithDynamicOperator(1, '===', 1)).toBe(true);
      expect(utils.generic.getWithDynamicOperator(1, '!==', 3)).toBe(true);
      expect(utils.generic.getWithDynamicOperator(1, '!==', 1)).toBe(false);
      expect(utils.generic.getWithDynamicOperator(3, '>=', 1)).toBe(true);
      expect(utils.generic.getWithDynamicOperator(1, '>=', 1)).toBe(true);
      expect(utils.generic.getWithDynamicOperator(1, '>=', 3)).toBe(false);
    });
  });

  describe('getDifferences', () => {
    it('should return a filtered object where properties have changed', () => {
      expect(utils.generic.getDifferences()).toEqual({});
      expect(utils.generic.getDifferences(1, 1)).toEqual({});
      expect(utils.generic.getDifferences({}, 1)).toEqual({});
      expect(utils.generic.getDifferences(1, {})).toEqual({});
      expect(utils.generic.getDifferences({}, { one: '1' })).toEqual({ one: '1' });
      expect(utils.generic.getDifferences({ one: '1' }, { one: '1' })).toEqual({});
      expect(utils.generic.getDifferences({ one: '1' }, { one: '1 changed' })).toEqual({ one: '1 changed' });
      expect(utils.generic.getDifferences({ one: '1' }, { one: '1 changed', two: '2' })).toEqual({ one: '1 changed', two: '2' });
      expect(utils.generic.getDifferences({ one: '1 changed', two: '2' }, { one: '1' })).toEqual({ one: '1' });

      // previous true --> next true
      expect(utils.generic.getDifferences({ one: true }, { one: true })).toEqual({});
      expect(utils.generic.getDifferences({ one: true }, { two: true })).toEqual({ two: true });
      expect(utils.generic.getDifferences({ one: true }, { one: true, two: true })).toEqual({ two: true });
      expect(utils.generic.getDifferences({ one: true, two: true }, { one: true })).toEqual({});
      expect(utils.generic.getDifferences({ one: true, two: true }, { two: true })).toEqual({});
      expect(utils.generic.getDifferences({ one: true, two: true }, { one: true, two: true })).toEqual({});

      // previous true --> next false
      expect(utils.generic.getDifferences({ one: true }, { one: false })).toEqual({ one: false });
      expect(utils.generic.getDifferences({ one: true }, { two: false })).toEqual({ two: false });
      expect(utils.generic.getDifferences({ one: true }, { one: false, two: false })).toEqual({ one: false, two: false });
      expect(utils.generic.getDifferences({ one: true, two: true }, { one: false })).toEqual({ one: false });
      expect(utils.generic.getDifferences({ one: true, two: true }, { two: false })).toEqual({ two: false });
      expect(utils.generic.getDifferences({ one: true, two: true }, { one: false, two: false })).toEqual({ one: false, two: false });

      // previous false --> next false
      expect(utils.generic.getDifferences({ one: false }, { one: false })).toEqual({});
      expect(utils.generic.getDifferences({ one: false }, { two: false })).toEqual({ two: false });
      expect(utils.generic.getDifferences({ one: false }, { one: false, two: false })).toEqual({ two: false });
      expect(utils.generic.getDifferences({ one: false, two: false }, { one: false })).toEqual({});
      expect(utils.generic.getDifferences({ one: false, two: false }, { two: false })).toEqual({});
      expect(utils.generic.getDifferences({ one: false, two: false }, { one: false, two: false })).toEqual({});

      // previous false --> next true
      expect(utils.generic.getDifferences({ one: false }, { one: true })).toEqual({ one: true });
      expect(utils.generic.getDifferences({ one: false }, { two: true })).toEqual({ two: true });
      expect(utils.generic.getDifferences({ one: false }, { one: true, two: true })).toEqual({ one: true, two: true });
      expect(utils.generic.getDifferences({ one: false, two: false }, { one: true })).toEqual({ one: true });
      expect(utils.generic.getDifferences({ one: false, two: false }, { two: true })).toEqual({ two: true });
      expect(utils.generic.getDifferences({ one: false, two: false }, { one: true, two: true })).toEqual({ one: true, two: true });
    });
  });

  describe('getPagination', () => {
    it('should return a filtered object where properties have changed', () => {
      // arrange
      const defaultPagination = {
        page: 0,
        rowsTotal: 0,
        rowsPerPage: config.ui.pagination.default,
      };

      // assert
      expect(utils.generic.getPagination()).toEqual(defaultPagination);
      expect(utils.generic.getPagination({})).toEqual(defaultPagination);
      expect(utils.generic.getPagination([])).toEqual(defaultPagination);
      expect(utils.generic.getPagination(0)).toEqual(defaultPagination);
      expect(utils.generic.getPagination(null)).toEqual(defaultPagination);
      expect(utils.generic.getPagination('foo')).toEqual(defaultPagination);

      expect(utils.generic.getPagination({ page: 10 })).toEqual({ ...defaultPagination, page: 9 });
      expect(utils.generic.getPagination({ itemsTotal: 20 })).toEqual({ ...defaultPagination, rowsTotal: 20 });
      expect(utils.generic.getPagination({ pageSize: 30 })).toEqual({ ...defaultPagination, rowsPerPage: 30 });
      expect(utils.generic.getPagination({ page: 10, itemsTotal: 20, pageSize: 30 })).toEqual({ page: 9, rowsTotal: 20, rowsPerPage: 30 });
    });
  });

  describe('getAutocompleteValue', () => {
    it('should return a object  based in value', () => {
      // arrange
      const options = [
        {
          value: '1',
          label: 'First Option',
        },
        {
          value: '2',
          label: 'Second Option',
        },
        {
          value: '3',
          label: 'Third Option',
        },
      ];

      // assert
      expect(utils.generic.getAutocompleteValue()).toEqual(null);
      expect(utils.generic.getAutocompleteValue({})).toEqual(null);
      expect(utils.generic.getAutocompleteValue(1)).toEqual(null);
      expect(utils.generic.getAutocompleteValue(2, options)).toEqual(null);
      expect(utils.generic.getAutocompleteValue(2, options, 'key')).toEqual(null);
      expect(utils.generic.getAutocompleteValue(2, options, 'value')).toEqual(null);

      expect(utils.generic.getAutocompleteValue('2', options, 'value')).toEqual({
        value: '2',
        label: 'Second Option',
      });
    });
  });

  describe('getAutocompleteMultipleValues', () => {
    it('should return a array of objects based on values from options', () => {
      // arrange
      const options = [
        {
          value: '1',
          label: 'First Option',
        },
        {
          value: '2',
          label: 'Second Option',
        },
        {
          value: '3',
          label: 'Third Option',
        },
      ];

      // assert
      expect(utils.generic.getAutocompleteMultipleValues()).toEqual([]);
      expect(utils.generic.getAutocompleteMultipleValues({})).toEqual([]);
      expect(utils.generic.getAutocompleteMultipleValues(1)).toEqual([]);
      expect(utils.generic.getAutocompleteMultipleValues(['2'], options)).toEqual([]);
      expect(utils.generic.getAutocompleteMultipleValues(['2'], options, 'key')).toEqual([]);

      expect(utils.generic.getAutocompleteMultipleValues(['2'], options, 'value')).toEqual([
        {
          value: '2',
          label: 'Second Option',
        },
      ]);

      expect(utils.generic.getAutocompleteMultipleValues(['2', '3', '1'], options, 'value')).toEqual([
        {
          value: '2',
          label: 'Second Option',
        },
        {
          value: '3',
          label: 'Third Option',
        },
        {
          value: '1',
          label: 'First Option',
        },
      ]);
    });
  });
});
