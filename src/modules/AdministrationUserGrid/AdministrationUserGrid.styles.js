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
    label: {
      textTransform: 'none',
      textDecoration: 'underline',
      fontSize: theme.typography.pxToRem(11),
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },
  };
};

export default styles;
