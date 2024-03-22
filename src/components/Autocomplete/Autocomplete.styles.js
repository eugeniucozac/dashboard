import get from 'lodash/get';

const variantIsFilled = (props) => {
  const variant = get(props, 'muiComponentProps.variant');
  return variant === 'filled';
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(1.5),

    '&:first-child': {
      marginTop: 0,
    },

    '&:last-child': {
      paddingBottom: 0,
    },
  },
  input: (props) => {
    const isFilled = variantIsFilled(props);
    return {
      display: 'flex',
      padding: 0,
      height: isFilled ? 'inherit' : 'auto',
      backgroundColor: isFilled ? 'none' : 'white',
      borderRadius: isFilled ? 0 : 4,
    };
  },
  formControl: {
    marginTop: 0,
    paddingBottom: 0,

    '&:first-child': {
      marginTop: 0,
    },

    '&:last-child': {
      paddingBottom: 0,
    },
  },
  valueContainer: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    padding: '7.5px 2px 4.5px 14px',

    // cursor element
    '& > div:last-child:not([role="button"])': {
      marginLeft: 0,

      '& input': {
        fontFamily: `${theme.typography.fontFamily} !important`,
      },
    },

    // cursor element (following a chip)
    '& > div[role="button"] ~ div:last-child': {
      marginTop: 0,
      marginLeft: -6,
    },

    '& ~ div': {
      '& > span': {
        display: 'none',
        marginTop: 6,
        marginBottom: 6,
        backgroundColor: theme.palette.grey[300],
      },
      '& > svg ~ span': {
        display: 'block',
      },
    },

    '&:hover': {
      '& ~ div': {
        '& > svg': {
          color: theme.palette.neutral.dark,
        },
      },
    },
  },
  valueContainerXs: {
    paddingTop: 3.5,
    paddingBottom: 0.5,
  },
  valueContainerCompact: {
    paddingTop: 1,
    paddingBottom: 0,
    paddingLeft: 6,
    fontSize: theme.typography.pxToRem(12),
  },
  valueContainerMulti: {},
  valueContainerGreyed: {
    opacity: 0.2,
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  loadingMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    color: 'inherit',
    position: 'absolute',
    fontSize: 'inherit',
    maxWidth: `calc(100% - ${theme.spacing(1)}px)`,
  },
  placeholder: {
    position: 'absolute',
    maxWidth: `calc(100% - ${theme.spacing(1)}px)`,
    fontSize: 'inherit',
    color: theme.palette.neutral.medium,

    '& ~ div': {
      marginLeft: 0,
    },
  },
  menuItem: {
    fontSize: theme.typography.pxToRem(13),
    whiteSpace: 'normal',
    height: 'auto',
    minHeight: 36,
    lineHeight: theme.typography.lineHeight['16/13'],
    backgroundColor: 'white',

    '&:hover': {
      backgroundColor: `${theme.palette.neutral.lighter} !important`,
    },
  },
  paper: (props) => {
    const isFilled = variantIsFilled(props);
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      marginTop: isFilled ? 0 : -1,
      border: `1px solid ${theme.palette.grey[400]}`,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderTopColor: isFilled ? 'transparent' : theme.palette.primary.hint,
      boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 8px 14px 0px rgba(0,0,0,0.12)',
      zIndex: theme.zIndex.dropdown + 1,

      ...(!isFilled && {
        '&:before': {
          content: '""',
          position: 'absolute',
          bottom: 'calc(100% + 1px)',
          left: -1,
          width: 'calc(100% + 2px)',
          height: theme.spacing(0.5),
          background: 'white',
          border: `1px solid ${theme.palette.primary.main}`,
          borderTop: 0,
          borderBottom: 0,
        },
      }),
    };
  },
  paperError: {
    borderTopColor: theme.palette.error.main,

    '&:before': {
      borderColor: theme.palette.error.main,
    },
  },
  divider: {
    height: theme.spacing(2),
  },
  clearIcon: {
    margin: 0,
    padding: '12px 10px',
    fontSize: 44,
    width: 40,
    cursor: 'pointer',
    color: theme.palette.neutral.medium,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.shortest,
    }),

    '&:hover': {
      color: theme.palette.neutral.dark,
    },
  },
  dropdownIcon: {
    margin: 0,
    padding: '10px 8px',
    fontSize: 44,
    width: 40,
    cursor: 'pointer',
    color: theme.palette.neutral.medium,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.shortest,
    }),

    '&:hover': {
      color: theme.palette.neutral.dark,
    },
  },
  dropdownIconXs: {
    height: 36,
    paddingTop: 6,
    paddingBottom: 6,
  },
  dropdownIconCompact: {
    height: 18,
    paddingTop: 2,
    paddingBottom: 0,
    paddingRight: 0,
  },
  iconFocused: {
    color: theme.palette.neutral.dark,
  },
});

export default styles;
