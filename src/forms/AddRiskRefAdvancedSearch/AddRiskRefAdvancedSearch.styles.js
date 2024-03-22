const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
    fontSize: theme.typography.pxToRem(14),
  },
  tableHead: {
    '& th': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  instructionIdsCell: {
    wordBreak: 'break-all',
  },
});

export default styles;
