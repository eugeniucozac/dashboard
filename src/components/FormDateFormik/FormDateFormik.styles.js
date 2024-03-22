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
  placeholder: {
    color: theme.palette.neutral.medium,
  },
});

export default styles;
