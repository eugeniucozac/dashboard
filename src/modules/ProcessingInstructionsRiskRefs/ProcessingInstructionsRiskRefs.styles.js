const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  searchFieldRadioGroup: {
    paddingBottom: '0 !important',
  },
  searchBtnContainer: {
    marginTop: theme.spacing(2.3),
  },
  searchBtn: {
    height: 44,
    minWidth: theme.spacing(12),
  },
  tableContainer: {
    maxHeight: theme.spacing(60),
  },
  tableStyling: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
  },
  searchContainer: {
    marginBottom: theme.spacing(4),
  },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
    fontSize: theme.typography.pxToRem(14),
  },
  or: {
    textTransform: 'uppercase',
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
  },
  tableHead: {
    '& th': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
});

export default styles;
