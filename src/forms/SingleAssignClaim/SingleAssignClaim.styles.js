const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },

  complexityBasis: {
    transition: theme.transitions.create(['padding']),
  },

  complexityBasisHidden: {
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
  },
});

export default styles;
