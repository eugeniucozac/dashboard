import defaults from './theme-defaults';
import chroma from 'chroma-js';

const { transitions, palette } = defaults;

const bezierGradient = (direction, color) => {
  const hsl = [chroma(color).get('hsl.h') || 0, chroma(color).get('hsl.s'), chroma(color).get('hsl.l') * 100];

  return {
    background: `linear-gradient(
      to ${direction},
      hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%) 0%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.987) 13.6%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.951) 25.6%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.896) 36.1%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.825) 45.4%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.741) 53.5%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.648) 60.5%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.55) 66.7%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.45) 72.1%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.352) 76.9%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.259) 81.2%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.175) 85.1%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.104) 88.8%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.049) 92.5%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.013) 96.1%,
      hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0) 100%
    )`,
  };
};

const mixins = {
  breakword: {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    MsWordBreak: 'break-all',
    wordBreak: 'break-word',
    MsHyphens: 'auto',
    MozHyphens: 'auto',
    WebkitHyphens: 'auto',
    hyphens: 'auto',
  },
  drawer: {
    width: {
      collapsed: 60,
      expanded: {
        xs: 240,
        sm: 280,
        md: 320,
        lg: 360,
      },
    },
  },
  ellipsis: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  gradient: {
    linear: {
      bezier: (direction, color) => {
        return bezierGradient(direction, color);
      },
    },
  },
  page: {
    header: {
      height: 84,
    },
  },
  modal: {
    dialog: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflowY: 'hidden',
        minHeight: 150,
        marginTop: 0,
      },
      overflowY: {
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
      },
    },
  },
  nav: {
    width: {
      default: 240,
      collapsed: 65,
    },
  },
  overflowPanel: {
    marginTop: -24,
    marginRight: -24,
    marginLeft: -24,

    '@media (min-width: 600px)': {
      marginTop: -40,
      marginLeft: -40,
      marginRight: -40,
    },
  },
  panel: {
    width: {
      mobile: 320,
      tablet: 420,
      collapsed: 48,
    },
  },
  tab: {
    scroll: {
      buttons: {
        position: 'absolute',
        width: 60,
        height: '100%',
        top: 0,
        zIndex: 1,

        '& > span': {
          display: 'none',
        },

        '&:first-child': {
          left: 0,
          paddingRight: 30,
          ...bezierGradient('right', 'white'),

          '&.Mui-disabled': {
            opacity: 0,
            transform: 'translateX(-100%)',
          },

          '&:not(.Mui-disabled)': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },

        '&:last-child': {
          right: 0,
          paddingLeft: 30,
          ...bezierGradient('left', 'white'),

          '&.Mui-disabled': {
            opacity: 0,
            transform: 'translateX(100%)',
          },

          '&:not(.Mui-disabled)': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      },
      // animations are defined in index.css
      buttonsAnimated: {
        '&:first-child.Mui-disabled': {
          animation: `
            fadeOut ${transitions.duration.complex}ms ${transitions.easing.easeInOut},
            slideOutLeft ${transitions.duration.complex}ms ${transitions.easing.easeInOut}
          `,
        },

        '&:first-child:not(.Mui-disabled)': {
          animation: `
            fadeIn ${transitions.duration.complex}ms ${transitions.easing.easeInOut},
            slideInLeft ${transitions.duration.complex}ms ${transitions.easing.easeInOut}
          `,
        },

        '&:last-child.Mui-disabled': {
          animation: `
            fadeOut ${transitions.duration.complex}ms ${transitions.easing.easeInOut},
            slideOutRight ${transitions.duration.complex}ms ${transitions.easing.easeInOut}
          `,
        },

        '&:last-child:not(.Mui-disabled)': {
          animation: `
            fadeIn ${transitions.duration.complex}ms ${transitions.easing.easeInOut},
            slideInRight ${transitions.duration.complex}ms ${transitions.easing.easeInOut}
          `,
        },
      },
    },
  },
  summary: {
    info: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 'calc(100% + 24px)',
      margin: -12,
      marginTop: 4,
    },
    boxes: {
      flex: '1 1 auto',
      width: '50%',
      minWidth: 160,
      marginBottom: -4,
      padding: 12,
      paddingRight: 8,
      transition: 'padding-top 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, padding-bottom 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

      '@media (min-width: 600px)': {
        width: '33.3333%',
      },

      '@media (min-width: 960px)': {
        width: '50%',

        '&:nth-child(2n)': {
          paddingRight: 0,
        },
      },
    },
    boxesEmpty: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  header: {
    default: {
      minHeight: 64,
      backgroundColor: '#fafafa',
      borderTop: `3px solid ${palette.primary.main}`,
    },
    height: 64,
  },
  heightScale: {
    default: {
      animation: `
        heightScale 0.35s ${transitions.easing.easeInOut}
      `,
    },
  },
  highlight: {
    default: {
      animation: `
        highlightFadeInOut 2s ${transitions.easing.easeInOut}
      `,
    },
  },
  row: {
    new: {
      background: palette.secondary.lightest,

      '&:hover': {
        background: `${chroma(palette.secondary.lightest).darken(0.1).saturate(0.1).hex()} !important`,
      },

      '& td': {
        borderBottomColor: `${chroma(palette.secondary.lightest).darken(0.25).hex()} !important`,
      },
    },
    newSelected: {
      background: palette.secondary.lighter,

      '&:hover': {
        background: `${chroma(palette.secondary.lighter).darken(0.2).saturate(0.1).hex()} !important`,
      },

      '& td': {
        borderBottomColor: `${chroma(palette.secondary.lightest).darken(0.25).hex()} !important`,
      },
    },
  },
  divider: '1px solid rgba(0, 0, 0, 0.12)',
};

export default mixins;
