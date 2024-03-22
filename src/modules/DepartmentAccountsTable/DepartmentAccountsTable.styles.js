const styles = (theme) => {
  const tableFontSize = (wide) => {
    return theme.typography.pxToRem(wide ? 12 : 11);
  };

  return {
    paginationButton: {
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 6,
        paddingRight: 6,
      },
    },
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
    logo: {
      display: 'block',
      width: 'auto',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: 20,
    },
    clientWrapperCell: {
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    },
    clientCell: ({ wide }) => ({
      minWidth: '8vw !important',
      maxWidth: '8vw !important',
      paddingLeft: '4px !important',
      verticalAlign: 'middle !important',
      fontSize: tableFontSize(wide),

      '&:last-child': {
        paddingRight: '16px !important',
      },
    }),
    clientNoOfficeCell: {
      ...theme.mixins.ellipsis,
    },
    officeCell: ({ wide }) => ({
      minWidth: '9vw !important',
      maxWidth: '9vw !important',
      paddingLeft: 4,
      verticalAlign: 'middle !important',
      fontSize: tableFontSize(wide),

      '&:last-child': {
        paddingRight: '16px !important',
      },
    }),
    clientName: {
      display: 'block',
      width: '100%',
      ...theme.mixins.ellipsis,
    },
    officeName: {
      display: 'block',
      width: '100%',
      ...theme.mixins.ellipsis,
    },
    avatarName: ({ wide }) => ({
      fontSize: tableFontSize(wide),
    }),
  };
};

export default styles;
