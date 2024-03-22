import { selectModellingTask, selectModellingList } from 'stores';

describe('STORES › SELECTORS › modelling', () => {
  it('selectOpeningMemoList', () => {
    // assert
    expect(selectModellingList({})).toEqual({});
    expect(selectModellingList({ modelling: {} })).toEqual({});
    expect(selectModellingList({ modelling: { list: {} } })).toEqual({});
    expect(selectModellingList({ modelling: { list: { items: [{ id: 11 }], foo: 'bar' } } })).toEqual({ items: [{ id: 11 }], foo: 'bar' });
  });

  it('selectModellingTask', () => {
    // assert
    expect(selectModellingTask({})).toEqual({});
    expect(selectModellingTask({ modelling: {} })).toEqual({});
    expect(selectModellingTask({ modelling: { selected: {} } })).toEqual({});
    expect(selectModellingTask({ modelling: { selected: { id: 11 } } })).toEqual({ id: 11 });
  });
});
