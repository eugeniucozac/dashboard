const styles = (theme) => ({
  root: {
    width: '100%',
  },
  tableHead: {
    '& th:nth-child(2)': {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },

    '& th:nth-child(3)': {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  },
  cellName: {
    '&&': {
      minWidth: 160,

      [theme.breakpoints.up('sm')]: {
        minWidth: 160,
        display: 'table-cell',
      },

      [theme.breakpoints.up('md')]: {
        minWidth: 180,
      },

      [theme.breakpoints.up('lg')]: {
        minWidth: 220,
      },

      [theme.breakpoints.up('xl')]: {
        minWidth: 300,
      },
    },
  },
  cellDept: {
    '&&': {
      display: 'none',

      [theme.breakpoints.up('sm')]: {
        minWidth: 100,
        display: 'table-cell',
      },

      [theme.breakpoints.up('lg')]: {
        minWidth: 140,
      },

      [theme.breakpoints.up('xl')]: {
        minWidth: 200,
      },
    },
  },
  cellOffice: {
    '&&': {
      display: 'none',

      [theme.breakpoints.up('md')]: {
        minWidth: 100,
        display: 'table-cell',
      },

      [theme.breakpoints.up('lg')]: {
        minWidth: 140,
      },

      [theme.breakpoints.up('xl')]: {
        minWidth: 200,
      },
    },
  },
  cellValue: {
    width: '50%',
  },
  bar: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: theme.spacing(3),
  },
  barBg: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    minWidth: 1,
    width: '100%',
    height: '100%',
    color: theme.palette.neutral.dark,
    textIndent: theme.spacing(1),
    borderRadius: 2,
    userSelect: 'none',
  },
  barValueContainer: {
    color: 'white',
  },
  barLabel: {
    color: 'white',
    position: 'absolute',
    zIndex: 1,
    userSelect: 'auto',
    pointerEvents: 'none',
  },
  barValue: {
    position: 'relative',
    float: 'left',
    color: 'white',
    borderRadius: 0,
    backgroundColor: theme.palette.grey[500],

    '&:nth-child(2)': {
      borderTopLeftRadius: 2,
      borderBottomLeftRadius: 2,
    },

    '&:last-child': {
      borderTopRightRadius: 2,
      borderBottomRightRadius: 2,
    },
  },
  barTooltip: {
    height: '100%',
  },
});

export default styles;
