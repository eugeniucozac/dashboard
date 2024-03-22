const styles = (theme) => ({
  picker: {
    padding: `${theme.spacing(2)} !important`,
    boxShadow: 'none !important',
  },
  iconClear: {
    color: theme.palette.error.main,
  },
  iconSave: {
    color: theme.palette.success.main,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export default styles;
