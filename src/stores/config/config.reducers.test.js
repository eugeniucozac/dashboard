import reducer from './config.reducers';
import config from 'config';

describe('STORES › REDUCERS › config', () => {
  const initialState = {
    vars: {},
    locale: config.locale,
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle CONFIG_VARS_SET', () => {
    // arrange
    const action = {
      type: 'CONFIG_VARS_SET',
      payload: { a: 1, b: 2 },
    };

    const expectedState = {
      ...initialState,
      vars: { a: 1, b: 2 },
    };

    // assert
    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle CONFIG_LOCALE_SET', () => {
    // arrange
    const action = {
      type: 'CONFIG_LOCALE_SET',
      payload: 'de',
    };

    const expectedState = {
      ...initialState,
      locale: 'de',
    };

    // assert
    expect(reducer(undefined, action)).toEqual(expectedState);
  });
});
