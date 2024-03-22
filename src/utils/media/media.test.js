import * as utils from 'utils';

describe('UTILS › media', () => {
  const breakpoints = {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  };

  const setMatchMedia = (bool) => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => {
        return { matches: bool };
      }),
    });
  };

  it('should export the required methods', () => {
    expect(utils.media).toHaveProperty('get');
    expect(utils.media).toHaveProperty('match');
    expect(utils.media).toHaveProperty('up');
    expect(utils.media).toHaveProperty('down');
    expect(utils.media).toHaveProperty('only');
  });

  it('should export all "match" properties', () => {
    expect(utils.media.match).toHaveProperty('mobile');
    expect(utils.media.match).toHaveProperty('tablet');
    expect(utils.media.match).toHaveProperty('desktop');
  });

  it('should export all "up" properties', () => {
    expect(utils.media.up).toHaveProperty('xs');
    expect(utils.media.up).toHaveProperty('sm');
    expect(utils.media.up).toHaveProperty('md');
    expect(utils.media.up).toHaveProperty('lg');
    expect(utils.media.up).toHaveProperty('xl');
  });

  it('should export all "down" properties', () => {
    expect(utils.media.down).toHaveProperty('xs');
    expect(utils.media.down).toHaveProperty('sm');
    expect(utils.media.down).toHaveProperty('md');
    expect(utils.media.down).toHaveProperty('lg');
    expect(utils.media.down).toHaveProperty('xl');
  });

  it('should export all "only" properties', () => {
    expect(utils.media.only).toHaveProperty('xs');
    expect(utils.media.only).toHaveProperty('sm');
    expect(utils.media.only).toHaveProperty('md');
    expect(utils.media.only).toHaveProperty('lg');
    expect(utils.media.only).toHaveProperty('xl');
  });

  describe('get', () => {
    it('should return the current breakpoint', () => {
      setMatchMedia(false);
      expect(utils.media.get({ breakpoints })).toBeNull();

      setMatchMedia(true);
      expect(utils.media.get({ breakpoints })).toEqual('xs');
    });
  });

  describe('match', () => {
    it('should return true if it matches media width', () => {
      setMatchMedia(true);
      expect(utils.media.match.mobile({ breakpoints }).matches).toBeTruthy();
      expect(utils.media.match.tablet({ breakpoints }).matches).toBeTruthy();
      expect(utils.media.match.tabletUp({ breakpoints }).matches).toBeTruthy();
      expect(utils.media.match.desktop({ breakpoints }).matches).toBeTruthy();
      expect(utils.media.match.desktopUp({ breakpoints }).matches).toBeTruthy();
      expect(utils.media.match.wide({ breakpoints }).matches).toBeTruthy();
      expect(utils.media.match.wideUp({ breakpoints }).matches).toBeTruthy();
      expect(utils.media.match.extraWide({ breakpoints }).matches).toBeTruthy();

      setMatchMedia(false);
      expect(utils.media.match.mobile({ breakpoints }).matches).toBeFalsy();
      expect(utils.media.match.tablet({ breakpoints }).matches).toBeFalsy();
      expect(utils.media.match.tabletUp({ breakpoints }).matches).toBeFalsy();
      expect(utils.media.match.desktop({ breakpoints }).matches).toBeFalsy();
      expect(utils.media.match.desktopUp({ breakpoints }).matches).toBeFalsy();
      expect(utils.media.match.wide({ breakpoints }).matches).toBeFalsy();
      expect(utils.media.match.wideUp({ breakpoints }).matches).toBeFalsy();
      expect(utils.media.match.extraWide({ breakpoints }).matches).toBeFalsy();
    });
  });

  describe('up', () => {
    it('should return true if it matches media width', () => {
      setMatchMedia(true);
      expect(utils.media.up.xs({ breakpoints })).toBeTruthy();
      expect(utils.media.up.sm({ breakpoints })).toBeTruthy();
      expect(utils.media.up.md({ breakpoints })).toBeTruthy();
      expect(utils.media.up.lg({ breakpoints })).toBeTruthy();
      expect(utils.media.up.xl({ breakpoints })).toBeTruthy();

      setMatchMedia(false);
      expect(utils.media.up.xs({ breakpoints })).toBeTruthy();
      expect(utils.media.up.sm({ breakpoints })).toBeFalsy();
      expect(utils.media.up.md({ breakpoints })).toBeFalsy();
      expect(utils.media.up.lg({ breakpoints })).toBeFalsy();
      expect(utils.media.up.xl({ breakpoints })).toBeFalsy();
    });
  });

  describe('down', () => {
    it('should return true if it matches media width', () => {
      setMatchMedia(true);
      expect(utils.media.down.xs({ breakpoints })).toBeTruthy();
      expect(utils.media.down.sm({ breakpoints })).toBeTruthy();
      expect(utils.media.down.md({ breakpoints })).toBeTruthy();
      expect(utils.media.down.lg({ breakpoints })).toBeTruthy();
      expect(utils.media.down.xl({ breakpoints })).toBeTruthy();

      setMatchMedia(false);
      expect(utils.media.down.xs({ breakpoints })).toBeFalsy();
      expect(utils.media.down.sm({ breakpoints })).toBeFalsy();
      expect(utils.media.down.md({ breakpoints })).toBeFalsy();
      expect(utils.media.down.lg({ breakpoints })).toBeFalsy();
      expect(utils.media.down.xl({ breakpoints })).toBeTruthy();
    });
  });

  describe('only', () => {
    it('should return true if it matches media width', () => {
      setMatchMedia(true);
      expect(utils.media.only.xs({ breakpoints })).toBeTruthy();
      expect(utils.media.only.sm({ breakpoints })).toBeTruthy();
      expect(utils.media.only.md({ breakpoints })).toBeTruthy();
      expect(utils.media.only.lg({ breakpoints })).toBeTruthy();
      expect(utils.media.only.xl({ breakpoints })).toBeTruthy();

      setMatchMedia(false);
      expect(utils.media.only.xs({ breakpoints })).toBeFalsy();
      expect(utils.media.only.sm({ breakpoints })).toBeFalsy();
      expect(utils.media.only.md({ breakpoints })).toBeFalsy();
      expect(utils.media.only.lg({ breakpoints })).toBeFalsy();
      expect(utils.media.only.xl({ breakpoints })).toBeFalsy();
    });
  });
});
