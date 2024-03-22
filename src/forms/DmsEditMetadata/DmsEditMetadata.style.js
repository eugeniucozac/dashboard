const styles = (theme) => ({
  boxView: {
    padding: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[200]}`,
  },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  dmsDocSelect: {
    '& .MuiBox-root': {
      overflow: 'hidden',
    },
    paddingTop: theme.spacing(2),
  },
  dmsFieldTiltles: {
    fontWeight: theme.typography.fontWeightBold,
  },
});

export default styles;
