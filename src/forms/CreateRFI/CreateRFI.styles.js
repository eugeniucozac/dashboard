const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    overflowY: 'auto',
  },
  textFieldTime: {
    width: '100%',
  },
  'input[type="date"]': {
    textTransform: 'uppercase',
  },
  codeSelect: {
    '& .MuiBox-root': {
      overflow: 'hidden',
    },
  },
  greyGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    display: 'flex',
    alignItems: 'center',
  },
  sectionheader: {
    marginBottom: theme.spacing(3),
    fontWeight: theme.typography.fontWeightMedium,
  },
  dueDateheader: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(0.5),
    fontWeight: theme.typography.fontWeightMedium,
  },
  documentHeader: {
    textAlign: 'end',
  },
  viewDocument: {
    fontSize: theme.typography.pxToRem(11),
  },
  alert: {
    color: 'blue',
  },
  uploadYesBtn: {
    marginLeft: theme.spacing(1),
  },
});

export default styles;
