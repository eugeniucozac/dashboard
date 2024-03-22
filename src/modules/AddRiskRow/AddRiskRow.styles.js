const styles = (theme) => ({
  table: {
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  tableHead: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  tableHeadCell: {
    paddingTop: 0,
    paddingLeft: 6,
    paddingRight: 4,
  },
  tableBody: {
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  tableRow: {
    [theme.breakpoints.down('xs')]: {
      display: 'block',

      '&:first-child > td': {
        paddingTop: '0 !important',
      },
    },

    [theme.breakpoints.up('sm')]: {
      verticalAlign: 'top',

      '&:first-child > td': {
        paddingTop: '8px !important',
      },
    },
  },
  tableRowAlignCenter: {
    textAlign: 'center',
  },
  tableRowDivider: {
    display: 'block',

    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  tableRowDividerCell: {
    width: '100%',
    display: 'block',
    border: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
  },
  tableRowCell: {
    border: 0,

    [theme.breakpoints.down('xs')]: {
      width: '100% !important',
      display: 'block',
      border: 0,
      padding: '0 4px 28px',
    },

    [theme.breakpoints.up('sm')]: {
      '&&': {
        padding: '4px 0',
      },

      '& input[type="text"], & input[type="number"]': {
        paddingLeft: 2,
        paddingRight: 2,
        textAlign: 'center',
      },

      '&:first-child input[type="text"]': {
        paddingLeft: 12,
        textAlign: 'left',
      },

      '& input[type="number"]': {
        '&::-webkit-inner-spin-button': {
          display: 'none',
        },
      },
    },

    [theme.breakpoints.up('md')]: {
      '& input[type="text"], & input[type="number"]': {
        paddingLeft: 4,
        paddingRight: 4,
      },
    },
  },
  tableRowCellFirst: {
    [theme.breakpoints.up('sm')]: {
      '& input[type="text"] ~ fieldset, & input[type="number"] ~ fieldset': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
  },
  tableRowCellMiddle: {
    [theme.breakpoints.up('sm')]: {
      '& input[type="text"] ~ fieldset, & input[type="number"] ~ fieldset': {
        borderRadius: 0,
        marginLeft: -1,
        borderLeftColor: 'transparent',
      },

      '& .MuiOutlinedInput-root.Mui-focused fieldset': {
        borderLeftColor: theme.palette.primary.main,
      },

      '& .MuiOutlinedInput-root.Mui-error fieldset': {
        borderLeftColor: theme.palette.error.main,
      },

      '&:hover': {
        '& input[type="text"] ~ fieldset, & input[type="number"] ~ fieldset': {
          zIndex: 1,
          borderLeftColor: theme.palette.neutral.darker,
        },

        '& .MuiOutlinedInput-root.Mui-error fieldset': {
          borderLeftColor: theme.palette.error.main,
        },
      },
    },
  },
  tableRowCellLast: {
    [theme.breakpoints.up('sm')]: {
      '& input[type="text"] ~ fieldset, & input[type="number"] ~ fieldset': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        marginLeft: -1,
        borderLeftColor: 'transparent',
      },

      '& .MuiOutlinedInput-root.Mui-focused fieldset': {
        borderLeftColor: theme.palette.primary.main,
      },

      '& .MuiOutlinedInput-root.Mui-error fieldset': {
        borderLeftColor: theme.palette.error.main,
      },

      '&:hover': {
        '& input[type="text"] ~ fieldset, & input[type="number"] ~ fieldset': {
          zIndex: 1,
          borderLeftColor: theme.palette.neutral.darker,
        },

        '& .MuiOutlinedInput-root.Mui-error fieldset': {
          borderLeftColor: theme.palette.error.main,
        },
      },
    },
  },
  tableRowCellDisabled: {
    [theme.breakpoints.up('sm')]: {
      '&:not(:first-child)': {
        '&:hover': {
          '& input[type="text"] ~ fieldset, & input[type="number"] ~ fieldset': {
            borderLeftColor: 'transparent',
          },
        },
      },
    },
  },
  tableRowCellHidden: {
    display: 'none',
  },
  divider: {
    height: 0,
    backgroundColor: 'transparent',
    borderTop: `1px dashed ${theme.palette.neutral.light}`,
  },
  deleteCell: {
    width: 20,
    paddingLeft: '12 !important',
    paddingRight: '0 !important',
    verticalAlign: 'middle',
  },
  deleteBtn: {
    minWidth: '24px !important',
  },
});

export default styles;
