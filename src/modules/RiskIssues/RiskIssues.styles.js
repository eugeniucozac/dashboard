const styles = (theme) => ({
  quote: {
    '& .MuiTableCell-root': {
      paddingTop: 4,
      paddingBottom: 4,
      color: theme.palette.neutral.dark,
      borderBottomStyle: 'dotted',

      '&:first-child': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    '& .MuiTableRow-root:last-child': {
      '& .MuiTableCell-root': {
        borderBottom: 0,
      },
    },
  },
  card: {
    backgroundColor: theme.palette.grey[50],
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    overflow: 'hidden',
    boxShadow: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 16px 32px -4px',
    borderRadius: '5px',
    position: 'relative',
    height: '100%',
    padding: 0,
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
  },
  cardActions: {
    marginTop: '0px!important',
    paddingTop: '16px!important',
    paddingBottom: '16px!important',
  },
  warning: {
    color: theme.palette.neutral.light,
    fontSize: 18,
    marginRight: 4,
  },
  issueName: {
    display: 'flex',
    flexDirection: 'column',
  },
  createdAt: {
    fontSize: '0.75rem',
  },
  issueTypeChip: {
    marginBottom: 10,
    height: 24,
    lineHeight: 1.5,
  },
  message: {
    color: theme.palette.neutral.darkest,
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
  numIssues: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  foundIssues: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.error.main,
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
  sectionMessage: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.neutral.darkest,
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
  linkRoot: {
    fontWeight: theme.typography.fontWeightMedium,
    padding: '5px 0',
  },
  linkIcon: {
    margin: '0 5px',
    fontSize: 12,
  },
});

export default styles;
