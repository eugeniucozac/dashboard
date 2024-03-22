export const styles = (theme) => ({
  table: {
    marginBottom: 16,
    tableLayout: 'fixed',

    '& td:last-child': {
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    },
  },
  tableHeadCell: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  layer: {
    marginBottom: -7,
  },
  layerName: {
    flex: '0 0 auto',
    marginRight: 6,
  },
  layerNotes: {
    flex: '1 1 auto',
    marginBottom: -2,
    position: 'relative',
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.neutral.medium,
  },
  layerStatus: {
    flex: '0 0 auto',
    marginRight: 6,
  },
  checkbox: {
    flex: '0 0 auto',
    margin: '0 0 0 -15px',
    '& > span:first-child .MuiSvgIcon-root': {
      height: '0.9em',
    },
  },
  seeNotesRow: {
    '& > th, & > td': {
      fontSize: theme.typography.pxToRem(11),
      color: theme.palette.neutral.main,
      fontStyle: 'italic',
    },

    '&& > :first-child': {
      paddingLeft: 52,
    },
  },
});

export default styles;
