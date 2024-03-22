const styles = (theme) => ({
  noteTextWidth: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
  },
  noteSaveButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '50%',
  },
  noteStatus: {
    fontWeight: theme.typography.fontWeightBold,
  },
  noteUpdatedBy: {
    color: theme.palette.disabled.color,
    fontSize: theme.typography.pxToRem(12),
  },
  noteComments: {
    fontSize: theme.typography.pxToRem(15),
  },
  label: {
    textTransform: 'none',
    textDecoration: 'underline',
    fontSize: theme.typography.pxToRem(11),
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
  textDescription: {
    fontSize: theme.typography.pxToRem(12),
    wordBreak: 'break-all',
  },
});

export default styles;
