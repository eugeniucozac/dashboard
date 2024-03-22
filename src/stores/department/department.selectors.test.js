import { selectDepartmentMarketsItems } from 'stores';

describe('STORES › SELECTORS › department', () => {
  it('selectDepartmentMarketsItems', () => {
    // assert
    expect(selectDepartmentMarketsItems({})).toEqual([]);
    expect(selectDepartmentMarketsItems({ department: {} })).toEqual([]);
    expect(selectDepartmentMarketsItems({ department: { markets: {} } })).toEqual([]);
    expect(selectDepartmentMarketsItems({ department: { markets: { items: [] } } })).toEqual([]);
    expect(selectDepartmentMarketsItems({ department: { markets: { items: [{ id: 1 }, { id: 2 }] } } })).toEqual([{ id: 1 }, { id: 2 }]);
  });
});
