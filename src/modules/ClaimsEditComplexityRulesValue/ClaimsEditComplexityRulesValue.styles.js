const styles = (theme) => ({
  wrapper: {
    marginTop: 30,
    background: theme.palette.grey[50],
    padding: theme.spacing(3),
  },
  title: {
    marginTop: theme.spacing(6),
    paddingBottom: theme.spacing(0.5),
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  formcontainer: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(-5),
  },
  formInput: {
    '& input': {
      paddingTop: '9.5px',
      paddingBottom: '7.5px',
    },
  },
  complexLabel: {
    fontWeight: theme.typography.fontWeightBold,
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  editcomplexityruleForm: {
    marginBottom: '15px',
    paddingRight: '10px',
  },
});

export default styles;
