// export default styles;
const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    display: 'flex',
  },
  legend: {
    '&:not(:first-child) > legend': {
      marginTop: '0px !important',
    },
    '& > legend': {
      marginBottom: 0,
    },
  },
  spacer: {
    padding: '0 !important',
  },
});

export default styles;
