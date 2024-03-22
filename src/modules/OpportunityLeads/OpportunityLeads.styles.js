const styles = (theme) => ({
  rowExpanded: {
    '& > td': {
      borderBottom: `1px dashed ${theme.palette.neutral.light}`,
    },
  },
  visitRow: {
    '& > td': {
      paddingTop: 0,
      paddingBottom: 0,
      borderBottom: `1px dashed ${theme.palette.neutral.light}`,
      backgroundColor: theme.palette.neutral.lightest,
    },
  },
  visitWrapper: {
    display: 'flex',
  },
  visitDetails: {
    fontSize: theme.typography.pxToRem(11),
    lineHeight: 1.4,
    marginTop: 4,
    marginBottom: 4,
  },
  visitDate: {
    marginLeft: 4,
    color: theme.palette.neutral.main,
    whiteSpace: 'nowrap',
  },
  iconSubdirectory: {
    position: 'relative',
    top: 3,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: theme.typography.pxToRem(16),
    color: theme.palette.neutral.dark,
  },
});

export default styles;
