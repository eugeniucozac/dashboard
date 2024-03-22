const styles = (theme) => ({
  badge: (props) => ({
    color: 'white',
    backgroundColor: theme.palette.grey[500],
    zIndex: 0,

    ...(props.standalone && {
      top: 'auto',
      right: 'auto',
      position: 'relative',
      transform: 'none',
    }),

    ...(props.compact && {
      padding: 0,
      height: 16,
      minWidth: 16,
    }),

    ...(props.type &&
      ['info', 'success', 'alert', 'error'].includes(props.type) && {
        backgroundColor: theme.palette[props.type].main,
      }),
  }),
});

export default styles;
