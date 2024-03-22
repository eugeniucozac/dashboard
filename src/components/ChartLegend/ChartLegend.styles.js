const styles = (theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(1),
    },

    '& > ul': {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: 0,
      padding: 0,

      '& > li': {
        flex: '0 0 auto',
        margin: '0 6px',
        padding: 0,
        listStyle: 'none',
        color: theme.palette.neutral.main,
        fontSize: theme.typography.pxToRem(11),
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeightRegular,
        cursor: 'pointer',

        '&.strike': {
          textDecoration: 'line-through',
        },

        '& > span': {
          display: 'inline-block',
          width: theme.spacing(2),
          height: theme.spacing(1),
          marginRight: 4,
          verticalAlign: 'baseline',
        },
      },
    },
  },
});

export default styles;
