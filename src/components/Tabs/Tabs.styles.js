import chroma from 'chroma-js';

const styles = (theme) => ({
  root: {
    '& + [class*="Tabs-root"]': {
      marginTop: theme.spacing(4),
    },
  },
  tabs: (props) => ({
    position: 'relative',
    minHeight: props.compact ? 36 : 48,

    '& .MuiTabs-indicator': {
      display: props.light ? 'block' : 'none',
      height: 4,
    },

    '& .MuiTab-root': {
      minHeight: props.compact ? 36 : 48,

      '&.Mui-selected': {
        color: props.light ? 'inherit' : 'white',
        backgroundColor: props.light ? 'transparent' : theme.palette.primary.main,

        '& .MuiSvgIcon-colorError': {
          backgroundColor: (props) => (props.light ? 'white' : theme.palette.primary.main),
        },
      },

      '&:not(.Mui-selected):hover': {
        color: props.light ? 'inherit' : 'white',
        backgroundColor: props.light ? 'transparent' : chroma(theme.palette.primary.main).brighten(0.5),

        '& .MuiSvgIcon-colorError': {
          backgroundColor: (props) => (props.light ? 'white' : chroma(theme.palette.primary.main).brighten(0.5)),
        },
      },
    },
  }),
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightMedium,
  },
  sublabel: {
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: -4,
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightLight,
  },
  labelCount: {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(11),
  },
  iconError: {
    marginLeft: 3,
    marginRight: 0,
    fontSize: theme.typography.pxToRem(16),
    backgroundColor: 'white',
  },
  scrollButtons: {
    ...theme.mixins.tab.scroll.buttons,
  },
});

export default styles;
