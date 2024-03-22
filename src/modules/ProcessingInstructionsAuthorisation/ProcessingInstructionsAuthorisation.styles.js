const styles = (theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  documentsValidationTitle: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  notes: {
    wordBreak: 'break-all',
  },
  noteStatus: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  noteUpdatedBy: {
    color: theme.palette.disabled.color,
  },
  rejected: { color: theme.palette.error.main },
  approved: { color: theme.palette.success.main },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
    fontSize: theme.typography.pxToRem(14),
  },
  formErrorMessage: {
    display: 'flex',
    justifyContent: 'center',
    position: 'sticky',
    top: theme.spacing(1),
    zIndex: 9,
  },
});

export default styles;
