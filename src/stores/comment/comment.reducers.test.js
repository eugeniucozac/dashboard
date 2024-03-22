import reducer from './comment.reducers';

describe('STORES › REDUCERS › comment', () => {
  const initialState = {
    items: {},
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle COMMENTS_GET_SUCCESS', () => {
    // arrange
    const action = {
      type: 'COMMENTS_GET_SUCCESS',
      payload: {
        id: 1,
        comments: [
          { id: 1, date: '2017-01-31', message: 'lorem ipsum', user: { id: 1 } },
          { id: 2, date: '2018-01-31', message: 'lorem ipsum', user: { id: 1 } },
          { id: 3, date: '2019-10-31', message: 'lorem ipsum', user: { id: 1 } },
          { id: 4, date: '2017-06-15', message: 'lorem ipsum', user: { id: 1 } },
          { id: 5, date: '2017-06-15', message: 'lorem ipsum', user: { id: 1 } },
          { id: 6, date: '2019-12-31', message: 'lorem ipsum', user: { id: 1 } },
        ],
      },
    };
    const expectedComments = {
      1: [
        { id: 1, date: '2017-01-31', message: 'lorem ipsum', user: { id: 1 } },
        { id: 4, date: '2017-06-15', message: 'lorem ipsum', user: { id: 1 } },
        { id: 5, date: '2017-06-15', message: 'lorem ipsum', user: { id: 1 } },
        { id: 2, date: '2018-01-31', message: 'lorem ipsum', user: { id: 1 } },
        { id: 3, date: '2019-10-31', message: 'lorem ipsum', user: { id: 1 } },
        { id: 6, date: '2019-12-31', message: 'lorem ipsum', user: { id: 1 } },
      ],
    };
    const expectedState = {
      ...initialState,
      items: expectedComments,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle COMMENTS_GET_BY_PLACEMENT_SUCCESS', () => {
    // arrange
    const action = {
      type: 'COMMENTS_GET_BY_PLACEMENT_SUCCESS',
      payload: {
        id: 1,
        comments: [
          { id: 1, typeId: 11, date: '2017-01-31', message: 'lorem ipsum', user: { id: 1 } },
          { id: 2, typeId: 22, date: '2018-01-31', message: 'lorem ipsum', user: { id: 1 } },
          { id: 3, typeId: 11, date: '2019-10-31', message: 'lorem ipsum', user: { id: 1 } },
          { id: 4, typeId: 33, date: '2017-06-15', message: 'lorem ipsum', user: { id: 1 } },
          { id: 5, typeId: 22, date: '2017-06-15', message: 'lorem ipsum', user: { id: 1 } },
          { id: 6, typeId: 22, date: '2019-12-31', message: 'lorem ipsum', user: { id: 1 } },
        ],
      },
    };
    const expectedComments = {
      '1/11': [
        { id: 1, typeId: 11, date: '2017-01-31', message: 'lorem ipsum', user: { id: 1 } },
        { id: 3, typeId: 11, date: '2019-10-31', message: 'lorem ipsum', user: { id: 1 } },
      ],
      '1/22': [
        { id: 5, typeId: 22, date: '2017-06-15', message: 'lorem ipsum', user: { id: 1 } },
        { id: 2, typeId: 22, date: '2018-01-31', message: 'lorem ipsum', user: { id: 1 } },
        { id: 6, typeId: 22, date: '2019-12-31', message: 'lorem ipsum', user: { id: 1 } },
      ],
      '1/33': [{ id: 4, typeId: 33, date: '2017-06-15', message: 'lorem ipsum', user: { id: 1 } }],
    };
    const expectedState = {
      ...initialState,
      items: expectedComments,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  describe('post', () => {
    it('should handle SUCCESS', () => {
      // arrange
      const action = {
        type: 'COMMENTS_POST_SUCCESS',
        payload: {
          id: 1,
          comments: {
            id: 123456,
            date: '2000-01-31',
            message: 'lorem ipsum',
            user: { id: 1 },
          },
        },
      };
      const prevState = {
        items: {},
      };
      const expectedState = {
        ...prevState,
        items: {
          1: [{ id: 123456, date: '2000-01-31', message: 'lorem ipsum', user: { id: 1 } }],
        },
      };

      // assert
      expect(reducer(prevState, action)).toEqual(expectedState);
    });
  });
});
