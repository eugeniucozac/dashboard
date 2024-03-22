const styles = (theme) => ({
  row: {
    '&> td:first-child': {
      position: 'relative',
      paddingLeft: (props) => (props.level !== 1 ? `${props.level * 20}px!important` : '25px'),
    },
    display: 'table-row',
    ...theme.mixins.heightScale.default,
  },
  arrow: {
    position: 'absolute',
    left: (props) => (props.level !== 1 ? `${props.level * 10}px!important` : '0px'),
    top: 0,
    bottom: 0,
    margin: 'auto',
    flex: '0 0 auto',
    verticalAlign: 'middle',
    transition: theme.transitions.create('transform'),
    transform: (props) => (props.expanded ? 'scaleY(-1)' : 'none'),
  },
});

export default styles;
