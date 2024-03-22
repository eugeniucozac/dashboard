const styles = (theme) => {
  const tableFontSize = (wide) => {
    return theme.typography.pxToRem(wide ? 12 : 11);
  };

  return {
    row: ({ wide }) => ({
      cursor: 'pointer',

      '& > td': {
        fontSize: tableFontSize(wide),
      },
    }),
    rowNew: {
      ...theme.mixins.row.new,
    },
    cellsMarkets: {
      verticalAlign: 'top',
    },
    cellsUnderwriters: {
      verticalAlign: 'top',
      paddingRight: 0,
    },
    market: {
      display: 'flex',
    },
    checkbox: {
      margin: '-4px 2px 0 0',
      '& > span:first-child .MuiSvgIcon-root': {
        height: '0.8em',
      },
    },
    marketStatus: {
      flex: '0 0 auto',
      marginTop: -1,
      width: 28,
    },
    marketName: {
      flex: '1 1 auto',
    },
    marketNotes: {
      fontSize: theme.typography.pxToRem(10),
      color: theme.palette.neutral.main,
    },
    tooltipRoot: {
      [theme.breakpoints.up('md')]: {
        '&&': {
          maxWidth: 500,
        },
      },
    },
    tooltipContent: {
      textAlign: 'left',
      fontSize: theme.typography.pxToRem(11),
      color: theme.palette.neutral.dark,

      '& strong': {
        fontSize: theme.typography.pxToRem(12),
        fontWeight: theme.typography.fontWeightMedium,
        color: theme.palette.neutral.darker,
      },

      '& span': {
        color: theme.palette.neutral.main,
      },
    },
  };
};

export default styles;
