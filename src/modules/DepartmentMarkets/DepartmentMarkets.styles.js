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
    rowSelected: {
      background: theme.palette.grey[100],
    },
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
    cellsNested: ({ wide }) => ({
      verticalAlign: 'top',
      width: '50%',
      fontSize: tableFontSize(wide),

      '&:first-child': {
        paddingLeft: 0,
      },
    }),
    market: {
      display: 'flex',
    },
    marketStatus: {
      flex: '0 0 auto',
      marginTop: -1,
      width: 28,
    },
    marketName: {
      flex: '1 1 auto',
    },
    underwriterName: {
      paddingLeft: 2,
    },
    underwriterArrow: {
      marginLeft: -2,
      marginBottom: -1,
      fontSize: theme.typography.pxToRem(10),
      color: theme.palette.neutral.medium,
    },
  };
};

export default styles;
