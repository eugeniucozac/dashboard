const styles = (theme) => ({
  button: {
    float: 'right',
    marginBottom: theme.spacing(2),
  },
  folder: {
    margin: 0,
  },
  filename: {
    margin: 0,
    cursor: 'pointer',
    color: theme.palette.secondary.dark,
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.secondary.dark + ' !important',
    },
  },
  filenameCell: {
    paddingLeft: '4px !important',
  },
  inlineComponentCell: {
    padding: theme.spacing(1.5),
    borderBottom: 'none',
  },
  inlineComponentRow: {
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  inlineComponentText: {
    fontSize: theme.typography.pxToRem(10),
  },
  avatar: {
    marginLeft: 15,
    align: 'center',
  },
});

export default styles;
