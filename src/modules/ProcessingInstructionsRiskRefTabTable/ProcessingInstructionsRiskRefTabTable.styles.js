const styles = (theme) => ({
  documentLinkWrapper: {
    marginBottom: theme.spacing(1),

    '&:last-child': {
      marginBottom: 0,
    },
  },
  documentLink: ({ isMobile, isTablet }) => ({
    display: 'inline !important',
    fontSize: theme.typography.pxToRem(isMobile || isTablet ? 11 : 12),
    wordBreak: 'break-word',
    lineHeight: '14px',
  }),
  tableContainer: {
    maxHeight: theme.spacing(60),
  },
  documentCount: {
    marginLeft: theme.spacing(1),
    color: theme.palette.neutral.medium,
  },
  documentDeleteIcon: {
    marginTop: -6,
    marginBottom: -6,
  },
  invalidDocument: {
    color: theme.palette.error.main,
  },
  accordion: {
    flexDirection: 'column',
    boxShadow: 'none',
    backgroundColor: 'inherit',

    '&:hover': {
      backgroundColor: 'inherit',
    },
  },
  accordionSummary: {
    minHeight: '32px !important',
    margin: 0,
    padding: 0,
  },
  accordionDetails: {
    position: 'relative',
    flexDirection: 'column',
    padding: 0,
    marginTop: theme.spacing(-3.5),
    marginRight: theme.spacing(4),
    zIndex: 3,
  },
  icon: {
    width: '0.8rem',
  },
  tableHead: {
    '& th': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  zeroDocument: { color: theme.palette.error.dark, cursor: 'pointer' },
});

export default styles;
