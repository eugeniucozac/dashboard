import * as utils from 'utils';

describe('UTILS › string', () => {
  it('should export the required methods', () => {
    expect(utils.string).toHaveProperty('t');
    expect(utils.string).toHaveProperty('capitalise');
  });

  describe('t', () => {
    it('should return the translated string', () => {
      // arrange
      utils.i18n.t.mockReset();

      // assert
      expect(utils.string.t('app.na')).toEqual('app.na');
      expect(utils.i18n.t).toHaveBeenCalledTimes(1);
      expect(utils.i18n.t).toHaveBeenCalledWith('app.na', undefined);
    });

    it('should pass the options param to the method', () => {
      // arrange
      utils.i18n.t.mockReset();

      // assert
      expect(utils.string.t('app.na', { foo: 1 })).toEqual('app.na');
      expect(utils.i18n.t).toHaveBeenCalledTimes(1);
      expect(utils.i18n.t).toHaveBeenCalledWith('app.na', { foo: 1 });
    });
  });

  describe('capitalise', () => {
    it('should return an empty string if not passed a valid string', () => {
      // assert
      expect(utils.string.capitalise()).toEqual('');
      expect(utils.string.capitalise(null)).toEqual('');
      expect(utils.string.capitalise(false)).toEqual('');
      expect(utils.string.capitalise(true)).toEqual('');
      expect(utils.string.capitalise([])).toEqual('');
      expect(utils.string.capitalise({})).toEqual('');
      expect(utils.string.capitalise(0)).toEqual('');
      expect(utils.string.capitalise(1)).toEqual('');
      expect(utils.string.capitalise('')).toEqual('');
      expect(utils.string.capitalise(new Date())).toEqual('');
    });

    it('should return a lowercase string with the first letter uppercase', () => {
      // assert
      expect(utils.string.capitalise('foo')).toEqual('Foo');
      expect(utils.string.capitalise('Foo')).toEqual('Foo');
      expect(utils.string.capitalise('foO')).toEqual('Foo');
      expect(utils.string.capitalise('FOO')).toEqual('Foo');
      expect(utils.string.capitalise(' FOO ')).toEqual('Foo');
      expect(utils.string.capitalise('-FOO-')).toEqual('Foo');
      expect(utils.string.capitalise(' -FOO- ')).toEqual('Foo');
      expect(utils.string.capitalise('_FOO_')).toEqual('Foo');
      expect(utils.string.capitalise(' _FOO_ ')).toEqual('Foo');
      expect(utils.string.capitalise(' _- FOO -_ ')).toEqual('Foo');
    });

    it('should capitalise the first letter of each words', () => {
      // using Lodash startCase implementation

      // assert
      expect(utils.string.capitalise('foo bar')).toEqual('Foo Bar');
      expect(utils.string.capitalise('foo Bar')).toEqual('Foo Bar');
      expect(utils.string.capitalise('foo BAR')).toEqual('Foo Bar');
      expect(utils.string.capitalise('Foo bar')).toEqual('Foo Bar');
      expect(utils.string.capitalise('foO bAr')).toEqual('Foo Bar');
      expect(utils.string.capitalise('FOO BAR')).toEqual('Foo Bar');
      expect(utils.string.capitalise(' FOO BAR ')).toEqual('Foo Bar');
      expect(utils.string.capitalise('-FOO BAR-')).toEqual('Foo Bar');
      expect(utils.string.capitalise(' -FOO BAR- ')).toEqual('Foo Bar');
      expect(utils.string.capitalise('_FOO BAR_')).toEqual('Foo Bar');
      expect(utils.string.capitalise(' _FOO BAR_ ')).toEqual('Foo Bar');
      expect(utils.string.capitalise('_- FOO BAR -_')).toEqual('Foo Bar');
      expect(utils.string.capitalise(' _- FOO BAR -_ ')).toEqual('Foo Bar');
    });
  });

  describe('replaceLowerCase', () => {
    it('return the expected result for `default` regex', () => {
      expect(utils.string.replaceLowerCase('In Progress')).toEqual('inprogress');
      expect(utils.string.replaceLowerCase('Bound')).toEqual('bound');
      expect(utils.string.replaceLowerCase('Auto-Bound')).toEqual('auto-bound');
      expect(utils.string.replaceLowerCase('NTU')).toEqual('ntu');
      expect(utils.string.replaceLowerCase('AWAITING_APPROVAL')).toEqual('awaitingapproval');
    });

    it('return the expected result for `withDash` regex', () => {
      expect(utils.string.replaceLowerCase('In Progress', 'withDash')).toEqual('inprogress');
      expect(utils.string.replaceLowerCase('Bound', 'withDash')).toEqual('bound');
      expect(utils.string.replaceLowerCase('Auto-Bound', 'withDash')).toEqual('autobound');
      expect(utils.string.replaceLowerCase('NTU', 'withDash')).toEqual('ntu');
      expect(utils.string.replaceLowerCase('AWAITING_APPROVAL', 'withDash')).toEqual('awaitingapproval');
    });
  });

  describe('startCase', () => {
    it('return the expected result for without forward slashes', () => {
      expect(utils.string.startCase('foobar', false)).toEqual('Foobar');
      expect(utils.string.startCase('foo-bar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('foo--bar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('-foo-bar-', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('--foo--bar--', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('foo_bar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('foo__bar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('_foo_bar_', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('__foo__bar__', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('foo/bar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('foo//bar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('/foo/bar/', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('//foo//bar//', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('foo /bar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('foo //bar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('foo / /bar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase(' /foo /bar /', false)).toEqual('Foo Bar');
      expect(utils.string.startCase(' //foo //bar //', false)).toEqual('Foo Bar');
      expect(utils.string.startCase(' / /foo / /bar / /', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('fooBar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('FooBar', false)).toEqual('Foo Bar');
      expect(utils.string.startCase('FOOBAR', false)).toEqual('Foobar');
    });

    it('return the expected result with forward slashes', () => {
      expect(utils.string.startCase('foobar')).toEqual('Foobar');
      expect(utils.string.startCase('foo-bar')).toEqual('Foo Bar');
      expect(utils.string.startCase('foo--bar')).toEqual('Foo Bar');
      expect(utils.string.startCase('-foo-bar-')).toEqual('Foo Bar');
      expect(utils.string.startCase('--foo--bar--')).toEqual('Foo Bar');
      expect(utils.string.startCase('foo_bar')).toEqual('Foo Bar');
      expect(utils.string.startCase('foo__bar')).toEqual('Foo Bar');
      expect(utils.string.startCase('_foo_bar_')).toEqual('Foo Bar');
      expect(utils.string.startCase('__foo__bar__')).toEqual('Foo Bar');
      expect(utils.string.startCase('foo/bar')).toEqual('Foo / Bar');
      expect(utils.string.startCase('foo//bar')).toEqual('Foo / Bar');
      expect(utils.string.startCase('/foo/bar/')).toEqual('Foo / Bar');
      expect(utils.string.startCase('//foo//bar//')).toEqual('Foo / Bar');
      expect(utils.string.startCase('foo /bar')).toEqual('Foo / Bar');
      expect(utils.string.startCase('foo //bar')).toEqual('Foo / Bar');
      expect(utils.string.startCase('foo / /bar')).toEqual('Foo / Bar');
      expect(utils.string.startCase(' /foo /bar /')).toEqual('Foo / Bar');
      expect(utils.string.startCase(' //foo //bar //')).toEqual('Foo / Bar');
      expect(utils.string.startCase(' / /foo / /bar / /')).toEqual('Foo / Bar');
      expect(utils.string.startCase('fooBar')).toEqual('Foo Bar');
      expect(utils.string.startCase('FooBar')).toEqual('Foo Bar');
      expect(utils.string.startCase('FOOBAR')).toEqual('Foobar');
    });
  });

  describe('stripNonNumeric', () => {
    it('should return the translated string', () => {
      // assert
      expect(utils.string.stripNonNumeric()).toBeUndefined();
      expect(utils.string.stripNonNumeric({})).toBeUndefined();
      expect(utils.string.stripNonNumeric([])).toBeUndefined();
      expect(utils.string.stripNonNumeric(45566.0)).toBe(45566.0);
      expect(utils.string.stripNonNumeric(-45566.0)).toBe(-45566.0);
      expect(utils.string.stripNonNumeric('$45,566.00')).toBe('45566.00');
      expect(utils.string.stripNonNumeric('-$45,566.00')).toBe('-45566.00');
      expect(utils.string.stripNonNumeric('10.5%')).toBe('10.5');
      expect(utils.string.stripNonNumeric('-10.5%')).toBe('-10.5');
    });
  });

  describe('isEqual', () => {
    it('should return boolean if both strings are equal', () => {
      // assert
      expect(utils.string.isEqual()).toBeFalsy();

      // only first param is a string
      expect(utils.string.isEqual('a')).toBeFalsy();
      expect(utils.string.isEqual('a', '')).toBeFalsy();
      expect(utils.string.isEqual('a', null)).toBeFalsy();
      expect(utils.string.isEqual('a', undefined)).toBeFalsy();
      expect(utils.string.isEqual('a', false)).toBeFalsy();
      expect(utils.string.isEqual('a', true)).toBeFalsy();
      expect(utils.string.isEqual('a', [])).toBeFalsy();
      expect(utils.string.isEqual('a', {})).toBeFalsy();
      expect(utils.string.isEqual('a', 0)).toBeFalsy();
      expect(utils.string.isEqual('a', 1)).toBeFalsy();

      // only second param is a string
      expect(utils.string.isEqual('', 'b')).toBeFalsy();
      expect(utils.string.isEqual(null, 'b')).toBeFalsy();
      expect(utils.string.isEqual(undefined, 'b')).toBeFalsy();
      expect(utils.string.isEqual(false, 'b')).toBeFalsy();
      expect(utils.string.isEqual(true, 'b')).toBeFalsy();
      expect(utils.string.isEqual([], 'b')).toBeFalsy();
      expect(utils.string.isEqual({}, 'b')).toBeFalsy();
      expect(utils.string.isEqual(0, 'b')).toBeFalsy();
      expect(utils.string.isEqual(1, 'b')).toBeFalsy();

      // both params are equal BUT not strings
      expect(utils.string.isEqual(null, null)).toBeFalsy();
      expect(utils.string.isEqual(undefined, undefined)).toBeFalsy();
      expect(utils.string.isEqual(false, false)).toBeFalsy();
      expect(utils.string.isEqual(true, true)).toBeFalsy();
      expect(utils.string.isEqual([], [])).toBeFalsy();
      expect(utils.string.isEqual({}, {})).toBeFalsy();
      expect(utils.string.isEqual(0, 0)).toBeFalsy();
      expect(utils.string.isEqual(1, 1)).toBeFalsy();

      // both params are strings BUT not equal
      expect(utils.string.isEqual('a', 'b')).toBeFalsy();
      expect(utils.string.isEqual('a', 'aa')).toBeFalsy();

      // both params are similar values BUT different case
      expect(utils.string.isEqual('a', 'A')).toBeFalsy();
      expect(utils.string.isEqual('A', 'a')).toBeFalsy();
      expect(utils.string.isEqual('AA', 'aa')).toBeFalsy();
      expect(utils.string.isEqual('aaa', 'aAa')).toBeFalsy();

      // both params are similar values BUT there is empty space around strings
      expect(utils.string.isEqual('a', 'a ')).toBeFalsy();
      expect(utils.string.isEqual('a ', 'a')).toBeFalsy();
      expect(utils.string.isEqual(' a', 'a')).toBeFalsy();
      expect(utils.string.isEqual('a', ' a')).toBeFalsy();

      // both empty string
      expect(utils.string.isEqual('', '')).toBeTruthy();

      // same values
      expect(utils.string.isEqual('a', 'a')).toBeTruthy();
      expect(utils.string.isEqual('aa', 'aa')).toBeTruthy();
      expect(utils.string.isEqual('A', 'A')).toBeTruthy();
      expect(utils.string.isEqual('a ', 'a ')).toBeTruthy();

      // same values if case-insensitive flag is passed
      expect(utils.string.isEqual('a', 'a', { caseSensitive: false })).toBeTruthy();
      expect(utils.string.isEqual('a', 'A', { caseSensitive: false })).toBeTruthy();
      expect(utils.string.isEqual('Aa', 'aa', { caseSensitive: false })).toBeTruthy();
      expect(utils.string.isEqual('A', 'a', { caseSensitive: false })).toBeTruthy();
      expect(utils.string.isEqual('A ', 'A ', { caseSensitive: false })).toBeTruthy();
    });
  });
});
