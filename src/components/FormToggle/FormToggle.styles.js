const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2),
    paddingBottom: 12,

    '&:first-child': {
      marginTop: 0,
    },

    '&:last-child': {
      paddingBottom: 0,
    },
  },
  toggleButton: (props) => ({
    minHeight: props?.type === 'toggle' ? 44 : 32,
    fontSize: theme.typography.pxToRem(13),
  }),
  title: (props) => ({
    marginBottom: props?.type === 'toggle' ? 6 : theme.spacing(0.5),
    ...(props.hasError && { color: theme.palette.error.main }),
  }),
});

export default styles;
