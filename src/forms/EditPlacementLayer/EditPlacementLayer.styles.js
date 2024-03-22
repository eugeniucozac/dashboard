const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  collapse: {
    marginTop: '8px !important',
    paddingBottom: '12px !important',

    [theme.breakpoints.up('sm')]: {
      marginTop: '2px !important',
      paddingBottom: '10px !important',
    },
  },
  buyDown: {
    paddingTop: '30px !important',
    paddingBottom: '6px !important',

    [theme.breakpoints.up('sm')]: {
      paddingTop: '34px !important',
    },
  },
  currency: {
    '& > div:first-child .MuiOutlinedInput-root': {
      minWidth: 120,
    },
  },
});

export default styles;
