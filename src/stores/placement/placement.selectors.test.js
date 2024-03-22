import {
  selectPlacement,
  selectPlacementId,
  selectPlacementPolicies,
  selectPlacementLayers,
  selectPlacementMarkets,
  selectPlacementDepartmentName,
  selectPlacementDepartmentId,
  selectPlacementBulkType,
  selectPlacementBulkItems,
  selectPlacementConfig,
  selectPlacementList,
  selectPlacementSort,
  selectPlacementBulkItemsLayers,
  selectPlacementBulkItemsMarkets,
  selectPlacementBulkItemsMarketingMarkets,
} from 'stores';

describe('STORES › SELECTORS › placement', () => {
  it('selectPlacement', () => {
    // assert
    expect(selectPlacement({})).toEqual(undefined);
    expect(selectPlacement({ placement: {} })).toEqual(undefined);
    expect(selectPlacement({ placement: { selected: 1 } })).toEqual(1);
  });

  it('selectPlacementId', () => {
    // assert
    expect(selectPlacementId({})).toEqual(undefined);
    expect(selectPlacementId({ placement: {} })).toEqual(undefined);
    expect(selectPlacementId({ placement: { selected: {} } })).toEqual(undefined);
    expect(selectPlacementId({ placement: { selected: { foo: 'bar' } } })).toEqual(undefined);
    expect(selectPlacementId({ placement: { selected: { id: 1, foo: 'bar' } } })).toEqual(1);
  });

  it('selectPlacementLayers', () => {
    // assert
    expect(selectPlacementLayers({})).toBeUndefined();
    expect(selectPlacementLayers({ placement: {} })).toBeUndefined();
    expect(selectPlacementLayers({ placement: { selected: {} } })).toBeUndefined();
    expect(selectPlacementLayers({ placement: { selected: { layers: [] } } })).toEqual([]);
    expect(selectPlacementLayers({ placement: { selected: { layers: [{ id: 1 }, { id: 2 }] } } })).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('selectPlacementMarkets', () => {
    // assert
    expect(selectPlacementMarkets({})).toBeUndefined();
    expect(selectPlacementMarkets({ placement: {} })).toBeUndefined();
    expect(selectPlacementMarkets({ placement: { selectedMarkets: [] } })).toEqual([]);
    expect(
      selectPlacementMarkets({
        placement: {
          selectedMarkets: [
            { id: 1, foo: 'bar' },
            { id: 2, foo: 'bar' },
          ],
        },
      })
    ).toEqual([
      { id: 1, foo: 'bar' },
      { id: 2, foo: 'bar' },
    ]);
  });

  it('selectPlacementDepartmentId', () => {
    // assert
    expect(selectPlacementDepartmentId({})).toBeUndefined();
    expect(selectPlacementDepartmentId({ placement: {} })).toBeUndefined();
    expect(selectPlacementDepartmentId({ placement: { selected: {} } })).toBeUndefined();
    expect(selectPlacementDepartmentId({ placement: { selected: { foo: 'bar' } } })).toBeUndefined();
    expect(selectPlacementDepartmentId({ placement: { selected: { departmentId: 1, foo: 'bar' } } })).toEqual(1);
  });

  it('selectPlacementBulkType', () => {
    // assert
    expect(selectPlacementBulkType({})).toBeUndefined();
    expect(selectPlacementBulkType({ placement: {} })).toBeUndefined();
    expect(selectPlacementBulkType({ placement: { bulk: {} } })).toBeUndefined();
    expect(selectPlacementBulkType({ placement: { bulk: { type: 'bar' } } })).toEqual('bar');
  });

  it('selectPlacementBulkItems', () => {
    // assert
    expect(selectPlacementBulkItems({})).toEqual([]);
    expect(selectPlacementBulkItems({ placement: {} })).toEqual([]);
    expect(selectPlacementBulkItems({ placement: { bulk: {} } })).toEqual([]);
    expect(selectPlacementBulkItems({ placement: { bulk: { items: [1, 2, 3] } } })).toEqual([1, 2, 3]);
  });

  it('selectPlacementBulkItems layers', () => {
    // assert
    expect(selectPlacementBulkItemsLayers({})).toEqual([]);
    expect(selectPlacementBulkItemsLayers({ placement: {} })).toEqual([]);
    expect(selectPlacementBulkItemsLayers({ placement: { bulkItems: {} } })).toEqual([]);
    expect(selectPlacementBulkItemsLayers({ placement: { bulkItems: { layers: [1, 2, 3] } } })).toEqual([1, 2, 3]);
  });

  it('selectPlacementBulkItems markets', () => {
    // assert
    expect(selectPlacementBulkItemsMarkets({})).toEqual([]);
    expect(selectPlacementBulkItemsMarkets({ placement: {} })).toEqual([]);
    expect(selectPlacementBulkItemsMarkets({ placement: { bulkItems: {} } })).toEqual([]);
    expect(selectPlacementBulkItemsMarkets({ placement: { bulkItems: { layerMarkets: [1, 2, 3] } } })).toEqual([1, 2, 3]);
  });

  it('selectPlacementDepartmentName', () => {
    // arrange
    const refData = {
      departments: [
        { id: 1, name: 'One' },
        { id: 2, name: 'Two' },
        { id: 3, name: 'Three' },
      ],
    };

    // assert
    expect(selectPlacementDepartmentName({})).toEqual('');
    expect(selectPlacementDepartmentName({ placement: {} })).toEqual('');
    expect(selectPlacementDepartmentName({ placement: { selected: {} } })).toEqual('');
    expect(selectPlacementDepartmentName({ placement: { selected: { foo: 'bar' } } })).toEqual('');
    expect(selectPlacementDepartmentName({ referenceData: {}, placement: { selected: { departmentId: 1, foo: 'bar' } } })).toEqual('');
    expect(
      selectPlacementDepartmentName({ referenceData: { departments: [] }, placement: { selected: { departmentId: 1, foo: 'bar' } } })
    ).toEqual('');
    expect(selectPlacementDepartmentName({ referenceData: refData, placement: { selected: { departmentId: 1, foo: 'bar' } } })).toEqual(
      'One'
    );
    expect(selectPlacementDepartmentName({ referenceData: refData, placement: { selected: { departmentId: 2, foo: 'bar' } } })).toEqual(
      'Two'
    );
    expect(selectPlacementDepartmentName({ referenceData: refData, placement: { selected: { departmentId: 3, foo: 'bar' } } })).toEqual(
      'Three'
    );
    expect(selectPlacementDepartmentName({ referenceData: refData, placement: { selected: { departmentId: 4, foo: 'bar' } } })).toEqual('');
  });

  it('selectPlacementPolicies', () => {
    // assert
    expect(selectPlacementPolicies({})).toEqual([]);
    expect(selectPlacementPolicies({ placement: {} })).toEqual([]);
    expect(selectPlacementPolicies({ placement: { selected: {} } })).toEqual([]);
    expect(selectPlacementPolicies({ placement: { selected: { policies: [] } } })).toEqual([]);
    expect(
      selectPlacementPolicies({
        placement: {
          selected: {
            policies: [
              { id: 1, foo: 'bar' },
              { id: 2, foo: 'bar' },
            ],
          },
        },
      })
    ).toEqual([
      { id: 1, foo: 'bar' },
      { id: 2, foo: 'bar' },
    ]);
  });

  it('selectPlacementConfig', () => {
    // assert
    expect(selectPlacementConfig({})).toBeUndefined();
    expect(selectPlacementConfig({ placement: {} })).toBeUndefined();
    expect(selectPlacementConfig({ placement: { selected: {} } })).toBeUndefined();
    expect(selectPlacementConfig({ placement: { selected: { config: {} } } })).toEqual({});
    expect(selectPlacementConfig({ placement: { selected: { config: { foo: 1 } } } })).toEqual({ foo: 1 });
  });

  it('selectPlacementList', () => {
    // assert
    expect(selectPlacementList({})).toBeUndefined();
    expect(selectPlacementList({ placement: {} })).toBeUndefined();
    expect(selectPlacementList({ placement: { list: {} } })).toEqual({});
    expect(selectPlacementList({ placement: { list: { foo: 1 } } })).toEqual({ foo: 1 });
  });

  it('selectPlacementSort', () => {
    // assert
    expect(selectPlacementSort({})).toBeUndefined();
    expect(selectPlacementSort({ placement: {} })).toBeUndefined();
    expect(selectPlacementSort({ placement: { sort: {} } })).toEqual({});
    expect(selectPlacementSort({ placement: { sort: { foo: 1 } } })).toEqual({ foo: 1 });
  });
  it('selectPlacementBulkItems MarketingMarkets', () => {
    // assert
    expect(selectPlacementBulkItemsMarketingMarkets({})).toEqual([]);
    expect(selectPlacementBulkItemsMarketingMarkets({ placement: {} })).toEqual([]);
    expect(selectPlacementBulkItemsMarketingMarkets({ placement: { bulkItemsMarketingMarkets: {} } })).toEqual([]);
    expect(selectPlacementBulkItemsMarketingMarkets({ placement: { bulkItemsMarketingMarkets: { marketingMarkets: [1, 2, 3] } } })).toEqual(
      [1, 2, 3]
    );
  });
});
