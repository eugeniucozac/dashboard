import theme from './index';

describe('THEME', () => {
  it('should have the expected properties', () => {
    // assert
    expect(theme).toHaveProperty('palette');
    expect(theme).toHaveProperty('shape');
    expect(theme).toHaveProperty('zIndex');
    expect(theme).toHaveProperty('overrides');
    expect(theme).toHaveProperty('mixins');
    expect(theme).toHaveProperty('props');
    expect(theme).toHaveProperty('typography');
    expect(theme).toHaveProperty('shadows');
  });
});
