const styles = (theme) => ({
  title: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightMedium,
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  submitButton: {
    height: '20px !important',
  },
  checkboxAlignment: {
    marginTop: '0 !important',
    paddingBottom: '0 !important',
  },
  rejectSubmitButtons: {
    marginTop: theme.spacing(2),
  },
  notesHistory: {
    fontSize: '11.5px',
    color: 'blue',
    textDecoration: 'none',
  },
  notes: {
    fontSize: '14px',
  },
  premiumNotes: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(4.5),
  },
  saveNotesButtons: {
    marginTop: theme.spacing(2),
  },
  singleRowButton: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
  },
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2.5),
  },
});

export default styles;
