const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  promptText: {
    margin: theme.spacing(5),
    paddingTop: theme.spacing(5),
  },
  wrapper: {
    '& button': {
      padding: '6px 22px',
      minHeight: '42px',
    },
  },
  formLabel: {
    paddingRight: '6px',
    paddingTop: theme.spacing(1),
  },
  requiredLabel: {
    textAlign: 'right',
  },
  formgridcontainer: {
    marginBottom: theme.spacing(2),
    paddingRight: theme.spacing(2.5),
  },
});

export default styles;
