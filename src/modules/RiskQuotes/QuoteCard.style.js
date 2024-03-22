const styles = (theme) => ({
  card: {
    backgroundColor: theme.palette.grey[50],
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    overflow: 'hidden',
    boxShadow: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 16px 32px -4px',
    borderRadius: '5px',
    position: 'relative',
    height: '100%',
    padding: 0,
    minWidth: 'fit-content',
  },
  cardArray: {
    padding: 10,
  },
  cardTitle: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardTitleHeading: {
    fontWeight: 600,
    color: 'white',
    marginBottom: 0,
  },
  cardContent: {
    paddingTop: '16px!important',
    borderTop: `1px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: 'white',
    minHeight: '100px',
  },
  cardContentCommission: {
    paddingTop: '16px!important',
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: 'white',
    minHeight: '120px',
  },
  label: {
    color: 'black!important',
  },
  cardActions: {
    marginTop: '0px!important',
    paddingTop: '16px!important',
    paddingBottom: '16px!important',
  },
  editIcon: {
    color: 'white',
    fontSize: theme.typography.pxToRem(18),
  },
  cellDataLabel: {
    width: '60%',
  },
  arrayCell: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  arrayTable: {
    '& td': {
      padding: 4,
      fontSize: theme.typography.pxToRem(11),
      borderBottomStyle: 'dotted',
      borderBottomColor: theme.palette.neutral.lighter,
      '&:first-child': {
        paddingLeft: 0,
        paddingRight: 12,
      },
      '&:last-child': {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    '& tr:last-child td': {
      borderBottom: 0,
    },
  },
  policyBox: {},
  cardPolicyTitle: {
    backgroundColor: 'rgb(9, 169, 237)',
    display: 'flex',
    justifyContent: 'center',
  },
  cardFacility: {
    fontWeight: 600,
    fontSize: theme.typography.pxToRem(16),
    marginBottom: 0,
  },
  quoteValue: {
    fontSize: theme.typography.pxToRem(32),
    fontWeight: 600,
  },
  issues: {
    fontSize: '1.2rem',
    color: theme.palette.error.main,
  },
  btnMarginLeft: {
    marginLeft: 10,
  },
});

export default styles;
