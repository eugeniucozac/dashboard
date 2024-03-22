import { selectOpeningMemoList, selectOpeningMemo, selectOpeningMemoListItems } from 'stores';

describe('STORES › SELECTORS › openingMemo', () => {
  it('selectOpeningMemoList', () => {
    // assert
    expect(selectOpeningMemoList({})).toEqual({});
    expect(selectOpeningMemoList({ openingMemo: {} })).toEqual({});
    expect(selectOpeningMemoList({ openingMemo: { list: {} } })).toEqual({});
    expect(selectOpeningMemoList({ openingMemo: { list: { items: [{ id: 11 }], foo: 'bar' } } })).toEqual({
      items: [{ id: 11 }],
      foo: 'bar',
    });
  });
  it('selectOpeningMemoListItems', () => {
    // assert
    expect(selectOpeningMemoListItems({})).toEqual([]);
    expect(selectOpeningMemoListItems({ openingMemo: {} })).toEqual([]);
    expect(selectOpeningMemoListItems({ openingMemo: { list: {} } })).toEqual([]);
    expect(selectOpeningMemoListItems({ openingMemo: { list: { items: [] } } })).toEqual([]);
    expect(selectOpeningMemoListItems({ openingMemo: { list: { items: [{ id: 11 }, { id: 22 }] } } })).toEqual([{ id: 11 }, { id: 22 }]);
  });
  it('selectOpeningMemo', () => {
    // assert
    expect(selectOpeningMemo({})).toEqual({});
    expect(selectOpeningMemo({ openingMemo: {} })).toEqual({});
    expect(selectOpeningMemo({ openingMemo: { selected: {} } })).toEqual({});
    expect(selectOpeningMemo({ openingMemo: { selected: { id: 11 } } })).toEqual({ id: 11 });
  });
});
