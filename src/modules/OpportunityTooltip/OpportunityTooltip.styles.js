const styles = (theme) => ({
  listWrapper: {
    position: 'relative',
  },
  list: (props) => ({
    maxHeight: 112,
    marginTop: -6,
    paddingBottom: 4,
    fontSize: theme.typography.pxToRem(11),
    overflowY: 'auto',

    '&:after': {
      content: '""',
      display: props.overflow ? 'block' : 'none',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 8,
      backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
    },
  }),
});

export default styles;
