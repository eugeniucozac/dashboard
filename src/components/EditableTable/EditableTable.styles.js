const styles = (theme) => ({
  tableContainer: {
    maxHeight: 440,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: 4,
    padding: theme.spacing(0.5),
  },
  dataTable: { width: '100%', tableLayout: 'fixed' },
  tableHeadCell: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  tableHead: {
    fontWeight: 700,
  },
  sizeSmall: {
    padding: '5px 0',
    paddingRight: 4,

    '&:first-child': {
      paddingLeft: 4,
    },

    '&:last-child': {
      paddingRight: 4,
    },
  },
  tableCellLabel: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.grey[600],
    minWidth: theme.spacing(26),
  },
  selectedRow: {
    backgroundColor: '#0000000a',
  },
  tableRow: {
    cursor: 'pointer',
    paddingLeft: 1,
  },
  tableRowNonClickable: {
    cursor: 'no-drop',
    paddingLeft: 1,
  },
  selectPlaceholder: {
    color: 'rgba(0,0,0,0.35)',
  },
  selectCreateLabel: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  selectDisabled: {
    color: theme.palette.neutral.medium,
  },
  createIcon: {
    width: 20,
    height: 20,
    margin: '-1px 4px -1px -4px',
  },
  selectedLabel: {
    display: 'block',
    ...theme.mixins.ellipsis,
  },
  dateIcon: {
    fontSize: theme.typography.pxToRem(20),
    marginTop: 1,
  },
  brokerageLabel: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightMedium,
  },
});

export default styles;
