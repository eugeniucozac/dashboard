import * as commentSelectors from './comment.selectors';

describe('STORES › SELECTORS › comment', () => {
  const { selectComments } = commentSelectors;
  const initialState = {
    comment: {
      items: {
        foo: [
          { id: 10, message: 'foo 10', date: '2020-12-31', user: { id: 1 } },
          { id: 11, message: 'foo 11', date: '2020-12-31', user: { id: 1 } },
          { id: 12, date: '2020-12-31', user: { id: 1 } },
          { id: 13, message: 'foo 13', user: { id: 1 } },
          { id: 14, message: 'foo 14', date: '2020-12-31' },
          { id: 15, message: 'foo 15' },
          { id: 16 },
        ],
        bar: [
          { id: 20, message: 'bar 20', date: '2020-12-31', user: { id: 1 } },
          { id: 21, message: 'bar 21', date: '2020-12-31', user: { id: 1 } },
        ],
      },
    },
  };
  it('selectComments with empty state', () => {
    // assert
    expect(selectComments()({})).toEqual([]);
    expect(selectComments('foo')({})).toEqual([]);
    expect(selectComments('bar')({})).toEqual([]);
    expect(selectComments('qwerty')({})).toEqual([]);
  });
  it('selectComments with state', () => {
    // assert
    expect(selectComments()(initialState)).toEqual([]);
    expect(selectComments('foo')(initialState)).toEqual([
      { id: 10, message: 'foo 10', date: '2020-12-31', user: { id: 1 } },
      { id: 11, message: 'foo 11', date: '2020-12-31', user: { id: 1 } },
    ]);
    expect(selectComments('bar')(initialState)).toEqual([
      { id: 20, message: 'bar 20', date: '2020-12-31', user: { id: 1 } },
      { id: 21, message: 'bar 21', date: '2020-12-31', user: { id: 1 } },
    ]);
    expect(selectComments('qwerty')(initialState)).toEqual([]);
  });
});
