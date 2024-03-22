const styles = (theme) => ({
  root: {
    minHeight: 300,
  },
  filenameRoot: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  filenameBase: {
    color: `${theme.palette.neutral.dark} !important`,
    fontSize: theme.typography.pxToRem(13),

    '& > fieldset': {
      border: '0 !important',
      backgroundColor: 'transparent !important',
    },
  },
  filenameInput: {
    cursor: 'default !important',
    padding: '0 !important',
    height: 'auto !important',
    ...theme.mixins.ellipsis,
  },
  margin0: {
    margin: '0px',
  },
  enableScroll: {
    overflow: 'auto',
    'max-height': '150px',
  },
  padding_0_30: {
    padding: theme.spacing(0, 4),
  },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
    fontSize: theme.typography.pxToRem(14),
  },
  tableHead: {
    '& th': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
});

export default styles;
