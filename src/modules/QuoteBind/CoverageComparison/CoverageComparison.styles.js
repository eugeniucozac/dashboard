const styles = (theme) => ({
  drawerPaper: ({ columnCount, coverageOptionBoxWidth }) => ({
    width: columnCount * coverageOptionBoxWidth + theme.spacing(4) * 2,
    maxWidth: '80%',
  }),
  title: {
    marginBottom: 0,
    color: 'white',
    fontWeight: 500,
  },
  fullList: {
    width: 'auto',
  },
  coverageFormTitle: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
  coverageOptionBox: ({ coverageOptionBoxWidth }) => ({
    backgroundColor: theme.palette.grey[100],
    overflow: 'hidden',
    width: coverageOptionBoxWidth,
  }),
  coverageOptionsCarriers: {
    display: 'flex',
    flex: 1,
    marginBottom: 0,
  },
  coverageCarrier: {
    width: '100%',
    borderRight: '1px solid #ccc',
    padding: 16,
    backgroundColor: '#f5f5f5',
    color: '#fff',
  },
  coverageCarrierLabel: {
    fontWeight: 500,
    fontSize: 16,
  },
  coverageOptions: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  coverageActiveOptions: {
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: '#2cc6ab',
  },
  summaryQuote: ({ coverageOptionBoxWidth }) => ({
    width: coverageOptionBoxWidth,
    borderRight: '1px solid #ccc',
  }),
  infoIcon: {
    color: 'rgb(237, 172, 0)',
    fontSize: 24,
    marginTop: 8,
    marginRight: 10,
  },
  coverageOption: {
    position: 'relative',
    zIndex: 20,
    '&:before': {
      content: '""',
      display: 'block',
      border: '2px solid #2cc6ab',
      borderRadius: '5px',
      overflow: 'hidden',
      position: 'absolute',
      bottom: '-1px',
      left: '-1px',
      top: '-1px',
      right: '-1px',
    },
  },
  coverageName: {
    fontWeight: 600,
  },
  quoteValueTitle: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 400,
  },
  quoteValue: {
    fontWeight: 700,
    fontSize: theme.typography.pxToRem(12),
  },
  premium: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 600,
  },
});

export default styles;
