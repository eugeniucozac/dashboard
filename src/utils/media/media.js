const utilsMedia = {
  get: (theme) => {
    const keys = Object.keys(theme.breakpoints.values);
    const values = Object.values(theme.breakpoints.values);

    const breakpoint = keys.filter((key, index) => {
      const min = window.matchMedia(`(min-width: ${values[index]}px)`).matches;
      const max = window.matchMedia(`(max-width: ${values[index + 1]}px)`).matches;
      let matches;

      if (index < keys.length - 1) {
        matches = min && max;
      } else {
        matches = min;
      }

      return matches;
    });

    return breakpoint.length ? breakpoint[0] : null;
  },
  match: {
    mobile: (theme) => {
      return window.matchMedia(`(max-width: ${theme.breakpoints.values.sm - 0.05}px)`);
    },
    tablet: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.sm}px) and (max-width: ${theme.breakpoints.values.md - 0.05}px)`);
    },
    tabletUp: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.sm}px)`);
    },
    desktop: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.md}px) and (max-width: ${theme.breakpoints.values.lg - 0.05}px)`);
    },
    desktopUp: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.md}px)`);
    },
    wide: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.lg}px) and (max-width: ${theme.breakpoints.values.xl - 0.05}px)`);
    },
    wideUp: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.lg}px)`);
    },
    extraWide: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.xl}px)`);
    },
  },
  up: {
    xs: () => {
      return true;
    },
    sm: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.sm}px)`).matches;
    },
    md: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.md}px)`).matches;
    },
    lg: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.lg}px)`).matches;
    },
    xl: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.xl}px)`).matches;
    },
  },
  down: {
    xs: (theme) => {
      return window.matchMedia(`(max-width: ${theme.breakpoints.values.sm}px)`).matches;
    },
    sm: (theme) => {
      return window.matchMedia(`(max-width: ${theme.breakpoints.values.md}px)`).matches;
    },
    md: (theme) => {
      return window.matchMedia(`(max-width: ${theme.breakpoints.values.lg}px)`).matches;
    },
    lg: (theme) => {
      return window.matchMedia(`(max-width: ${theme.breakpoints.values.xl}px)`).matches;
    },
    xl: () => {
      return true;
    },
  },
  only: {
    xs: (theme) => {
      return window.matchMedia(`(max-width: ${theme.breakpoints.values.sm - 0.05}px)`).matches;
    },
    sm: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.sm}px) and (max-width: ${theme.breakpoints.values.md - 0.05}px)`)
        .matches;
    },
    md: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.md}px) and (max-width: ${theme.breakpoints.values.lg - 0.05}px)`)
        .matches;
    },
    lg: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.lg}px) and (max-width: ${theme.breakpoints.values.xl - 0.05}px)`)
        .matches;
    },
    xl: (theme) => {
      return window.matchMedia(`(min-width: ${theme.breakpoints.values.xl}px)`).matches;
    },
  },
};

export default utilsMedia;
