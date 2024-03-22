const styles = (theme) => ({
  row: {
    cursor: 'pointer',
    '&.active': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  issueTypeChip: {
    marginRight: theme.spacing(1),
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    fontSize: theme.typography.pxToRem(11),
    '& > svg': {
      color: 'white',
    },
  },
  addUserButton: {
    marginTop: theme.spacing(3),
  },
});

export default styles;
