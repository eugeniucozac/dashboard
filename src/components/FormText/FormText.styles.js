const styles = (theme) => ({
  compact: {
    maxWidth: 180,

    '& input': {
      padding: `${theme.spacing(0.5)}px ${theme.spacing(0.75)}px`,
    },
  },
  readonly: {
    '&:hover > input': {
      cursor: 'not-allowed',

      '& ~ .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0,0,0,0.2)',
        boxShadow: 'none',
      },
    },
  },
});

export default styles;
