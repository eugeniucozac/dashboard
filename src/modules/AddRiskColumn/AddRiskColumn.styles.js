const styles = (theme) => ({
  divider: {
    height: 0,
    backgroundColor: 'transparent',
    borderTop: `1px dashed ${theme.palette.neutral.light}`,
  },
  highlight: {
    position: 'relative',

    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: -6,
      left: -6,
      width: `calc(100% + 12px)`,
      height: `calc(100% + 12px)`,
      borderRadius: 8,
      ...theme.mixins.highlight.default,
    },
  },
  legend: {
    '&:not(:first-child) > legend': {
      marginTop: '32px !important',
    },
    '& > legend': {
      marginBottom: 0,
    },
  },
  spacer: {
    padding: '0 !important',
  },
});

export default styles;
