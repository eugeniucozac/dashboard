const styles = (theme) => ({
  wrapper: {
    cursor: 'pointer',
  },
  title: {
    marginBottom: 0,
  },
  cell: {
    paddingLeft: `${theme.spacing(2)}px !important`,
    paddingRight: '0 !important',
  },
  arrow: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(0.75),

    '& > svg': {
      transition: theme.transitions.create('transform'),
      transform: (props) => (props.expanded ? 'scaleY(-1)' : 'none'),
    },
  },
  content: {
    flex: '1 1 auto',
  },
  button: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
  },
});

export default styles;
