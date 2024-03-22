const styles = (theme) => ({
  market: {
    display: 'flex',
    alignItems: 'center',
  },
  marketWithoutStatus: {
    marginLeft: 28,
  },
  marketDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  marketName: {
    display: 'flex',
    alignItems: 'center',
  },
  marketContact: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.neutral.main,
  },
  marketTag: {
    marginLeft: theme.spacing(1),
  },
  marketUnderwriterGroup: {
    color: theme.palette.neutral.main,
    marginRight: theme.spacing(0.5),
  },
  checkbox: {
    margin: '0 -2px 0 -12px',
  },
  row: {
    height: 34,
    cursor: 'pointer',
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),

    '&& > :first-child': {
      paddingLeft: 24,
    },

    '&:last-child > th, &:last-child > td': {
      borderBottomStyle: 'solid',
      borderBottomColor: theme.palette.grey[300],
    },

    '& > th, & > td': {
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: theme.typography.pxToRem(11),
      borderBottomStyle: 'dashed',
    },

    '&:hover': {
      backgroundColor: `${theme.palette.neutral.lightest} !important`,
    },
  },
  rowLast: {
    '& > th, & > td': {
      borderBottomStyle: 'solid !important',
      borderBottomColor: '#ccc !important',
    },
  },
  rowSelected: {
    backgroundColor: '#fcfcfc',
  },
});

export default styles;
