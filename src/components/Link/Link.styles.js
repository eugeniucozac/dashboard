const styles = (theme) => ({
  root: ({ color, disabled, isHref }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    color: !isHref && disabled ? theme.palette.disabled.color : theme.palette[color].main,
    cursor: !isHref && disabled ? 'not-allowed !important' : 'pointer',

    '&:hover': {
      textDecoration: !isHref && disabled ? 'none' : 'underline',
    },
  }),
  text: ({ icon, iconPosition }) => ({
    marginLeft: icon && iconPosition === 'left' ? theme.spacing(0.5) : 0,
    marginRight: icon && iconPosition === 'right' ? theme.spacing(0.5) : 0,
  }),
  icon: {
    color: 'inherit',
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '1.25em',
    marginTop: 1,
  },
});

export default styles;
