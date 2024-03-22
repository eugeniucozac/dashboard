const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  container: {
    ...theme.mixins.modal.dialog.overflowY,
    flex: 1,
  },
  tabs: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
  tab: {
    ...theme.mixins.modal.dialog.overflowY,
    flex: 1,
  },
  content: {
    ...theme.mixins.modal.dialog.overflowY,
    flex: '1 1 auto',
  },
  error: {
    margin: theme.spacing(4),
    marginTop: theme.spacing(9),
    marginBottom: theme.spacing(10),
  },
});

export default styles;
