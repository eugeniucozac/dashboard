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
    marginLeft: -6,
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
    margin: '0 4px 0 -22px',
    '& > span:first-child .MuiSvgIcon-root': {
      height: '0.8em',
    },
  },
  row: {
    height: 34,
    cursor: 'pointer',
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),

    '&& > :first-child': {
      paddingLeft: 28,
    },

    '& > th, & > td': {
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: theme.typography.pxToRem(11),
      borderBottomStyle: 'dashed',
      position: 'relative',

      '&:first-child:before, &:last-child:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        height: '100%',
        width: 1,
        backgroundColor: theme.palette.grey[300],
      },

      '&:first-child:before': {
        left: 0,
      },

      '&:last-child:before': {
        right: 0,
      },
    },

    '&:nth-last-child(2) > td': {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },

    '&:hover': {
      backgroundColor: `${theme.palette.neutral.lightest} !important`,
    },
  },
  rowSelected: {
    backgroundColor: '#fcfcfc',
  },
});

export default styles;
