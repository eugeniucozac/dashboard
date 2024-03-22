import { selectMarketSelected, selectMarketSelectedId } from 'stores';

describe('STORES › SELECTORS › market', () => {
  it('selectPolicyMarket', () => {
    // assert
    expect(selectMarketSelected({})).toEqual(undefined);
    expect(selectMarketSelected({ market: {} })).toEqual(undefined);
    expect(selectMarketSelected({ market: { selected: 1 } })).toEqual(1);
  });

  it('selectMarketSelectedId', () => {
    // assert
    expect(selectMarketSelectedId({})).toEqual(undefined);
    expect(selectMarketSelectedId({ market: {} })).toEqual(undefined);
    expect(selectMarketSelectedId({ market: { selected: {} } })).toEqual(undefined);
    expect(selectMarketSelectedId({ market: { selected: { foo: 'bar' } } })).toEqual(undefined);
    expect(selectMarketSelectedId({ market: { selected: { id: 1, foo: 'bar' } } })).toEqual(1);
  });
});
