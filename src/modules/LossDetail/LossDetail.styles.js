const styles = (theme) => ({
  wrapper: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(6),
    paddingBottom: theme.spacing(0.5),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  inFlightMarksText: {
    borderRadius: 4,
    border: '1px solid',
    height: 13,
    width: 14,
  },
  claimRow: {
    cursor: 'pointer',
  },
  inFlightIcon: {
    height: 12,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export default styles;
