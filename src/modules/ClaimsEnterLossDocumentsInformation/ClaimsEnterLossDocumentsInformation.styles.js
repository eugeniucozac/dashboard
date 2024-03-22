const styles = (theme) => ({
  cardHeader: {
    backgroundColor: theme.palette.grey[300],
    padding: theme.spacing(0.5, 2),
  },
  cardContent: {
    minHeight: '184px',
  },
  cardText: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightMedium,
  },
  attachDoc: {
    textAlign: 'center',
    '&& span': {
      fontSize: theme.typography.pxToRem(10),
      display: 'inline-block',
      verticalAlign: 'top',
      paddingTop: '3px',
    },
  },
});

export default styles;
