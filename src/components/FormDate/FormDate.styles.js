const styles = (theme) => ({
  label: {
    '& + div > input': {
      color: theme.palette.placeholder.color,

      '&::-webkit-calendar-picker-indicator': {
        color: theme.palette.neutral.dark,
      },
    },

    '&[class*="-filled"] + div > input': {
      color: theme.palette.neutral.dark,
    },
  },
  dateInputWrapper: {
    flexDirection: 'column',
    lineHeight: 'inherit',

    '&:before': {
      // override MUI input styles
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      position: 'static',
      border: '0 !important',

      // hack to force the input to stretch to the field formatted value
      content: 'attr(data-value)',
      height: 0,
      overflow: 'hidden',
    },

    '&:after': {
      display: 'none',
    },
  },
  adornedEnd: {
    paddingRight: 0,

    '& .MuiInputAdornment-positionEnd': {
      height: '100%',
      '& .MuiIconButton-root': {
        height: '100%',
        paddingTop: 9,
        paddingBottom: 9,
      },
    },
  },

  dateInput: {
    height: 'auto',
    cursor: 'pointer',
    '&:hover, &:focus': {
      textDecoration: 'underline',
    },

    '&:[data-is-empty="true"]': {
      color: 'red',
    },
  },

  dateInputDisabled: {
    cursor: 'not-allowed',

    '&:hover, &:focus': {
      textDecoration: 'none',
    },
  },

  placeholder: {
    color: theme.palette.neutral.medium,
  },
  dateIcon: {
    color: theme.palette.neutral.medium,
    fontSize: theme.typography.pxToRem(16),
    marginTop: 1,
  },
  datePicketIconAlignment: {
    display: 'flex',
    alignItems: 'end',
  },
});

export default styles;
