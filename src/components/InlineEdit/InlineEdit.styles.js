const styles = (theme) => ({
  root: {
    position: 'relative',
    display: 'inline-block',
    maxWidth: '100%',
    verticalAlign: 'top',
  },
  formControl: {
    position: 'absolute',
    margin: '0 auto',
    padding: 0,
    top: 0,
    left: 0,
    width: '100%',
  },
  formControlEditing: {
    position: 'relative',
  },
  base: {
    fontSize: 'inherit',
    lineHeight: 1.5,
  },
  baseMultiline: {
    padding: 7,
    paddingBottom: 6,

    '&:hover': {
      '& > textarea + textarea + fieldset': {
        borderColor: `${theme.palette.neutral.light} !important`,
      },
    },
  },
  baseCompact: {
    lineHeight: 1.4,
  },
  input: {
    height: 'auto',
    padding: 7,
    paddingBottom: 6,
    opacity: 0,

    '&[type=number]': {
      '-webkit-appearance': 'textfield',
      '-moz-appearance': 'textfield',
      appearance: 'textfield',
    },

    '&[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },

    '&[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },

    '&& + fieldset': {
      borderColor: 'transparent',
    },

    '&:hover': {
      '& + fieldset': {
        borderColor: `${theme.palette.neutral.light} !important`,
      },
    },
  },
  inputMultiline: {
    padding: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
  inputEditing: {
    color: theme.palette.neutral.dark,
    fontStyle: 'normal',
    backgroundColor: 'white',
    borderRadius: 4,
    opacity: 1,

    // single line (nowrap)
    '&& + fieldset': {
      borderColor: theme.palette.neutral.dark,
    },

    // multiline
    '&& + textarea + fieldset': {
      borderColor: theme.palette.neutral.dark,
    },

    '&:hover': {
      // single line (nowrap)
      '&& + fieldset': {
        borderColor: `${theme.palette.neutral.dark} !important`,
      },

      // multiline
      '&& + textarea + fieldset': {
        borderColor: `${theme.palette.neutral.dark} !important`,
      },
    },
  },
  inputError: {
    '&& + fieldset': {
      borderColor: theme.palette.error.main,
    },
  },
  inputCompact: {
    padding: 4,
    paddingBottom: 3,
  },
  label: {
    minWidth: 32,
    padding: 7,
    paddingBottom: 6,
    lineHeight: 1.5,
    borderRadius: 4,
    cursor: 'pointer',
    pointerEvents: 'none',
    ...theme.mixins.ellipsis,
  },
  labelMultiline: {
    textOverflow: 'none',
    overflow: 'visible',
    whiteSpace: 'normal',
  },
  labelCompact: {
    padding: 4,
    paddingBottom: 3,
    lineHeight: 1.4,
  },
  labelNumber: {
    paddingRight: 20,
  },
  labelPercent: {
    paddingRight: 10,
  },
  labelCurrency: {
    paddingRight: 0,
  },
  labelHidden: {
    minWidth: theme.spacing(4),
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    overflow: 'hidden',
    visibility: 'hidden',
    pointerEvents: 'none',
  },
});

export default styles;
