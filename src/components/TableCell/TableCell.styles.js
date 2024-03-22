const styles = (theme) => ({
  compact: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  minimal: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  menu: {
    width: 10,
    paddingTop: `${theme.spacing(0.5)}px !important`,
    paddingRight: '0px !important',
    paddingBottom: `${theme.spacing(0.5)}px !important`,
    overflow: 'hidden',

    '&:empty': {
      width: '0 !important',
      padding: '0 !important',
    },
  },
  narrow: {
    width: 10,
  },
  nowrap: {
    whiteSpace: 'nowrap',
  },
  ellipsis: {
    ...theme.mixins.ellipsis,
    minWidth: 160,
    maxWidth: 0,
  },
  left: {
    textAlign: 'left !important',
  },
  center: {
    textAlign: 'center !important',
  },
  right: {
    textAlign: 'right !important',
  },
  bold: {
    fontWeight: `${theme.typography.fontWeightMedium} !important`,
  },
  borderless: {
    border: `0 !important`,
  },
  relative: {
    position: 'relative',
  },
  hidden: {
    display: 'none !important',
  },
});

export default styles;
