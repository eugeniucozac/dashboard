const styles = (theme) => ({
  disabled: {
    color: theme.palette.grey[300],
  },
  enabled: {
    color: theme.palette.success.light,
  },
  cancelSaveButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '5%',
  },
  error: { color: theme.palette.error.main },
});

export default styles;
