import {
  selectRiskListItems,
  selectRiskListPagination,
  selectRiskListSort,
  selectRiskSelected,
  selectRiskSelectedLoading,
  selectRiskQuotes,
  selectRiskQuotesLoading,
  selectRiskDefinitionsFieldsByType,
  selectRiskFieldOptionsByType,
  selectProductsSorted,
  selectFacilitiesListItems,
  selectFacilitiesRatesLoaded,
} from 'stores';

describe('STORES › SELECTORS › risk', () => {
  it('selectRiskListItems', () => {
    // assert
    expect(selectRiskListItems({})).toEqual([]);
    expect(selectRiskListItems({ risk: {} })).toEqual([]);
    expect(selectRiskListItems({ risk: { list: {} } })).toEqual([]);
    expect(selectRiskListItems({ risk: { list: { items: [] } } })).toEqual([]);
    expect(selectRiskListItems({ risk: { list: { items: [{ id: 1 }, { id: 2 }] } } })).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('selectRiskListPagination', () => {
    // arrange
    const list = {
      items: [],
      itemsTotal: 104,
      page: 3,
      pageSize: 20,
      pageTotal: 6,
    };

    const emptyPagination = {
      page: 0,
      rowsTotal: 0,
      rowsPerPage: 10,
    };

    // assert
    expect(selectRiskListPagination({})).toEqual(emptyPagination);
    expect(selectRiskListPagination({ risk: {} })).toEqual(emptyPagination);
    expect(selectRiskListPagination({ risk: { list: {} } })).toEqual(emptyPagination);
    expect(selectRiskListPagination({ risk: { list: list } })).toEqual({
      page: 2,
      rowsTotal: 104,
      rowsPerPage: 20,
    });
  });

  it('selectRiskListSort', () => {
    // arrange
    const list = {
      items: [],
      query: '',
      sortBy: 'id',
      sortType: 'numeric',
      sortDirection: 'asc',
    };

    const emptySort = {
      by: '',
      type: '',
      direction: 'desc',
    };

    // assert
    expect(selectRiskListSort({})).toEqual(emptySort);
    expect(selectRiskListSort({ risk: {} })).toEqual(emptySort);
    expect(selectRiskListSort({ risk: { list: {} } })).toEqual(emptySort);
    expect(selectRiskListSort({ risk: { list: list } })).toEqual({
      by: 'id',
      type: 'numeric',
      direction: 'asc',
    });
  });

  it('selectRiskSelected', () => {
    // assert
    expect(selectRiskSelected({})).toEqual({});
    expect(selectRiskSelected({ risk: {} })).toEqual({});
    expect(selectRiskSelected({ risk: { selected: { id: 1 } } })).toEqual({ id: 1 });
  });

  it('selectRiskSelectedLoading', () => {
    // assert
    expect(selectRiskSelectedLoading({})).toBeUndefined();
    expect(selectRiskSelectedLoading({ risk: {} })).toBeUndefined();
    expect(selectRiskSelectedLoading({ risk: { selected: { id: 1 } } })).toBeUndefined();
    expect(selectRiskSelectedLoading({ risk: { selected: { id: 1, loading: false } } })).toBeFalsy();
    expect(selectRiskSelectedLoading({ risk: { selected: { id: 1, loading: true } } })).toBeTruthy();
  });

  it('selectRiskQuotes', () => {
    // assert
    expect(selectRiskQuotes({})).toEqual([]);
    expect(selectRiskQuotes({ risk: {} })).toEqual([]);
    expect(selectRiskQuotes({ risk: { quotes: {} } })).toEqual([]);
    expect(selectRiskQuotes({ risk: { quotes: { items: [{ id: 1 }, { id: 2 }] } } })).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('selectRiskQuotesLoading', () => {
    // assert
    expect(selectRiskQuotesLoading({})).toBeUndefined();
    expect(selectRiskQuotesLoading({ risk: {} })).toBeUndefined();
    expect(selectRiskQuotesLoading({ risk: { quotes: {} } })).toBeUndefined();
    expect(selectRiskQuotesLoading({ risk: { quotes: { loading: false } } })).toBeFalsy();
    expect(selectRiskQuotesLoading({ risk: { quotes: { loading: true } } })).toBeTruthy();
  });

  it('selectRiskDefinitionsFieldsByType', () => {
    // arrange
    const definitions = {
      foo: {
        fields: [{ id: 1 }],
      },
      bar: {
        fields: [{ id: 2 }, { id: 3 }, { id: 4 }],
      },
      xyz: {},
    };

    // assert
    expect(selectRiskDefinitionsFieldsByType()({})).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType()({ risk: {} })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType()({ risk: { definitions: {} } })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType()(definitions)).toEqual([]);

    expect(selectRiskDefinitionsFieldsByType('foo')({})).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('foo')({ risk: {} })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('foo')({ risk: { definitions: {} } })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('foo')({ risk: { definitions } })).toEqual([{ id: 1 }]);

    expect(selectRiskDefinitionsFieldsByType('bar')({})).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('bar')({ risk: {} })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('bar')({ risk: { definitions: {} } })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('bar')({ risk: { definitions } })).toEqual([{ id: 2 }, { id: 3 }, { id: 4 }]);

    expect(selectRiskDefinitionsFieldsByType('xyz')({})).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('xyz')({ risk: {} })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('xyz')({ risk: { definitions: {} } })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('xyz')({ risk: { definitions } })).toEqual([]);

    expect(selectRiskDefinitionsFieldsByType('something else')({})).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('something else')({ risk: {} })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('something else')({ risk: { definitions: {} } })).toEqual([]);
    expect(selectRiskDefinitionsFieldsByType('something else')({ risk: { definitions } })).toEqual([]);
  });

  it('selectRiskFieldOptionsByType', () => {
    // arrange
    const countryList = [
      {
        label: 'France',
        value: 'FR',
      },
      {
        label: 'United Kingdom',
        value: 'GB',
      },
    ];
    const definitions = {
      foo: {
        fieldOptions: {
          countryOfOrigin: countryList,
        },
      },

      xyz: {},
    };

    // assert
    expect(selectRiskFieldOptionsByType()({})).toEqual([]);
    expect(selectRiskFieldOptionsByType()({ risk: {} })).toEqual([]);
    expect(selectRiskFieldOptionsByType()({ risk: { definitions: {} } })).toEqual([]);
    expect(selectRiskFieldOptionsByType()(definitions)).toEqual([]);

    expect(selectRiskFieldOptionsByType('foo')({})).toEqual([]);
    expect(selectRiskFieldOptionsByType('foo')({ risk: {} })).toEqual([]);
    expect(selectRiskFieldOptionsByType('foo')({ risk: { definitions: {} } })).toEqual([]);
    expect(selectRiskFieldOptionsByType('foo')({ risk: { definitions } })).toEqual({ countryOfOrigin: countryList });

    expect(selectRiskFieldOptionsByType('something else')({})).toEqual([]);
    expect(selectRiskFieldOptionsByType('something else')({ risk: {} })).toEqual([]);
    expect(selectRiskFieldOptionsByType('something else')({ risk: { definitions: {} } })).toEqual([]);
    expect(selectRiskFieldOptionsByType('something else')({ risk: { definitions } })).toEqual([]);
  });

  it('selectProductsSorted', () => {
    // assert
    expect(selectProductsSorted({})).toEqual([]);
    expect(selectProductsSorted({ risk: {} })).toEqual([]);
    expect(selectProductsSorted({ risk: { products: {} } })).toEqual([]);
    expect(selectProductsSorted({ risk: { products: { items: [] } } })).toEqual([]);
    expect(selectProductsSorted({ risk: { products: { items: ['BAZ', 'FOO', 'BAR'] } } })).toEqual(['BAR', 'BAZ', 'FOO']);
  });

  it('selectFacilitiesListItems', () => {
    expect(selectFacilitiesListItems({})).toEqual([]);
    expect(selectFacilitiesListItems({ risk: {} })).toEqual([]);
    expect(selectFacilitiesListItems({ risk: { facilities: {} } })).toEqual([]);
    expect(selectFacilitiesListItems({ risk: { facilities: { list: {} } } })).toEqual([]);
    expect(selectFacilitiesListItems({ risk: { facilities: { list: { items: [] } } } })).toEqual([]);
    expect(selectFacilitiesListItems({ risk: { facilities: { list: { items: [{ id: 1 }, { id: 2 }] } } } })).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it('selectFacilitiesRatesLoaded', () => {
    expect(selectFacilitiesRatesLoaded({})).toEqual({});
    expect(selectFacilitiesRatesLoaded({ risk: {} })).toEqual({});
    expect(selectFacilitiesRatesLoaded({ risk: { facilities: {} } })).toEqual({});
    expect(selectFacilitiesRatesLoaded({ risk: { facilities: { ratesLoaded: {} } } })).toEqual({});
    expect(selectFacilitiesRatesLoaded({ risk: { facilities: { ratesLoaded: { id: 1 } } } })).toEqual({ id: 1 });
  });
});
