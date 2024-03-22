import { selectSearchResults, selectSearchTerm, selectSearchResultsTerm, selectSearchIsLoading, selectSearchError } from 'stores';

describe('STORES › SELECTORS › search', () => {
  const search = {
    term: '',
    queue: [],
    results: {},
    resultsTerm: '',
    isLoading: false,
  };

  it('selectSearchResults', () => {
    // assert
    expect(selectSearchResults({ search })).toEqual({});
    expect(selectSearchResults({ search: { ...search, results: null } })).toEqual({});
    expect(selectSearchResults({ search: { ...search, results: { foo: 1, bar: 2 } } })).toEqual({ foo: 1, bar: 2 });
  });

  it('selectSearchTerm', () => {
    // assert
    expect(selectSearchTerm({ search })).toEqual('');
    expect(selectSearchTerm({ search: { ...search, term: null } })).toEqual('');
    expect(selectSearchTerm({ search: { ...search, term: 'foo' } })).toEqual('foo');
  });

  it('selectSearchResultsTerm', () => {
    // assert
    expect(selectSearchResultsTerm({ search })).toEqual('');
    expect(selectSearchResultsTerm({ search: { ...search, resultsTerm: null } })).toEqual('');
    expect(selectSearchResultsTerm({ search: { ...search, resultsTerm: 'foo' } })).toEqual('foo');
  });

  it('selectSearchIsLoading', () => {
    // assert
    expect(selectSearchIsLoading({ search })).toBeFalsy();
    expect(selectSearchIsLoading({ search: { ...search, isLoading: null } })).toBeFalsy();
    expect(selectSearchIsLoading({ search: { ...search, isLoading: '' } })).toBeFalsy();
    expect(selectSearchIsLoading({ search: { ...search, isLoading: 'foo' } })).toBeFalsy();
    expect(selectSearchIsLoading({ search: { ...search, isLoading: 0 } })).toBeFalsy();
    expect(selectSearchIsLoading({ search: { ...search, isLoading: 1 } })).toBeFalsy();
    expect(selectSearchIsLoading({ search: { ...search, isLoading: false } })).toBeFalsy();
    expect(selectSearchIsLoading({ search: { ...search, isLoading: true } })).toBeTruthy();
  });

  it('selectSearchError', () => {
    // assert
    expect(selectSearchError({ search })).toEqual('');
    expect(selectSearchError({ search: { ...search, error: null } })).toEqual('');
    expect(selectSearchError({ search: { ...search, error: 'foo' } })).toEqual('foo');
  });
});
