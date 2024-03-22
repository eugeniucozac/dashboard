const styles = (theme) => ({
  option: {
    padding: 0,
  },
  inputFocused: {
    paddingLeft: '0px !important',
  },
  inputRoot: {
    minHeight: 45,
    paddingLeft: '12px !important',
    display: 'flex',
    flexWrap: 'wrap',
    '& > span': {
      paddingTop: theme.spacing(1.65),
      paddingBottom: theme.spacing(1.55),
      marginRight: theme.spacing(0.75),
    },
  },
  issueTypeChip: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    height: 24,
    lineHeight: 1.5,
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    fontSize: theme.typography.pxToRem(11),
    '& > svg': {
      color: 'white',
    },
  },
});

export default styles;
