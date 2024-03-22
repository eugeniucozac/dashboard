const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: `${theme.spacing(0.5)}px 0`,
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.neutral.lightest,
    borderRadius: theme.shape.borderRadius,

    [theme.breakpoints.up('sm')]: {
      alignItems: 'flex-start',
      flexWrap: 'nowrap',
    },

    [theme.breakpoints.up('720')]: {
      alignItems: 'center',
    },
  },
  searchContent: {
    flex: '1 1 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',

    [theme.breakpoints.up('720')]: {
      flexWrap: 'nowrap',
    },
  },
  searchButton: {
    flex: `0 0 calc(100% - ${theme.spacing(3)}px)`,
    margin: `0 ${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
    textAlign: 'right',

    [theme.breakpoints.up('sm')]: {
      flex: '0 0 auto',
      marginTop: theme.spacing(1.5),
    },

    [theme.breakpoints.up('720')]: {
      marginTop: theme.spacing(-1.5),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },

    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(-1.5),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    margin: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,

    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap',
    },

    [theme.breakpoints.up('720')]: {
      minWidth: 200,
    },

    [theme.breakpoints.up('md')]: {
      minWidth: 260,
      marginLeft: '5%',
      marginRight: '5%',

      '&:nth-child(1)': {
        marginLeft: theme.spacing(2),
      },
    },
  },
  searchField: {
    '& > .MuiFormControl-root': {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      width: '100%',
      margin: 0,

      '& > .MuiFormHelperText-root': {
        flex: '1 0 100%',
      },
    },
  },
  searchFieldAutocomplete: {
    flex: '1 1 100%',
  },
  searchFieldLabel: {
    flex: '1 1 auto',
    marginRight: theme.spacing(2),

    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(-2),
    },

    [theme.breakpoints.up('md')]: {
      flex: '1 0 auto',
    },
  },
  searchFieldInput: {
    flex: '1 1 auto',
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
  },
  searchFieldInputDisabled: {
    color: theme.palette.neutral.lighter,
    backgroundColor: theme.palette.neutral.lightest,

    '& > input[type="text"]': {
      color: theme.palette.neutral.medium,
    },

    '& > fieldset': {
      borderColor: `${theme.palette.neutral.lighter} !important`,
    },
  },
  searchFieldRadioGroup: {
    paddingBottom: '0 !important',

    [theme.breakpoints.up('sm')]: {
      marginTop: `${theme.spacing(-2)}px !important`,
    },
  },
  filenameRoot: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  filenameBase: {
    color: `${theme.palette.neutral.dark} !important`,
    fontSize: theme.typography.pxToRem(13),

    '& > fieldset': {
      border: '0 !important',
      backgroundColor: 'transparent !important',
    },
  },
  filenameInput: {
    cursor: 'default !important',
    padding: '0 !important',
    height: 'auto !important',
    ...theme.mixins.ellipsis,
  },
});

export default styles;
